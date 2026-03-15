<?php
session_start();

require_once '../src/Database.php';
require_once '../src/Validator.php';
require_once '../src/Utils.php';
require_once '../src/CSRF.php';
require_once '../src/Logger.php';
require_once '../src/RateLimiter.php';

// Initialize components
$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    die("System error. Please try again later.");
}

$logger = new Logger($db);
$limiter = new RateLimiter($db, 5, 300); // 5 attempts per 5 minutes

// Check Request Method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: signup.php");
    exit;
}

// Check Rate Limit
$ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
if (!$limiter->check($ip, 'signup_attempt')) {
    $_SESSION['error'] = "Too many registration attempts. Please try again later.";
    $logger->log('signup_rate_limit_exceeded', null, "IP: $ip");
    header("Location: signup.php");
    exit;
}

// Verify CSRF
if (!CSRF::verifyToken($_POST['csrf_token'] ?? '')) {
    $_SESSION['error'] = "Invalid security token. Please refresh and try again.";
    $logger->log('csrf_failure', null, "IP: $ip");
    header("Location: signup.php");
    exit;
}

// Get and Sanitize Input
$first_name = Validator::sanitizeInput($_POST['first_name'] ?? '');
$middle_name = Validator::sanitizeInput($_POST['middle_name'] ?? '');
$last_name = Validator::sanitizeInput($_POST['last_name'] ?? '');
$email = Validator::sanitizeInput($_POST['email'] ?? '');
$phone = Validator::sanitizeInput($_POST['phone_number'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

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

if (!empty($phone) && !Validator::validatePhone($phone)) {
    $errors[] = "Invalid phone number format.";
}

if (empty($password) || !Validator::validatePassword($password)) {
    $errors[] = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
}

if ($password !== $confirm_password) {
    $errors[] = "Passwords do not match.";
}

if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    $_SESSION['old_input'] = $_POST;
    header("Location: signup.php");
    exit;
}

// Check for duplicate email
try {
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $_SESSION['error'] = "Email already registered.";
        $_SESSION['old_input'] = $_POST;
        header("Location: signup.php");
        exit;
    }

    // Create User
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $user_id = Utils::generateUniqueUserId($db);

    $insert = "INSERT INTO users (id, first_name, middle_name, last_name, email, phone_number, password_hash) VALUES (:id, :first_name, :middle_name, :last_name, :email, :phone, :hash)";
    $stmt = $db->prepare($insert);
    $stmt->bindParam(':id', $user_id);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':middle_name', $middle_name);
    $stmt->bindParam(':last_name', $last_name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':hash', $password_hash);

    if ($stmt->execute()) {
        // Log Success
        $logger->log('signup_success', $email, "User ID: $user_id");

        // Start Session (Auto-login)
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $first_name . ' ' . $last_name;

        header("Location: success.php");
        exit;
    } else {
        throw new Exception("Insert failed");
    }

} catch (Exception $e) {
    error_log("Registration Error: " . $e->getMessage());
    $logger->log('signup_error', $email, $e->getMessage());
    $_SESSION['error'] = "An error occurred during registration. Please try again.";
    header("Location: signup.php");
    exit;
}
?>