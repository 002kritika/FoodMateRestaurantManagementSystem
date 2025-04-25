// components/Header.jsx
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

// You can also pull this from process.env.REACT_APP_RESTAURANT_NAME
const RESTAURANT_NAME = "Food Mate Restaurant Dashboard";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // tick every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white shadow m-4 p-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{RESTAURANT_NAME}</h1>
        <p className="text-sm text-gray-600">
          {currentTime.toLocaleDateString()}{" "}
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="flex items-center text-sm text-gray-700 gap-2">
        <FaUser className="text-xl text-gray-500" />
        <span>
          Role: <strong className="font-medium">Admin</strong>
        </span>
      </div>
    </header>
  );
};

export default Header;
