<?php
// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default fallback or restrict
    header("Access-Control-Allow-Origin: *"); // Be careful with * and credentials
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start Session for CSRF and Auth
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../src/Database.php';
require_once '../../src/Validator.php';
require_once '../../src/Logger.php';
require_once '../../src/RateLimiter.php';

// Initialize components
$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "System error. Please try again later."]);
    exit;
}

$logger = new Logger($db);
$limiter = new RateLimiter($db, 5, 300); // 5 login attempts per 5 minutes

// Check Rate Limit
$ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
if (!$limiter->check($ip, 'api_login_attempt')) {
    $logger->log('login_rate_limit_exceeded', null, "IP: $ip");
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
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
$email = Validator::sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';
$scope = $data['scope'] ?? 'customer'; // 'customer' or 'admin'

// Validation
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

if (!Validator::validateEmail($email)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format."]);
    exit;
}

try {
    // Check credentials
    $query = "SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userRole = $user['role'] ?? 'customer';

        // Scope Validation
        if ($scope === 'customer' && ($userRole === 'admin' || $userRole === 'staff')) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Please log in via the Staff/Admin portal."]);
            exit;
        }

        if ($scope === 'admin' && $userRole === 'customer') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access denied. Customers must use the main login."]);
            exit;
        }

        if (password_verify($password, $user['password_hash'])) {
            // Success
            $logger->log('login_success', $email, "User ID: " . $user['id']);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'] ?? 'customer';
            $_SESSION['email'] = $user['email'];

            // Generate simple token (in production, use JWT or similar)
            // For this session-based/local storage approach, we return user info

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    "id" => $user['id'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "email" => $user['email'],
                    "role" => $user['role'] ?? 'customer', // Default to customer if role is missing
                    "profilePic" => "http://localhost/bistroflow/bistroflow/php-backend/public/api/get-profile-pic.php?user_id=" . $user['id'] . "&t=" . time()
                ]
            ]);
            exit;
        }
    }

    // Generic error for security (don't reveal if email exists)
    $logger->log('login_failed', $email, "IP: $ip - Invalid credentials");
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);

} catch (Exception $e) {
    error_log("API Login Error: " . $e->getMessage());
    $logger->log('login_error', $email, $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred during login."]);
    exit;
}
?>