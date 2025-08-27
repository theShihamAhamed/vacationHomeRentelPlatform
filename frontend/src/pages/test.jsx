import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHomeStore } from "../stores/useHomeStore";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMap } from "../../provider/GoogleMapsProvider";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Home,
  Bath,
  Ruler,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const PropertyDetail = ({ onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (home?.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (home?.images?.length || 1)) % (home?.images?.length || 1)
    );
  };

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const { id } = useParams();
  const { getHomeById, loading, error } = useHomeStore();
  const [home, setHome] = useState(null);
  const { isLoaded } = useMap();

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHomeById(id);
        setHome(data);
      } catch (err) {
        console.error("Failed to fetch home:", err.message);
      }
    };

    fetchHome();
  }, [id, getHomeById]);

  if (loading) return <p>Loading home details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!home) return <p>No home found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to listings</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={home.images[currentImageIndex]}
                  alt={home.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => openGallery(currentImageIndex)}
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {home.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="grid grid-cols-6 gap-2">
                  {home.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => openGallery(index)}
                      className={`relative rounded-lg overflow-hidden aspect-square ${
                        index === currentImageIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity duration-200"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {home.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{home.location.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ${home.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per night</div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {home.bedrooms}
                  </div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {home.bathrooms}
                  </div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Ruler className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {home.floorArea}
                  </div>
                  <div className="text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {home.floors}
                  </div>
                  <div className="text-gray-600">Floors</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Features & Amenities
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {home.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {home.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Map and Contact */}
          <div className="space-y-6">
            {/* Google Maps */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Location</h3>
              </div>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{
                    lat: home.location.latitude,
                    lng: home.location.longitude,
                  }}
                  zoom={14}
                >
                  <Marker
                    position={{
                      lat: home.location.latitude,
                      lng: home.location.longitude,
                    }}
                  />
                </GoogleMap>
              ) : (
                <p>Loading map...</p>
              )}
              <div className="p-4 border-t border-gray-100 text-center">
                <a
                  href={`https://www.google.com/maps?q=${home.location.latitude},${home.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Property Manager
              </h3>
              <div className="space-y-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  onClick={() => navigate("/book-home/68a4a5e378a4252b74d85dcc")}
                >
                  Book Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Send Message
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="relative max-w-4xl max-h-full">
            <img
              src={home.images[currentImageIndex]}
              alt={home.title}
              className="max-w-full max-h-full object-contain"
            />

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {home.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
