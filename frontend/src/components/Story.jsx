import { Link } from "react-router-dom";
import storyphoto from "../assets/story.png";

export default function Story() {
  return (
    <div className="max-h-screen w-full flex bg-white">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col border-2 border-black bg-gradient-to-b from-[#FFD700] via-[#FFFACD] to-[#FFA500] justify-center p-6 m-8 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
        <h1 className="font-semibold text-3xl text-[#8B0000] mb-4 uppercase border-b-4 border-[#FF4500] w-fit transition-colors duration-300 hover:text-[#FF6347]">
          Our Story
        </h1>

        <h2 className="font-bold text-5xl text-[#B22222] mb-6">
          Welcome to FoodMate Restaurant
        </h2>
        <p className="text-[#4B0082] text-lg leading-relaxed">
          At Food Mate, we take pride in crafting fresh, flavorful dishes that
          reflect our passion for food and hospitality. Nestled in the heart of
          Pokhara, our restaurant offers a warm and inviting space where guests
          can enjoy hearty breakfasts, satisfying lunches, and unforgettable
          dinners. Every dish is thoughtfully prepared using the finest
          ingredients, blending tradition and creativity to provide a dining
          experience that is both comforting and exciting.
        </p>
        <p className="text-[#4B0082] text-lg leading-relaxed mt-4">
          We opened Food Mate to create a place where exceptional food and
          outstanding service come together. Our dedicated team is committed to
          ensuring every guest feels valued and at home, whether you're stopping
          by for a quiet meal or a festive gathering. At Food Mate, we believe
          great food has the power to bring people together, and we can’t wait
          to share our passion with you.
        </p>

        <Link to="/aboutus">
          <button className="btn border-[#FFD700] bg-[#FF4500] text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-[#FFA07A] hover:scale-110">
            Explore more
          </button>
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-6 bg-white  rounded-lg shadow-lg">
        <img
          src={storyphoto}
          alt="story"
          className="w-full h-full object-cover border-2 border-[#FFD700] rounded-md shadow-lg transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
}
