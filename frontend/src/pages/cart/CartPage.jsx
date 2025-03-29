import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirect user if session expires

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      // Debug: Check if token is available
      console.log("Token received:", token);

      if (!token) {
        console.error("No token found. Redirecting to login.");
        throw new Error("Unauthorized: Please log in first.");
      }

      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCartItems(response.data);
    } catch (err) {
      console.error("Fetch Cart Error:", err.response?.data || err.message);
      setError(err.response?.data || "Failed to fetch cart");
      toast.error(err.response?.data || err.message);

      // If session expired, clear token & redirect
      if (err.response?.status === 401) {
        Cookies.remove("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      const token = Cookies.get("token");

      // Debug: Check token before making request
      console.log("Token for remove request:", token);

      if (!token) {
        console.error("No token found. Cannot remove item.");
        throw new Error("Unauthorized: Please log in first.");
      }

      await axios.delete(
        `http://localhost:5000/api/cart/remove/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Item removed from cart!");
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error("Remove Cart Error:", err.response?.data || err.message);
      toast.error(err.response?.data || "Error removing item.");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="bg-white p-4 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center mb-3"
            >
              <span>
                {item.menu.name} - {item.quantity}x
              </span>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
