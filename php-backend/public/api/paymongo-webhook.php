<?php
// php-backend/public/api/paymongo-webhook.php

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

require_once '../../src/Database.php';
require_once '../../src/PayMongo.php';
require_once '../../src/Logger.php';

$database = new Database();
$db = $database->getConnection();
$logger = new Logger($db);
$paymongo = new PayMongo();

$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

if (!$data || !isset($data['data']['attributes']['type'])) {
    http_response_code(400);
    exit;
}

$eventType = $data['data']['attributes']['type'];
$eventData = $data['data']['attributes']['data'];

$logger->log('paymongo_webhook', 'system', "Received event: $eventType");

if ($eventType === 'source.chargeable') {
    $sourceId = $eventData['id'];
    $amount = $eventData['attributes']['amount'] / 100; // Convert back to main unit

    // Find order by source ID
    $query = "SELECT * FROM orders WHERE paymongo_source_id = :source_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':source_id', $sourceId);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        $logger->log('paymongo_error', 'system', "Order not found for source: $sourceId");
        http_response_code(404);
        echo json_encode(['status' => 'order not found']);
        exit;
    }

    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    // Create Payment
    try {
        $payment = $paymongo->createPayment($sourceId, $amount, "Order #" . $order['id']);
        
        if ($payment['attributes']['status'] === 'paid') {
            $paymentId = $payment['id'];
            
            // Update Order
            $updateQuery = "UPDATE orders SET status = 'preparing', paymongo_payment_id = :payment_id WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':payment_id', $paymentId);
            $updateStmt->bindParam(':id', $order['id']);
            $updateStmt->execute();
            
            $logger->log('payment_success', "Order:" . $order['id'], "Payment successful via GCash. Payment ID: $paymentId");
        }
    } catch (Exception $e) {
        $logger->log('paymongo_error', "Order:" . $order['id'], "Payment creation failed: " . $e->getMessage());
        http_response_code(500);
        exit;
    }
}

http_response_code(200);
echo json_encode(['status' => 'ok']);
?>
