/**
 * Login Page Component - Handles user authentication and login form
 * @author Thang Truong
 * @date 2025-01-09
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../components/Button";
import logoImage from "../assets/images/Logo.png";
import { FaLock, FaShieldAlt, FaSmile } from "react-icons/fa";

/**
 * Login component
 * @returns {JSX.Element} Login form page
 */
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Redirect to home if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle form submission
   * @param {Object} data - Form data (email, password)
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setLoginError("");
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        // Display inline error message instead of toast
        setLoginError(
          result.error || "Invalid email or password. Please try again."
        );
      }
    } catch (error) {
      // Display inline error message for network/server errors
      setLoginError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
      {/* Page shell */}
      <div className="max-w-5xl w-full mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Welcome panel */}
          <div className="hidden lg:block bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border border-gray-100">
            <p className="text-sm font-semibold text-blue-600 mb-2">
              Secure access
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Welcome back to your shop workspace
            </h1>
            <p className="text-gray-600 mb-6">
              Manage orders, track deliveries, and continue where you left off
              with a streamlined sign-in built for real retail operations.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600">
                  <FaLock />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Enterprise-grade security
                  </p>
                  <p className="text-sm text-gray-600">
                    Encrypted sessions and device-aware protection keep your
                    account safe.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600">
                  <FaShieldAlt />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Frictionless entry
                  </p>
                  <p className="text-sm text-gray-600">
                    Fast sign-in so you can process carts, vouchers, and
                    fulfillment quicker.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600">
                  <FaSmile />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Support that cares
                  </p>
                  <p className="text-sm text-gray-600">
                    Need help? Our team is here to get you back on track in
                    minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login form card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Logo section */}
            <div className="mb-6 text-center">
              <Link
                to="/"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src={logoImage}
                  alt="Ecommerce Store Logo"
                  className="h-20 w-auto object-contain mx-auto"
                />
              </Link>
            </div>

            {/* Header section */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  create a new account
                </Link>
              </p>
            </div>

            {/* Login form */}
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-4">
                {/* Email input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Work email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="text"
                    autoComplete="email"
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email || loginError
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register("password", {
                        required: "Password is required",
                      })}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`block w-full rounded-lg border px-3 py-2 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password || loginError
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={handleTogglePassword}
                      className="absolute inset-y-0 right-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login error message */}
                {loginError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-600">{loginError}</p>
                  </div>
                )}

                {/* Forgot password link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit + helper */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  loading={loading}
                  icon="login"
                  className="w-full"
                >
                  Sign in
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  By continuing you agree to our standard terms and understand
                  this workspace uses secure cookies.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
