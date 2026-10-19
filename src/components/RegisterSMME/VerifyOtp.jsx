import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../API/axiosInstance";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem("pending_smme_verification") || "{}"); } catch { /* Ignore invalid saved state. */ }
  const userId = location.state?.user_id ?? saved.user_id;
  const email = location.state?.email ?? saved.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");
    if (userId == null) {
      setError("Registration details were not found. Please create your account first.");
      return;
    }
    if (!otp.trim()) {
      setError("Please enter your verification code.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/otp/verify", { user_id: userId, otp: otp.trim() });
      if (response.data?.success === false) throw new Error(response.data?.message || "Verification failed.");
      sessionStorage.removeItem("pending_smme_verification");
      setSuccess(response.data?.message || "Account verified successfully.");
      navigate("/login", { replace: true, state: { verificationSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-neutral-50 px-4 py-8 flex items-center justify-center">
      <section className="w-full max-w-md border border-neutral-200 bg-white shadow-sm">
        <header className="border-b border-neutral-100 px-6 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">Verify Your Account</h1>
          <p className="mt-2 text-sm text-neutral-500">Enter the OTP sent to {email || "your registered email address"}.</p>
        </header>
        <form onSubmit={handleVerify} className="space-y-5 px-6 py-6">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-neutral-800">Verification Code</label>
            <input id="otp" name="otp" value={otp} onChange={(event) => { setOtp(event.target.value); setError(""); }}
              placeholder="Enter your OTP" autoComplete="one-time-code" inputMode="numeric" required
              className="h-12 w-full border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/10" />
          </div>
          {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="text-sm text-green-700">{success}</p>}
          <button type="submit" disabled={loading || userId == null} className="h-12 w-full bg-[#201E64] px-4 text-sm font-semibold text-white transition hover:bg-[#2B2889] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-center text-sm text-neutral-500">Need to register again? <Link to="/createaccount" className="font-semibold text-[#201E64] hover:underline">Create Account</Link></p>
        </form>
      </section>
    </main>
  );
}
