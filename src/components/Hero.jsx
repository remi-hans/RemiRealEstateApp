import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="relative bg-gray-900 h-[600px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/wallpaper.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Your Dream Home in Douala
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            Discover the perfect property in Cameroon's economic capital
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-4xl font-bold text-white">10+</div>
              <div className="mt-2 text-gray-300">Properties Listed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-4xl font-bold text-white">5</div>
              <div className="mt-2 text-gray-300">Happy Clients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="text-4xl font-bold text-white">2</div>
              <div className="mt-2 text-gray-300">Agents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero; 