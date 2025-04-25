import { Route, Routes } from "react-router-dom";
import CustomerHome from "./pages/customer/CustomerHome";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import StaffHome from "./pages/staff/StaffHome";
import Aboutus from "./components/AboutUs";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgetPasswordPage";
import CustomerMenu from "./components/CustomerMenu";
import CartPage from "./pages/cart/CartPage";
import Profile from "./pages/customer/Profile";
import UserLayout from "./layouts/UserLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import OrderForm from "./pages/cart/OrderForm";
import CustomerOrderList from "./pages/cart/CustomerOrderList";
import Contact from "./components/Contact";
import Payment from "./pages/payment/payment";
import Failure from "./pages/payment/Failure";
import Success from "./pages/payment/Success";

export default function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public routes using the UserLayout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="aboutus" element={<Aboutus />} />
          <Route path="verify-email/:token" element={<EmailVerifyPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="forget-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Customer layout routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="menu" element={<CustomerMenu />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order" element={<OrderForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<Aboutus />} />
          <Route path="order-list" element={<CustomerOrderList />} />
          <Route path="contact" element={<Contact />} />
          <Route path="payment" element={<Payment />} />
          <Route path="payment/failure" element={<Failure />} />
          <Route path="payment/success" element={<Success />} />
        </Route>

        {/* Staff-only route */}
        <Route path="staffhome" element={<StaffHome />} />
      </Routes>
    </div>
  );
}
