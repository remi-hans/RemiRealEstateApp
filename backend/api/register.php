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
if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Sanitize input data
$username = mysqli_real_escape_string($conn, $data['username']);
$email = mysqli_real_escape_string($conn, $data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
$first_name = isset($data['first_name']) ? mysqli_real_escape_string($conn, $data['first_name']) : '';
$last_name = isset($data['last_name']) ? mysqli_real_escape_string($conn, $data['last_name']) : '';
$phone = isset($data['phone']) ? mysqli_real_escape_string($conn, $data['phone']) : '';

// Check if username already exists
$check_query = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
$result = mysqli_query($conn, $check_query);

if (mysqli_num_rows($result) > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Username or email already exists']);
    exit();
}

// Insert user into database
$query = "INSERT INTO users (username, email, password, first_name, last_name, phone) 
          VALUES ('$username', '$email', '$password', '$first_name', '$last_name', '$phone')";

if (mysqli_query($conn, $query)) {
    $user_id = mysqli_insert_id($conn);
    
    // Return success response
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'User registered successfully',
        'user_id' => $user_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to register user: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
?> 