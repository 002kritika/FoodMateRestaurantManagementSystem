import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
      case "PENDING":
        return "bg-blue-500 text-white";
      case "PREPARING":
        return "bg-yellow-400 text-black";
      case "DELIVERED":
        return "bg-green-500 text-white";
      case "COMPLETED":
        return "bg-indigo-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getCustomerName = (order) => order.user?.name || "Guest";

  const filteredOrders = orders.filter((order) => {
    return (
      getCustomerName(order).toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search)
    );
  });

  const summary = {
    new: orders.filter((o) => o.status === "PENDING").length,
    preparing: orders.filter((o) => o.status === "PREPARING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    totalSales: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-6">
        <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-blue-600 rounded-full"></span>
        Loading Orders...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Order Management
      </h1>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "New Orders",
            count: summary.new,
            desc: "Waiting to be processed",
          },
          {
            label: "Preparing",
            count: summary.preparing,
            desc: "Currently in kitchen",
          },
          {
            label: "Delivered",
            count: summary.delivered,
            desc: "Successfully delivered",
          },
          {
            label: "Total Sales",
            count: `Rs.${summary.totalSales.toFixed(2)}`,
            desc: "Today's revenue",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-6 border rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              {card.label}
            </h2>
            <p className="text-3xl font-bold text-gray-900">{card.count}</p>
            <span className="text-gray-500 text-sm">{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="border p-3 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded-md w-full md:w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option>All Orders</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Completed</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr className="text-left text-blue-700">
              {[
                "Order ID",
                "Customer",
                "Items",
                "Status",
                "Time",
                "Total",
                "Update Status",
                "Actions",
              ].map((head, idx) => (
                <th key={idx} className="p-4 font-semibold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .filter((o) =>
                filter === "All Orders"
                  ? true
                  : o.status.toUpperCase() === filter.toUpperCase()
              )
              .map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-blue-50 transition-all"
                >
                  <td className="p-4">{`ORD-${order.id
                    .toString()
                    .padStart(3, "0")}`}</td>
                  <td className="p-4">{getCustomerName(order)}</td>
                  <td className="p-4">{order.items?.length} item(s)</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={18} />{" "}
                    {formatDistanceToNow(new Date(order.createdAt))} ago
                  </td>
                  <td className="p-4 font-semibold">
                    Rs.{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {[
                        "PENDING",
                        "PREPARING",
                        "COMPLETED",
                        "CANCELLED",
                        "DELIVERED",
                      ].map((status, idx) => (
                        <option key={idx} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      className="border border-blue-500 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-50 transition-all"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Order Details
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <strong>Order ID:</strong> ORD-
                {selectedOrder.id.toString().padStart(3, "0")}
              </div>
              <div>
                <strong>Customer:</strong> {getCustomerName(selectedOrder)}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
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
              <ul className="list-disc list-inside mt-2 text-gray-600">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.menu?.name || "Item"} x {item.quantity} – Rs.
                    {(item.menu?.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 font-bold text-xl text-blue-700">
              Total: Rs.{selectedOrder.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
