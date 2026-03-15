<?php
// setup_floor_tables.php
// Script to create the floor_layouts table

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../src/Database.php';

$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

try {
    // Create Floor Layouts Table
    $sql = "CREATE TABLE IF NOT EXISTS floor_layouts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_number VARCHAR(50) NOT NULL UNIQUE,
        image_path VARCHAR(255) NOT NULL,
        availability BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sql);

    echo json_encode(["success" => true, "message" => "Floor layouts table created successfully."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table creation failed: " . $e->getMessage()]);
}
?>
