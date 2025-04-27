import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetails = ({ orderId }) => {
  const [orderItems, setOrderItems] = useState([]); // State to hold order items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch order items when the component mounts
    const fetchOrderItems = async () => {
      try {
        // Make API request to fetch order items based on the orderId
        const response = await axios.get(`/api/orders/${orderId}/items`);
        setOrderItems(response.data.orderItems); // Set the fetched items to state
      } catch (error) {
        setError("Failed to fetch order items"); // Set error message if request fails
      } finally {
        setLoading(false); // Set loading to false when the request completes
      }
    };

    fetchOrderItems(); // Call the fetch function
  }, [orderId]); // The effect depends on the orderId prop

  if (loading) {
    return <div>Loading order details...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error message if fetching fails
  }

  return (
    <div>
      <h2>Order Details</h2>
      <div>
        <h3>Order Items</h3>
        <ul>
          {orderItems.length > 0 ? (
            orderItems.map((item) => (
              <li key={item.id}>
                <strong>{item.menu.name}</strong>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </li>
            ))
          ) : (
            <p>No items in this order.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
