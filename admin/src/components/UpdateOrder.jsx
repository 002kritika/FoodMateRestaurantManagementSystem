import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateOrders = ({ admin }) => {
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const updateStatus = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: statusUpdate[orderId] },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      toast.success("Order status updated!");
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  // Define the order status options
  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "PREPARED", label: "Prepared" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELED", label: "Canceled" },
    { value: "DELIVERED", label: "Delivered" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className="border p-4 mb-4 rounded-lg shadow-sm bg-white"
        >
          <p className="mb-2">
            <strong>Order #{order.id}</strong> - Status:{" "}
            <span className="font-semibold">{order.status}</span>
          </p>
          <div className="flex items-center gap-2">
            <select
              value={statusUpdate[order.id] || order.status}
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, [order.id]: e.target.value })
              }
              className="border p-2 rounded-md"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => updateStatus(order.id)}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdateOrders;
