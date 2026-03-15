<?php
// setup_menu_tables.php
// Script to create the categories and products tables

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
    // 1. Create Categories Table
    $sqlCategories = "CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $db->exec($sqlCategories);

    // 2. Create Products Table
    $sqlProducts = "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        food_name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        availability BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $db->exec($sqlProducts);

    // 3. Seed Initial Data (Optional, only if empty)
    $stmt = $db->query("SELECT COUNT(*) FROM categories");
    if ($stmt->fetchColumn() == 0) {
        $db->exec("INSERT INTO categories (name, sort_order) VALUES ('Appetizers', 1), ('Main Course', 2), ('Desserts', 3), ('Beverages', 4)");
        
        $catId = $db->lastInsertId(); // Gets the last one, but let's fetch specific ones to be safe
        
        // Fetch IDs
        $cats = $db->query("SELECT id, name FROM categories")->fetchAll(PDO::FETCH_KEY_PAIR);
        // Map name -> id
        $catMap = array_flip($cats); // If names are unique-ish

        // Insert some dummy products
        if (isset($catMap['Appetizers'])) {
            $cid = $catMap['Appetizers'];
            $db->prepare("INSERT INTO products (category_id, food_name, description, price, availability, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
               ->execute([$cid, 'Nachos', 'Crispy tortilla chips with cheese dip', 150.00, 1, 1]);
            $db->prepare("INSERT INTO products (category_id, food_name, description, price, availability, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
               ->execute([$cid, 'Buffalo Wings', 'Spicy chicken wings served with ranch', 220.00, 1, 2]);
        }
        
        if (isset($catMap['Main Course'])) {
             $cid = $catMap['Main Course'];
             $db->prepare("INSERT INTO products (category_id, food_name, description, price, availability, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
               ->execute([$cid, 'Bistro Burger', 'Premium beef patty with special sauce', 250.00, 1, 1]);
        }
    }

    echo json_encode(["success" => true, "message" => "Menu tables created and seeded successfully."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table creation failed: " . $e->getMessage()]);
}
?>
