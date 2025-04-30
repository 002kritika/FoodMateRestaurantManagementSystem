import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomerNavbar from "../pages/customer/CustomerNavbar";

export default function CustomerLayout() {
  return (
    <>
      <CustomerNavbar />
      <div className="pt-20 bg-slate-50">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
