import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaShoppingCart } from "react-icons/fa";

const CustomerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        {/* <img src="logo" className="" /> */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          FoodMate
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link to="/menu" className="text-gray-700 hover:text-gray-900">
            Menu
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-gray-900">
            Orders
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <FaShoppingCart className="text-gray-700 w-6 h-6 hover:text-gray-900" />
          </Link>
          <Link to="/profile">
            <FaUserCircle className="text-gray-700 w-7 h-7 hover:text-gray-900" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-gray-900">
              Menu
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-gray-900">
              Orders
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <FaShoppingCart className="w-5 h-5" /> Cart
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <FaUserCircle className="w-6 h-6" /> Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;
