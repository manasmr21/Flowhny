import { useState, useEffect } from "react";
import apiStore from "../Store/apiStores";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { userData, verifyUser, resendVerificationCode, isVerified } =
    apiStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    return () => timer && clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (isVerified) {
      navigate("/login");
    }
  }, [isVerified, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      nextInput?.focus();
    }
  };

  //For OTP field
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      prevInput?.focus();
    }
  };

  //Send verification code
  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const code = otp.join("");
      const response = await verifyUser(userData.useremail, code);

      if (response.success) {
        alert(response.message);
        setOtp(["","","",""])
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //Resend verification code
  const handleResend = async () => {
    try {
      await resendVerificationCode(userData.useremail);
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Failed to resend code:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-themedark bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8  dark:bg-lighterthemedark p-5 rounded-xl shadow-2xl dark:shadow-black">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-themegreen">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We&apos;ve sent a verification code to {userData?.useremail}
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border-2 dark:border-white text-themegreen rounded-lg focus:border-themegreen"
              />
            ))}
          </div>
          <div>
            <button
            tabIndex={0}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-themegreen hover:scale-[103%] active:scale-[95%] transition"
              onClick={handleVerification}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  console.log("asdjkslmdkl")
                }
              }}
            >
              Verify Email
            </button>
          </div>
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm dark:text-gray-400 text-gray-600">
                Resend code in {timeLeft} seconds
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-themegreen cursor-pointer hover:scale-[105%] active:95% transition"
              >
                Resend verification code
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;
