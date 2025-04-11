<?php
require_once '../config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the post data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Sanitize input data
$username = mysqli_real_escape_string($conn, $data['username']);
$password = $data['password'];

// Check if user exists
$query = "SELECT * FROM users WHERE username = '$username' OR email = '$username'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) === 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
    exit();
}

$user = mysqli_fetch_assoc($result);

// Verify password
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
    exit();
}

// Generate a simple session token (in a production environment, use JWT instead)
$token = bin2hex(random_bytes(32));
$user_id = $user['id'];

// Update user with new token (simplified session management)
$update_query = "UPDATE users SET remember_token = '$token' WHERE id = $user_id";
mysqli_query($conn, $update_query);

// Remove password from user data
unset($user['password']);

// Return success response with user data and token
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Login successful',
    'user' => $user,
    'token' => $token
]);

mysqli_close($conn);
?> 