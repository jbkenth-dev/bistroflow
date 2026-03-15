<?php
// orders.php
// Returns order history for a user

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../src/Database.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required."]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $status = isset($_GET['status']) ? $_GET['status'] : null;

    // Fetch orders, limit 10 for recent history
    $query = "SELECT * FROM orders 
              WHERE user_id = :user_id";
    
    if ($status) {
        $query .= " AND status = :status";
    }

    $query .= " ORDER BY created_at DESC 
                LIMIT 10";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    if ($status) {
        $stmt->bindParam(':status', $status);
    }
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Enhance orders with items
    foreach ($orders as &$order) {
        $itemQuery = "SELECT product_name, quantity, price FROM order_items WHERE order_id = :order_id";
        $itemStmt = $db->prepare($itemQuery);
        $itemStmt->bindParam(':order_id', $order['id']);
        $itemStmt->execute();
        $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $order['items'] = $items;
        $order['item_count'] = count($items);
        
        $itemNames = array_map(function($i) {
             return $i['quantity'] > 1 ? "{$i['quantity']}x {$i['product_name']}" : $i['product_name'];
        }, $items);
        $order['items_summary'] = implode(', ', $itemNames);
    }

    echo json_encode(["success" => true, "data" => $orders]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>