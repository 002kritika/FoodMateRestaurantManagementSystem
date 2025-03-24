import CustomerRegisterForm from "./CustomerRegisterForm";
import StaffRegisterForm from "./StaffRegisterForm";

export default function Tab() {
  return (
    // <div className="bg-base-200 min-h-screen flex items-center flex-col">
    <div role="tablist" className="tabs tabs-lifted w-[24rem] h-[15rem]  ">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab font-semibold  bg-[#bc0030] "
        aria-label="Staff"
      />
      <div role="tabpanel" className="tab-content rounded-box p-4 ">
        <StaffRegisterForm />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab  bg-[#bc0030]"
        aria-label="Customer"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content rounded-box p-4">
        <CustomerRegisterForm />
      </div>

      {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" />
  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
    Tab content 3
  </div> */}
    </div>
    //</div>
  );
}
