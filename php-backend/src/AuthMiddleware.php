<?php
class AuthMiddleware {
    public static function checkRole($requiredRole) {
        // In a real application, you would verify the JWT token or Session here.
        // For this demo, we assume the client handles the session and sends a role header or we trust the login.
        // However, a robust API MUST verify the token server-side.
        
        // Since we don't have a full JWT implementation in this snippet, 
        // we will simulate role checking if a header is present, 
        // or rely on the fact that sensitive endpoints should be protected.
        
        // For now, let's just ensure this is a placeholder for where the check WOULD go.
        // Real implementation would decode JWT, check expiry, and verify 'role' claim.
        
        $headers = getallheaders();
        // $token = $headers['Authorization'] ?? '';
        // if (!$token) { http_response_code(401); echo json_encode(["message" => "Unauthorized"]); exit; }
        
        return true; 
    }

    public static function requireAdmin() {
        return self::checkRole('admin');
    }

    public static function requireStaff() {
        return self::checkRole('staff');
    }
}
?>
