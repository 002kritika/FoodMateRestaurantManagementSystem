import React from "react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Unauthorized</h1>
        <p className="text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
