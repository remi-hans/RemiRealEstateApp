import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Import hotel data
const hotelsList = [
  {
    id: 1,
    title: "Luxury Hotel in Akwa",
    location: "Akwa, Douala",
    price: 75000,
    type: "Hotel",
    bedrooms: 4,
    bathrooms: 3,
    size: 250,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    forRent: true
  },
  {
    id: 2,
    title: "Boutique Hotel in Bonapriso",
    location: "Bonapriso, Douala",
    price: 85000,
    type: "Hotel",
    bedrooms: 5,
    bathrooms: 4,
    size: 300,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    forRent: true
  },
  {
    id: 3,
    title: "Seaside Hotel in Bonanjo",
    location: "Bonanjo, Douala",
    price: 95000,
    type: "Hotel",
    bedrooms: 6,
    bathrooms: 4,
    size: 350,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    forRent: true
  },
  {
    id: 4,
    title: "Business Hotel in Bali",
    location: "Bali, Douala",
    price: 65000,
    type: "Hotel",
    bedrooms: 3,
    bathrooms: 2,
    size: 200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    forRent: true
  }
];

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        navigate('/login');
        return;
      }

      try {
        // Parse stored user data
        const userData = JSON.parse(storedUser);
        
        // Get registered users to ensure this user still exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = registeredUsers.some(u => u.id === userData.id);
        
        if (!userExists) {
          throw new Error('User no longer exists');
        }
        
        // Set user state
        setUser(userData);
        
        // Set form data
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
      } catch (err) {
        setError(err.message);
        // If authentication error, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      old_password: '',
      new_password: '',
      confirm_password: ''
    });
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords if trying to change password
    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }

      if (formData.new_password !== formData.confirm_password) {
        setError('New passwords do not match');
        return;
      }

      if (!formData.old_password) {
        setError('Current password is required to set a new password');
        return;
      }
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find the current user
      const currentUserIndex = registeredUsers.findIndex(u => u.id === user.id);
      
      if (currentUserIndex === -1) {
        throw new Error('User not found');
      }
      
      const currentUser = registeredUsers[currentUserIndex];
      
      // Verify old password if trying to change password
      if (formData.new_password && formData.old_password !== currentUser.password) {
        throw new Error('Current password is incorrect');
      }
      
      // Prepare updated user data
      const updatedUser = {
        ...currentUser,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone
      };
      
      // Update password if needed
      if (formData.new_password) {
        updatedUser.password = formData.new_password;
      }
      
      // Update user in registered users array
      registeredUsers[currentUserIndex] = updatedUser;
      
      // Save updated users list to localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Update the stored user (without password)
      const { password, ...userWithoutPassword } = updatedUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Update state
      setUser(userWithoutPassword);
      setMessage('Profile updated successfully');
      setIsEditing(false);
      
      // Reset password fields
      setFormData({
        ...formData,
        old_password: '',
        new_password: '',
        confirm_password: ''
      });

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('auth-change'));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
    
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 self-start sm:self-auto"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'hotels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hotels
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {message}
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                {!isEditing ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium break-words">{user.username}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium break-words">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">First Name</p>
                            <p className="font-medium">{user.first_name || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Name</p>
                            <p className="font-medium">{user.last_name || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{user.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleEditProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Account Information</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.first_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.last_name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">Change Password (optional)</h3>
                      
                      <div className="mb-4">
                        <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          id="old_password"
                          name="old_password"
                          type="password"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.old_password}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            id="new_password"
                            name="new_password"
                            type="password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.new_password}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.confirm_password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {activeTab === 'hotels' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Hotels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotelsList.map((hotel) => (
                    <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={hotel.image} 
                          alt={hotel.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                          {hotel.type}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{hotel.title}</h3>
                        <p className="text-gray-600 mb-1 text-sm">{hotel.location}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-blue-600">
                            {hotel.price.toLocaleString()} FCFA
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{hotel.bedrooms} Bedrooms</span>
                          <span>{hotel.bathrooms} Bathrooms</span>
                          <span>{hotel.size} m²</span>
                        </div>
                        
                        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link
                    to="/hotels"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View All Hotels
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 