// pages/Failure.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed!</h1>
      <p className="mb-4">
        There was an error processing your payment. Please try again.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Failure;
