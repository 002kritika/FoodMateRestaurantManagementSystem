import React, { useEffect, useState } from "react";
import axios from "axios";

const TopMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/menu/top"
        );
        console.log("Menu data:", response.data);
        setMenuItems(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Top Picks for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.name}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = "/default-food.png")} // fallback image
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="text-blue-600 font-bold text-lg">
                ₹{item.price?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMenu;
