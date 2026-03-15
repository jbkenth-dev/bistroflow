<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: signup.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful - BistroFlow</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div>
            <h2 class="mt-6 text-3xl font-extrabold text-green-600">
                Success!
            </h2>
            <p class="mt-2 text-gray-600">
                Your account has been successfully created.
            </p>
        </div>
        <div class="mt-4">
            <p class="text-sm text-gray-500">Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</p>
        </div>
        <div class="mt-8">
            <a href="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Home
            </a>
        </div>
    </div>
</body>
</html>
