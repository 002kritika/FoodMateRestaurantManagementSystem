import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Card from "../components/Card";
import CardContent from "../components/CardContent";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [dailyOrders, setDailyOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [customerMap, setCustomerMap] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    async function fetchData() {
      try {
        const [resSummary, resDaily, resMonthly, resCustomerMap] =
          await Promise.all([
            axios.get("/api/dashboard/summary"),
            axios.get("/api/dashboard/orders/daily"),
            axios.get("/api/dashboard/revenue/monthly"),
            axios.get("/api/dashboard/customers/map"),
          ]);
        setSummary(resSummary.data);
        setDailyOrders(resDaily.data);
        setMonthlyRevenue(resMonthly.data);
        setCustomerMap(resCustomerMap.data);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p>Total Orders</p>
            <p className="text-xl font-bold">{summary.totalOrders || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p>Total Delivered</p>
            <p className="text-xl font-bold">{summary.totalDelivered || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p>Total Canceled</p>
            <p className="text-xl font-bold">{summary.totalCanceled || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p>Total Revenue</p>
            <p className="text-xl font-bold">${summary.totalRevenue || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="font-semibold">Order Stats</p>
            <PieChart width={200} height={200}>
              <Pie
                data={[{ name: "Orders", value: summary.totalOrders || 0 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                <Cell fill={COLORS[0]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Customer Growth</p>
            <PieChart width={200} height={200}>
              <Pie
                data={[
                  { name: "Customers", value: summary.customerGrowth || 0 },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                <Cell fill={COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Revenue Share</p>
            <PieChart width={200} height={200}>
              <Pie
                data={[{ name: "Revenue", value: summary.revenueShare || 0 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                <Cell fill={COLORS[2]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      {/* Line & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="font-semibold">Orders This Week</p>
            <LineChart width={500} height={250} data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold">Customer Map</p>
            <BarChart width={500} height={250} data={customerMap}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Chart */}
      <Card>
        <CardContent>
          <p className="font-semibold">Monthly Revenue Comparison</p>
          <LineChart width={1000} height={300} data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue2024" stroke="#8884d8" />
            <Line type="monotone" dataKey="revenue2025" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  );
}
