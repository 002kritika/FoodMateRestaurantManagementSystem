import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomerNavbar from "../pages/customer/CustomerNavbar";

export default function UserLayout() {
  return (
    <>
      <CustomerNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
