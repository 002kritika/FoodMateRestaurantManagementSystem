import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/menu");
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items.");
    }
  };

  const addToCart = async (menuId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("You must be logged in to add items to the cart.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { menuId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Our Menu</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              {item.imageUrl && (
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <h2 className="text-lg font-bold mt-2">{item.name}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <p className="text-lg font-semibold mt-2">${item.price}</p>
              <button
                onClick={() => addToCart(item.id)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerMenu;
