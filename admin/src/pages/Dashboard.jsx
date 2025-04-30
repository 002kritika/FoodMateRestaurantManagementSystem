import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [dailyOrders, setDailyOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [customerMap, setCustomerMap] = useState([]);
  const [newActivity, setNewActivity] = useState({
    newUsers: [],
    newOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [resSummary, resDaily, resMonthly, resCustomerMap, resActivity] =
        await Promise.all([
          axiosInstance.get("/admin/dashboard/summary"),
          axiosInstance.get("/admin/dashboard/orders/daily"),
          axiosInstance.get("/admin/dashboard/revenue/monthly"),
          axiosInstance.get("/admin/dashboard/customers/map"),
          axiosInstance.get("/admin/dashboard/new-activity"),
        ]);

      setSummary(resSummary.data);
      setDailyOrders(resDaily.data);
      setMonthlyRevenue(resMonthly.data);
      setCustomerMap(resCustomerMap.data);
      setNewActivity(resActivity.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center p-4 text-blue-500">
        Loading data, please wait...
      </p>
    );
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Dashboard
      </h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Orders", value: summary.totalOrders },
          { label: "Total Users", value: summary.totalUsers },
          { label: "Total Menu", value: summary.totalMenu },
          { label: "Total Revenue", value: `Rs.${summary.totalRevenue}` },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-gray-500">{item.label}</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {item.value || 0}
            </p>
          </div>
        ))}
      </div>

      {/* New Users Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">New Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left text-blue-700 border-b">Name</th>
                <th className="p-3 text-left text-blue-700 border-b">Email</th>
                <th className="p-3 text-left text-blue-700 border-b">Joined</th>
              </tr>
            </thead>
            <tbody>
              {newActivity.newUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Orders Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          New Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left text-blue-700 border-b">
                  Order ID
                </th>
                <th className="p-3 text-left text-blue-700 border-b">
                  Customer
                </th>
                <th className="p-3 text-left text-blue-700 border-b">Amount</th>
                <th className="p-3 text-left text-blue-700 border-b">Status</th>
                <th className="p-3 text-left text-blue-700 border-b">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {newActivity.newOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3 border-b">{order.id}</td>
                  <td className="p-3 border-b">{order.user?.name || "-"}</td>
                  <td className="p-3 border-b">Rs.{order.totalAmount}</td>
                  <td className="p-3 border-b">{order.status}</td>
                  <td className="p-3 border-b">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Orders This Week
          </h2>
          <LineChart width={500} height={250} data={dailyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" />
          </LineChart>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Customer Regions
          </h2>
          <BarChart width={500} height={250} data={customerMap}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#60A5FA" />
          </BarChart>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Monthly Revenue Comparison
        </h2>
        <LineChart width={1000} height={300} data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue2024" stroke="#3B82F6" />
          <Line type="monotone" dataKey="revenue2025" stroke="#60A5FA" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;
