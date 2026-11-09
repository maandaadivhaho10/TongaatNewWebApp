
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // STEP 1: REQUEST OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email: email.trim().toLowerCase() }
      );

      setMessage(response.data.message);
      setStep(2);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit OTP sent to your email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          email: email.trim().toLowerCase(),
          otp,
          newPassword
        }
      );

      setMessage(response.data.message);

      // Return to login after successful reset
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA] px-4">

      <div className="w-full max-w-md bg-white border border-neutral-200 p-6 sm:p-8 shadow-sm">

        <div className="text-center mb-6">

          <img
            src="/Tongaat-Huletts-Logo.png"
            alt="Tongaat Hulett"
            className="w-44 mx-auto mb-6"
          />

          <h1 className="text-2xl font-bold text-[#201E64]">
            {step === 1 ? "Forgot Password?" : "Reset Your Password"}
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            {step === 1
              ? "Enter your email address to receive a password reset OTP."
              : "Enter the OTP sent to your email and choose a new password."}
          </p>

        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (

          <form onSubmit={handleSendOTP} className="space-y-4">

            <div>
              <label className="block text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-neutral-300 p-3 text-sm outline-none focus:border-[#201E64]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#201E64] text-white p-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>

        ) : (

          <form onSubmit={handleResetPassword} className="space-y-4">

            <div>
              <label className="block text-sm mb-2">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                required
                className="w-full border border-neutral-300 p-3 text-sm outline-none focus:border-[#201E64]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full border border-neutral-300 p-3 text-sm outline-none focus:border-[#201E64]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full border border-neutral-300 p-3 text-sm outline-none focus:border-[#201E64]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#201E64] text-white p-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm text-[#201E64] hover:underline"
            >
              Use a different email
            </button>

          </form>

        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-6 text-sm text-neutral-500 hover:text-[#201E64]"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}
