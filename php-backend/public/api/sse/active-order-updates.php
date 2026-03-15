<?php
// api/sse/active-order-updates.php
// Server-Sent Events stream for real-time active order updates

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');

// Disable buffering
if (function_exists('apache_setenv')) {
    @apache_setenv('no-gzip', 1);
}
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
ob_implicit_flush(1);

require_once __DIR__ . '/../../../src/Database.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;

if (!$userId) {
    echo "data: " . json_encode(["error" => "User ID required"]) . "\n\n";
    flush();
    exit;
}

// Session handling - close write to prevent blocking other requests
if (session_status() === PHP_SESSION_ACTIVE) {
    session_write_close();
}

$database = new Database();
$db = $database->getConnection();

$lastHash = null;
$startTime = time();
$timeout = 600; // 10 minutes max connection time to prevent zombie processes

// Helper to get active order data
function getActiveOrderData($db, $userId) {
    // Find the latest order that is NOT completed or cancelled
    $query = "SELECT * FROM orders
              WHERE user_id = :user_id
              AND status IN ('pending', 'preparing', 'ready')
              ORDER BY created_at DESC
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        // Fetch items
        $itemsQuery = "SELECT oi.product_name, oi.quantity, p.image_url
                       FROM order_items oi
                       LEFT JOIN products p ON p.id = oi.product_slug
                       WHERE oi.order_id = :order_id";

        $itemStmt = $db->prepare($itemsQuery);
        $itemStmt->bindParam(':order_id', $order['id']);
        $itemStmt->execute();
        $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

        $orderImage = null;
        if (!empty($items)) {
            $orderImage = $items[0]['image_url'] ?? null;
        }

        // Create a summary string
        $itemNames = array_map(function($i) {
            return $i['quantity'] > 1 ? "{$i['quantity']}x {$i['product_name']}" : $i['product_name'];
        }, $items);
        $itemsSummary = implode(', ', $itemNames);

        // Calculate progress based on status
        $isCash = ($order['payment_method'] === 'cash');
        $steps = [];

        // Step 1: Placed
        $steps[] = ['label' => 'Placed', 'active' => true, 'completed' => true];

        // Step 2: To Pay (Only for Cash)
        if ($isCash) {
            $formattedTotal = number_format((float)$order['total_amount'], 2);
            $steps[] = [
                'label' => "To Pay\n₱$formattedTotal",
                'active' => false,
                'completed' => false
            ];
        }

        // Step 3: Preparing
        $steps[] = ['label' => 'Preparing', 'active' => false, 'completed' => false];

        // Step 4: Ready
        $steps[] = ['label' => 'Ready', 'active' => false, 'completed' => false];

        // Step 5: Served (Completed) - Not really in 'active' list but for UI flow
        $steps[] = ['label' => 'Served', 'active' => false, 'completed' => false];

        // Update progress based on current status
        $currentStatus = $order['status'];
        $progress = 0;

        $totalSteps = count($steps);
        $stepPercentage = 100 / $totalSteps;

        // Helper to get center of a step
        $getCenter = function($index) use ($stepPercentage) {
            return ($index + 0.5) * $stepPercentage;
        };

        if ($currentStatus === 'pending') {
            if ($isCash) {
                // At 'To Pay' step (Index 1)
                // Index 0 (Placed) is completed
                $steps[1]['active'] = true;
                $progress = $getCenter(1); // Center of 2nd step
            } else {
                // Stay at Placed (Index 0)
                // Do not advance to Preparing yet
                $progress = $getCenter(0);
            }
        } elseif ($currentStatus === 'preparing') {
            if ($isCash) {
                // Index 2 (Preparing)
                $steps[1]['completed'] = true;
                $steps[2]['active'] = true;
                $progress = $getCenter(2);
            } else {
                // Index 1 (Preparing)
                $steps[1]['active'] = true;
                $progress = $getCenter(1);
            }
        } elseif ($currentStatus === 'ready') {
             if ($isCash) {
                 // Index 3 (Ready)
                 $steps[1]['completed'] = true;
                 $steps[2]['completed'] = true;
                 $steps[3]['active'] = true;
                 $progress = $getCenter(3);
             } else {
                 // Index 2 (Ready)
                 $steps[1]['completed'] = true;
                 $steps[2]['active'] = true;
                 $progress = $getCenter(2);
             }
        }

        // Calculate estimated time (mock logic for now, could be DB field)
        $createdAt = strtotime($order['created_at']);
        $now = time();
        $elapsed = $now - $createdAt;
        $estTotal = 20 * 60; // 20 mins
        $remaining = max(0, $estTotal - $elapsed);
        $estMinutes = ceil($remaining / 60);

        $estimatedTime = $estMinutes > 0 ? "{$estMinutes} mins" : "Soon";

        return [
            "id" => $order['id'],
            "status" => $order['status'],
            "items_summary" => $itemsSummary,
            "estimated_time" => $estimatedTime,
            "progress" => $progress,
            "steps" => $steps,
            "payment_method" => $order['payment_method'],
            "total_amount" => $order['total_amount'],
            "order_image" => $orderImage,
            "items" => $items,
            "updated_at" => date('Y-m-d H:i:s') // Force update check
        ];
    }

    return null;
}

// Loop for updates
while (true) {
    // Check for timeout
    if (time() - $startTime > $timeout) {
        break;
    }

    try {
        // Fetch current data
        $data = getActiveOrderData($db, $userId);

        // Generate a hash to check for changes
        // If data is null (no active order), hash is 'null'
        $currentHash = $data ? md5(json_encode($data)) : 'null';

        if ($currentHash !== $lastHash) {
            $lastHash = $currentHash;

            echo "data: " . json_encode([
                "success" => true,
                "data" => $data,
                "timestamp" => time()
            ]) . "\n\n";

            flush();
        }

        // Also send a heartbeat every 30 seconds to keep connection alive
        if ((time() - $startTime) % 30 === 0) {
             echo ": heartbeat\n\n";
             flush();
        }

    } catch (Exception $e) {
        // On error, send error event and maybe break or retry
        // echo "event: error\ndata: " . json_encode(["message" => $e->getMessage()]) . "\n\n";
        // flush();
    }

    // Sleep for 2 seconds before next check
    sleep(2);

    // Clearstatcache if checking files, but here we check DB
    // Re-verify connection if needed (PDO usually handles it but long running scripts can drop)
}
?>
