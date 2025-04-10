import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddMenu from "./components/AddMenu";
import MenuList from "./components/MenuList";
import DashboardLayout from "./layout/DashboardLayout";
import OrderList from "./components/OrderList";

export default function App() {
  return (
    <Routes>
      {/* Redirect to /login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add/menu" element={<AddMenu />} />
        <Route path="/menu/list" element={<MenuList />} />
        <Route path="/orders" element={<OrderList />} />
      </Route>
    </Routes>
  );
}
