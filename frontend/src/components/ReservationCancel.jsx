import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const ReservationCancel = ({
  reservationId,
  createdAt,
  status,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCancelable, setIsCancelable] = useState(false);

  // Check if the reservation can be canceled based on the time difference
  useEffect(() => {
    if (!createdAt) return;

    const now = new Date();
    const created = new Date(createdAt);
    const timeDiffMs = now - created;
    const twoHoursMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    // Only allow cancellation if within 2 hours of creation time
    setIsCancelable(timeDiffMs <= twoHoursMs);
  }, [createdAt]);

  const handleCancel = async () => {
    const token = Cookies.get("token");

    // Ensure user is logged in before attempting cancellation
    if (!token) {
      return toast.error("Please log in first");
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const res = await axios.put(
        `http://localhost:3000/api/reservations/${reservationId}/cancel`, // Updated endpoint for reservations
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSuccessMessage(res.data.message);
      toast.success(res.data.message);

      // Update the status in the parent component
      if (onStatusChange) {
        onStatusChange("Cancelled");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle missing reservation or missing createdAt date
  if (!reservationId || !createdAt) {
    return <p className="text-gray-500 italic">No reservation found</p>;
  }

  return (
    <div>
      {/* Display cancellation button only if the status is not already "Cancelled" and within 2 hours */}
      {status !== "Cancelled" && isCancelable ? (
        <button
          onClick={handleCancel}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            isCancelable
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Canceling..." : "Cancel Reservation"}
        </button>
      ) : (
        <p className="text-gray-500 mt-2">
          {status === "Cancelled"
            ? "This reservation has been canceled"
            : "You can only cancel reservations within 2 hours of booking."}
        </p>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default ReservationCancel;
