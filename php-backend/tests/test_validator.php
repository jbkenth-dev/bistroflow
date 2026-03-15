<?php
require_once __DIR__ . '/../src/Validator.php';

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

// Enable assertions
ini_set('zend.assertions', 1);
ini_set('assert.exception', 1);

runTest('Validate Valid Email', function() {
    assert(Validator::validateEmail('test@example.com') !== false, 'Valid email failed');
});

runTest('Validate Invalid Email', function() {
    assert(Validator::validateEmail('invalid-email') === false, 'Invalid email passed');
    assert(Validator::validateEmail('test@.com') === false, 'Invalid email passed');
});

runTest('Validate Strong Password', function() {
    // Min 8 chars, 1 upper, 1 lower, 1 number, 1 special
    assert(Validator::validatePassword('StrongP@ssw0rd') === 1, 'Valid password failed');
});

runTest('Validate Weak Password', function() {
    assert(Validator::validatePassword('weak') === 0, 'Weak password passed (too short)');
    assert(Validator::validatePassword('NoSpecialChar1') === 0, 'Weak password passed (no special)');
    assert(Validator::validatePassword('alllowercase1!') === 0, 'Weak password passed (no upper)');
});

runTest('Validate Phone', function() {
    assert(Validator::validatePhone('1234567890') === 1, 'Valid phone failed');
    assert(Validator::validatePhone('+1 (555) 123-4567') === 1, 'Valid formatted phone failed');
    assert(Validator::validatePhone('abc') === 0, 'Invalid phone passed');
});
?>