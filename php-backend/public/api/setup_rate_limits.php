<?php
require_once __DIR__ . '/../../src/Database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "CREATE TABLE IF NOT EXISTS rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        action VARCHAR(50) NOT NULL,
        request_count INT DEFAULT 1,
        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (ip_address, action)
    )";
    $db->exec($sql);
    echo "Rate limits table created/checked.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
