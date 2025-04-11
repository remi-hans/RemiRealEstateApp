import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
          {property.forRent ? 'For Rent' : 'For Sale'}
        </div>
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-3 py-1 m-2 rounded-md text-sm">
          {property.type || 'Property'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
        <p className="text-gray-600 mb-2">{property.location}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-blue-600 font-bold text-lg">{property.price.toLocaleString()} CFA</p>
          {(property.bedrooms > 0 || property.bathrooms > 0 || property.size > 0) && (
            <p className="text-gray-500 text-sm">
              {property.bedrooms > 0 && `${property.bedrooms} bed${property.bedrooms !== 1 ? 's' : ''}`}
              {property.bedrooms > 0 && property.bathrooms > 0 && ' · '}
              {property.bathrooms > 0 && `${property.bathrooms} bath${property.bathrooms !== 1 ? 's' : ''}`}
              {(property.bedrooms > 0 || property.bathrooms > 0) && property.size > 0 && ' · '}
              {property.size > 0 && `${property.size} m²`}
            </p>
          )}
        </div>
        {property.description && (
          <p className="text-gray-500 text-sm line-clamp-2">{property.description}</p>
        )}
      </div>
    </div>
  );
};

export default PropertyCard; 