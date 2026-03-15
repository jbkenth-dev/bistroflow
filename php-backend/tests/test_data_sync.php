<?php
// Test Script for Data Synchronization

require_once __DIR__ . '/../src/Database.php';

$database = new Database();
$db = $database->getConnection();

// Helper to make GET request
function getRequest($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => json_decode($result, true)];
}

// 1. Create a dummy user and order for testing
echo "=== Setting up Test Data ===\n";
try {
    $db->beginTransaction();
    
    // Create User
    $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password_hash) VALUES ('Test', 'User Sync', 'sync_test@example.com', 'hash')");
    $stmt->execute();
    $userId = $db->lastInsertId();
    echo "Created User ID: $userId\n";

    // Create Active Order
    $stmt = $db->prepare("INSERT INTO orders (user_id, order_type, payment_method, subtotal, total_amount, status, created_at) VALUES (?, 'dine-in', 'cash', 500, 500, 'preparing', NOW())");
    $stmt->execute([$userId]);
    $activeOrderId = $db->lastInsertId();
    echo "Created Active Order ID: $activeOrderId (Status: preparing)\n";

    // Add Items to Active Order
    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_slug, product_name, price, quantity, subtotal) VALUES (?, 'burger-1', 'Classic Burger', 250, 2, 500)");
    $stmt->execute([$activeOrderId]);

    // Create Completed Order (History)
    $stmt = $db->prepare("INSERT INTO orders (user_id, order_type, payment_method, subtotal, total_amount, status, created_at) VALUES (?, 'takeout', 'gcash', 300, 300, 'completed', NOW() - INTERVAL 1 DAY)");
    $stmt->execute([$userId]);
    $historyOrderId = $db->lastInsertId();
    echo "Created History Order ID: $historyOrderId (Status: completed)\n";

    // Add Items to History Order
    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_slug, product_name, price, quantity, subtotal) VALUES (?, 'pasta-1', 'Spaghetti', 300, 1, 300)");
    $stmt->execute([$historyOrderId]);

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    die("Setup Failed: " . $e->getMessage() . "\n");
}

echo "\n=== Testing API Endpoints ===\n";

// 2. Test Active Order API
echo "Testing GET /api/active-order.php?userId=$userId ... ";
$resActive = getRequest("http://localhost/bistroflow/bistroflow/php-backend/public/api/active-order.php?userId=$userId");

if ($resActive['code'] === 200 && $resActive['body']['success']) {
    $data = $resActive['body']['data'];
    if ($data['id'] == $activeOrderId && $data['status'] === 'preparing') {
        echo "PASSED\n";
        echo "  - Retrieved Order ID: " . $data['id'] . "\n";
        echo "  - Status: " . $data['status'] . "\n";
        echo "  - Items Summary: " . $data['items_summary'] . "\n";
    } else {
        echo "FAILED (Data mismatch)\n";
        print_r($data);
    }
} else {
    echo "FAILED (API Error)\n";
    print_r($resActive);
}

// 3. Test Order History API
echo "Testing GET /api/orders.php?userId=$userId ... ";
$resHistory = getRequest("http://localhost/bistroflow/bistroflow/php-backend/public/api/orders.php?userId=$userId");

if ($resHistory['code'] === 200 && $resHistory['body']['success']) {
    $data = $resHistory['body']['data'];
    // Should find at least 2 orders (active and completed)
    if (count($data) >= 2) {
        echo "PASSED\n";
        echo "  - Found " . count($data) . " orders\n";
        echo "  - First Order ID: " . $data[0]['id'] . " (Latest)\n";
    } else {
        echo "FAILED (Count mismatch)\n";
        print_r($data);
    }
} else {
    echo "FAILED (API Error)\n";
    print_r($resHistory);
}

// 4. Cleanup
echo "\n=== Cleaning up ===\n";
$db->exec("DELETE FROM users WHERE id = $userId"); // Cascades to orders
echo "Test data deleted.\n";
?>