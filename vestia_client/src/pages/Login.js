import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Add useNavigate hook

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "test" && password === "test") {
      // Save fake user data to localStorage
      localStorage.setItem("token", "12345");
      localStorage.setItem("userId", "1");
      
      // Redirect to the home page after successful login
      navigate("/home");
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleSignUp = () => {
    navigate("/register"); // Navigate to the Register page
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background with angle */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00]" />
        <div
          className="absolute bottom-0 left-0 bg-white"
          style={{
            width: "150%",
            height: "200%",
            transform: "rotate(-25deg) translateY(60%)",
            transformOrigin: "bottom",
          }}
        />
      </div>

      {/* Form Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Log in to your account
          </p>
          <form className="mt-6" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-gray-800"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-gray-800"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
            >
              Log In
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <button
              onClick={handleSignUp}
              className="mt-2 text-indigo-500 hover:underline"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Vestia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
