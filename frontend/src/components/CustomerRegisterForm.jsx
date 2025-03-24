import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function CustomerRegisterForm() {
  const Validation = (userInput) => {
    let errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const numberRegex = /^(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})$/;

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

    if (!userInput.name) {
      errors.name = "First Name is required";
    } else if (userInput.name.length < 3) {
      errors.tName = " Name must be more than 3 characters";
    }

    return errors;
  };
  const [userInput, setUserInput] = useState({
    email: "",
    name: "",
    password: "",
  });
  const handleBlur = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const [errors, setErrors] = useState({});
  const handleSignup = async (e) => {
    e.preventDefault();

    const validationErrors = Validation(userInput);
    setErrors(validationErrors);

    // If there are validation errors, do not proceed
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/customer/register",
        userInput
      );
      console.log("Response:", response);
      toast.success("Registration successful");
    } catch (error) {
      console.log("Error response:", error.response); // Log error response

      if (
        error.response &&
        error.response.data.message === "Email is already in use."
      ) {
        setErrors({ email: "Email is already in use." });
        toast.error("Email is already in use.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form className="card-body " onSubmit={handleSignup}>
      {/* <div className="text-2xl font-bold text-center text-black "> */}
      <h1 className="text-2xl font-bold text-center text-black ">
        Customer Register
      </h1>
      {/* </div> */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg> */}
        <input
          type="text"
          className="input input-bordered text-black bg-gray-200"
          placeholder="Username"
          required
          onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
          onBlur={handleBlur}
        />
        {errors.name && <span className="text-danger">{errors.name}</span>}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          className="input input-bordered text-black bg-gray-200"
          placeholder="abc@example.com"
          required
          onChange={(e) =>
            setUserInput({ ...userInput, email: e.target.value })
          }
          onBlur={handleBlur}
        />
        {errors.email && <span className="text-danger">{errors.email}</span>}
        {/* </label> */}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg> */}
        <input
          type="password"
          placeholder="password"
          required
          className="grow input input-bordered text-black bg-gray-200"
          onChange={(e) =>
            setUserInput({ ...userInput, password: e.target.value })
          }
          onBlur={handleBlur}
        />
        {errors.password && (
          <span className="text-danger">{errors.password}</span>
        )}
      </div>

      <div className="form-control mt-6">
        <button
          className="btn border-[#FFD700] bg-[#bc0030] font-bold text-2xl text-white "
          type="submit"
        >
          Register
        </button>
      </div>

      {/* <button className="btn btn-primary text-white" type="submit">
      Register
    </button> */}
      <div className="items-center">
        Already have an account?{" "}
        <span className="font-semibold ">
          <Link to="/login" className="link-hover text-black">
            Login
          </Link>
        </span>
      </div>
    </form>
  );
}
