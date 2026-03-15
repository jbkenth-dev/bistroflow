<?php
class RateLimiter {
    private $conn;
    private $limit;
    private $window; // in seconds

    public function __construct($db, $limit = 5, $window = 300) { // Default 5 attempts per 5 minutes
        $this->conn = $db;
        $this->limit = $limit;
        $this->window = $window;
    }

    public function check($ip, $action) {
        try {
            // Delete old records
            $deleteQuery = "DELETE FROM rate_limits WHERE window_start < (NOW() - INTERVAL :window SECOND)";
            $stmt = $this->conn->prepare($deleteQuery);
            $stmt->bindParam(':window', $this->window, PDO::PARAM_INT);
            $stmt->execute();

            // Check current count
            $query = "SELECT request_count FROM rate_limits WHERE ip_address = :ip AND action = :action";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':ip', $ip);
            $stmt->bindParam(':action', $action);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row['request_count'] >= $this->limit) {
                    return false;
                }
                // Increment
                $update = "UPDATE rate_limits SET request_count = request_count + 1 WHERE ip_address = :ip AND action = :action";
                $stmt = $this->conn->prepare($update);
                $stmt->bindParam(':ip', $ip);
                $stmt->bindParam(':action', $action);
                $stmt->execute();
            } else {
                // Insert
                $insert = "INSERT INTO rate_limits (ip_address, action, request_count) VALUES (:ip, :action, 1)";
                $stmt = $this->conn->prepare($insert);
                $stmt->bindParam(':ip', $ip);
                $stmt->bindParam(':action', $action);
                $stmt->execute();
            }
            return true;
        } catch (Exception $e) {
            error_log("Rate limiter error: " . $e->getMessage());
            // Fail open or closed? Closed for security.
            return false;
        }
    }
}
?>