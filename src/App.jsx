import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import HotelsList from './components/HotelsList';
import ApartmentsList from './components/ApartmentsList';
import HostelsList from './components/HostelsList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import WelcomeBanner from './components/WelcomeBanner';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const sampleProperties = [
  {
    id: 1,
    title: "Student Hostels in Bonaberi",
    location: "Bonaberi, Douala",
    price: 25000,
    type: "Hostel",
    bedrooms: 4,
    bathrooms: 3,
    size: 250,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    forRent: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Hotels in Bonamusadi",
    location: "Bonamusadi, Douala",
    price: 45000,
    type: "Hotel",
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    forRent: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Apartments in Yassa",
    location: "Yassa, Douala",
    price: 100000,
    type: "Apartment",
    bedrooms: 0,
    bathrooms: 2,
    size: 200,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    forRent: false,
    created_at: new Date().toISOString()
  }
];

// Home component
const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  
  useEffect(() => {
    // Get properties from localStorage
    const allProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Combine sample properties with stored properties
    const combinedProperties = [...sampleProperties, ...allProperties];
    
    // Get up to 3 newest properties for featured display
    const newest = [...combinedProperties].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    ).slice(0, 3);
    
    setFeaturedProperties(newest);
  }, []);
  
  return (
    <>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id}>
              <Link
                to={property.type === "Hotel" ? "/hotels" : property.type === "Apartment" ? "/apartments" : property.type === "Hostel" ? "/hostels" : "#"}
                className="block transform transition-transform hover:scale-105"
              >
                <PropertyCard property={property} />
                <div className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors">
                  {property.type === "Hotel" ? "View All Hotels" : property.type === "Apartment" ? "View All Apartments" : property.type === "Hostel" ? "View All Hostels" : "View Details"}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">I am Legit <u>TRUST</u></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust the process</h3>
              <p className="text-gray-600">All our resources are legit</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Always Available</h3>
              <p className="text-gray-600">I am Always available,<br />Don't borther about the scam</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
              <p className="text-gray-600">My sources are affordable <br /> and based on individuals income</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Properties component
const Properties = () => {
  const [allProperties, setAllProperties] = useState([]);
  
  useEffect(() => {
    // Get properties from localStorage
    const savedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // Always include sample properties along with admin-added ones
    const combinedProperties = [...sampleProperties, ...savedProperties];
    
    setAllProperties(combinedProperties);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProperties.map((property) => (
          <div key={property.id}>
            <Link
              to={property.type === "Hotel" ? "/hotels" : property.type === "Apartment" ? "/apartments" : property.type === "Hostel" ? "/hostels" : "#"}
              className="block transform transition-transform hover:scale-105"
            >
              <PropertyCard property={property} />
              <div className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors">
                {property.type === "Hotel" ? "View All Hotels" : property.type === "Apartment" ? "View All Apartments" : property.type === "Hostel" ? "View All Hostels" : "View Details"}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  // Initialize properties in localStorage if none exist
  useEffect(() => {
    const savedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    // If no properties exist in localStorage, add the sample properties
    if (savedProperties.length === 0) {
      // Add created_at timestamp to each property
      const propertiesWithTimestamp = sampleProperties.map(property => ({
        ...property,
        id: property.id.toString(), // Ensure IDs are strings for consistency
        created_at: property.created_at || new Date().toISOString()
      }));
      
      localStorage.setItem('properties', JSON.stringify(propertiesWithTimestamp));
    }
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <WelcomeBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/hotels" element={<HotelsList />} />
          <Route path="/apartments" element={<ApartmentsList />} />
          <Route path="/hostels" element={<HostelsList />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;