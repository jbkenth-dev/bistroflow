<?php
require_once __DIR__ . '/../../src/Database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "ALTER TABLE orders ADD COLUMN paymongo_source_id VARCHAR(255) NULL, ADD COLUMN paymongo_payment_id VARCHAR(255) NULL";
    $db->exec($sql);
    echo "Columns added successfully.";
} catch (PDOException $e) {
    echo "Error (might already exist): " . $e->getMessage();
}
?>
