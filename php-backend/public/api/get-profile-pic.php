<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

require_once '../../src/Database.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(404);
    exit;
}

$database = new Database();
try {
    $db = $database->getConnection();
    
    // Check if user exists and fetch profile pic
    $stmt = $db->prepare("SELECT profile_pic FROM users WHERE id = :id");
    $stmt->bindParam(':id', $user_id);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $blob = $row['profile_pic'];
        
        if ($blob) {
            // Determine MIME type (simple detection)
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime_type = $finfo->buffer($blob);
            
            // Default to jpeg if detection fails
            if (!$mime_type) $mime_type = 'image/jpeg';
            
            header("Content-Type: " . $mime_type);
            echo $blob;
            exit;
        }
    }
    
    // Return default image if no profile pic or user not found
    // Redirect to the unsplash image we used as placeholder
    header("Location: https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80");
    exit;

} catch (Exception $e) {
    http_response_code(500);
    exit;
}
?>
