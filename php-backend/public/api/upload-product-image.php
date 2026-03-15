<?php
// upload-product-image.php
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
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No image uploaded or upload error"]);
    exit;
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

// Validate Type
if (!in_array($file['type'], $allowedTypes)) {
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

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('prod_') . '_' . time() . '.' . $extension;
$uploadDir = __DIR__ . '/../uploads/products/';
$targetPath = $uploadDir . $filename;
$publicUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/uploads/products/" . $filename;

// Ensure directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Move file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        "success" => true, 
        "message" => "Image uploaded successfully",
        "url" => $publicUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to save image file"]);
}
?>
