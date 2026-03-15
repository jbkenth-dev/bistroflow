<?php
require_once __DIR__ . '/../../../src/Database.php';

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// In a real production app, enforce admin check here too

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['first_name'], $data['last_name'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

try {
    // Check if email already exists
    $checkStmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $data['email']);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit;
    }

    // Insert new staff
    $query = "INSERT INTO users (first_name, middle_name, last_name, email, password_hash, role) 
              VALUES (:first_name, :middle_name, :last_name, :email, :password_hash, 'staff')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':first_name', $data['first_name']);
    $stmt->bindParam(':middle_name', $data['middle_name']);
    $stmt->bindParam(':last_name', $data['last_name']);
    $stmt->bindParam(':email', $data['email']);
    
    $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bindParam(':password_hash', $password_hash);

    if ($stmt->execute()) {
        // Log password change (initial set)
        $id = $db->lastInsertId();
        // Update password_updated_at
        $updatePassTime = $db->prepare("UPDATE users SET password_updated_at = NOW() WHERE id = :id");
        $updatePassTime->execute([':id' => $id]);
        
        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Staff member created successfully.", "id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to create staff member."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>