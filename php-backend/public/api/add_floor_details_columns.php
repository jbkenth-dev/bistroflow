<?php
// add_floor_details_columns.php
// Migration script to add 'floor_level' and 'room_name' columns to floor_layouts table

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
    $updates = [];
    
    // Check floor_level
    $check = $db->query("SHOW COLUMNS FROM floor_layouts LIKE 'floor_level'");
    if ($check->rowCount() == 0) {
        $db->exec("ALTER TABLE floor_layouts ADD COLUMN floor_level INT DEFAULT 1 AFTER table_number");
        $updates[] = "floor_level";
    }

    // Check room_name
    $check = $db->query("SHOW COLUMNS FROM floor_layouts LIKE 'room_name'");
    if ($check->rowCount() == 0) {
        $db->exec("ALTER TABLE floor_layouts ADD COLUMN room_name VARCHAR(100) DEFAULT 'Main Hall' AFTER floor_level");
        $updates[] = "room_name";
    }

    if (empty($updates)) {
        echo json_encode(["success" => true, "message" => "Columns already exist."]);
    } else {
        echo json_encode(["success" => true, "message" => "Added columns: " . implode(", ", $updates)]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Migration failed: " . $e->getMessage()]);
}
?>
