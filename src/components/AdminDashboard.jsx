import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'properties'
  const [properties, setProperties] = useState([]);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: '',
    type: 'Hotel', // default type
    bedrooms: '',
    bathrooms: '',
    size: '',
    image: '',
    forRent: true,
    description: ''
  });

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.isAdmin) {
      setError('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    loadUsers();
    loadProperties();
  }, [navigate]);

  const loadUsers = () => {
    // Get all registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Sort users by registration date (newest first)
    const sortedUsers = registeredUsers.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    setUsers(sortedUsers);
    setLoading(false);
  }

  const loadProperties = () => {
    // Get all properties from localStorage
    const savedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    setProperties(savedProperties);
  }

  const handleDeleteUser = (userId, username) => {
    setDeleteConfirmation({ id: userId, username });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;

    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Prevent admin from deleting their own account
      if (currentUser.id === deleteConfirmation.id) {
        setError('You cannot delete your own admin account.');
        setDeleteConfirmation(null);
        return;
      }

      // Get all registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Filter out the user being deleted
      const updatedUsers = registeredUsers.filter(user => user.id !== deleteConfirmation.id);
      
      // Update localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Update state
      setUsers(updatedUsers);
      setSuccessMessage(`User ${deleteConfirmation.username} has been deleted successfully.`);
      
      // Clear confirmation dialog
      setDeleteConfirmation(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };
  
  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const finalValue = type === 'checkbox' ? checked : 
                     (name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'size') 
                        ? Number(value) || '' // Convert to number or empty string if NaN
                        : value;
    
    setNewProperty({
      ...newProperty,
      [name]: finalValue
    });
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newProperty.title || !newProperty.location || !newProperty.price || !newProperty.type) {
        throw new Error('Please fill in all required fields (title, location, price, type)');
      }
      
      // Create a new property with ID and timestamp
      const propertyToAdd = {
        ...newProperty,
        id: `admin-${Date.now()}`, // Ensure unique ID format
        created_at: new Date().toISOString()
      };
      
      // Get existing properties
      const existingProperties = JSON.parse(localStorage.getItem('properties') || '[]');
      
      // Add new property
      const updatedProperties = [...existingProperties, propertyToAdd];
      
      // Save to localStorage
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      
      // Update state
      setProperties(updatedProperties);
      
      // Reset form
      setNewProperty({
        title: '',
        location: '',
        price: '',
        type: 'Hotel',
        bedrooms: '',
        bathrooms: '',
        size: '',
        image: '',
        forRent: true,
        description: ''
      });
      
      setSuccessMessage('Property added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Hide the form after successful submission
      setShowAddPropertyForm(false);
    } catch (err) {
      setError(err.message);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleDeleteProperty = (propertyId) => {
    try {
      // Get all properties from localStorage
      const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
      
      // Filter out the property to delete
      const updatedProperties = allProperties.filter(property => property.id !== propertyId);
      
      // Save to localStorage
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      
      // Update state
      setProperties(updatedProperties);
      
      setSuccessMessage('Property deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete property. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage users and properties
            </p>
            
            {successMessage && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
          </div>
          
          {/* Delete confirmation modal */}
          {deleteConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete user <span className="font-semibold">{deleteConfirmation.username}</span>? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tab navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'properties'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Properties
              </button>
            </nav>
          </div>
          
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profile_picture ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profile_picture}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                {(user.first_name?.[0] || user.username[0]).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isAdmin
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className={`text-red-600 hover:text-red-900 ${
                            JSON.parse(localStorage.getItem('user') || '{}').id === user.id
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={JSON.parse(localStorage.getItem('user') || '{}').id === user.id}
                          title={JSON.parse(localStorage.getItem('user') || '{}').id === user.id ? "Cannot delete your own account" : "Delete user"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'properties' && (
            <div className="p-4">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Property Management</h3>
                <button
                  onClick={() => setShowAddPropertyForm(!showAddPropertyForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  {showAddPropertyForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Hide Form
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Property
                    </>
                  )}
                </button>
              </div>
              
              {showAddPropertyForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-4">Add New Property</h4>
                  <form onSubmit={handleAddProperty} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title*
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newProperty.title}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location*
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={newProperty.location}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price (CFA)*
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={newProperty.price}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Type*
                        </label>
                        <select
                          name="type"
                          value={newProperty.type}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="Hotel">Hotel</option>
                          <option value="Hostel">Hostel</option>
                          <option value="Apartment">Apartment</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={newProperty.bedrooms}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={newProperty.bathrooms}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Size (m²)
                        </label>
                        <input
                          type="number"
                          name="size"
                          value={newProperty.size}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Image URL
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={newProperty.image}
                          onChange={handlePropertyChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newProperty.description}
                        onChange={handlePropertyChange}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="forRent"
                        checked={newProperty.forRent}
                        onChange={handlePropertyChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Available for Rent (uncheck for Sale)
                      </label>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddPropertyForm(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Property
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <h3 className="text-lg font-semibold mb-4">Existing Properties</h3>
              
              {properties.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No properties found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map(property => (
                    <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        {property.image ? (
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            property.type === 'Hotel' ? 'bg-indigo-100 text-indigo-800' :
                            property.type === 'Hostel' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.type}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{property.location}</p>
                        <p className="text-gray-700 font-bold mb-2">{property.price.toLocaleString()} CFA</p>
                        <p className="text-gray-500 text-sm mb-4">
                          {property.bedrooms > 0 && `${property.bedrooms} bed${property.bedrooms !== 1 ? 's' : ''} · `}
                          {property.bathrooms > 0 && `${property.bathrooms} bath${property.bathrooms !== 1 ? 's' : ''} · `}
                          {property.size > 0 && `${property.size} m²`}
                        </p>
                        {property.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${property.forRent ? 'text-blue-600' : 'text-purple-600'} font-medium`}>
                            For {property.forRent ? 'Rent' : 'Sale'}
                          </span>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 