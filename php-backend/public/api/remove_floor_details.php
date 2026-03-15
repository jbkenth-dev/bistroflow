<?php
// remove_floor_details.php
// Script to remove 'floor_level' and 'room_name' columns from floor_layouts table

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
    // 1. Check if columns exist
    $columns = [];
    $stmt = $db->query("SHOW COLUMNS FROM floor_layouts");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as $row) {
        if ($row['Field'] === 'floor_level' || $row['Field'] === 'room_name') {
            $columns[] = $row['Field'];
        }
    }

    if (empty($columns)) {
        echo json_encode(["success" => true, "message" => "Columns do not exist."]);
        exit;
    }

    // 2. Backup data (simple JSON dump)
    $backupStmt = $db->query("SELECT * FROM floor_layouts");
    $data = $backupStmt->fetchAll(PDO::FETCH_ASSOC);
    $backupFile = __DIR__ . '/../../backups/floor_layouts_backup_' . time() . '.json';
    if (!is_dir(dirname($backupFile))) {
        mkdir(dirname($backupFile), 0777, true);
    }
    file_put_contents($backupFile, json_encode($data, JSON_PRETTY_PRINT));

    // 3. Drop columns
    $sql = "ALTER TABLE floor_layouts DROP COLUMN floor_level, DROP COLUMN room_name";
    $db->exec($sql);

    echo json_encode([
        "success" => true, 
        "message" => "Columns removed successfully. Backup created at: " . $backupFile
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Migration failed: " . $e->getMessage()]);
}
?>
