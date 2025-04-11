import { HomeIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const properties = [
  {
    id: 1,
    title: 'Modern Villa in Bonanjo',
    price: '75,000 FCFA',
    location: 'Bonanjo, Douala',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: '450 m²',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  },
  {
    id: 2,
    title: 'Luxury Apartment in Akwa',
    price: '45,000 FCFA',
    location: 'Akwa, Douala',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: '200 m²',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 3,
    title: 'Family Home in Bonapriso',
    price: '65,000 FCFA',
    location: 'Bonapriso, Douala',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: '350 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1475&q=80',
  },
  {
    id: 4,
    title: 'Spacious Villa in Bonaberi',
    price: '85,000 FCFA',
    location: 'Bonaberi, Douala',
    type: 'Villa',
    bedrooms: 6,
    bathrooms: 4,
    area: '500 m²',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  }
];

function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {property.type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-5 w-5 mr-2" />
          {property.location}
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
          {property.price}
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-500">Bedrooms</div>
              <div className="font-semibold">{property.bedrooms}</div>
            </div>
            <div>
              <div className="text-gray-500">Bathrooms</div>
              <div className="font-semibold">{property.bathrooms}</div>
            </div>
            <div>
              <div className="text-gray-500">Area</div>
              <div className="font-semibold">{property.area}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProperties() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our hand-picked properties in prime locations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties; 