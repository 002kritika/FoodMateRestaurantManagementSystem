import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaBoxOpen,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";

const SideNavbar = () => {
  return (
    <aside className="bg-gray-100 text-blue-900 w-64 fixed h-full z-50 shadow-xl transition-transform transform">
      {/* Logo & Title */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-300">
        <span className="text-2xl font-extrabold tracking-wide text-blue-700">
          Food-Mate
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaHome className="w-5 h-5" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaUtensils className="w-5 h-5" /> Menu Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaBoxOpen className="w-5 h-5" /> Orders Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reserve"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaBoxOpen className="w-5 h-5" /> Appointment Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaUsers className="w-5 h-5" /> Users Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-6 py-3 text-sm rounded-lg transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaCogs className="w-5 h-5" /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 w-full px-6">
        <Link to="/login">
          <button className="flex items-center gap-3 w-full px-6 py-3 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <FaSignOutAlt className="w-5 h-5" /> Logout
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default SideNavbar;
