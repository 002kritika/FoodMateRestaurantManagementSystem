import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navbar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
