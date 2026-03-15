<?php
// php-backend/config/paymongo.php

return [
    'secret_key' => getenv('PAYMONGO_SECRET_KEY') ?: '',
    'public_key' => getenv('PAYMONGO_PUBLIC_KEY') ?: '',
    'api_url' => 'https://api.paymongo.com/v1',
    'webhook_secret' => getenv('PAYMONGO_WEBHOOK_SECRET') ?: '', // Needs to be set after creating webhook
];
?>
