<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../src/Database.php';
require_once '../../src/Validator.php';
require_once '../../src/Logger.php';
require_once '../../src/PayMongo.php';
require_once '../../src/RateLimiter.php';

// Initialize components
$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "System error. Please try again later."]);
    exit;
}

$logger = new Logger($db);
$rateLimiter = new RateLimiter($db, 10, 60); // 10 per minute

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!$rateLimiter->check($ip, 'place_order')) {
    http_response_code(429);
    echo json_encode(["success" => false, "message" => "Too many requests. Please try again later."]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit;
}

// Extract data
$userId = isset($data['userId']) ? (int)$data['userId'] : null;
$items = $data['items'] ?? [];
$orderType = isset($data['orderType']) ? Validator::sanitizeInput($data['orderType']) : '';
$tableNumber = isset($data['tableNumber']) ? Validator::sanitizeInput($data['tableNumber']) : null;
$paymentMethod = isset($data['paymentMethod']) ? Validator::sanitizeInput($data['paymentMethod']) : '';

// New Fields for Delivery/Customer Info
$customerName = isset($data['customerName']) ? Validator::sanitizeInput($data['customerName']) : null;
$customerEmail = isset($data['customerEmail']) ? Validator::sanitizeInput($data['customerEmail']) : null;
$customerPhone = isset($data['customerPhone']) ? Validator::sanitizeInput($data['customerPhone']) : null;
$shippingAddress = isset($data['shippingAddress']) ? Validator::sanitizeInput($data['shippingAddress']) : null;
$deliveryFeeInput = isset($data['deliveryFee']) ? (float)$data['deliveryFee'] : 0.00;

// --- VALIDATION ---

if (empty($items) || !is_array($items)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Cart is empty."]);
    exit;
}

$validOrderTypes = ['dine-in', 'takeout', 'delivery'];
if (!in_array($orderType, $validOrderTypes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid order type."]);
    exit;
}

if ($orderType === 'dine-in' && empty($tableNumber)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Table number is required for dine-in."]);
    exit;
}

if ($orderType === 'delivery') {
    if (empty($shippingAddress)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Shipping address is required for delivery."]);
        exit;
    }
    if (empty($customerPhone)) { // Phone is crucial for delivery
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Phone number is required for delivery."]);
        exit;
    }
}

if (!empty($customerEmail) && !Validator::validateEmail($customerEmail)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format."]);
    exit;
}

if (!empty($customerPhone) && !Validator::validatePhone($customerPhone)) {
     // Optional: stricter phone validation if needed, Validator has basic regex
}

if (!in_array($paymentMethod, ['cash', 'gcash', 'qrph'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid payment method."]);
    exit;
}

// --- PRICE VERIFICATION & STOCK CHECK ---

// Collect product IDs from items (assuming slug IS the ID based on frontend logic)
$productIds = [];
foreach ($items as $item) {
    if (isset($item['item']['slug'])) {
        $productIds[] = (int)$item['item']['slug'];
    }
}

if (empty($productIds)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid product identifiers."]);
    exit;
}

// Fetch current prices and availability from DB
$placeholders = implode(',', array_fill(0, count($productIds), '?'));
$priceQuery = "SELECT id, food_name, price, availability FROM products WHERE id IN ($placeholders)";
$priceStmt = $db->prepare($priceQuery);
$priceStmt->execute($productIds);
$productsDB = $priceStmt->fetchAll(PDO::FETCH_ASSOC);

// Map ID to Product Data
$productMap = [];
foreach ($productsDB as $p) {
    $productMap[$p['id']] = $p;
}

// Calculate Totals Server-Side
$subtotal = 0;
$verifiedItems = []; // Store items with verified prices to insert later

foreach ($items as $cartItem) {
    $productId = (int)$cartItem['item']['slug'];
    $qty = (int)$cartItem['qty'];

    if ($qty <= 0) continue;

    if (!isset($productMap[$productId])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Product ID $productId not found or unavailable."]);
        exit;
    }

    $productDB = $productMap[$productId];

    // Check availability (optional based on requirements, but robust systems do this)
    // Assuming availability column is boolean/tinyint
    if (isset($productDB['availability']) && !$productDB['availability']) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Product '{$productDB['food_name']}' is currently unavailable."]);
        exit;
    }

    $price = (float)$productDB['price'];
    $itemSubtotal = $price * $qty;
    $subtotal += $itemSubtotal;

    $verifiedItems[] = [
        'product_id' => $productId, // Store ID as slug
        'product_name' => $productDB['food_name'], // Store name snapshot
        'price' => $price,
        'quantity' => $qty,
        'subtotal' => $itemSubtotal
    ];
}

// Service Charge / Delivery Fee Logic
$serviceCharge = 0.00; // Can be percentage or fixed
$deliveryFee = ($orderType === 'delivery') ? 50.00 : 0.00; // Fixed delivery fee example, or trust client if validated

// Total Calculation
$finalTotal = $subtotal + $serviceCharge + $deliveryFee;

// --- PAYMONGO INTEGRATION ---
$checkoutUrl = null;
$paymongoSourceId = null;
$paymongoPaymentIntentId = null;
$qrCodeUrl = null;

if ($paymentMethod === 'gcash' || $paymentMethod === 'qrph') {
    try {
        $paymongo = new PayMongo();

        // 1. Create Payment Intent
        $intent = $paymongo->createPaymentIntent($finalTotal, "Order Payment", ['qrph']);
        $paymongoPaymentIntentId = $intent['id'];

        // 2. Create Payment Method (QRPH)
        $billing = [];
        if ($customerName) $billing['name'] = $customerName;
        if ($customerEmail) $billing['email'] = $customerEmail;
        if ($customerPhone) $billing['phone'] = $customerPhone;

        $method = $paymongo->createPaymentMethod('qrph', empty($billing) ? [] : ['billing' => $billing]);
        $methodId = $method['id'];

        // 3. Attach Payment Method
        $attached = $paymongo->attachPaymentMethod($paymongoPaymentIntentId, $methodId);

        if (isset($attached['attributes']['next_action']['type']) &&
            $attached['attributes']['next_action']['type'] === 'consume_qr') {
            $qrCodeUrl = $attached['attributes']['next_action']['code']['image_url'];
        } else {
             throw new Exception("Failed to generate QR Code. Please try again.");
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "PayMongo Error: " . $e->getMessage()]);
        exit;
    }
}

// --- TRANSACTION & INSERTION ---

$maxRetries = 3;
$retryCount = 0;
$success = false;
$orderId = null;
$errorMsg = "";

while ($retryCount < $maxRetries && !$success) {
    try {
        $db->beginTransaction();

        // Insert Order
        $query = "INSERT INTO orders (
                    user_id, order_type, table_number, payment_method,
                    subtotal, service_charge, delivery_fee, total_amount,
                    status, created_at,
                    customer_name, customer_email, customer_phone, shipping_address,
                    paymongo_source_id, paymongo_payment_intent_id
                  ) VALUES (
                    :user_id, :order_type, :table_number, :payment_method,
                    :subtotal, :service_charge, :delivery_fee, :total_amount,
                    :status, NOW(),
                    :customer_name, :customer_email, :customer_phone, :shipping_address,
                    :paymongo_source_id, :paymongo_payment_intent_id
                  )";

        $status = ($paymentMethod === 'gcash' || $paymentMethod === 'qrph') ? 'pending' : 'pending';

        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId); // can be null
        $stmt->bindParam(':order_type', $orderType);
        $stmt->bindParam(':table_number', $tableNumber); // can be null
        $stmt->bindParam(':payment_method', $paymentMethod);
        $stmt->bindParam(':subtotal', $subtotal);
        $stmt->bindParam(':service_charge', $serviceCharge);
        $stmt->bindParam(':delivery_fee', $deliveryFee);
        $stmt->bindParam(':total_amount', $finalTotal);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':customer_name', $customerName);
        $stmt->bindParam(':customer_email', $customerEmail);
        $stmt->bindParam(':customer_phone', $customerPhone);
        $stmt->bindParam(':shipping_address', $shippingAddress);
        $stmt->bindParam(':paymongo_source_id', $paymongoSourceId);
        $stmt->bindParam(':paymongo_payment_intent_id', $paymongoPaymentIntentId);

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert order header.");
        }

        $orderId = $db->lastInsertId();

        // Insert Order Items
        $itemQuery = "INSERT INTO order_items (order_id, product_slug, product_name, price, quantity, subtotal)
                      VALUES (:order_id, :product_slug, :product_name, :price, :quantity, :subtotal)";
        $itemStmt = $db->prepare($itemQuery);

        foreach ($verifiedItems as $vItem) {
            $itemStmt->bindParam(':order_id', $orderId);
            $itemStmt->bindParam(':product_slug', $vItem['product_id']); // Using ID as slug
            $itemStmt->bindParam(':product_name', $vItem['product_name']);
            $itemStmt->bindParam(':price', $vItem['price']);
            $itemStmt->bindParam(':quantity', $vItem['quantity']);
            $itemStmt->bindParam(':subtotal', $vItem['subtotal']);

            if (!$itemStmt->execute()) {
                throw new Exception("Failed to insert order item: " . $vItem['product_name']);
            }
        }

        $db->commit();
        $success = true;

    } catch (PDOException $e) {
        $db->rollBack();
        // Check for deadlock error code (1213)
        if ($e->errorInfo[1] == 1213) {
            $retryCount++;
            usleep(100000); // Wait 100ms before retry
            continue;
        }
        $errorMsg = "Database Error: " . $e->getMessage();
        break; // Non-retryable error
    } catch (Exception $e) {
        $db->rollBack();
        $errorMsg = $e->getMessage();
        break;
    }
}

if ($success) {
    // Log success
    $logDetails = "Order ID: $orderId, Type: $orderType, Total: $finalTotal";
    if ($userId || $customerEmail) {
        // Use email if userId is null
        $userIdentifier = $userId ? "User:$userId" : $customerEmail;
        $logger->log('order_placed', $userIdentifier, $logDetails);
    }

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully!",
        "orderId" => $orderId,
        "totalAmount" => $finalTotal,
        "checkoutUrl" => $checkoutUrl,
        "qrCodeUrl" => $qrCodeUrl,
        "paymentIntentId" => $paymongoPaymentIntentId
    ]);
} else {
    error_log("Order Placement Failed: " . $errorMsg);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to place order. Please try again. " . ($retryCount >= $maxRetries ? "(Server Busy)" : "")]);
}
?>