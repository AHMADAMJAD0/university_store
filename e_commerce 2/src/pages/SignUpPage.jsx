import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"; // For password toggle
import { GoogleLogin } from "@react-oauth/google";
import * as jwt_decode from "jwt-decode"; // Decode Google credentials
import users from "../data/userData"; // Mocked user data

export const SignUpPage = ({ onSignUp }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   let isValid = true;
  //   let errors = { name: "", email: "", password: "" };

  //   if (!validateName(formData.name)) {
  //     errors.name = "Name must only contain alphabets and spaces.";
  //     isValid = false;
  //   }

  //   if (!validateEmail(formData.email)) {
  //     errors.email = "Please enter a valid email address.";
  //     isValid = false;
  //   }

  //   if (!validatePassword(formData.password)) {
  //     errors.password = "Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number.";
  //     isValid = false;
  //   }

  //   setErrorMessages(errors);

  //   if (isValid) {
  //     const userExists = users.find((user) => user.email === formData.email);
  //     if (userExists) {
  //       alert("User already exists!");
  //     } else {
  //       users.push(formData);
  //       console.log("User added:", formData);
  //       onSignUp(formData);
  //     }
  //   }
  // };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    let isValid = true;
    let errors = { name: "", email: "", password: "" };
  
    if (!validateName(formData.name)) {
      errors.name = "Name must only contain alphabets and spaces.";
      isValid = false;
    }
  
    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
  
    if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number.";
      isValid = false;
    }
  
    setErrorMessages(errors);
  
    if (isValid) {
      const userExists = users.find((user) => user.email === formData.email);
      if (userExists) {
        alert("User already exists!");
      } else {
        users.push(formData);
        // Store new user data in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(formData));
        onSignUp(formData);
        alert("Sign Up Successful!");
        navigate(`/profile/${formData.email}`);
      }
    }
  };
  
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name) && name.length > 0;

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    const userExists = users.find((user) => user.email === decoded.email);

    if (userExists) {
      alert("Sign-In Successful!");
      onSignUp(userExists);
    } else {
      users.push({ name: decoded.name, email: decoded.email, password: "" });
      onSignUp({ name: decoded.name, email: decoded.email, password: "" });
    }
  };

  const handleGoogleFailure = () => {
    alert("Google Sign-In Failed. Please try again.");
  };

  return (
    <div className=" flex justify-center items-center h-full bg-gray-50 w-3/4">
      <div className="w-3/4 sm:w-3/4 md:w-3/4 lg:w-3/4 p-8 pt-5 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm mb-2 ml-3 font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errorMessages.name && <p className="text-red-500 text-xs">{errorMessages.name}</p>}
          </div>

          <div className="mb-2">
            <label htmlFor="email" className="block text-sm mb-2 ml-3 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errorMessages.email && <p className="text-red-500 text-xs">{errorMessages.email}</p>}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-sm mb-2 ml-3 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
              </span>
            </div>
            {errorMessages.password && <p className="text-red-500 text-xs">{errorMessages.password}</p>}
          </div>

          <button
            className="w-full bg-blue-500 text-white py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-5 text-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap />
        </div>
      </div>
    </div>
  );
};
