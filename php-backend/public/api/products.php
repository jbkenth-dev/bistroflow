<?php
// products.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../src/Database.php';
require_once __DIR__ . '/../../src/Validator.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Helper to get input data
$input = json_decode(file_get_contents("php://input"), true);

// Get query params if any
$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

switch ($method) {
    case 'GET':
        try {
            $query = "SELECT p.*, c.name as category_name 
                      FROM products p 
                      JOIN categories c ON p.category_id = c.id";
            
            if ($categoryId) {
                $query .= " WHERE p.category_id = :cat_id";
            }
            
            $query .= " ORDER BY c.sort_order ASC, p.sort_order ASC, p.food_name ASC";
            
            $stmt = $db->prepare($query);
            if ($categoryId) {
                $stmt->bindParam(":cat_id", $categoryId);
            }
            
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Map boolean for availability
            foreach ($products as &$product) {
                $product['availability'] = (bool)$product['availability'];
            }
            
            echo json_encode(["success" => true, "data" => $products]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Validation
        if (empty($input['category_id']) || empty($input['food_name']) || empty($input['price'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Category, Name, and Price are required."]);
            exit;
        }

        try {
            $query = "INSERT INTO products (category_id, food_name, description, price, availability, sort_order, image_url) 
                      VALUES (:cat_id, :name, :desc, :price, :avail, :sort, :img)";
            
            $stmt = $db->prepare($query);
            
            $catId = (int)$input['category_id'];
            $name = Validator::sanitizeInput($input['food_name']);
            $desc = isset($input['description']) ? Validator::sanitizeInput($input['description']) : null;
            $price = (float)$input['price'];
            $avail = isset($input['availability']) ? (int)$input['availability'] : 1;
            $sort = isset($input['sort_order']) ? (int)$input['sort_order'] : 0;
            $img = isset($input['image_url']) ? Validator::sanitizeInput($input['image_url']) : null;
            
            $stmt->bindParam(":cat_id", $catId);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":desc", $desc);
            $stmt->bindParam(":price", $price);
            $stmt->bindParam(":avail", $avail);
            $stmt->bindParam(":sort", $sort);
            $stmt->bindParam(":img", $img);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Product created.", "id" => $db->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to create product."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID is required."]);
            exit;
        }

        try {
            $fields = [];
            $params = [];
            
            // Build dynamic update query
            if (isset($input['category_id'])) { $fields[] = "category_id = :cat_id"; $params[':cat_id'] = (int)$input['category_id']; }
            if (isset($input['food_name'])) { $fields[] = "food_name = :name"; $params[':name'] = Validator::sanitizeInput($input['food_name']); }
            if (isset($input['description'])) { $fields[] = "description = :desc"; $params[':desc'] = Validator::sanitizeInput($input['description']); }
            if (isset($input['price'])) { $fields[] = "price = :price"; $params[':price'] = (float)$input['price']; }
            if (isset($input['availability'])) { $fields[] = "availability = :avail"; $params[':avail'] = (int)$input['availability']; }
            if (isset($input['sort_order'])) { $fields[] = "sort_order = :sort"; $params[':sort'] = (int)$input['sort_order']; }
            if (isset($input['image_url'])) { $fields[] = "image_url = :img"; $params[':img'] = Validator::sanitizeInput($input['image_url']); }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "No fields to update."]);
                exit;
            }
            
            $query = "UPDATE products SET " . implode(", ", $fields) . " WHERE id = :id";
            $params[':id'] = (int)$input['id'];
            
            $stmt = $db->prepare($query);
            if ($stmt->execute($params)) {
                echo json_encode(["success" => true, "message" => "Product updated."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to update product."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : null);
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID is required."]);
            exit;
        }

        try {
            $query = "DELETE FROM products WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Product deleted."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to delete product."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
