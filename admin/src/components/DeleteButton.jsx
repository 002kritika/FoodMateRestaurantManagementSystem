import React from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const DeleteButton = ({ id, onSuccess, setError }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess(); // Refresh the menu list
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete menu item.");
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
      <FaTrash size={20} />
    </button>
  );
};

export default DeleteButton;
