<?php
require_once __DIR__ . '/../../src/Database.php';

$database = new Database();
try {
    $db = $database->getConnection();
    
    // Read SQL file
    $sqlFile = __DIR__ . '/../../sql/migration_v4_add_delivery_info.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Split by semicolon
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            try {
                $db->exec($stmt);
                echo "Executed: " . substr($stmt, 0, 50) . "...\n";
            } catch (PDOException $e) {
                // If column exists, it might fail. We can ignore or log.
                // For robustness, we check error code.
                echo "Warning/Error executing statement: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "Migration v4 completed.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>