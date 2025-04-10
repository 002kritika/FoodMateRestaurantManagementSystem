import { Link } from "react-router-dom";
import { FiLogIn, FiShoppingCart } from "react-icons/fi";
import logo from "../assets/logo.png";
import { useState } from "react";

export default function Navbar() {
  const [menu, setMenu] = useState("menu");

  return (
    <div className="navbar bg-white shadow-lg shadow-gray-700 relative z-10 px-4 py-2">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} className="text-black lg:hidden cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#D9D9D9] text-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link
                to="/"
                className="hover:bg-[#bc0030] hover:text-white rounded-md px-2"
              >
                Home
              </Link>
            </li>
            <details>
              <summary className="hover:bg-[#bc0030] hover:text-white rounded-md px-2">
                Menu
              </summary>
              <ul className="p-2 bg-white rounded-md">
                <li>
                  <Link to="/menu/foods" className="hover:text-[#bc0030]">
                    Foods
                  </Link>
                </li>
                <li>
                  <Link to="/menu/drinks" className="hover:text-[#bc0030]">
                    Drinks
                  </Link>
                </li>
              </ul>
            </details>
            <li>
              <Link
                to="/aboutus"
                className="hover:bg-[#bc0030] hover:text-white rounded-md px-2"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:bg-[#bc0030] hover:text-white rounded-md px-2"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/">
          <img src={logo} className="h-16 w-auto ml-2" alt="Logo" />
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-4 gap-6 text-xl font-semibold text-black">
          <li
            onClick={() => setMenu("home")}
            className={`hover:text-[#bc0030] transition duration-300 ${
              menu === "home" ? "border-b-2 border-[#bc0030]" : ""
            }`}
          >
            <Link to="/">Home</Link>
          </li>
          <li>
            <details>
              <summary className="hover:text-[#bc0030] transition duration-300">
                <Link to="/menu">Menu</Link>
              </summary>
              <ul className="p-2 bg-white shadow rounded-md">
                <li>
                  <Link to="/menu/foods" className="hover:text-[#bc0030]">
                    Foods
                  </Link>
                </li>
                <li>
                  <Link to="/menu/drinks" className="hover:text-[#bc0030]">
                    Drinks
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link
              to="/aboutus"
              className="hover:text-[#bc0030] transition duration-300"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-[#bc0030] transition duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Cart and Login */}
      <div className="navbar-end gap-4 items-center pr-2">
        <Link to="/cart" className="relative text-black hover:text-[#bc0030]">
          <FiShoppingCart size={28} />
          <div className="absolute top-[-6px] right-[-6px] bg-[#bc0030] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {/* You can make this dynamic later */}
          </div>
        </Link>
        <Link to="/signup">
          <button className="btn border-[#FFD700] bg-[#bc0030] text-white hover:bg-[#a80028] transition duration-300 flex items-center gap-2">
            <FiLogIn size={20} />
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
