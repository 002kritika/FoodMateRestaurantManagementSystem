import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EmailVerifyPage() {
  const { token } = useParams(); // Capture token from the URL
  const [verificationStatus, setVerificationStatus] = useState(null); // For status messages
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Function to handle email verification
    const verifyEmail = async () => {
      try {
        // Send GET request to the backend with the token
        const response = await axios.get(
          `http://localhost:5000/api/users/verify-email/${token}`
        );
        console.log("Token being sent:", token);
        if (response.status === 200) {
          // Success message
          setVerificationStatus("Your email has been verified successfully!");
          setTimeout(() => {
            navigate("/login"); // Redirect to login page after successful verification
          }, 2000); // Delay before redirecting
        }
      } catch (error) {
        // Handle different error cases
        if (error.response) {
          const message = error.response.data.message;
          if (message === "user already verified.") {
            setVerificationStatus("User already verified.");
          } else if (message === "Invalid or expired token.") {
            setVerificationStatus("Invalid or expired token.");
          } else {
            setVerificationStatus("An unexpected error occurred.");
          }
        } else {
          setVerificationStatus("Unable to connect to the server.");
        }
      }
    };

    // Call the verification function
    verifyEmail();
  }, [token, navigate]); // Runs whenever the token or navigate changes

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold text-center">Email Verification</h2>
        <p className="text-gray-700 mt-4 text-center">
          {verificationStatus || "Verifying your email... Please wait."}
        </p>
      </div>
    </div>
  );
}
