import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import CancelOrder from "../../components/CancelOrder";

const CustomerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/customer",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
        console.error("Invalid response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">Rs.{order.totalAmount}</td>
                  <td className="px-4 py-2">{order.paymentMethod}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2">{order.orderType}</td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {order.orderType === "PICKUP" &&
                    order.status !== "CANCELED" ? (
                      <CancelOrder
                        order={order}
                        onCancelSuccess={fetchOrders}
                      />
                    ) : (
                      <span className="text-gray-500">Cannot Cancel</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrderList;
