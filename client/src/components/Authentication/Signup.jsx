import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import apiStore from '../Store/apiStores';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    useremail: '',
    password: '',
    cpassword: ''
  });
  const [errors, setErrors] = useState({});
  const {registerUser} = apiStore()

  const getUserData = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!formData.username.trim()) {
      newErrors.username = 'Full name is required';
    }

    // Email validation
    if (!formData.useremail) {
      newErrors.useremail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.useremail)) {
      newErrors.useremail = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.cpassword) {
      newErrors.cpassword = 'Please confirm your password';
    } else if (formData.password !== formData.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {

      registerUser(formData)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-themedark">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg dark:bg-lighterthemedark">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-themegreen">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-themegreen hover:text-green-700">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div>
            <label htmlFor="username" className="block text-sm dark:text-white font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={getUserData}
                className={`appearance-none block w-full pl-10 pr-3 dark:text-white py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="useremail" className="block text-sm dark:text-white font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="useremail"
                name="useremail"
                type="email"
                value={formData.useremail}
                onChange={getUserData}
                className={`appearance-none block w-full pl-10 pr-3 dark:text-white py-2 border ${
                  errors.useremail ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent`}
                placeholder="Enter your email"
              />
            </div>
            {errors.useremail && (
              <p className="mt-1 text-sm text-red-500">{errors.useremail}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm dark:text-white font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={getUserData}
                className={`appearance-none block w-full pl-10 pr-10 py-2 dark:text-white border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent`}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="cpassword" className="block text-sm dark:text-white font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="cpassword"
                name="cpassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.cpassword}
                onChange={getUserData}
                className={`appearance-none block w-full pl-10 dark:text-white pr-10 py-2 border ${
                  errors.cpassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.cpassword && (
              <p className="mt-1 text-sm text-red-500">{errors.cpassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-themegreen focus:ring-themegreen border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 dark:text-white block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-themegreen hover:text-green-700">
                Terms and Conditions
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className=" cursor-pointer active:scale-[95%] group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-themegreen hover:bg-green-700 focus:outline-none  transition duration-200"
              
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Social Signup Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-lighterthemedark dark:text-gray-300 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid items-center">
            <button
              type="button"
              className="w-full items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 flex "
            >
                <FcGoogle/>
              <span className='px-2'>Google</span>

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;