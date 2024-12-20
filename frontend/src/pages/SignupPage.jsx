import Tab from "../components/Tab";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex justify-center bg-[#EFD6A9] p-8">
      <div className="card  w-[24rem] shrink-0 shadow-2xl bg-white ">
        <button className="btn btn-sm btn-square btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <Tab />
      </div>
    </div>
  );
}
