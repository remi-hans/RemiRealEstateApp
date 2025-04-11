<?php
require_once '../config.php';

// Simple token authentication middleware
function authenticate() {
    global $conn;
    
    // Get the token from Authorization header
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($auth_header) || !preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Token required']);
        exit();
    }
    
    $token = $matches[1];
    
    // Verify token against database
    $query = "SELECT * FROM users WHERE remember_token = '$token'";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid token']);
        exit();
    }
    
    return mysqli_fetch_assoc($result);
}

// GET: Retrieve user profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = authenticate();
    
    // Remove sensitive information
    unset($user['password']);
    unset($user['remember_token']);
    
    // Return user profile
    echo json_encode([
        'status' => 'success',
        'user' => $user
    ]);
    exit();
}

// PUT/POST: Update user profile
if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = authenticate();
    $user_id = $user['id'];
    
    // Get the post data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Fields that are allowed to be updated
    $allowed_fields = ['first_name', 'last_name', 'email', 'phone', 'profile_picture'];
    $updates = [];
    
    // Build update query
    foreach ($allowed_fields as $field) {
        if (isset($data[$field])) {
            $value = mysqli_real_escape_string($conn, $data[$field]);
            $updates[] = "$field = '$value'";
        }
    }
    
    // Handle password update separately (requires old password verification)
    if (isset($data['new_password']) && isset($data['old_password'])) {
        if (password_verify($data['old_password'], $user['password'])) {
            $new_password = password_hash($data['new_password'], PASSWORD_DEFAULT);
            $updates[] = "password = '$new_password'";
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Current password is incorrect']);
            exit();
        }
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update']);
        exit();
    }
    
    // Execute update query
    $update_query = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = $user_id";
    
    if (mysqli_query($conn, $update_query)) {
        // Get updated user profile
        $query = "SELECT * FROM users WHERE id = $user_id";
        $result = mysqli_query($conn, $query);
        $updated_user = mysqli_fetch_assoc($result);
        
        // Remove sensitive information
        unset($updated_user['password']);
        unset($updated_user['remember_token']);
        
        // Return updated profile
        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $updated_user
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update profile: ' . mysqli_error($conn)]);
    }
    exit();
}

// Handle other methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
mysqli_close($conn);
?> 