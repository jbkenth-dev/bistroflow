<?php
// update_users_table_for_images.php
// Migration script to update users table for file-based profile pictures

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
    // 1. Check current schema of profile_pic
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'profile_pic'");
    $column = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($column) {
        // If it exists, check if it's blob or varchar
        // If Type contains 'blob', we drop and recreate or modify. 
        // To be safe and switch to path storage, let's modify it to VARCHAR.
        // WARNING: This will invalidate existing BLOB images.
        if (strpos(strtolower($column['Type']), 'blob') !== false) {
            $db->exec("ALTER TABLE users MODIFY COLUMN profile_pic VARCHAR(255) DEFAULT NULL");
        }
    } else {
        // Create if doesn't exist
        $db->exec("ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255) DEFAULT NULL");
    }

    // 2. Add upload timestamp column if missing
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'profile_pic_updated_at'");
    if ($stmt->rowCount() == 0) {
        $db->exec("ALTER TABLE users ADD COLUMN profile_pic_updated_at DATETIME DEFAULT NULL");
    }

    echo json_encode(["success" => true, "message" => "Users table updated for profile pictures."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Migration failed: " . $e->getMessage()]);
}
?>
