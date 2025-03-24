import React from "react";
import DashboardLayout from "../layout/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-600">
          This is the admin dashboard. You can manage your application from
          here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
