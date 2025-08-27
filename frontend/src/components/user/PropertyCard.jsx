import React, { useState } from "react";
import { Heart, MapPin, Home, Bath, Ruler, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(property.isLiked || false);

  const navigate = useNavigate();

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleLikeToggle}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            isLiked
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
        <div className="absolute top-4 left-4">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Available
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm block">/month</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-3">
          <div className="flex items-center">
            <Home className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {property.bedrooms} bed
            </span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {property.bathrooms} bath
            </span>
          </div>
          <div className="flex items-center">
            <Ruler className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">{property.area} sqft</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        </div>
        <button
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
          onClick={() => navigate("/test/689c7733c986d7f18b0c7cc9")}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
