<?php
require_once '../config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get token from headers
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($auth_header) || !preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Token required']);
    exit();
}

$token = $matches[1];

// Clear token from database
$query = "UPDATE users SET remember_token = NULL WHERE remember_token = '$token'";
mysqli_query($conn, $query);

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Logged out successfully'
]);

mysqli_close($conn);
?> 