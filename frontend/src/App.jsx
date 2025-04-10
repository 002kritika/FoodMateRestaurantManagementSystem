import { Route, Routes } from "react-router-dom";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerLayout from "./layouts/CustomerLayout";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import StaffHome from "./pages/staff/StaffHome";
import Aboutus from "./components/AboutUs";
import Menu from "./components/Menu";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgetPasswordPage";
import CustomerMenu from "./components/CustomerMenu";
import CartPage from "./pages/cart/CartPage";
import CustomerProfile from "./pages/customer/CustomerProfile";
import Profile from "./pages/customer/Profile";
// import Checkout from "./pages/placeorder/CHeckout";

export default function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/staffhome" element={<StaffHome />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/aboutus" element={<Aboutus />} />

          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="/verify-email/:token" element={<EmailVerifyPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/customer/profile" element={<Profile />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
        </Route>
      </Routes>
    </div>
  );
}
