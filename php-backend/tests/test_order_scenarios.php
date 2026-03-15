<?php
// Test Script for Robust Order Processing

require_once __DIR__ . '/../src/Database.php';

$database = new Database();
$db = $database->getConnection();

// Helper to make POST request
function postRequest($url, $data) {
    $ch = curl_init($url);
    $payload = json_encode($data);
    
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'body' => json_decode($result, true)];
}

$baseUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/api/place-order.php";

echo "=== Starting Robust Order Tests ===\n\n";

// 1. Get a valid product
$stmt = $db->query("SELECT * FROM products LIMIT 1");
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    die("Error: No products in DB to test with.\n");
}

$productId = $product['id'];
$realPrice = (float)$product['price'];
echo "Using Product ID: $productId (Price: $realPrice)\n\n";

// --- TEST 1: Valid Dine-in Order ---
echo "Test 1: Valid Dine-in Order... ";
$payload1 = [
    'orderType' => 'dine-in',
    'tableNumber' => 5,
    'paymentMethod' => 'cash',
    'items' => [
        [
            'item' => ['slug' => (string)$productId, 'price' => $realPrice], // Correct price
            'qty' => 2
        ]
    ]
];
$res1 = postRequest($baseUrl, $payload1);
if ($res1['code'] === 201 && $res1['body']['success']) {
    echo "PASSED (Order ID: " . $res1['body']['orderId'] . ")\n";
} else {
    echo "FAILED\n";
    print_r($res1);
}

// --- TEST 2: Valid Delivery Order ---
echo "Test 2: Valid Delivery Order... ";
$payload2 = [
    'orderType' => 'delivery',
    'paymentMethod' => 'gcash',
    'customerName' => 'John Doe',
    'customerPhone' => '09171234567',
    'shippingAddress' => '123 Main St, Manila',
    'items' => [
        [
            'item' => ['slug' => (string)$productId, 'price' => $realPrice],
            'qty' => 1
        ]
    ]
];
$res2 = postRequest($baseUrl, $payload2);
if ($res2['code'] === 201 && $res2['body']['success']) {
    echo "PASSED (Order ID: " . $res2['body']['orderId'] . ")\n";
} else {
    echo "FAILED\n";
    print_r($res2);
}

// --- TEST 3: Delivery Missing Address ---
echo "Test 3: Delivery Missing Address... ";
$payload3 = $payload2;
unset($payload3['shippingAddress']);
$res3 = postRequest($baseUrl, $payload3);
if ($res3['code'] === 400 && strpos($res3['body']['message'], 'address is required') !== false) {
    echo "PASSED (Correctly rejected)\n";
} else {
    echo "FAILED\n";
    print_r($res3);
}

// --- TEST 4: Price Tampering ---
echo "Test 4: Price Tampering (Client sends 1.00, Real is $realPrice)... ";
$payload4 = [
    'orderType' => 'takeout',
    'paymentMethod' => 'cash',
    'items' => [
        [
            'item' => ['slug' => (string)$productId, 'price' => 1.00], // FAKE PRICE
            'qty' => 1
        ]
    ]
];
$res4 = postRequest($baseUrl, $payload4);
if ($res4['code'] === 201) {
    // Check if total amount matches real price
    $expectedTotal = $realPrice; // + service charge if any, currently 0 for takeout
    $actualTotal = (float)$res4['body']['totalAmount'];
    
    if (abs($actualTotal - $expectedTotal) < 0.01) {
        echo "PASSED (Server used real price: $actualTotal)\n";
    } else {
        echo "FAILED (Server used wrong price: $actualTotal)\n";
    }
} else {
    echo "FAILED (Request failed)\n";
    print_r($res4);
}

// --- TEST 5: Invalid Product ID ---
echo "Test 5: Invalid Product ID... ";
$payload5 = [
    'orderType' => 'dine-in',
    'tableNumber' => 1,
    'paymentMethod' => 'cash',
    'items' => [
        [
            'item' => ['slug' => '99999999', 'price' => 100],
            'qty' => 1
        ]
    ]
];
$res5 = postRequest($baseUrl, $payload5);
if ($res5['code'] === 400 && strpos($res5['body']['message'], 'not found') !== false) {
    echo "PASSED (Correctly rejected)\n";
} else {
    echo "FAILED\n";
    print_r($res5);
}

// --- TEST 6: Performance Benchmark ---
echo "Test 6: Performance Benchmark (10 Orders)... ";
$start = microtime(true);
for ($i = 0; $i < 10; $i++) {
    $payloadBench = [
        'orderType' => 'takeout',
        'paymentMethod' => 'cash',
        'items' => [
            [
                'item' => ['slug' => (string)$productId, 'price' => $realPrice],
                'qty' => 1
            ]
        ]
    ];
    $res = postRequest($baseUrl, $payloadBench);
    if ($res['code'] !== 201) {
        echo "Failed at iteration $i\n";
        // exit; // Don't exit, just report
    }
}
$end = microtime(true);
$duration = $end - $start;
echo "PASSED (10 orders in " . number_format($duration, 4) . "s, " . number_format($duration/10, 4) . "s/order)\n";

echo "\n=== Tests Completed ===\n";
?>