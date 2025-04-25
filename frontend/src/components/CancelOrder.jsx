import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const CancelOrder = ({ order, onCancelSuccess }) => {
  const handleCancel = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Unauthorized. Please log in again.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/orders/cancel/${order.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Order canceled successfully.");
        onCancelSuccess(); // Re-fetch the orders to update the list
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Cancel Order
    </button>
  );
};

export default CancelOrder;
