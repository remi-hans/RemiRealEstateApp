# Real Estate Website PHP Backend

This directory contains the PHP backend API for the real estate website. Below are instructions on how to properly set up and configure the backend.

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- A web server (Apache, Nginx, etc.)

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE real_estate_db;
   ```

2. Import the database schema:
   ```bash
   mysql -u username -p real_estate_db < database.sql
   ```

### 2. Configure the Backend

1. Update the database connection details in `config.php`:
   ```php
   $db_host = "localhost"; // Your database host
   $db_user = "root";      // Your database username
   $db_pass = "";          // Your database password
   $db_name = "real_estate_db"; // Your database name
   ```

### 3. Web Server Configuration

#### For Apache:

1. Make sure your project is in the web server's document root or properly configured with a virtual host.
2. Ensure that PHP is properly configured with Apache.
3. Make sure the `mod_rewrite` module is enabled.

Example virtual host configuration:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/your/project
    
    <Directory /path/to/your/project>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

#### For Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/project;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
```

### 4. Connect Frontend to Backend

In your React frontend, make sure API requests are pointing to the correct backend URL. 

For example, if your backend is hosted at `https://api.yourdomain.com`, update the fetch URLs in the components:

```js
// Example in Login.jsx
const response = await fetch('https://api.yourdomain.com/api/login.php', { 
  // ... rest of your fetch configuration
});
```

## Temporary Development Solution

If you don't have a proper PHP environment set up yet, the frontend has been configured to use mock responses for development purposes. When you're ready to switch to the real backend:

1. Uncomment the actual API calls in the components
2. Comment out or remove the mock response code
3. Update the API URLs to point to your backend server

## API Endpoints

- `api/register.php` - User registration
- `api/login.php` - User login
- `api/profile.php` - Get and update user profile
- `api/logout.php` - User logout

## Security Considerations

- Make sure to set up HTTPS for your production environment
- Consider implementing rate limiting for API endpoints
- For production, consider using JWT tokens with proper expiration instead of the simple token system

# Email Backend for Password Reset

This backend service handles sending verification codes to users' email for password reset.

## Setup Instructions

### 1. Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

### 2. Configure Email Settings

To use Gmail for sending emails, you need to:

1. Edit the `.env` file with your Gmail credentials:
   ```
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. For `EMAIL_PASS`, you'll need to generate an "App Password" from Google:
   - Go to your Google Account settings: https://myaccount.google.com/
   - Navigate to Security
   - Under "Signing in to Google", select "2-Step Verification" (enable it if not already)
   - At the bottom, select "App passwords"
   - Generate a new app password for "Mail" and "Other (Custom name)" - name it "Real Estate Website"
   - Copy the 16-character password and use it as your EMAIL_PASS

### 3. Start the Server

```bash
npm run dev
```

The server will start on port 5000 (or the port specified in your `.env` file).

## API Endpoints

### Request Password Reset

**POST /api/forgot-password**

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Verification code sent to your email."
}
```

### Reset Password with Verification Code

**POST /api/reset-password**

Request body:
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newSecurePassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in with your new password."
}
```

## Security Notes

- For production, use HTTPS to secure the API endpoints
- Consider implementing rate limiting to prevent brute-force attacks
- In a production environment, store verification codes in a database instead of in-memory
- Set appropriate CORS settings to only allow requests from your frontend domain 