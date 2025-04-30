import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";

const TopMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/menu/top"
        );
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

  const addToCart = (id) => {
    console.log(`Add to cart: ${id}`);
  };

  const addToWishlist = (id) => {
    setWishlist((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  return (
    <div className="bg-white py-10 px-4">
      <h2 className="text-3xl text-red-700 font-bold text-center mb-8">
        ❤️ Top Picks for You
      </h2>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="overflow-x-auto"
      >
        <div className="flex gap-6 min-w-full w-max">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="min-w-[250px] bg-white rounded-lg shadow-md p-4 text-black border hover:shadow-lg transition"
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

              <h2 className="text-lg font-bold mt-2">{item.name}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <p className="text-lg font-semibold mt-2 text-red-600">
                Rs.{item.price}
              </p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Add to Cart
                </button>

                {wishlist.has(item.id) ? (
                  <AiFillHeart
                    className="text-red-500 cursor-pointer ml-3 text-2xl"
                    onClick={() => addToWishlist(item.id)}
                  />
                ) : (
                  <AiOutlineHeart
                    className="text-gray-600 cursor-pointer ml-3 text-2xl"
                    onClick={() => addToWishlist(item.id)}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TopMenu;
