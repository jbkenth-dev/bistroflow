<?php
// api/staff/update-order-status.php
// Updates the status of an order

require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/AuthMiddleware.php';

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Basic Auth Check (Placeholder)
// AuthMiddleware::requireStaff();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['order_id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Order ID and status are required."]);
    exit;
}

$allowedStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
if (!in_array($data['status'], $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid status."]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "UPDATE orders SET status = :status WHERE id = :order_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':order_id', $data['order_id']);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Order status updated."]);
        } else {
            // Could be that the ID doesn't exist, or the status was already the same
            // Check if ID exists
            $checkQuery = "SELECT id FROM orders WHERE id = :order_id";
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->execute([':order_id' => $data['order_id']]);
            if ($checkStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Order not found."]);
            } else {
                echo json_encode(["success" => true, "message" => "Order status updated (no change)."]);
            }
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update order status."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
