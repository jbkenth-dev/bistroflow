<?php
require_once __DIR__ . '/../../src/Database.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->query("DESCRIBE products");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>