<?php
class Validator {
    public static function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function validatePassword($password) {
        // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/';
        return preg_match($pattern, $password);
    }

    public static function validatePhone($phone) {
        // Basic validation allow numbers, spaces, dashes, plus, parentheses
        return preg_match('/^[0-9\-\+\(\)\s]{10,20}$/', $phone);
    }
}
?>