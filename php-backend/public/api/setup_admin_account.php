<?php
// setup_admin_account.php
// Script to ensure the users table has the correct schema and to create the initial admin account.

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

// 1. Ensure Table Schema is correct
try {
    // Check if columns exist
    $columns = [];
    $stmt = $db->query("SHOW COLUMNS FROM users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $columns[] = $row['Field'];
    }

    // Add first_name if missing
    if (!in_array('first_name', $columns)) {
        $db->exec("ALTER TABLE users ADD COLUMN first_name VARCHAR(50) NOT NULL AFTER id");
    }
    
    // Add middle_name if missing
    if (!in_array('middle_name', $columns)) {
        $db->exec("ALTER TABLE users ADD COLUMN middle_name VARCHAR(50) AFTER first_name");
    }

    // Add last_name if missing
    if (!in_array('last_name', $columns)) {
        $db->exec("ALTER TABLE users ADD COLUMN last_name VARCHAR(50) NOT NULL AFTER middle_name");
    }

    // Add role if missing
    if (!in_array('role', $columns)) {
        $db->exec("ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer' AFTER password_hash");
    }

    // Check full_name and drop if exists (cleanup from migration v2 if not run)
    if (in_array('full_name', $columns) && in_array('first_name', $columns)) {
        // Only drop if we have the new columns. 
        // Ideally we should migrate data first, but for this specific task we focus on admin creation.
        // Let's assume migration_v2 runs separately or we leave it for now to avoid data loss on existing users if any.
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Schema update failed: " . $e->getMessage()]);
    exit;
}

// 2. Create Admin Account
$adminData = [
    'first_name' => 'John Kenneth',
    'middle_name' => 'Oaña',
    'last_name' => 'Balutan',
    'email' => 'balutanjohnkenneth220@gmail.com',
    'password' => '@Jbkenthrina25',
    'role' => 'admin'
];

try {
    // Check if user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $adminData['email']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // User exists, update role to admin just in case, and maybe password?
        // For security, let's update the password to ensure it matches the requirement.
        $passwordHash = password_hash($adminData['password'], PASSWORD_BCRYPT);
        
        $updateStmt = $db->prepare("UPDATE users SET first_name = :fname, middle_name = :mname, last_name = :lname, password_hash = :pass, role = :role WHERE email = :email");
        $updateStmt->bindParam(':fname', $adminData['first_name']);
        $updateStmt->bindParam(':mname', $adminData['middle_name']);
        $updateStmt->bindParam(':lname', $adminData['last_name']);
        $updateStmt->bindParam(':pass', $passwordHash);
        $updateStmt->bindParam(':role', $adminData['role']);
        $updateStmt->bindParam(':email', $adminData['email']);
        $updateStmt->execute();

        echo json_encode(["success" => true, "message" => "Admin account updated successfully."]);
    } else {
        // Create new user
        $passwordHash = password_hash($adminData['password'], PASSWORD_BCRYPT);

        $insertStmt = $db->prepare("INSERT INTO users (first_name, middle_name, last_name, email, password_hash, role) VALUES (:fname, :mname, :lname, :email, :pass, :role)");
        $insertStmt->bindParam(':fname', $adminData['first_name']);
        $insertStmt->bindParam(':mname', $adminData['middle_name']);
        $insertStmt->bindParam(':lname', $adminData['last_name']);
        $insertStmt->bindParam(':email', $adminData['email']);
        $insertStmt->bindParam(':pass', $passwordHash);
        $insertStmt->bindParam(':role', $adminData['role']);
        $insertStmt->execute();

        echo json_encode(["success" => true, "message" => "Admin account created successfully."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Account creation failed: " . $e->getMessage()]);
    exit;
}
?>
