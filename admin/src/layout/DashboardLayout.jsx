import React from "react";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Side Navbar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 mt-16 ml-64">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
