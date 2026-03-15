<?php
// categories.php
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
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        try {
            $query = "SELECT * FROM categories ORDER BY sort_order ASC, name ASC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "data" => $categories]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Category name is required."]);
            exit;
        }

        try {
            $query = "INSERT INTO categories (name, sort_order) VALUES (:name, :sort_order)";
            $stmt = $db->prepare($query);
            $name = Validator::sanitizeInput($data['name']);
            $sort = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
            
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":sort_order", $sort);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Category created.", "id" => $db->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to create category."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (empty($data['id']) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID and Name are required."]);
            exit;
        }

        try {
            $query = "UPDATE categories SET name = :name, sort_order = :sort_order WHERE id = :id";
            $stmt = $db->prepare($query);
            
            $name = Validator::sanitizeInput($data['name']);
            $sort = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
            $id = (int)$data['id'];

            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":sort_order", $sort);
            $stmt->bindParam(":id", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Category updated."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to update category."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($data['id']) ? $data['id'] : null);
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID is required."]);
            exit;
        }

        try {
            // Check if products exist (Cascade delete is set in schema, but we might want to warn or check manually if schema isn't perfect)
            // But user requested cascade handling. The schema ON DELETE CASCADE handles it.
            
            $query = "DELETE FROM categories WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Category deleted."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to delete category."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
