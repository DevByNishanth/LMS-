import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import loginBg from "../assets/loginBg.svg";
import { useNavigate, useLocation } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  //   router
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, []);

  // old submit function 
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(`${apiUrl}api/auth/login`, {
  //       email,
  //       password,
  //     });
  //     navigate("/dashboard");
  //     // ✅ You can store token in localStorage if backend returns it
  //     localStorage.setItem("LmsToken", response.data.token);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     alert(
  //       error.response?.data?.message ||
  //       "Invalid credentials. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // new submit function 
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(`${apiUrl}api/auth/login`, {
      email,
      password,
    });

    // store token FIRST
    localStorage.setItem("LmsToken", response.data.token);

    // smart redirect
    const redirectTo = location.state?.redirectTo || "/dashboard";
    navigate(redirectTo, { replace: true });

  } catch (error) {
    console.error("Login error:", error);
    alert(
      error.response?.data?.message ||
      "Invalid credentials. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="w-full h-[100vh] p-4 md:flex justify-between">
      {/* Left side image */}
      <div className=" hidden md:block md:w-[62%] h-full">
        <img
          src={loginBg}
          alt="Login Background"
          className="h-full object-cover w-full rounded-[24px]"
        />
      </div>

      {/* Right side login form */}
      <div className=" w-[100%] md:w-[38%] relative flex gap-12 justify-between bg-white h-full px-4">
        <div className="w-full">
          {/* Top signup link */}
          {/* <div className="flex justify-end w-full">
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm">
                Don’t have an account?{" "}
                <button className="text-[#0B56A4] font-medium hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          </div> */}

          {/* Login form */}
          <div className="bg-white rounded-xl w-full p-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <h2 className="text-2xl font-medium text-center mb-2">
              Sign in to <span className="text-[#0B56A4]">LMS</span>
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Welcome to LMS, please enter your login details below to use the
              app.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />
              </div>

              {/* Password Input with toggle */}
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-[#0B56A4]"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.8} />
                  ) : (
                    <Eye size={20} strokeWidth={1.8} />
                  )}
                </button>
              </div>

              {/* Forgot password */}
              <div className="text-center mb-6">
                <button
                  type="button"
                  className="text-sm text-[#0B56A4] hover:underline"
                >
                  Forgot the password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-[#0b55a4b4]" : "bg-[#0B56A4]"
                  } hover:bg-[#0b55a4e1] text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
