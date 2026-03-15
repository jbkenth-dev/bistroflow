<?php
require_once __DIR__ . '/../src/PayMongo.php';

function testQrPhFlow() {
    echo "Testing PayMongo QRPH Flow...\n";
    try {
        $paymongo = new PayMongo();
        
        // 1. Create Payment Intent
        echo "Creating Payment Intent...\n";
        $intent = $paymongo->createPaymentIntent(100.00, 'Test QRPH', ['qrph']);
        if (!isset($intent['id'])) {
            echo "FAIL: Failed to create Payment Intent.\n";
            print_r($intent);
            return;
        }
        $intentId = $intent['id'];
        echo "Payment Intent ID: $intentId\n";

        // 2. Create Payment Method (QRPH)
        echo "Creating Payment Method (QRPH)...\n";
        $method = $paymongo->createPaymentMethod('qrph', [
            'billing' => [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'phone' => '09171234567'
            ]
        ]);
        if (!isset($method['id'])) {
            echo "FAIL: Failed to create Payment Method.\n";
            print_r($method);
            return;
        }
        $methodId = $method['id'];
        echo "Payment Method ID: $methodId\n";

        // 3. Attach Payment Method to Intent
        echo "Attaching Payment Method to Intent...\n";
        $attached = $paymongo->attachPaymentMethod($intentId, $methodId, 'http://localhost/return');
        
        if (isset($attached['attributes']['next_action'])) {
            $nextAction = $attached['attributes']['next_action'];
            if ($nextAction['type'] === 'consume_qr' || (isset($nextAction['type']) && strpos($nextAction['type'], 'qr') !== false)) {
                echo "PASS: QR Code Generated!\n";
                // Depending on API version, structure might differ slightly.
                // Based on search, it might be in `code` -> `image_url`
                // or `redirect` -> `url`? No, usually `consume_qr` has image.
                print_r($nextAction);
            } else {
                echo "FAIL: Unexpected next_action type.\n";
                print_r($nextAction);
            }
        } else {
            // It might be already succeeded (unlikely for QRPH which requires scanning)
            echo "FAIL: No next_action returned.\n";
            print_r($attached);
        }

    } catch (Exception $e) {
        echo "FAIL: Exception: " . $e->getMessage() . "\n";
    }
}

testQrPhFlow();
?>
