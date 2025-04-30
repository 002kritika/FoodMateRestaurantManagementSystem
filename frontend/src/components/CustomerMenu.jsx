import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Import heart icons
import background from "../assets/menubg.jpg";

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Price Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Price Sort State
  const [sortOrder, setSortOrder] = useState(""); // "" | "lowToHigh" | "highToLow"

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Wishlist state
  const [wishlist, setWishlist] = useState(new Set());

  const fetchMenuItems = async () => {
    try {
      let url = "http://localhost:5000/api/users/menu";
      if (selectedCategory !== "ALL") {
        url += `?category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items.");
    }
  };

  useEffect(() => {
    fetchMenuItems();
    setCurrentPage(1);
  }, [selectedCategory]);

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

      // Add to wishlist in the database (if not already added)
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

      // Update local state for wishlist (toggle between added and not added)
      setWishlist((prevWishlist) => {
        const newWishlist = new Set(prevWishlist);
        if (newWishlist.has(menuId)) {
          newWishlist.delete(menuId); // Remove from wishlist
        } else {
          newWishlist.add(menuId); // Add to wishlist
        }
        return newWishlist;
      });

      toast.success("Item added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Failed to add item to wishlist"
      );
    }
  };

  // ✨ Filter menu items based on search and price filter
  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMinPrice = minPrice === "" || item.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || item.price <= Number(maxPrice);
      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 relative text-black">
      {/* Background Banner */}
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
              className="w-full pl-12 pr-4 py-2 text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}

      <div className="justify-between flex mr-6 flex-wrap">
        {/* Category Filter */}
        <div className="flex ml-10 mt-6 space-x-4 flex-wrap">
          {["ALL", "APPETIZER", "MAIN_COURSE", "DESSERT", "BEVERAGE"].map(
            (category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative px-4 py-2 text-sm sm:text-base font-semibold rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {category.replace("_", " ")}
              </button>
            )
          )}
        </div>

        {/* 🔥 Price Filter + Sort */}
        <div className="flex justify-center items-center mt-6 flex-wrap">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by Price</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mt-8">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 text-black transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100"
          >
            <div className="relative">
              {item.imageUrl && (
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            <h2 className="text-lg font-bold mt-2 flex items-center gap-1">
              {item.name}
            </h2>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <p className="text-lg font-semibold mt-2">Rs.{item.price}</p>

            {/* Buttons and Wishlist Icon */}
            <div className="flex items-center justify-between mt-4">
              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(item.id)}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingCart /> Add to Cart
              </button>

              {/* Wishlist Icon */}
              {wishlist.has(item.id) ? (
                <AiFillHeart
                  className="text-red-500 cursor-pointer ml-4 text-2xl"
                  onClick={() => addToWishlist(item.id)}
                />
              ) : (
                <AiOutlineHeart
                  className="text-gray-600 cursor-pointer ml-4 text-2xl"
                  onClick={() => addToWishlist(item.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center my-8 gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
