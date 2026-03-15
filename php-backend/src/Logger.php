<?php
class Logger {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function log($action, $email = null, $details = '') {
        try {
            $query = "INSERT INTO audit_logs (user_email, action, ip_address, user_agent, details) VALUES (:email, :action, :ip, :ua, :details)";
            $stmt = $this->conn->prepare($query);
            
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
            $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN';
            
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':action', $action);
            $stmt->bindParam(':ip', $ip);
            $stmt->bindParam(':ua', $ua);
            $stmt->bindParam(':details', $details);
            
            $stmt->execute();
        } catch (Exception $e) {
            // Silently fail logging to not disrupt user flow, but maybe log to file
            error_log("Audit log failed: " . $e->getMessage());
        }
    }
}
?>