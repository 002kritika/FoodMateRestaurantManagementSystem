import { Link } from "react-router-dom";
import background from "../assets/background.jpg";

export default function Hero() {
  return (
    <div className="hero h-fit relative">
      {/* Transparent Background Image */}
      <img
        src={background}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ opacity: 0.8 }}
        alt="Restaurant background"
      />

      {/* Content Overlay */}
      <div className="flex flex-col items-center hero-content text-center relative w-3/4 h-3/4 gap-4 p-8">
        <h1 className="mb-5 text-5xl font-extrabold text-white drop-shadow-md">
          Food Mate Restaurant
        </h1>

        <h2 className="text-3xl text-[#FFD700] font-bold drop-shadow-sm">
          Fresh, Quality Food
        </h2>

        <p className="font-medium w-1/2 text-lg text-white leading-relaxed drop-shadow-sm">
          A multi-cuisine restaurant in the heart of Pokhara offering your taste
          buds special flavors of food in a pleasant surrounding.
        </p>
        <div className="flex gap-3">
          <Link to="/customer/menu">
            <button className="btn border-[#FFD700] bg-[#bc0030] text-white hover:bg-[#a80028] transition duration-300 flex items-center gap-2">
              View Menu
            </button>
          </Link>
          <Link to="/customer/reserve">
            <button className="btn border-[#FFD700] bg-[#bc0030] text-white hover:bg-[#a80028] transition duration-300 flex items-center gap-2">
              Book table
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
