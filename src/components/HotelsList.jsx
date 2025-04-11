import React, { useState, useRef, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Link } from 'react-router-dom';

const HotelsList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Sample hotel data as fallback if no hotels are added
  const sampleHotels = [
    {
      id: 'sample-1',
      title: "Luxury Hotel in Bonamoussadi",
      location: "Bonamoussadi, Douala",
      price: 45000,
      type: "Hotel",
      bedrooms: 1,
      bathrooms: 1,
      size: 35,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-2',
      title: "Grand Hotel Deido",
      location: "Deido, Douala",
      price: 55000,
      type: "Hotel",
      bedrooms: 2,
      bathrooms: 1,
      size: 42,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-3',
      title: "Akwa Palace Hotel",
      location: "Akwa, Douala",
      price: 75000,
      type: "Hotel",
      bedrooms: 1,
      bathrooms: 1,
      size: 40,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      forRent: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Get properties from localStorage
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Filter hotels from admin-added properties
    const adminHotels = allProperties.filter(property => property.type === 'Hotel');
    
    // Combine admin hotels with sample hotels
    const combinedHotels = [...sampleHotels, ...adminHotels];
    
    setHotels(combinedHotels);
    setLoading(false);
  }, []);

  // Use all hotels directly, no need for displayHotels logic
  const filteredHotels = hotels.filter(hotel =>
    hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clicks outside of the search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Available Hotels in Douala</h1>
        
        <div className="relative mb-6" ref={searchRef}>
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) {
                setShowResults(true);
              }
            }}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          
          {showResults && filteredHotels.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-96 overflow-y-auto">
              {filteredHotels.map(hotel => (
                <div 
                  key={hotel.id} 
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                  onClick={() => {
                    setSearchQuery(hotel.title);
                    setShowResults(false);
                  }}
                >
                  <div className="flex items-center">
                    <img 
                      src={hotel.image} 
                      alt={hotel.title}
                      className="h-16 w-16 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{hotel.title}</h3>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                      <p className="text-sm text-gray-800">{hotel.price} FCFA</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {filteredHotels.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={hotel.image} 
                    alt={hotel.title}
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel.title}</h2>
                  <p className="text-gray-600 mb-4">{hotel.location}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-semibold">Price:</span> {hotel.price} FCFA
                    </div>
                    <div>
                      <span className="font-semibold">Type:</span> {hotel.type}
                    </div>
                    <div>
                      <span className="font-semibold">Bedrooms:</span> {hotel.bedrooms}
                    </div>
                    <div>
                      <span className="font-semibold">Bathrooms:</span> {hotel.bathrooms}
                    </div>
                    <div>
                      <span className="font-semibold">Size:</span> {hotel.size} m²
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> {hotel.forRent ? 'For Rent' : 'For Sale'}
                    </div>
                  </div>
                  <a href="https://wa.me/680518811"><button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Contact on Whatsapp
                  </button></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsList; 