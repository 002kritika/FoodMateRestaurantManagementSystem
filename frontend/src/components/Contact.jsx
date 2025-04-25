import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaMobileAlt,
} from "react-icons/fa";
import background from "../assets/background.jpg";

const Contact = () => {
  return (
    <div className="bg-[#f5f9fc] mb-6 ">
      <div className="w-full h-[380px] relative overflow-hidden">
        <img
          src={background}
          className="w-full h-full object-cover object-center opacity-50 absolute top-0 left-0"
          alt="Restaurant background"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">
            Contact us
          </h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-6 ">
        {/* Left Section - Info */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="bg-[#bc0030] text-white text-lg font-semibold text-center py-2 rounded-md mb-6">
            Get In Touch With Us Now!
          </h2>
          <div className="grid grid-cols-2 gap-6 text-gray-700">
            <div className="flex flex-col items-start">
              <FaPhoneAlt className="text-xl text-[#112D4E]" />
              <h4 className="font-semibold mt-2">Phone Number</h4>
              <p className="mt-1">+977 9874561230</p>
            </div>
            <div className="flex flex-col items-start">
              <FaEnvelope className="text-xl text-[#112D4E]" />
              <h4 className="font-semibold mt-2">Email</h4>
              <p className="mt-1 text-sm leading-snug">info@foodmate.com</p>
            </div>
            <div className="flex flex-col items-start">
              <FaMapMarkerAlt className="text-xl text-[#112D4E]" />
              <h4 className="font-semibold mt-2">Location</h4>
              <p className="mt-1 text-sm leading-snug">
                Pokhara LAkeside, Kaski, Province-4, Nepal
              </p>
            </div>
            <div className="flex flex-col items-start">
              <FaClock className="text-xl text-[#112D4E]" />
              <h4 className="font-semibold mt-2">Working Hours</h4>
              <p className="mt-1">
                Sun-Fri
                <br />
                09:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="bg-[#bc0030] text-white text-lg font-semibold text-center py-2 rounded-md mb-6 items-center">
            Contact Us
          </h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  placeholder="First Name *"
                  className="w-full outline-none bg-white"
                />
              </div>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full outline-none bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <FaMobileAlt className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Mobile No *"
                  className="w-full outline-none bg-white"
                />
              </div>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <FaEnvelope className="text-gray-500" />
                <input
                  type="email"
                  placeholder="Email ID *"
                  className="w-full outline-none bg-white"
                />
              </div>
            </div>
            <textarea
              rows="4"
              placeholder="Message"
              className="w-full border rounded-md px-3 py-2 outline-none bg-white"
            />

            <button
              type="submit"
              className="btn border-[#FFD700] bg-[#bc0030] text-white hover:bg-[#a80028] transition duration-300 flex items-center gap-2"
            >
              Submit <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
