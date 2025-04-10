import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const OrderForm = ({ cartItems, totalAmount }) => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderType, setOrderType] = useState("DELIVERY");
  const DELIVERY_CHARGE = 150;

  useEffect(() => {
    if (orderType === "DELIVERY") {
      fetchAddress();
    } else {
      setAddress(""); // Clear address for pickup
    }
  }, [orderType]);

  const fetchAddress = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized: Please log in first.");

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

      const response = await axios.post(
        "http://localhost:5000/api/orders/place",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Order placed successfully!");
      // Optionally reset cart or redirect user here
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error placing order.";
      toast.error(errorMessage);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized: Please log in first.");

      await axios.put(
        "http://localhost:5000/api/customer/address/update",
        { address },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Address updated successfully");
    } catch (err) {
      toast.error("Failed to update address");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Order Details</h3>

      <label className="block mb-2">Order Type</label>
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md"
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
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
          <button
            onClick={handleSaveAddress}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Save Address
          </button>
          <div className="text-lg font-semibold mb-4">
            Delivery Charge: ${DELIVERY_CHARGE}
          </div>
        </>
      )}

      <label className="block mb-2">Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md"
        required
      >
        <option value="">Select Payment Method</option>
        <option value="CASH">Cash on Delivery</option>
        <option value="CARD">Credit/Debit Card</option>
      </select>

      <div className="text-xl font-semibold mb-4">
        Total: ${totalAmount + (orderType === "DELIVERY" ? DELIVERY_CHARGE : 0)}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={
          !paymentMethod || (orderType === "DELIVERY" && !address.trim())
        }
        className={`w-full py-2 rounded-md ${
          !paymentMethod || (orderType === "DELIVERY" && !address.trim())
            ? "bg-gray-400"
            : "bg-green-600"
        } text-white hover:bg-green-700`}
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderForm;
