import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrders = ({ admin }) => {
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
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>
            Order #{order.id} - Status: {order.status}
          </p>
          <select
            value={statusUpdate[order.id] || order.status}
            onChange={(e) =>
              setStatusUpdate({ ...statusUpdate, [order.id]: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={() => updateStatus(order.id)}>Update</button>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
