import React from "react";
import { motion } from "framer-motion";
import storyphoto from "../assets/story.png";

const AboutUs = () => {
  return (
    <div className="relative py-16 px-4 sm:px-8 lg:px-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/story.png')" }}
      />
      <div className="absolute inset-0 bg-white" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto text-black">
        {/* Left Text Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 space-y-6"
        >
          <p className="text-red-400 italic text-sm sm:text-base tracking-wider uppercase">
            About our team
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Who We Are
          </h2>
          <p className="text-base leading-relaxed text-black">
            "Strong fringes lie at the gateway of great expression. Requesting
            effort becomes smoother. Anyone who wants, receives value in
            elegance, in the essence of purpose. Fine touches form an elite
            harmony, drawn from subtle movements. We embrace challenges
            confidently with effective strategy. Right at the start, we prepare
            carefully with balance and support at every stage."
          </p>

          {/* Progress Bars */}
          <div className="space-y-5 pt-4">
            <ProgressBar label="Food Quality" percentage={100} />
            <ProgressBar label="Delivery Time" percentage={90} />
            <ProgressBar label="Client Satisfaction" percentage={96} />
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-10 md:mt-0 w-full"
        >
          <img
            src={storyphoto}
            alt="Chef tasting food"
            className="rounded-2xl shadow-2xl w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, percentage }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-black font-semibold text-sm sm:text-base">
        <span className="text-red-500">✔</span>
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-black/20 rounded-full h-3">
        <motion.div
          className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </div>
  );
};

export default AboutUs;
