<?php
// tests/test_profile_upload_flow.php
// Integration test for Profile Picture Upload

require_once __DIR__ . '/../php-backend/src/Database.php';

function testProfileUploadFlow() {
    echo "Starting Profile Upload Integration Test...\n";

    // 1. Create a Test User
    $db = (new Database())->getConnection();
    $testEmail = "test_upload_" . time() . "@example.com";
    $testPassword = password_hash("password123", PASSWORD_DEFAULT);
    
    $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ('Test', 'User', :email, :password, 'customer')");
    $stmt->bindParam(':email', $testEmail);
    $stmt->bindParam(':password', $testPassword);
    
    if (!$stmt->execute()) {
        echo "FAIL: Could not create test user.\n";
        return;
    }
    
    $userId = $db->lastInsertId();
    echo "PASS: Created test user ID: $userId\n";

    // 2. Create a Dummy Image File
    $imagePath = __DIR__ . '/test_image.jpg';
    // Create a simple 1x1 pixel JPEG from base64
    $base64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    file_put_contents($imagePath, base64_decode($base64));

    if (!file_exists($imagePath)) {
        echo "FAIL: Could not create dummy image.\n";
        return;
    }
    echo "PASS: Created dummy image at $imagePath\n";

    // 3. Upload the Image via API
    $uploadUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/api/upload-profile-pic.php";
    
    $cfile = new CURLFile($imagePath, 'image/jpeg', 'test_image.jpg');
    $postData = [
        'userId' => $userId,
        'profile_pic' => $cfile
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $uploadUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($httpCode !== 200) {
        echo "FAIL: Upload API failed. HTTP Code: $httpCode. Response: $response\n";
        unlink($imagePath);
        return;
    }
    
    curl_close($ch);

    echo "Upload Response: $response\n";

    $result = json_decode($response, true);
    
    if (isset($result['success']) && $result['success'] === true && !empty($result['profilePic'])) {
        echo "PASS: API returned success and URL: " . $result['profilePic'] . "\n";
    } else {
        echo "FAIL: Upload API success check failed.\n";
        unlink($imagePath);
        return;
    }

    // 4. Verify Database Update
    $stmt = $db->prepare("SELECT profile_pic FROM users WHERE id = :id");
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    $dbPath = $stmt->fetchColumn();

    if ($dbPath === $result['profilePic']) {
        echo "PASS: Database updated with correct URL.\n";
    } else {
        echo "FAIL: Database URL mismatch. DB: $dbPath, API: " . $result['profilePic'] . "\n";
    }

    // 5. Verify File Exists on Server (via URL check or file check if local)
    // Since we are on the same machine, we can check file system.
    // The URL is http://localhost/.../uploads/profile_pics/filename
    // The path is php-backend/public/uploads/profile_pics/filename
    
    $filename = basename($result['profilePic']);
    $serverPath = __DIR__ . '/../php-backend/public/uploads/profile_pics/' . $filename;
    
    if (file_exists($serverPath)) {
        echo "PASS: File exists on server at $serverPath\n";
    } else {
        echo "FAIL: File not found on server at $serverPath\n";
    }

    // 6. Verify Fetch Profile API
    $fetchUrl = "http://localhost/bistroflow/bistroflow/php-backend/public/api/user-profile.php?user_id=$userId";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fetchUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $fetchResponse = curl_exec($ch);
    curl_close($ch);
    
    $fetchResult = json_decode($fetchResponse, true);
    
    if (isset($fetchResult['user']['profilePic']) && $fetchResult['user']['profilePic'] === $result['profilePic']) {
        echo "PASS: Fetch Profile API returned correct image URL.\n";
    } else {
        echo "FAIL: Fetch Profile API returned incorrect URL or failed.\n";
        print_r($fetchResult);
    }

    // Cleanup
    unlink($imagePath); // delete local test image
    // Ideally delete the uploaded file and test user too, but good for manual inspection if kept.
    // Let's delete the user to keep DB clean.
    $db->exec("DELETE FROM users WHERE id = $userId");
    unlink($serverPath); // delete uploaded file
    echo "PASS: Cleanup completed.\n";
}

testProfileUploadFlow();
?>
