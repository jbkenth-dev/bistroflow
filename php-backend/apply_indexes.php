<?php
// apply_indexes.php
// Applies performance indexes to the database

require_once __DIR__ . '/src/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $queries = [
        "CREATE INDEX idx_orders_status_created_at ON orders (status, created_at)",
        "CREATE INDEX idx_orders_created_at ON orders (created_at)"
    ];

    foreach ($queries as $query) {
        try {
            $db->exec($query);
            echo "Executed: $query\n";
        } catch (PDOException $e) {
            // Check for "Duplicate key name" error (Code 42000 or specific driver code)
            if (strpos($e->getMessage(), "Duplicate key name") !== false || strpos($e->getMessage(), "already exists") !== false) {
                echo "Skipped (Index already exists): $query\n";
            } else {
                echo "Error executing: $query\n";
                echo "Message: " . $e->getMessage() . "\n";
            }
        }
    }

    echo "Index optimization completed.\n";

} catch (Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
?>
