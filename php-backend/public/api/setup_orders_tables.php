<?php
// setup_orders_tables.php
// Script to create the orders and order_items tables

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
    // 1. Create Orders Table
    $sqlOrders = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        order_type ENUM('dine-in', 'takeout') NOT NULL,
        table_number VARCHAR(50) NULL,
        payment_method ENUM('cash', 'gcash') NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        service_charge DECIMAL(10, 2) DEFAULT 0.00,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sqlOrders);

    // 2. Create Order Items Table
    $sqlOrderItems = "CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_slug VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $db->exec($sqlOrderItems);

    echo json_encode(["success" => true, "message" => "Orders tables created successfully."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table creation failed: " . $e->getMessage()]);
}
?>
