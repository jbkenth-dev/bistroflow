<?php
/**
 * Test script for Active Order API Scenarios
 */

function makeRequest($userId) {
    $url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/active-order.php";
    if ($userId !== null) {
        $url .= "?userId=" . $userId;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $httpCode, 'body' => $response];
}

function runTest($name, $userId, $expectedCode, $checkFn = null) {
    echo "Running Test: $name... ";
    $result = makeRequest($userId);
    
    if ($result['code'] !== $expectedCode) {
        echo "FAILED (Expected status $expectedCode, got {$result['code']})\n";
        return;
    }

    if ($checkFn) {
        $data = json_decode($result['body'], true);
        if ($checkFn($data)) {
            echo "PASSED\n";
        } else {
            echo "FAILED (Content check failed)\n";
            echo "Response: " . substr($result['body'], 0, 200) . "...\n";
        }
    } else {
        echo "PASSED\n";
    }
}

echo "=== Active Order API Tests ===\n";

// Test 1: Valid User with Active Order (User ID 5 known to have order)
runTest("Valid User with Active Order", 5, 200, function($data) {
    return $data['success'] === true && 
           isset($data['data']['id']) && 
           isset($data['data']['order_image']) &&
           !empty($data['data']['order_image']);
});

// Test 2: Valid User with NO Active Order (Need a user ID without active order)
// Let's assume user 9999 doesn't exist or has no orders
runTest("User with No Active Order", 9999, 200, function($data) {
    return $data['success'] === true && $data['data'] === null;
});

// Test 3: Missing User ID
runTest("Missing User ID", null, 400, function($data) {
    return $data['success'] === false && strpos($data['message'], "required") !== false;
});

?>
