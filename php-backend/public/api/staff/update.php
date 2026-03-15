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
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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
    // Check if user exists
    $checkStmt = $db->prepare("SELECT id FROM users WHERE id = :id");
    $checkStmt->bindParam(':id', $data['id']);
    $checkStmt->execute();

    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Staff member not found."]);
        exit;
    }

    // Update query
    $updateFields = [];
    $params = [':id' => $data['id']];

    if (isset($data['first_name'])) {
        $updateFields[] = "first_name = :first_name";
        $params[':first_name'] = $data['first_name'];
    }
    if (isset($data['middle_name'])) {
        $updateFields[] = "middle_name = :middle_name";
        $params[':middle_name'] = $data['middle_name'];
    }
    if (isset($data['last_name'])) {
        $updateFields[] = "last_name = :last_name";
        $params[':last_name'] = $data['last_name'];
    }
    if (isset($data['email'])) {
        $updateFields[] = "email = :email";
        $params[':email'] = $data['email'];
        
        // Verify email uniqueness
        $emailCheck = $db->prepare("SELECT id FROM users WHERE email = :email AND id != :id");
        $emailCheck->execute([':email' => $data['email'], ':id' => $data['id']]);
        if ($emailCheck->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["success" => false, "message" => "Email already taken by another user."]);
            exit;
        }
    }
    if (isset($data['password']) && !empty($data['password'])) {
        $updateFields[] = "password_hash = :password_hash";
        $updateFields[] = "password_updated_at = NOW()";
        $params[':password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No fields to update."]);
        exit;
    }

    $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = :id AND role = 'staff'";
    $stmt = $db->prepare($sql);
    
    if ($stmt->execute($params)) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Staff member updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update staff member."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>