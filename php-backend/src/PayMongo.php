<?php
// php-backend/src/PayMongo.php

class PayMongo {
    private $secretKey;
    private $publicKey;
    private $apiUrl;

    public function __construct() {
        $config = require __DIR__ . '/../config/paymongo.php';
        $this->secretKey = $config['secret_key'];
        $this->publicKey = $config['public_key'];
        $this->apiUrl = $config['api_url'];
    }

    private function request($method, $endpoint, $data = []) {
        $url = $this->apiUrl . $endpoint;
        
        $headers = [
            'Authorization: Basic ' . base64_encode($this->secretKey . ':'),
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['data' => $data]));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new Exception('PayMongo Curl Error: ' . curl_error($ch));
        }
        
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode >= 400) {
            $errorMsg = isset($result['errors'][0]['detail']) ? $result['errors'][0]['detail'] : 'Unknown PayMongo Error';
            throw new Exception($errorMsg);
        }

        return $result['data'];
    }

    public function createSource($amount, $type = 'gcash', $redirect = []) {
        // Amount must be in centavos (e.g., 100.00 -> 10000)
        // Ensure amount is integer
        $amountInt = (int) round($amount * 100);

        $data = [
            'attributes' => [
                'type' => $type,
                'amount' => $amountInt,
                'currency' => 'PHP',
                'redirect' => $redirect
            ]
        ];

        return $this->request('POST', '/sources', $data);
    }

    public function createPayment($sourceId, $amount, $description = '') {
        $amountInt = (int) round($amount * 100);

        $data = [
            'attributes' => [
                'amount' => $amountInt,
                'currency' => 'PHP',
                'source' => [
                    'id' => $sourceId,
                    'type' => 'source'
                ],
                'description' => $description
            ]
        ];

        return $this->request('POST', '/payments', $data);
    }

    public function retrieveSource($id) {
        return $this->request('GET', '/sources/' . $id);
    }

    public function createPaymentIntent($amount, $description = '', $allowedMethods = ['card', 'paymaya', 'gcash', 'grab_pay', 'dob', 'qrph']) {
        $amountInt = (int) round($amount * 100);
        $data = [
            'attributes' => [
                'amount' => $amountInt,
                'payment_method_allowed' => $allowedMethods,
                'currency' => 'PHP',
                'description' => $description,
                'capture_type' => 'automatic'
            ]
        ];
        return $this->request('POST', '/payment_intents', $data);
    }

    public function createPaymentMethod($type = 'qrph', $details = []) {
        $data = [
            'attributes' => [
                'type' => $type
            ]
        ];
        if (!empty($details)) {
             $data['attributes'] = array_merge($data['attributes'], $details);
        }
        return $this->request('POST', '/payment_methods', $data);
    }

    public function attachPaymentMethod($intentId, $methodId, $returnUrl = null) {
        $data = [
            'attributes' => [
                'payment_method' => $methodId
            ]
        ];
        if ($returnUrl) {
            $data['attributes']['return_url'] = $returnUrl;
        }
        return $this->request('POST', '/payment_intents/' . $intentId . '/attach', $data);
    }

    public function retrievePaymentIntent($id) {
        return $this->request('GET', '/payment_intents/' . $id);
    }
}
?>
