import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import addtocart from "../assets/addtocart.png";
import { useState } from "react";

export default function Navbar() {
  const [menu, setMenu] = useState("menu");
  return (
    <div className="navbar bg-white shadow-lg shadow-gray-700 relative z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} className=" text-black lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
              <a>Home</a>
            </li>
            <details>
              <summary>Menu</summary>
              <ul className="p-2">
                <li>
                  <a>Foods</a>
                </li>
                <li>
                  <a>Drinks</a>
                </li>
              </ul>
            </details>

            <li>
              <a>About Us</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
        <img src={logo} className="h-20 w-70" />
        {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
      </div>
      <div className="navbar-center hidden text-black lg:flex">
        <ul className="menu menu-horizontal text-xl font-bold px-4 gap-4">
          <li
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}
          >
            <Link to="/">Home</Link>
          </li>
          <li>
            <details>
              <summary>
                <Link to="/menu">Menu</Link>
              </summary>
              <ul className="p-2 bg-[#D9D9D9]">
                <li>
                  <a>Foods</a>
                </li>
                <li>
                  <a>Drinks</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link to="/aboutus">About Us</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <div className="relative">
          <img src={addtocart} alt="search" />

          <div className="absolute min-w-3 min-h-3 bg-[#bc0030] rounded-md top-[-8px] right-[-8px]"></div>
        </div>
        <Link to="/login">
          <button className="btn border-[#FFD700] bg-[#bc0030] text-white m-2">
            login
          </button>
        </Link>
      </div>
    </div>
  );
}
