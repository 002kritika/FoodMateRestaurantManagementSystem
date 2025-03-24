import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/reset-password/${token}`,
        { newPassword: password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/jobseeker/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="mx-auto h-3/4 p-10 flex justify-center items-center">
      <div class="font-[sans-serif] items-center p-6 w-1/3 mx-auto  bg-[#F2F0EF] rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] ">
        <form class="w-full" onSubmit={{ handleResetPassword }}>
          <div class="mb-3 text-center">
            <h3 class="text-[#252525] lg:text-3xl text-2xl font-extrabold max-md:text-center">
              Reset Password
            </h3>
          </div>

          <div>
            <label class="text-gray-800 text-sm font-semibold block mb-2">
              New Password
            </label>
            <div class="relative flex items-center">
              <input
                class="w-full bg-transparent text-sm text-gray-800 border-2 focus:border-[#BAA898] pl-4 pr-12 py-3.5 outline-none rounded-xl"
                placeholder="Enter your new Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                class="w-4 h-4 absolute right-4 cursor-pointer"
                viewBox="0 0 128 128"
              >
                <path
                  d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                  data-original="#000000"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-6">
            <button
              type="submit"
              class="w-full shadow-xl font-extrabold py-3 px-4 text-base tracking-wide rounded-xl bg-[#606060] hover:bg-[#2B2B2B] text-white border focus:outline-none transition-all"
            >
              Save the Password
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
