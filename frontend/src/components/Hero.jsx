import { Link } from "react-router-dom";
import background from "../assets/background.jpg";

export default function Hero() {
  return (
    <div
      className="hero h-fit"
      // style={{
      //   backgroundImage: "url(background.jpg))",
      // }}
    >
      <img src={background} className="hero min-h-screen" />
      {/* <div className="hero-overlay bg-opacity-50"></div> */}
      <div className="flex flex-col items-center hero-content text-black text-center hero-overlay bg-opacity-25 w-3/4 h-3/4 gap-4">
        <h1 className="mb-5 text-4xl font-extrabold text-white">
          Food Mate Restaurnt
        </h1>

        <h2 className="text-3xl text-white font-bold"> Fresh, Quality Food</h2>

        <p className="mb-5 w-1/4 text-xl text-white  ">
          A multi cuisine restaurant in heart of Pokhara offering your taste
          buds special flavours of food in pleasant surrounding
        </p>

        <button className="btn border-[#EFD6A9] bg-[#EFD6A9] text-black hover:bg-[#FFA500]  m-2 ">
          <Link to="/menu"> View Menu</Link>
        </button>
      </div>
    </div>
  );
}
