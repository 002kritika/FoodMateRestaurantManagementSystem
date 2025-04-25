import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut, FiClipboard } from "react-icons/fi";
import Cookies from "js-cookie";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center bg-gray-200 cursor-pointer"
      >
        <FiUser size={18} />
      </div>

      {isOpen && (
        <ul className="absolute right-0 top-10 w-40 bg-white rounded-md shadow-md z-50">
          <li>
            <Link
              to="/customer/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FiUser /> Profile
            </Link>
          </li>
          <li>
            <Link
              to="/customer/order-list"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FiClipboard /> Orders
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
            >
              <FiLogOut /> Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
