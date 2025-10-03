import {useState} from "react"
import apiStore from "../Store/apiStores";
import { useParams, useNavigate } from "react-router";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const {resetPassword} = apiStore()
  const resetPasswordRoute = useParams();
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword(newPassword, resetPasswordRoute.resetPasswordRoute);

      if(response.success){
        alert("Password reset successfully");
        navigate("/");
      }

    } catch (error) {
      console.log(error.message || "Error reseting password");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-themedark text-gray-200 p-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md dark:bg-lighterthemedark rounded-2xl p-8 shadow-xl dark:border-none border border-themegreen"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-themegreen">
          Reset Password
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-themegreen mb-1" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border dark:border-white border-black rounded focus:outline-none focus:border-2 focus:border-themegreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-themegreen text-sm mb-1" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border dark:border-white border-black rounded focus:outline-none focus:border-2 focus:border-themegreen"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 rounded bg-themegreen text-white hover:scale-[98%] cursor-pointer transition-all duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
