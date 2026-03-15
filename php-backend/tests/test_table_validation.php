<?php
/**
 * Test script for To Pay Validation Bug
 */

function makeRequest($payload) {
    $url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/place-order.php";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $httpCode, 'body' => $response];
}

echo "=== Testing Table Number Validation ===\n";

$basePayload = [
    "userId" => 5,
    "items" => [["item" => ["slug" => 3], "qty" => 1]],
    "orderType" => "dine-in",
    "paymentMethod" => "cash"
];

// Case 1: Valid Table ID (String)
$payload1 = $basePayload;
$payload1["tableNumber"] = "T-011";
$res1 = makeRequest($payload1);
echo "Test 1 (T-011): Code {$res1['code']} - " . ($res1['code'] == 201 ? "PASS" : "FAIL") . "\n";

// Case 2: Valid Table ID (Numeric String)
$payload2 = $basePayload;
$payload2["tableNumber"] = "1";
$res2 = makeRequest($payload2);
echo "Test 2 (1): Code {$res2['code']} - " . ($res2['code'] == 201 ? "PASS" : "FAIL") . "\n";

// Case 3: Missing Table Number
$payload3 = $basePayload;
unset($payload3["tableNumber"]);
$res3 = makeRequest($payload3);
echo "Test 3 (Missing): Code {$res3['code']} - " . ($res3['code'] == 400 ? "PASS" : "FAIL") . "\n";

// Case 4: Null Table Number
$payload4 = $basePayload;
$payload4["tableNumber"] = null;
$res4 = makeRequest($payload4);
echo "Test 4 (Null): Code {$res4['code']} - " . ($res4['code'] == 400 ? "PASS" : "FAIL") . "\n";

?>
