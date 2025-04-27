import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import Header from "../components/Header"; // <-- Import the Header

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navbar */}
      <SideNavbar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        {/* <Header /> */}

        {/* Page Content */}
        <div className=" flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
