<?php
// api/staff/orders.php
// Returns a paginated list of orders for staff view (with filtering and search)

require_once __DIR__ . '/../../../src/Database.php';
require_once __DIR__ . '/../../../src/AuthMiddleware.php';

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Basic Auth Check (Placeholder)
// AuthMiddleware::requireStaff();

try {
    $database = new Database();
    $db = $database->getConnection();

    // Parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Performance Monitoring Start
    $startTime = microtime(true);

    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'created_at';
    $sortOrder = isset($_GET['sortOrder']) && strtolower($_GET['sortOrder']) === 'asc' ? 'ASC' : 'DESC';

    // Base Query
    $query = "SELECT o.*, u.first_name, u.last_name, u.email
              FROM orders o
              LEFT JOIN users u ON o.user_id = u.id
              WHERE 1=1";

    $params = [];

    // Filter by Status
    if ($status !== 'all' && !empty($status)) {
        $query .= " AND o.status = :status";
        $params[':status'] = $status;
    }

    // Search (Order ID or Customer Name)
    if (!empty($search)) {
        $query .= " AND (o.id LIKE :search OR u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search)";
        $params[':search'] = "%{$search}%";
    }

    // Sorting
    $allowedSorts = ['created_at', 'total_amount', 'status', 'id'];
    if (!in_array($sortBy, $allowedSorts)) {
        $sortBy = 'created_at';
    }
    $query .= " ORDER BY o.{$sortBy} {$sortOrder}";

    // Count Total (for pagination)
    $countQuery = "SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1";
    if ($status !== 'all' && !empty($status)) {
        $countQuery .= " AND o.status = :status";
    }
    if (!empty($search)) {
        $countQuery .= " AND (o.id LIKE :search OR u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search)";
    }

    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $totalOrders = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    $totalPages = ceil($totalOrders / $limit);

    // Add Pagination to Query
    $query .= " LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($query);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Optimize: Fetch all items for these orders in one query to avoid N+1 problem
    if (!empty($orders)) {
        $orderIds = array_column($orders, 'id');
        $placeholders = implode(',', array_fill(0, count($orderIds), '?'));

        $itemQuery = "SELECT oi.order_id, oi.product_name, oi.quantity, oi.price, oi.product_slug, p.image_url
                       FROM order_items oi
                       LEFT JOIN products p ON p.id = oi.product_slug
                       WHERE oi.order_id IN ($placeholders)";

        $itemStmt = $db->prepare($itemQuery);
        $itemStmt->execute($orderIds);
        $allItems = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

        // Group items by order_id
        $itemsByOrder = [];
        foreach ($allItems as $item) {
            $itemsByOrder[$item['order_id']][] = $item;
        }

        // Assign items back to orders
        foreach ($orders as &$order) {
            $orderItems = isset($itemsByOrder[$order['id']]) ? $itemsByOrder[$order['id']] : [];

            $order['items'] = $orderItems;
            $order['item_count'] = count($orderItems);

            // Summary string
            $itemNames = array_map(function($i) {
                 return $i['quantity'] > 1 ? "{$i['quantity']}x {$i['product_name']}" : $i['product_name'];
            }, $orderItems);
            $order['items_summary'] = implode(', ', $itemNames);

        // Customer Name Fallback
        if (empty($order['first_name']) && empty($order['last_name'])) {
            $order['customer_name'] = "Guest / Walk-in";
        } else {
            $order['customer_name'] = trim($order['first_name'] . ' ' . $order['last_name']);
        }
    }
} else {
    // No orders found
    $orders = [];
}

// Performance Monitoring End
$endTime = microtime(true);
$duration = $endTime - $startTime;

echo json_encode([
    "success" => true,
    "data" => $orders,
    "pagination" => [
        "current_page" => $page,
        "total_pages" => $totalPages,
        "total_records" => $totalOrders,
        "limit" => $limit
    ],
    "meta" => [
        "execution_time" => round($duration, 4) . "s"
    ]
]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
