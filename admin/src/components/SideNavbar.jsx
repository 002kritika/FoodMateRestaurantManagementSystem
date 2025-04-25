import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaList,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const SideNavbar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 fixed h-full z-50 shadow-lg">
      {/* Logo & Title */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-700">
        <span className="text-2xl font-bold">🍽️ Food-Mate</span>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-800 transition-all"
            >
              <FaTachometerAlt className="w-5 h-5" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add/menu"
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-800 transition-all"
            >
              <FaPlusCircle className="w-5 h-5" /> Add Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu/list"
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-800 transition-all"
            >
              <FaList className="w-5 h-5" /> Menu List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-800 transition-all"
            >
              <FaShoppingCart className="w-5 h-5" /> Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-800 transition-all"
            >
              <FaCog className="w-5 h-5" /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 w-full">
        <button className="flex items-center gap-3 w-full px-6 py-3 text-sm bg-red-600 hover:bg-red-700 transition-all">
          <FaSignOutAlt className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default SideNavbar;
