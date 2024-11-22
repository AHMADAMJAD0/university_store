import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

// Mocked user data, or replace this with the actual data if needed
import users from "../data/userData"; 

const LoginPage = ({ onLogin, toggleMode }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Used for navigation

  // Handle form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Email validation regex
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    let isValid = true;
    let errors = { email: "", password: "" };
  
    // Email validation
    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
  
    // Password validation
    if (!formData.password) {
      errors.password = "Password cannot be empty.";
      isValid = false;
    }
  
    setErrorMessages(errors);

    // If the form is valid, proceed with login
    if (isValid) {
      // Check if user data exists in localStorage
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      
      if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
        // If valid, log in the user and navigate
        onLogin(storedUser);
        navigate(`/profile/${storedUser.email}`);
      } else {
        // Search the user in mocked user data (in case it's not in localStorage)
        const user = users.find(
          (user) => user.email === formData.email && user.password === formData.password
        );

        if (user) {
          // Store user data in localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          onLogin(user);
          navigate(`/profile/${user.email}`);
        } else {
          alert("Invalid email or password!"); // Handle failed login
        }
      }
    }
  };

  return (
    <div className="form-container flex justify-center items-center bg-gray-50 p-4">
      <div className="form-content w-3/4 sm:w-3/4 md:w-3/4 lg:w-3/4 p-8 pt-5 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessages.email && <p className="text-red-500 text-sm mt-1">{errorMessages.email}</p>}
          </div>

          {/* Password Input */}
          <div className="form-group mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="password-wrapper relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="password-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </span>
            </div>
            {errorMessages.password && <p className="text-red-500 text-sm mt-1">{errorMessages.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
