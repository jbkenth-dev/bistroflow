<?php
// floor_layouts.php
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
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        try {
            $search = isset($_GET['q']) ? trim($_GET['q']) : '';
            
            if ($search) {
                $query = "SELECT * FROM floor_layouts 
                          WHERE table_number LIKE :q 
                          ORDER BY table_number ASC";
                $stmt = $db->prepare($query);
                $term = "%{$search}%";
                $stmt->bindParam(":q", $term);
            } else {
                $query = "SELECT * FROM floor_layouts ORDER BY table_number ASC";
                $stmt = $db->prepare($query);
            }
            
            $stmt->execute();
            $layouts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Map availability to boolean
            foreach ($layouts as &$layout) {
                $layout['availability'] = (bool)$layout['availability'];
            }
            
            echo json_encode(["success" => true, "data" => $layouts]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Handle file upload separately if using FormData, but here we expect separate call or base64? 
        // Typically for images + data, we use POST with FormData. 
        // Let's assume the client uploads image first to get URL, then calls this API with image_path.
        
        if (empty($data['table_number']) || empty($data['image_path'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Table Number and Image are required."]);
            exit;
        }

        try {
            $query = "INSERT INTO floor_layouts (table_number, image_path, availability, capacity) VALUES (:table_number, :image_path, :availability, :capacity)";
            $stmt = $db->prepare($query);
            
            $tableNum = Validator::sanitizeInput($data['table_number']);
            $imgPath = Validator::sanitizeInput($data['image_path']);
            $avail = isset($data['availability']) ? (int)$data['availability'] : 1;
            $cap = isset($data['capacity']) ? (int)$data['capacity'] : 2;
            
            $stmt->bindParam(":table_number", $tableNum);
            $stmt->bindParam(":image_path", $imgPath);
            $stmt->bindParam(":availability", $avail);
            $stmt->bindParam(":capacity", $cap);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Floor layout created.", "id" => $db->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to create floor layout."]);
            }
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                http_response_code(409);
                echo json_encode(["success" => false, "message" => "Table number already exists."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        break;

    case 'PUT':
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID is required."]);
            exit;
        }

        try {
            $fields = [];
            $params = [];
            
            if (isset($data['table_number'])) { 
                $fields[] = "table_number = :table_number"; 
                $params[':table_number'] = Validator::sanitizeInput($data['table_number']); 
            }
            if (isset($data['image_path'])) { 
                $fields[] = "image_path = :image_path"; 
                $params[':image_path'] = Validator::sanitizeInput($data['image_path']); 
            }
            if (isset($data['availability'])) { 
                $fields[] = "availability = :availability"; 
                $params[':availability'] = (int)$data['availability']; 
            }
            if (isset($data['capacity'])) { 
                $fields[] = "capacity = :capacity"; 
                $params[':capacity'] = (int)$data['capacity']; 
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "No fields to update."]);
                exit;
            }
            
            $query = "UPDATE floor_layouts SET " . implode(", ", $fields) . " WHERE id = :id";
            $params[':id'] = (int)$data['id'];
            
            $stmt = $db->prepare($query);
            if ($stmt->execute($params)) {
                echo json_encode(["success" => true, "message" => "Floor layout updated."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to update floor layout."]);
            }
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                http_response_code(409);
                echo json_encode(["success" => false, "message" => "Table number already exists."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
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
            $query = "DELETE FROM floor_layouts WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Floor layout deleted."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Unable to delete floor layout."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;
}
?>
