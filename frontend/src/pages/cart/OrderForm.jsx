import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Payment from "../payment/Payment";

const OrderForm = ({ cartItems, totalAmount }) => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderType, setOrderType] = useState("DELIVERY");
  const [triggerEsewa, setTriggerEsewa] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const DELIVERY_CHARGE = 150;

  useEffect(() => {
    if (orderType === "DELIVERY") {
      fetchAddress();
    } else {
      setAddress("");
    }
  }, [orderType]);

  const fetchAddress = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized: Please log in.");
      const response = await axios.get(
        "http://localhost:5000/api/customer/address",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setAddress(response.data.address || "");
    } catch (err) {
      toast.error("Failed to fetch address.");
    }
  };

  const handlePlaceOrder = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Unauthorized: Please log in first.");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (orderType === "DELIVERY" && !address.trim()) {
      toast.error("Address is required for delivery.");
      return;
    }

    try {
      const finalAmount =
        totalAmount + (orderType === "DELIVERY" ? DELIVERY_CHARGE : 0);

      const orderData = {
        orderType,
        paymentMethod,
        address: orderType === "DELIVERY" ? address : null,
      };

      if (paymentMethod.toLowerCase() === "esewa") {
        const response = await axios.post(
          "http://localhost:5000/api/payment/initiate",
          {
            address,
            orderType,
            cartItems,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setPaymentData(response.data);
        setTriggerEsewa(true);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/orders/place",
          orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        toast.success("Order placed successfully!");

        // Clear the cart data from localStorage or state after placing the order
        localStorage.removeItem("cart"); // Clear from localStorage

        // Optionally reset cart state (if cartItems are in component state)
        // setCartItems([]); // If you have cartItems in the state, reset them

        if (
          paymentMethod.toLowerCase() === "esewa" &&
          response.data.paymentUrl
        ) {
          setPaymentUrl(response.data.paymentUrl);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error placing order.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Order Details</h3>

      <label className="block mb-2">Order Type</label>
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        className="w-full px-4 py-2 mb-4 border-2 bg-white text-black rounded-md"
      >
        <option value="DELIVERY">Delivery</option>
        <option value="PICKUP">Pickup</option>
      </select>

      {orderType === "DELIVERY" && (
        <>
          <label className="block mb-2">Delivery Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full px-4 py-2 mb-4 bg-white text-black border-2 rounded-md"
            required
          />
          <div className="text-lg font-semibold mb-4">
            Delivery Charge: Rs.{DELIVERY_CHARGE}
          </div>
        </>
      )}

      <label className="block mb-2">Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full px-4 py-2 mb-4 border-2 rounded-md text-black bg-white"
        required
      >
        <option value="">Select Payment Method</option>
        <option value="cash">Cash on Delivery</option>
        <option value="esewa">eSewa</option>
        {/* Add other payment methods as needed */}
      </select>

      <div className="text-xl font-semibold mb-4">
        Total: Rs.
        {totalAmount + (orderType === "DELIVERY" ? DELIVERY_CHARGE : 0)}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={
          !paymentMethod || (orderType === "DELIVERY" && !address.trim())
        }
        className={`w-full py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 border ${
          !paymentMethod || (orderType === "DELIVERY" && !address.trim())
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "border-[#FFD700] bg-[#bc0030] text-white hover:bg-[#a80028]"
        }`}
      >
        Place Order
      </button>

      {/* eSewa Payment Form */}
      {triggerEsewa && paymentData && (
        <div className="mt-8">
          <Payment paymentData={paymentData} />
        </div>
      )}
    </div>
  );
};

export default OrderForm;
