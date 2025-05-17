import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import adminApis from "../../components/Store/adminApi";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-lighterthemedark p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-gray-300">Admin Login</h2>

        <div className="mb-6">
          <label htmlFor="adminMail" className="block mb-2 text-sm font-medium dark:text-gray-300">
            Admin Mail:
          </label>
          <input
            type="email"
            name="adminMail"
            id="adminMail"
            className="w-full p-3 border border-themegreen rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen dark:bg-lighterthemedark dark:text-gray-300"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6 relative">
          <label htmlFor="adminPassword" className="block mb-2 text-sm font-medium dark:text-gray-300">
            Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="adminPassword"
            id="adminPassword"
            className="w-full p-3 border border-themegreen rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen dark:bg-lighterthemedark dark:text-gray-300 pr-10"
            placeholder="Enter your password"
          />
          <span
            className="absolute top-11 right-4 text-xl text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
          </span>
        </div>

        <button className="w-full bg-themegreen hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-300">
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
