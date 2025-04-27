import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import CancelOrder from "../../components/CancelOrder";

const CustomerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getDisplayTotal = (order) => {
    if (order.orderType === "PICKUP") {
      return (order.totalAmount - (order.deliveryCharge || 0)).toFixed(2);
    }
    return order.totalAmount.toFixed(2);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 mt-4">
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
                  <td className="px-4 py-2">{`ORD-${order.id
                    .toString()
                    .padStart(3, "0")}`}</td>
                  <td className="px-4 py-2">Rs.{getDisplayTotal(order)}</td>
                  <td className="px-4 py-2">{order.paymentMethod}</td>
                  <td className="px-4 py-2 capitalize">{order.status}</td>
                  <td className="px-4 py-2">{order.orderType}</td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    {order.orderType === "PICKUP" &&
                    order.status !== "CANCELLED" ? (
                      <CancelOrder
                        order={order}
                        onCancelSuccess={fetchOrders}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Cannot Cancel
                      </span>
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

      {/* Modal for Order Details */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Details
            </h2>

            <div className="space-y-4">
              <div>
                <strong>Order ID:</strong> ORD-
                {selectedOrder.id.toString().padStart(3, "0")}
              </div>
              <div>
                <strong>Status:</strong> {selectedOrder.status}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Updated:</strong>{" "}
                {new Date(selectedOrder.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc list-inside mt-2">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.menu?.name || "Item"} x {item.quantity} – Rs.
                    {(item.menu?.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 font-semibold text-xl text-gray-800">
              Total: Rs.{getDisplayTotal(selectedOrder)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderList;
