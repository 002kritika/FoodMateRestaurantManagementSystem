import { useState } from "react";
import { Link } from "react-router-dom";
export default function LoginPage() {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/users/login", userInput)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(userInput);
  };

  return (
    <div className="w-full  flex flex-col bg-[#EFD6A9]  items-center">
      <div className="card bg-white m-8 shrink-0 shadow-2xl w-[24rem]">
        <form className="card-body" onSubmit={handleLogin}>
          <button className="btn btn-sm btn-square btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h1 className="font-bold text-3xl text-black">Login to Food Mate</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="abc@example.com"
              className="input input-bordered bg-[#D9D9D9]"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered bg-[#D9D9D9]"
              required
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          <div className="form-control mt-6">
            <button className="btn  bg-[#FFA500] font-bold text-2xl text-white">
              Login
            </button>
          </div>
          <div>
            Don't have an account?{" "}
            <span className="font-semibold ">
              <Link to="/signup" className="link-hover text-black">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
