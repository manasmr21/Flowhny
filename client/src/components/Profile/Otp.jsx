import { useState, useEffect } from "react";
import apiStore from "../Store/apiStores";
import PropTypes from 'prop-types';

const Otp = ({ newMail, setShowOTPField }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);


  const { handleVerification} = apiStore()

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    return () => timer && clearInterval(timer);
  }, [timeLeft]);

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

  const changeEmail = async () => {
    try {
      const response = await handleVerification(newMail, otp.join(""))  

      if (response.success) {
        setShowOTPField(false)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#00000051] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white  dark:bg-lighterthemedark p-5 rounded-xl shadow-2xl dark:shadow-black">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-themegreen">
              Verify your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              We&apos;ve sent a verification code to {newMail}
            </p>
          </div>
          <div className="mt-8 space-y-6">
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-themegreen hover:scale-[103%] active:scale-[95%] transition"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    changeEmail();
                  }
                }}
                onClick={changeEmail}
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
                  className="text-themegreen cursor-pointer hover:scale-[105%] active:95% transition"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  
};

Otp.propTypes = {
  newMail: PropTypes.string.isRequired,
  setShowOTPField: PropTypes.bool.isRequired
}

export default Otp;
