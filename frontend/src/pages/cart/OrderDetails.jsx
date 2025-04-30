import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetails = ({ orderId }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order with items and payment details
        const response = await axios.get(
          `http://localhost:3000/api/orders/${orderId}`
        );
        const order = response.data.order;
        const allItems = order.orderItems || [];

        // Filter items created within the last 24 hours
        const filteredItems = allItems.filter((item) => {
          const createdAt = new Date(item.createdAt);
          const now = new Date();
          const timeDifference = now - createdAt;
          return timeDifference <= 24 * 60 * 60 * 1000;
        });

        setOrderItems(filteredItems);
        setPaymentMethod(order.paymentMethod || "Unknown");
        setTotalAmount(order.totalAmount || 0);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getPaymentStatus = (paymentMethod) => {
    if (paymentMethod === "cash") return "Unpaid";
    if (paymentMethod === "esewa") return "Paid";
    return "Unknown";
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>

      {/* Payment Details */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Payment Info</h3>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <p>
          <strong>Payment Status:</strong> {getPaymentStatus(paymentMethod)}
        </p>
        <p>
          <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Order Items */}
      <div>
        <h3>Order Items (Last 24 Hours)</h3>
        <ul>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <li key={item.id}>
                <strong>{item.menu.name}</strong>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rs.{item.price.toFixed(2)}</p>
                <p>Ordered At: {new Date(item.createdAt).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>No recent items in this order.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
