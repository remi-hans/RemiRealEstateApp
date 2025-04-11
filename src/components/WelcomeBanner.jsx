import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Check if user navigated from login/signup with justLoggedIn state
  useEffect(() => {
    if (location.state?.justLoggedIn) {
      setVisible(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Hide the banner after 10 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Initial check for user login
  useEffect(() => {
    // Check if user is logged in (using localStorage)
    const userData = localStorage.getItem('user');
    if (userData && !user) {
      setUser(JSON.parse(userData));
      if (location.state?.justLoggedIn) {
        setVisible(true);
        
        // Hide the banner after 10 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen for auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setVisible(true);
        
        // Hide the banner after 10 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 10000);
        
        return () => clearTimeout(timer);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  if (!visible || !user) return null;

  const userName = user.first_name || user.username;

  return (
    <div className="fixed top-0 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-blue-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-blue-800">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">Welcome, {userName}!</span>
                <span className="hidden md:inline">Welcome to Remi Hans Real Estates, {userName}!</span>
              </p>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setVisible(false)}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner; 