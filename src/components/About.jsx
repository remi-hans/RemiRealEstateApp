import { CheckCircleIcon } from '@heroicons/react/24/solid';

function About() {
  const features = [
    'Expert local knowledge of Douala real estate market',
    'Professional and transparent service',
    'Wide range of properties in prime locations',
    'Personalized property search assistance',
    'Competitive market prices',
    'Dedicated customer support',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          <div className="relative">
            <img
              src="/public/profile_image.jpeg"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white p-8 rounded-lg hidden lg:block">
              <div className="text-4xl font-bold">1+</div>
              <div className="mt-2">Years of Experience</div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              About Remi Real Estate
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              We are the leading real estate agency in Douala, committed to helping you
              find your perfect property. With over 1 years of experience, we understand
              the local market and provide exceptional service to our clients.
            </p>
            <div className="mt-8">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About; 