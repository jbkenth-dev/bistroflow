# BistroFlow Secure User Registration System

This module provides a secure user registration system implemented in PHP, designed to be integrated with the BistroFlow project.

## Features

- **Secure Registration**: 
  - Server-side validation for all inputs.
  - Password hashing using `password_hash()` (Bcrypt).
  - CSRF protection using per-session tokens.
  - Rate limiting to prevent brute-force attacks (Default: 5 attempts per 5 minutes).
  - Input sanitization to prevent XSS.
  - SQL Injection prevention using Prepared Statements (PDO).
- **Audit Logging**: Logs critical security events (signup attempts, failures, rate limit hits) to the database.
- **Responsive UI**: HTML5 form styled with Tailwind CSS (via CDN) with client-side validation.

## Directory Structure

- `config/`: Database configuration.
- `public/`: Public-facing files (Signup form, Process handler, Success page).
- `src/`: Core logic classes (Database, Validator, CSRF, Logger, RateLimiter).
- `sql/`: Database schema SQL script.
- `tests/`: Unit and integration tests.

## Database Schema

The system uses a MySQL database named `bistroflow_db` with the following tables:

### 1. `users`
Stores registered user information.
- `id`: INT (Primary Key, Auto Increment)
- `full_name`: VARCHAR(100)
- `email`: VARCHAR(255) (Unique)
- `password_hash`: VARCHAR(255)
- `phone_number`: VARCHAR(20)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### 2. `audit_logs`
Stores security audit trails.
- `id`: INT (Primary Key)
- `user_email`: VARCHAR(255)
- `action`: VARCHAR(50) (e.g., 'signup_success', 'rate_limit_exceeded')
- `ip_address`: VARCHAR(45)
- `user_agent`: TEXT
- `details`: TEXT
- `created_at`: TIMESTAMP

### 3. `rate_limits`
Tracks request frequency for rate limiting.
- `id`: INT (Primary Key)
- `ip_address`: VARCHAR(45)
- `action`: VARCHAR(50)
- `request_count`: INT
- `window_start`: TIMESTAMP

## API / Endpoints

### Registration Form
- **URL**: `/php-backend/public/signup.php`
- **Method**: `GET`
- **Description**: Displays the registration form with CSRF token.

### Process Registration
- **URL**: `/php-backend/public/register_process.php`
- **Method**: `POST`
- **Parameters**:
  - `full_name` (string, required)
  - `email` (string, required, valid email)
  - `phone_number` (string, optional, valid format)
  - `password` (string, required, min 8 chars, 1 upper, 1 lower, 1 number, 1 special)
  - `confirm_password` (string, required, must match password)
  - `csrf_token` (string, required)
- **Response**: Redirects to `success.php` on success or back to `signup.php` with errors.

## Deployment Instructions

1. **Database Setup**:
   - Ensure MySQL is running.
   - Import the schema:
     ```bash
     mysql -u root -p < php-backend/sql/schema.sql
     ```
   - (Optional) Create a dedicated database user and update `php-backend/src/Database.php`.

2. **Server Configuration**:
   - Serve the project using Apache (XAMPP/WAMP) or Nginx with PHP support.
   - Ensure the `php-backend` directory is accessible via the web server.

3. **Running Tests**:
   - Navigate to the project root.
   - Run the test scripts:
     ```bash
     php php-backend/tests/test_validator.php
     php php-backend/tests/test_integration.php
     ```

## Security Best Practices Implemented

- **Password Storage**: Uses `password_hash` with robust algorithms.
- **SQL Injection**: All database queries use PDO prepared statements.
- **XSS**: All outputs are sanitized using `htmlspecialchars`.
- **CSRF**: Forms are protected with unique session tokens.
- **Rate Limiting**: IP-based limiting on sensitive actions.
- **Error Handling**: Generic error messages shown to users; detailed errors logged internally.
