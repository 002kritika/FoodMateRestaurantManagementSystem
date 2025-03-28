import Login from "./pages/Login";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import MenuManagement from "./pages/MenuManagement";
import Dashboard from "./pages/Dashboard";
import AddMenu from "./components/AddMenu";
import MenuList from "./components/MenuList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />{" "}
      {/* Redirect to /login */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/menu" element={<MenuManagement />} />
      <Route path="/add/menu" element={<AddMenu />} />
      <Route path="/menu/list" element={<MenuList />} />
    </Routes>
  );
}
