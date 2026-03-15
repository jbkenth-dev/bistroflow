<?php
session_start();
require_once '../src/CSRF.php';
$csrf_token = CSRF::generateToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - BistroFlow</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .error-msg { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Or <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">sign in to your existing account</a>
            </p>
        </div>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span class="block sm:inline"><?php echo htmlspecialchars($_SESSION['error']); ?></span>
            </div>
            <?php unset($_SESSION['error']); ?>
        <?php endif; ?>

        <?php if (isset($_SESSION['errors']) && is_array($_SESSION['errors'])): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <ul class="list-disc list-inside">
                    <?php foreach ($_SESSION['errors'] as $err): ?>
                        <li><?php echo htmlspecialchars($err); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php unset($_SESSION['errors']); ?>
        <?php endif; ?>

        <form class="mt-8 space-y-6" action="register_process.php" method="POST" id="signupForm">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">

            <div class="rounded-md shadow-sm -space-y-px">
                <div class="mb-4 flex gap-2">
                    <div class="w-1/2">
                        <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
                        <input id="first_name" name="first_name" type="text" required
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="John"
                            value="<?php echo isset($_SESSION['old_input']['first_name']) ? htmlspecialchars($_SESSION['old_input']['first_name']) : ''; ?>">
                    </div>
                    <div class="w-1/2">
                        <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input id="last_name" name="last_name" type="text" required
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Doe"
                            value="<?php echo isset($_SESSION['old_input']['last_name']) ? htmlspecialchars($_SESSION['old_input']['last_name']) : ''; ?>">
                    </div>
                </div>
                <div class="mb-4">
                    <label for="middle_name" class="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
                    <input id="middle_name" name="middle_name" type="text"
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Quincy"
                        value="<?php echo isset($_SESSION['old_input']['middle_name']) ? htmlspecialchars($_SESSION['old_input']['middle_name']) : ''; ?>">
                </div>

                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input id="email" name="email" type="email" autocomplete="email" required
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="john@example.com"
                        value="<?php echo isset($_SESSION['old_input']['email']) ? htmlspecialchars($_SESSION['old_input']['email']) : ''; ?>">
                </div>

                <div class="mb-4">
                    <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input id="phone_number" name="phone_number" type="tel"
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="+1 (555) 123-4567"
                        value="<?php echo isset($_SESSION['old_input']['phone_number']) ? htmlspecialchars($_SESSION['old_input']['phone_number']) : ''; ?>">
                </div>

                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" required
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="********">
                    <p class="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</p>
                </div>

                <div class="mb-4">
                    <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input id="confirm_password" name="confirm_password" type="password" required
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="********">
                </div>
            </div>

            <div>
                <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign up
                </button>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const email = document.getElementById('email').value;

            // Client-side validation
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

            if (!passwordPattern.test(password)) {
                e.preventDefault();
                alert('Password does not meet complexity requirements.');
                return;
            }

            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match.');
                return;
            }

            // Basic email check
            if (!email.includes('@') || !email.includes('.')) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }
        });
    </script>
    <?php unset($_SESSION['old_input']); ?>
</body>
</html>
