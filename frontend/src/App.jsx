import { Route, Routes } from "react-router-dom";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerLayout from "./layouts/CustomerLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}
