import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if this is the default admin account
      const isDefaultAdmin = formData.username === 'admin@remi.com' && formData.password === 'admin123';
      
      if (isDefaultAdmin) {
        // Create admin user if it doesn't exist
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        let adminUser = registeredUsers.find(user => user.email === 'admin@remi.com');
        
        if (!adminUser) {
          // Create a new admin user
          adminUser = {
            id: Date.now().toString(),
            username: 'admin',
            email: 'admin@remi.com',
            password: 'admin123',
            first_name: 'Admin',
            last_name: 'User',
            isAdmin: true,
            created_at: new Date().toISOString()
          };
          
          // Add admin user to registered users
          registeredUsers.push(adminUser);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        // Create a token (in a real app, this would be a JWT)
        const token = btoa(JSON.stringify({ 
          id: adminUser.id, 
          username: adminUser.username,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        // Store token and user data (without password) in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          first_name: adminUser.first_name,
          last_name: adminUser.last_name,
          isAdmin: adminUser.isAdmin
        }));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('auth-change'));
        
        // Redirect to admin dashboard
        navigate('/admin', { 
          state: { 
            justLoggedIn: true,
            username: adminUser.first_name || adminUser.username 
          } 
        });
        return;
      }
      
      // Regular login flow for non-admin users
      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find the user with the given username or email
      const foundUser = registeredUsers.find(
        (user) => user.username === formData.username || user.email === formData.username
      );
      
      // Check if user exists and password is correct
      if (!foundUser) {
        throw new Error('User not found. Please check your username or email.');
      }
      
      if (foundUser.password !== formData.password) {
        throw new Error('Invalid password. Please try again.');
      }
      
      // Create a simple token (in a real app, this would be a JWT from the server)
      const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Store token and user data (without password) in localStorage
      const { password: _, ...userWithoutPassword } = foundUser;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Dispatch custom event to notify other components (like Navbar and WelcomeBanner)
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirect to home page after successful login
      navigate('/', { 
        state: { 
          justLoggedIn: true,
          username: userWithoutPassword.first_name || userWithoutPassword.username 
        } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm mb-2 sm:mb-0">
              {/* Removed "Forgot your password" link */}
            </div>
            <div className="text-sm">
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Default Admin Account</span>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              To log in as admin, use these credentials:
            </p>
            <div className="mt-2 text-sm">
              <p><strong>Email:</strong> admin@remi.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 