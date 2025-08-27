import React, { useState } from "react";
import { Search, Menu, X, User, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                RentHub
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Browse
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Saved
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              List Property
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Help
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => navigate("/owner")}
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Owner</span>
            </button>
            <button
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => navigate("/admin")}
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Admin</span>
            </button>
            <button
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => navigate("/review/68a4c91b589d096e3be147d2")}
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">review</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Browse
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Saved
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              List Property
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Help
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
