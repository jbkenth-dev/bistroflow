<?php
// upload-profile-pic.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

require_once __DIR__ . '/../../src/Database.php';

// Check if file was uploaded
if (!isset($_FILES['profile_pic']) || $_FILES['profile_pic']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No image uploaded or upload error"]);
    exit;
}

// Check User ID
if (!isset($_POST['userId'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

$userId = (int)$_POST['userId'];
$file = $_FILES['profile_pic'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

// Validate Type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid file type. Only JPG, PNG, and WebP are allowed."]);
    exit;
}

// Validate Size
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File too large. Maximum size is 5MB."]);
    exit;
}

// Prepare Storage
$uploadDir = __DIR__ . '/../uploads/profile_pics/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to create upload directory"]);
        exit;
    }
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
// Use user_id + timestamp for uniqueness and easy identification
$filename = "user_{$userId}_" . time() . '.' . $extension;
$targetPath = $uploadDir . $filename;
$publicUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/uploads/profile_pics/" . $filename;

// Move file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Database Update
    $database = new Database();
    $db = $database->getConnection();

    try {
        // Optional: Delete old profile pic to save space
        // fetch old path first
        $stmt = $db->prepare("SELECT profile_pic FROM users WHERE id = :id");
        $stmt->bindParam(":id", $userId);
        $stmt->execute();
        $oldPic = $stmt->fetchColumn();

        if ($oldPic) {
            // Extract filename from URL if it's a full URL
            $oldFilename = basename($oldPic);
            $oldFilePath = $uploadDir . $oldFilename;
            if (file_exists($oldFilePath) && is_file($oldFilePath)) {
                unlink($oldFilePath);
            }
        }

        // Update with new path
        $updateQuery = "UPDATE users SET profile_pic = :pic, profile_pic_updated_at = NOW() WHERE id = :id";
        $stmt = $db->prepare($updateQuery);
        $stmt->bindParam(":pic", $publicUrl);
        $stmt->bindParam(":id", $userId);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "Profile picture updated successfully",
                "profilePic" => $publicUrl
            ]);
        } else {
            // Rollback file upload if DB update fails?
            unlink($targetPath);
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database update failed"]);
        }

    } catch (Exception $e) {
        unlink($targetPath);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }

} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to save image file"]);
}
?>
