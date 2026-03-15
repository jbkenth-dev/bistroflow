<?php
// Test Script for To Pay Step

require_once __DIR__ . '/../src/Database.php';

$database = new Database();
$db = $database->getConnection();

function getRequest($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => json_decode($result, true)];
}

echo "=== Testing To Pay Step ===\n";

// 1. Setup Test User & Order
try {
    $db->beginTransaction();
    $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password_hash) VALUES ('Pay', 'Test', 'paytest@example.com', 'hash')");
    $stmt->execute();
    $userId = $db->lastInsertId();

    // Order with specific amount
    $totalAmount = 1234.50;
    $stmt = $db->prepare("INSERT INTO orders (user_id, order_type, payment_method, subtotal, total_amount, status, created_at) VALUES (?, 'dine-in', 'cash', ?, ?, 'preparing', NOW())");
    $stmt->execute([$userId, $totalAmount, $totalAmount]);
    $orderId = $db->lastInsertId();
    
    $stmt = $db->prepare("INSERT INTO order_items (order_id, product_slug, product_name, price, quantity, subtotal) VALUES (?, 'item', 'Item', ?, 1, ?)");
    $stmt->execute([$orderId, $totalAmount, $totalAmount]);

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    die("Setup Failed: " . $e->getMessage());
}

// 2. Fetch Active Order
$res = getRequest("http://localhost/bistroflow/bistroflow/php-backend/public/api/active-order.php?userId=$userId");

if ($res['code'] === 200 && $res['body']['success']) {
    $data = $res['body']['data'];
    $steps = $data['steps'];
    
    // Check for 5 steps
    if (count($steps) === 5) {
        echo "PASSED: 5 Steps found.\n";
    } else {
        echo "FAILED: Expected 5 steps, found " . count($steps) . ".\n";
    }

    // Check last step label
    $lastStep = end($steps);
    $expectedLabel = "To Pay\n₱1,234.50";
    if ($lastStep['label'] === $expectedLabel) {
        echo "PASSED: Last step label matches '$expectedLabel'.\n";
    } else {
        echo "FAILED: Expected '$expectedLabel', got '{$lastStep['label']}'.\n";
    }
} else {
    echo "FAILED: API Error\n";
    print_r($res);
}

// 3. Cleanup
$db->exec("DELETE FROM users WHERE id = $userId");
echo "Test data cleaned up.\n";
?>