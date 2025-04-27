import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddMenu from "./components/AddMenu";
import MenuList from "./components/MenuList";
import DashboardLayout from "./layout/DashboardLayout";
import OrderList from "./components/OrderList";
import MenuManagement from "./pages/Menumanagement";
import Userlist from "./components/UserList";
import OrderManagement from "./pages/OrderManagement";
import AllReservationList from "./components/AllReservationList";

export default function App() {
  return (
    <Routes>
      {/* Redirect to /login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/add/menu" element={<AddMenu />} />
        <Route path="/menu/list" element={<MenuList />} />
        <Route path="/orders/list" element={<OrderList />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/users" element={<Userlist />} />
        <Route path="/reserve" element={<AllReservationList />} />
      </Route>
    </Routes>
  );
}
