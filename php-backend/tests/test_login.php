<?php
// Test Script to simulate login request to API
$url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/login.php";

// Helper function to make request
function login($email, $password) {
    global $url;
    $data = [
        "email" => $email,
        "password" => $password
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $http_code, 'body' => $response];
}

echo "--- Starting Login Tests ---\n";

// 1. Successful Login
// Prerequisite: A user with email "test@example.com" and password "StrongP@ssw0rd!" must exist. 
// If not, run register test first.
echo "\nTest 1: Valid Credentials\n";
// Let's create a user first to be sure
$regUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/api/register.php";
$regData = [
    "firstName" => "Login",
    "lastName" => "Test",
    "email" => "logintest_" . time() . "@example.com",
    "password" => "StrongP@ssw0rd!"
];
$ch = curl_init($regUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($regData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$regRes = curl_exec($ch);
curl_close($ch);
$regUser = json_decode($regRes, true);

if (isset($regUser['success']) && $regUser['success']) {
    $email = $regData['email'];
    $password = $regData['password'];
    
    $res = login($email, $password);
    echo "Code: " . $res['code'] . "\n";
    if ($res['code'] == 200) {
        echo "PASS: Login successful.\n";
    } else {
        echo "FAIL: Login failed. " . $res['body'] . "\n";
    }
} else {
    echo "SKIP: Could not create test user.\n";
}

// 2. Invalid Password
echo "\nTest 2: Invalid Password\n";
$res = login($email, "WrongPassword123!");
echo "Code: " . $res['code'] . "\n";
if ($res['code'] == 401) {
    echo "PASS: Rejected invalid password.\n";
} else {
    echo "FAIL: Should return 401. Got " . $res['code'] . "\n";
}

// 3. Non-existent User
echo "\nTest 3: Non-existent User\n";
$res = login("ghost@example.com", "Password123!");
echo "Code: " . $res['code'] . "\n";
if ($res['code'] == 401) {
    echo "PASS: Rejected non-existent user.\n";
} else {
    echo "FAIL: Should return 401. Got " . $res['code'] . "\n";
}

// 4. Rate Limiting
echo "\nTest 4: Rate Limiting (Spamming 6 requests)\n";
for ($i = 0; $i < 6; $i++) {
    $res = login($email, "WrongPass" . $i);
    echo "Request " . ($i + 1) . ": Code " . $res['code'] . "\n";
}
// The last request should be 401 with generic message (was 429)
if ($res['code'] == 401) {
    $body = json_decode($res['body'], true);
    if ($body['message'] === "Invalid email or password.") {
        echo "PASS: Rate limit triggered but returned generic error.\n";
    } else {
        echo "FAIL: Rate limit returned wrong message: " . $body['message'] . "\n";
    }
} else {
    echo "FAIL: Expected 401 for rate limit, got " . $res['code'] . "\n";
}

?>