// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(response.data);
      } catch (error) {
        setError("Failed to fetch stats. Please try again.");
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: ["Today", "This Week", "This Month", "This Year"],
    datasets: [
      {
        label: "Revenue",
        data: stats
          ? [
              stats.stats.day.revenue,
              stats.stats.week.revenue,
              stats.stats.month.revenue,
              stats.stats.year.revenue,
            ]
          : [0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Dashboard
      </h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : stats ? (
        <div className="space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Users
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Orders
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Revenue
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue}
              </p>
            </div>
          </div>

          {/* Recently Added Users */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recently Added Users
            </h2>
            <ul className="space-y-4">
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {user.createdAt}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No recently added users.</p>
              )}
            </ul>
          </div>

          {/* Recently Added Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recently Added Orders
            </h2>
            <ul className="space-y-4">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        User: {order.user}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">${order.total}</p>
                      <p className="text-xs text-gray-400">{order.createdAt}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No recently added orders.</p>
              )}
            </ul>
          </div>

          {/* Revenue Overview Chart */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Revenue Overview
            </h2>
            <div className="w-full h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading stats...</p>
      )}
    </div>
  );
};

export default DashboardPage;
