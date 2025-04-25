import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import background from "../assets/menubg.jpg";

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    if (selectedCategory === "ALL") {
      fetchMenuItems();
    } else {
      fetchMenuItemsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/menu");
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items.");
    }
  };

  const fetchMenuItemsByCategory = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/menu?category=${category}`
      );
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items by category:", err);
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

      await axios.post(
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

  const addToWishlist = async (menuId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("You must be logged in to add items to the wishlist.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/wishlist/add",
        { menuId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Item added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Failed to add item to wishlist"
      );
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background Image Banner */}
      <div className="w-full h-[380px] relative overflow-hidden">
        <img
          src={background}
          className="w-full h-full object-cover object-center opacity-90 absolute top-0 left-0"
          alt="Restaurant background"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">
            Our Menu
          </h1>
          <div className="w-full max-w-md px-4 relative">
            <FiSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Display error if any */}
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {/* Category Filter */}
      <div className="flex ml-10 mt-6 h-15">
        {["ALL", "APPETIZER", "MAIN_COURSE", "DESSERT", "BEVERAGE"].map(
          (category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 mx-2 text-black font-medium rounded cursor-pointer transition duration-200 ${
                selectedCategory === category
                  ? "border-b-2 border-blue-500"
                  : "hover:underline"
              }`}
            >
              {category.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mt-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            {item.imageUrl && (
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            <h2 className="text-lg font-bold mt-2 flex items-center gap-1">
              {item.name}
            </h2>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <p className="text-lg font-semibold mt-2">Rs.{item.price}</p>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(item.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 w-full justify-center"
            >
              <FiShoppingCart /> Add to Cart
            </button>

            {/* Add to Wishlist */}
            <button
              onClick={() => addToWishlist(item.id)}
              className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 flex items-center gap-2 w-full justify-center"
            >
              <AiOutlineHeart /> Add to Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMenu;
