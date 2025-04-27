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
    <header className="bg-gray-100 shadow-md m-4 p-6 flex justify-between items-center rounded-lg">
      <div>
        <h1 className="text-2xl font-extrabold text-blue-800">
          {RESTAURANT_NAME}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {currentTime.toLocaleDateString()}{" "}
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all">
          <FaUser className="text-lg" />
        </div>
        <div className="text-gray-700">
          <span className="text-gray-500">Role:</span>{" "}
          <strong className="text-blue-700">Admin</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
