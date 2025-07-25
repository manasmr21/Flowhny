import { useState } from "react";
import apiStore from "../Store/apiStores";

const ForgotPassword = () => {
  const [useremail, setUserEmail] = useState("");
  const { sendResetPasswordRoute } = apiStore();

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleSendingEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await sendResetPasswordRoute(useremail);

      if(response.success) alert(response.message);

    } catch (error) {
      console.error(error.message || "Error sending email");
    }
  }


  return (
    <>
      <div className="m-auto flex justify-center items-center h-[100dvh] w-full">
        <form
          action=""
          className="dark:bg-lighterthemedark  rounded-md py-15 px-3 scroll-px-10  w-[90%] md:w-[75%] lg:w-[35%] shadow-xl"
        >
          <div className="">
            <label
              htmlFor="useremail"
              className="block dark:text-white text-themegreen font-semibold"
            >
              Enter your email
            </label>
            <input
              type="email"
              name="useremail"
              onChange={handleEmailChange}
              className="border dark:text-white text-themegreen border-themegreen p-2 rounded w-full mt-5"
            />
          </div>
          <button className="text-center w-full mt-5 hover:scale-[98%] cursor-pointer transition border border-themegreen bg-themegreen rounded p-2 text-white"
            onClick={handleSendingEmail}
          >
            Send Email
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
