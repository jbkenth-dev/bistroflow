<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../src/PayMongo.php';
require_once '../../src/Database.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing ID']);
    exit;
}

try {
    $paymongo = new PayMongo();
    $intent = $paymongo->retrievePaymentIntent($id);
    
    $status = $intent['attributes']['status'];
    // succeeded, awaiting_payment_method, awaiting_next_action, processing
    
    if ($status === 'succeeded') {
        // Update DB status if not already updated (optional, webhook usually does this)
        // But for polling, we might want to update here or just trust webhook.
        // Let's just return status.
        echo json_encode(['success' => true, 'status' => 'succeeded']);
    } else {
        echo json_encode(['success' => true, 'status' => $status]);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
