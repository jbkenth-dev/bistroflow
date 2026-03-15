<?php

class Utils {
    /**
     * Generate a unique 12-digit user ID.
     * 
     * @param PDO $db
     * @return int
     */
    public static function generateUniqueUserId($db) {
        do {
            // Generate a random 12-digit number (100,000,000,000 to 999,999,999,999)
            $id = random_int(100000000000, 999999999999);
            
            // Check if this ID already exists
            $stmt = $db->prepare("SELECT id FROM users WHERE id = :id");
            $stmt->execute([':id' => $id]);
            
        } while ($stmt->fetch()); // Repeat if ID exists
        
        return $id;
    }
}
