<?php
// benchmark_orders.php
// Benchmark the staff orders API endpoint

require_once __DIR__ . '/src/Database.php';

// Simulate GET request parameters
$_GET['page'] = 1;
$_GET['limit'] = 50; // Increased limit to exaggerate performance issues
$_GET['status'] = 'all';

// Mock DB Connection and capture output
ob_start();
$start = microtime(true);

// Include the actual API file
// We need to adjust the path because we are running from root
// But the API file includes Database.php relative to itself: ../../../src/Database.php
// So we should copy the logic or run it via curl.
// Running via curl is better to measure real response time including overhead.

ob_end_clean();

$url = "http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/orders.php?page=1&limit=50&status=all";

echo "Benchmarking URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);

$start = microtime(true);
$output = curl_exec($ch);
$end = microtime(true);

curl_close($ch);

$duration = $end - $start;
echo "Duration: " . number_format($duration, 4) . " seconds\n";

$data = json_decode($output, true);
if (json_last_error() === JSON_ERROR_NONE) {
    echo "Success: " . ($data['success'] ? 'Yes' : 'No') . "\n";
    echo "Count: " . count($data['data'] ?? []) . "\n";
} else {
    echo "Failed to decode JSON response.\n";
    // echo "Response: " . substr($output, 0, 500) . "...\n";
}
?>
