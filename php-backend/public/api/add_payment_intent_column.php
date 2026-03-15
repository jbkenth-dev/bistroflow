<?php
require_once __DIR__ . '/../../src/Database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "ALTER TABLE orders ADD COLUMN paymongo_payment_intent_id VARCHAR(255) NULL";
    $db->exec($sql);
    echo "paymongo_payment_intent_id column added successfully.";
} catch (PDOException $e) {
    echo "Error (might already exist): " . $e->getMessage();
}
?>
