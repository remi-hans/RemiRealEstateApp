import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Link } from 'react-router-dom';

const HostelsList = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample hostel data as fallback if no hostels are added
  const sampleHostels = [
    {
      id: 'sample-1',
      title: "Student Hostel in Bonamoussadi",
      location: "Bonamoussadi, Douala",
      price: 25000,
      type: "Hostel",
      bedrooms: 1,
      bathrooms: 1,
      size: 18,
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-2',
      title: "University Hostel in Bonaberi",
      location: "Bonaberi, Douala",
      price: 18000,
      type: "Hostel",
      bedrooms: 1,
      bathrooms: 1,
      size: 15,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-3',
      title: "Shared Hostel in Makepe",
      location: "Makepe, Douala",
      price: 15000,
      type: "Hostel",
      bedrooms: 2,
      bathrooms: 1,
      size: 25,
      image: "https://images.unsplash.com/photo-1527256035292-7217af53510e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Get properties from localStorage
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Filter hostels from admin-added properties
    const adminHostels = allProperties.filter(property => property.type === 'Hostel');
    
    // Combine admin hostels with sample hostels
    const combinedHostels = [...sampleHostels, ...adminHostels];
    
    setHostels(combinedHostels);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostels</h1>
      <p className="text-gray-600 mb-8">Affordable student accommodation in Douala</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="transform transition hover:scale-105">
            <PropertyCard property={hostel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostelsList; 