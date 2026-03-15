<?php
// add_capacity_column.php
// Migration script to add 'capacity' column to floor_layouts table

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
    // Check if column exists
    $check = $db->query("SHOW COLUMNS FROM floor_layouts LIKE 'capacity'");
    if ($check->rowCount() == 0) {
        $sql = "ALTER TABLE floor_layouts ADD COLUMN capacity INT DEFAULT 2 AFTER availability";
        $db->exec($sql);
        echo json_encode(["success" => true, "message" => "Column 'capacity' added successfully."]);
    } else {
        echo json_encode(["success" => true, "message" => "Column 'capacity' already exists."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Migration failed: " . $e->getMessage()]);
}
?>
