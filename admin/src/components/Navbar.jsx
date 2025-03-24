import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
              Admin Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            {/* User Profile */}
            <div className="ml-4 flex items-center">
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <span className="text-gray-700">Admin</span>
                  <svg
                    className="w-4 h-4 ml-2 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
