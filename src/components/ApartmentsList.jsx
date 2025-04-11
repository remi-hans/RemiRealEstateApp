import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Link } from 'react-router-dom';

const ApartmentsList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample apartment data as fallback if no apartments are added
  const sampleApartments = [
    {
      id: 'sample-1',
      title: "Modern 2-Bedroom Apartment",
      location: "Bonamoussadi, Douala",
      price: 150000,
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      size: 85,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-2',
      title: "Luxury Apartment with Balcony",
      location: "Bonapriso, Douala",
      price: 200000,
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-3',
      title: "Studio Apartment in City Center",
      location: "Akwa, Douala",
      price: 100000,
      type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      size: 45,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Get properties from localStorage
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Filter apartments from admin-added properties
    const adminApartments = allProperties.filter(property => property.type === 'Apartment');
    
    // Combine admin apartments with sample apartments
    const combinedApartments = [...sampleApartments, ...adminApartments];
    
    setApartments(combinedApartments);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Apartments</h1>
      <p className="text-gray-600 mb-8">Find your perfect apartment in Douala</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="transform transition hover:scale-105">
            <PropertyCard property={apartment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentsList; 