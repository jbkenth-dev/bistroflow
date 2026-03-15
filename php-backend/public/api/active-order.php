<?php
// active-order.php
// Returns the most recent ACTIVE order for a user (status: pending, preparing, ready)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../src/Database.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required."]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Find the latest order that is NOT completed or cancelled
    // We assume 'pending', 'preparing', 'ready' are active statuses
    $query = "SELECT * FROM orders
              WHERE user_id = :user_id
              AND status IN ('pending', 'preparing', 'ready')
              ORDER BY created_at DESC
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        // Fetch items for this order to display summary
        $itemQuery = "SELECT p.image_url, oi.product_name, oi.quantity
                      FROM order_items oi
                      JOIN products p ON oi.product_slug = p.id OR oi.product_slug = p.slug
                      WHERE oi.order_id = :order_id
                      LIMIT 1"; // Just get the first image for the main display

        // Note: The original query was just selecting from order_items.
        // We need to join with products to get image_url.
        // Assuming product_slug in order_items matches id or slug in products.
        // Let's check schema if possible, but standard join is safe.

        // Actually, let's get all items for summary, but also image.
        $itemsQuery = "SELECT oi.product_name, oi.quantity, p.image_url
                       FROM order_items oi
                       LEFT JOIN products p ON p.id = oi.product_slug
                       WHERE oi.order_id = :order_id";

        $itemStmt = $db->prepare($itemsQuery);
        $itemStmt->bindParam(':order_id', $order['id']);
        $itemStmt->execute();
        $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

        $orderImage = null;
        if (!empty($items)) {
            // Use the first item's image
            $orderImage = $items[0]['image_url'] ?? null;
        }

        // Create a summary string
        $itemNames = array_map(function($i) {
            return $i['quantity'] > 1 ? "{$i['quantity']}x {$i['product_name']}" : $i['product_name'];
        }, $items);
        $itemsSummary = implode(', ', $itemNames);

        // Calculate progress based on status
        // New Flow: Placed -> To Pay (Cash Only) -> Preparing -> Ready -> Served
        // If Cash: 5 steps. If GCash: 4 steps (Skip To Pay)

        $isCash = ($order['payment_method'] === 'cash');
        $steps = [];

        // Step 1: Placed
        $steps[] = ['label' => 'Placed', 'active' => true, 'completed' => true];

        // Step 2: To Pay (Only for Cash)
        if ($isCash) {
            $formattedTotal = number_format((float)$order['total_amount'], 2);
            $steps[] = [
                'label' => "To Pay\n₱$formattedTotal",
                'active' => false,
                'completed' => false
            ];
        }

        // Step 3: Preparing
        $steps[] = ['label' => 'Preparing', 'active' => false, 'completed' => false];

        // Step 4: Ready
        $steps[] = ['label' => 'Ready', 'active' => false, 'completed' => false];

        // Step 5: Served
        $steps[] = ['label' => 'Served', 'active' => false, 'completed' => false];

        // Determine current progress
        $status = $order['status'];
        $progress = 0;

        $totalSteps = count($steps);
        $stepPercentage = 100 / $totalSteps;

        // Helper to get center of a step
        $getCenter = function($index) use ($stepPercentage) {
            return ($index + 0.5) * $stepPercentage;
        };

        if ($status === 'pending') {
            if ($isCash) {
                // At 'To Pay' step (Index 1)
                $steps[1]['active'] = true;
                $progress = $getCenter(1);
            } else {
                // Stay at Placed (Index 0)
                // Do not advance to Preparing yet
                $progress = $getCenter(0);
            }
        } elseif ($status === 'preparing') {
            if ($isCash) {
                // Index 2 (Preparing)
                $steps[1]['completed'] = true;
                $steps[2]['active'] = true;
                $progress = $getCenter(2);
            } else {
                // Index 1 (Preparing)
                $steps[1]['active'] = true;
                $progress = $getCenter(1);
            }
        } elseif ($status === 'ready') {
             if ($isCash) {
                 // Index 3 (Ready)
                 $steps[1]['completed'] = true;
                 $steps[2]['completed'] = true;
                 $steps[3]['active'] = true;
                 $progress = $getCenter(3);
             } else {
                 // Index 2 (Ready)
                 $steps[1]['completed'] = true;
                 $steps[2]['active'] = true;
                 $progress = $getCenter(2);
             }
        } elseif ($status === 'served' || $status === 'completed') {
             // Not usually hit by this API due to WHERE clause, but for completeness
             $progress = 100;
        }

        // Add calculated fields
        $order['items_summary'] = $itemsSummary;
        $order['order_image'] = $orderImage;
        $order['items'] = $items;
        $order['progress'] = $progress;
        $order['steps'] = $steps;

        // Estimated time (mock logic for now, could be DB field)
        $order['estimated_time'] = "15 min";

        // --- Recent Order Types (Last 90 Days) ---
        $recentTypesQuery = "SELECT DISTINCT order_type FROM orders
                             WHERE user_id = :user_id
                             AND created_at >= NOW() - INTERVAL 90 DAY";
        $rtStmt = $db->prepare($recentTypesQuery);
        $rtStmt->bindParam(':user_id', $userId);
        $rtStmt->execute();
        $recentTypes = $rtStmt->fetchAll(PDO::FETCH_COLUMN);

        $order['recent_order_types'] = $recentTypes;

        echo json_encode(["success" => true, "data" => $order]);
    } else {
        // Even if no active order, we might want recent order types?
        // The current structure returns 'data' as the active order object.
        // If we want recent types even without active order, we should restructure the response
        // or make a separate call.
        // For now, let's include it in a separate block if no active order found,
        // OR simply return null data and let frontend handle it.
        // But the user prompt implies "Order Type" section is always visible.

        // Let's check recent types anyway
        $recentTypesQuery = "SELECT DISTINCT order_type FROM orders
                             WHERE user_id = :user_id
                             AND created_at >= NOW() - INTERVAL 90 DAY";
        $rtStmt = $db->prepare($recentTypesQuery);
        $rtStmt->bindParam(':user_id', $userId);
        $rtStmt->execute();
        $recentTypes = $rtStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(["success" => true, "data" => null, "recent_order_types" => $recentTypes]);
    }

} catch (Exception $e) {
    error_log("Active Order API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred while fetching the active order."]);
}
?>