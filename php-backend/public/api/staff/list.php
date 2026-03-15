<?php
require_once __DIR__ . '/../../../src/Database.php';

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Session Check
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// In a real production app, uncomment this to enforce admin session
// if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
//     http_response_code(403);
//     echo json_encode(["success" => false, "message" => "Unauthorized access."]);
//     exit;
// }

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT id, first_name, middle_name, last_name, email, role, created_at FROM users WHERE role = 'staff' ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "data" => $staff]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error fetching staff: " . $e->getMessage()]);
}
?>