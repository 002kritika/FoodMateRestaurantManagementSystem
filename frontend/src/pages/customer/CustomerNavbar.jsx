import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import Dropdown from "../../components/Dropdown";

export default function CustomerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/customer" },
    { label: "Menu", path: "/customer/menu" },
    { label: "About Us", path: "/customer/about" },
    { label: "Contact", path: "/customer/contact" },
  ];

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Fetch cart item count
      axios
        .get("http://localhost:5000/api/cart/count", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setCartCount(res.data.count || 0))
        .catch((err) => console.error("Cart count error", err));

      // Fetch user profile name
      axios
        .get("http://localhost:3000/api/users/profile/basic", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setUserName(res.data.name || "User"))
        .catch((err) => console.error("User fetch error", err));
    }
  }, []);

  return (
    <div className="navbar bg-white shadow-lg shadow-gray-700 fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-2">
      {/* Left: Logo & Hamburger */}
      <div className="navbar-start flex items-center">
        <div
          tabIndex={0}
          className="text-black lg:hidden cursor-pointer mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </div>
        <Link to="/">
          <img src={logo} className="h-16 w-auto" alt="Logo" />
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-4 gap-6 text-lg font-semibold text-black">
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={`hover:text-[#bc0030] transition duration-300 ${
                location.pathname === link.path
                  ? "border-b-2 border-[#bc0030]"
                  : ""
              }`}
            >
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Cart + Profile */}
      <div className="navbar-end gap-6 items-center pr-2">
        <Link
          to="/customer/cart"
          className="relative text-black hover:text-[#bc0030]"
        >
          <FiShoppingCart size={26} />
          {cartCount > 0 && (
            <div className="absolute top-[-6px] right-[-6px] bg-[#bc0030] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </div>
          )}
        </Link>

        {/* <Link
          to=""
          className="flex items-center gap-2 text-black hover:text-[#bc0030]"
        > */}
        <div className="flex items-center gap-2 text-black">
          <div className="hidden sm:block max-w-[100px] truncate font-medium text-sm text-black">
            {userName}
          </div>
          <Dropdown />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-[#D9D9D9] text-black rounded-box mt-3 w-52 p-2 shadow absolute left-4 top-[64px]"
        >
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="hover:bg-[#bc0030] hover:text-white rounded-md px-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
