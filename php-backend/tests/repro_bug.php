<?php
// Reproduction script for signup-then-login flow failure

$baseUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/api";
$uniqueId = time();
$email = "bug_repro_" . $uniqueId . "@example.com";
$password = "StrongP@ssw0rd!" . $uniqueId;

// 1. Signup
echo "--- Step 1: Attempting Signup ---\n";
$signupData = [
    "firstName" => "Bug",
    "lastName" => "Repro",
    "email" => $email,
    "password" => $password
];

$ch = curl_init($baseUrl . "/register.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($signupData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Signup Response Code: $httpCode\n";
echo "Signup Response Body: $response\n";

if ($httpCode != 201) {
    echo "FATAL: Signup failed. Cannot proceed with reproduction.\n";
    exit(1);
}

// 2. Login with same credentials
echo "\n--- Step 2: Attempting Login with SAME credentials ---\n";
$loginData = [
    "email" => $email,
    "password" => $password
];

$ch = curl_init($baseUrl . "/login.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login Response Code: $httpCode\n";
echo "Login Response Body: $response\n";

if ($httpCode == 200) {
    echo "\nRESULT: Login SUCCESS (Issue NOT reproduced)\n";
} else {
    echo "\nRESULT: Login FAILED (Issue REPRODUCED)\n";
}
?>