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
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Staff ID is required."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

try {
    // Check if user exists and is staff
    $checkStmt = $db->prepare("SELECT id FROM users WHERE id = :id AND role = 'staff'");
    $checkStmt->bindParam(':id', $data['id']);
    $checkStmt->execute();

    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Staff member not found or not a staff role."]);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM users WHERE id = :id AND role = 'staff'");
    $stmt->bindParam(':id', $data['id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Staff member deleted successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to delete staff member."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>