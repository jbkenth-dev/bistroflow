<?php
// php-backend/tests/test_paymongo_integration.php

require_once __DIR__ . '/../src/PayMongo.php';

function testCreateSource() {
    echo "Testing PayMongo Source Creation...\n";
    try {
        $paymongo = new PayMongo();
        $source = $paymongo->createSource(100.00, 'grab_pay', [
            'success' => 'http://localhost/success',
            'failed' => 'http://localhost/failed'
        ]);

        if (isset($source['id']) && ($source['attributes']['type'] === 'gcash' || $source['attributes']['type'] === 'grab_pay')) {
            echo "PASS: Source created. ID: " . $source['id'] . "\n";
            echo "Checkout URL: " . $source['attributes']['redirect']['checkout_url'] . "\n";
        } else {
            echo "FAIL: Invalid source response.\n";
            print_r($source);
        }
    } catch (Exception $e) {
        echo "FAIL: Exception: " . $e->getMessage() . "\n";
    }
}

testCreateSource();
?>
