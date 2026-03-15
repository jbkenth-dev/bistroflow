<?php
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/RateLimiter.php';

// Enable assertions
ini_set('zend.assertions', 1);
ini_set('assert.exception', 1);

function runTest($name, $callback) {
    try {
        $callback();
        echo "[PASS] $name\n";
    } catch (AssertionError $e) {
        echo "[FAIL] $name: " . $e->getMessage() . "\n";
    } catch (Exception $e) {
        echo "[ERROR] $name: " . $e->getMessage() . "\n";
    }
}

$conn = null;

runTest('Database Connection', function() use (&$conn) {
    $db = new Database();
    $conn = $db->getConnection();
    assert($conn instanceof PDO, 'Database connection is not PDO instance');
});

if ($conn) {
    runTest('Rate Limiter Logic', function() use ($conn) {
        // Setup
        $ip = '127.0.0.1';
        $action = 'test_limit';
        $conn->exec("DELETE FROM rate_limits WHERE ip_address = '$ip' AND action = '$action'");
        
        $limiter = new RateLimiter($conn, 2, 60); // 2 requests allowed
        
        assert($limiter->check($ip, $action) === true, 'Request 1 should be allowed');
        assert($limiter->check($ip, $action) === true, 'Request 2 should be allowed');
        assert($limiter->check($ip, $action) === false, 'Request 3 should be blocked');
        
        // Cleanup
        $conn->exec("DELETE FROM rate_limits WHERE ip_address = '$ip' AND action = '$action'");
    });
}
?>