<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../src/Database.php';

// In a real app, you'd verify a JWT or session here.
// For now, we'll expect a user_id as a query parameter (simulating a secured request).
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. User ID required."]);
    exit;
}

$database = new Database();
try {
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

try {
    $stmt = $db->prepare("SELECT id, first_name, middle_name, last_name, email, phone_number, created_at, profile_pic FROM users WHERE id = :id");
    $stmt->bindParam(':id', $user_id);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $name = trim($user['first_name'] . ' ' . $user['last_name']);
        
        // Use stored profile pic URL or fallback to default/null
        $profilePic = $user['profile_pic'] ? $user['profile_pic'] : null;

        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "firstName" => $user['first_name'],
                "middleName" => $user['middle_name'],
                "lastName" => $user['last_name'],
                "name" => $name,
                "email" => $user['email'],
                "phone" => $user['phone_number'],
                "joinedAt" => $user['created_at'],
                "profilePic" => $profilePic
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred fetching profile."]);
}
?>
