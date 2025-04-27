import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AllReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Please log in first");
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.error) {
          setError(res.data.error);
        } else {
          setReservations(res.data.reservations);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reservations");
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Function to confirm the reservation
  const confirmReservation = async (reservationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return toast.error("Please log in first");
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/reservations/${reservationId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "Confirmed" }
            : reservation
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to confirm reservation");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        All Reservations
      </h2>

      {loading && (
        <p className="text-center text-blue-500 font-medium">
          Loading reservations...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <p className="text-center text-gray-500">No reservations found.</p>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Service
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr
                  key={reservation.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  } hover:bg-blue-50 transition-all duration-300`}
                >
                  <td className="py-3 px-4 text-sm">{reservation.service}</td>
                  <td className="py-3 px-4 text-sm">{reservation.date}</td>
                  <td className="py-3 px-4 text-sm">{reservation.time}</td>
                  <td className="py-3 px-4 text-sm">
                    {reservation.status === "Confirmed" ? (
                      <span className="text-green-600 font-semibold">
                        Confirmed
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {reservation.status === "Pending" && (
                      <button
                        onClick={() => confirmReservation(reservation.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReservationList;
