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
require_once '../../src/Utils.php';
require_once '../../src/Logger.php';
require_once '../../src/RateLimiter.php';

// Initialize components
$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$logger = new Logger($db);
$limiter = new RateLimiter($db, 10, 60); // 10 attempts per minute

// Check Rate Limit
$ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
if (!$limiter->check($ip, 'api_signup_attempt')) {
    $logger->log('signup_rate_limit_exceeded', null, "IP: $ip");
    http_response_code(429);
    echo json_encode(["success" => false, "message" => "Too many attempts. Please try again later."]);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit;
}

// Sanitize Input
$first_name = Validator::sanitizeInput($data['firstName'] ?? '');
$middle_name = Validator::sanitizeInput($data['middleName'] ?? '');
$last_name = Validator::sanitizeInput($data['lastName'] ?? '');
$email = Validator::sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? ''; // Do NOT sanitize password, it breaks special chars!
// Phone is not in the form currently, skipping or optional

// Validation
$errors = [];

if (empty($first_name)) {
    $errors[] = "First Name is required.";
}

if (empty($last_name)) {
    $errors[] = "Last Name is required.";
}

if (empty($email) || !Validator::validateEmail($email)) {
    $errors[] = "Valid Email is required.";
}

if (empty($password) || !Validator::validatePassword($password)) {
    $errors[] = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Validation failed", "errors" => $errors]);
    exit;
}

// Check for duplicate email
try {
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit;
    }

    // Create User
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $user_id = Utils::generateUniqueUserId($db);

    $insert = "INSERT INTO users (id, first_name, middle_name, last_name, email, password_hash) VALUES (:id, :first_name, :middle_name, :last_name, :email, :hash)";
    $stmt = $db->prepare($insert);
    $stmt->bindParam(':id', $user_id);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':middle_name', $middle_name);
    $stmt->bindParam(':last_name', $last_name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':hash', $password_hash);

    if ($stmt->execute()) {
        // Log Success
        $logger->log('signup_success', $email, "User ID: $user_id (API)");

        http_response_code(201);
        echo json_encode(["success" => true, "message" => "User registered successfully", "userId" => $user_id]);
        exit;
    } else {
        throw new Exception("Insert failed");
    }

} catch (Exception $e) {
    error_log("API Registration Error: " . $e->getMessage());
    $logger->log('signup_error', $email, $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred during registration."]);
    exit;
}
?>