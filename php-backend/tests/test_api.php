<?php
// Test Script to simulate frontend request to API
$url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/register.php";
$data = [
    "firstName" => "Test",
    "middleName" => "API",
    "lastName" => "User",
    "email" => "api_test_" . time() . "@example.com",
    "password" => "StrongP@ssw0rd!"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $http_code\n";
echo "Response: $response\n";

if ($http_code == 201) {
    echo "SUCCESS: User created.\n";
} else {
    echo "FAIL: API request failed.\n";
    exit(1);
}
?>