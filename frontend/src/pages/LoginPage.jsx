import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const Validation = (userInput) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let errors = {};
    if (!userInput.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(userInput.email)) {
      errors.email = "Email is invalid";
    }
    if (!userInput.password) {
      errors.password = "Password is required";
    } else if (userInput.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    }
    return errors;
  };

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    role: "USER", // Default value, can be "STAFF" or "CUSTOMER"
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const errors = Validation(userInput);
    setErrors(errors);

    // if (Object.keys(errors).length > 0) {
    //   toast.error("Error in form!");
    // } else {
    //   toast.success("Validation Passed!");
    // }

    return errors;
  }

  const login = async (e) => {
    e.preventDefault();
    const errors = handleSubmit(e);
    if (Object.keys(errors).length > 0) return;

    try {
      const endpoint =
        userInput.role === "STAFF"
          ? "http://localhost:3000/api/users/staff/login"
          : "http://localhost:3000/api/users/customer/login";

      const response = await axios.post(endpoint, userInput, {
        withCredentials: true, // Send cookies with the request
      });

      // Success - Show success toast message
      toast.success("Logged in successfully!");

      Cookies.set("token", response.data.token); // Save token in cookies

      if (userInput.role === "STAFF") {
        navigate("/staffhome");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col bg-white items-center text-black">
      <div className="card bg-white m-8 shrink-0 shadow-2xl w-[24rem]">
        <form className="card-body" onSubmit={login}>
          <button className="btn btn-sm btn-square btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h1 className="font-bold text-3xl text-black">Login to Food Mate</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Email</span>
            </label>
            <input
              name="email"
              type="email"
              required
              className="input input-bordered text-black bg-gray-200"
              placeholder="Username"
              value={userInput.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-black">Password</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="password"
              required
              className="input input-bordered bg-[#D9D9D9] text-black"
              value={userInput.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <label className="label">
              <a
                href="/forget-password"
                className="label-text-alt link link-hover text-black"
              >
                Forgot password?
              </a>
            </label>
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn border-[#FFD700] bg-[#bc0030] font-bold text-2xl text-white"
            >
              Login
            </button>
          </div>
          <div className="mt-4 text-black">
            Don't have an account?{" "}
            <span className="font-semibold ">
              <Link to="/signup" className="link-hover text-black">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
