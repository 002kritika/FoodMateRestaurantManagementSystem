import React from "react";
import { Link } from "react-router-dom";

const SideNavbar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 fixed h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              Menu Management
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm hover:bg-gray-700"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideNavbar;
