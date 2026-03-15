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

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit;
}

// In a real app, you'd verify the session/token here.
// For now, we expect 'user_id' in the payload.
$user_id = $data['user_id'] ?? null;
$first_name = Validator::sanitizeInput($data['firstName'] ?? '');
$middle_name = Validator::sanitizeInput($data['middleName'] ?? '');
$last_name = Validator::sanitizeInput($data['lastName'] ?? '');

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. User ID required."]);
    exit;
}

// Validation
$errors = [];
if (empty($first_name)) {
    $errors[] = "First Name is required.";
}
if (empty($last_name)) {
    $errors[] = "Last Name is required.";
}
// Middle name is optional

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Validation failed", "errors" => $errors]);
    exit;
}

$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

try {
    // Check if user exists first
    $stmt = $db->prepare("SELECT id FROM users WHERE id = :id");
    $stmt->bindParam(':id', $user_id);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    // Update User
    $update = "UPDATE users SET first_name = :first_name, middle_name = :middle_name, last_name = :last_name WHERE id = :id";
    $stmt = $db->prepare($update);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':middle_name', $middle_name);
    $stmt->bindParam(':last_name', $last_name);
    $stmt->bindParam(':id', $user_id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully",
            "user" => [
                "firstName" => $first_name,
                "middleName" => $middle_name,
                "lastName" => $last_name,
                "name" => trim("$first_name $last_name")
            ]
        ]);
    } else {
        throw new Exception("Update failed");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred updating profile."]);
}
?>
