import React, { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const NAVY = "#201E64";

// Change this only if your Express route is different
const VERIFY_OTP_URL =
 "http://localhost:5000/api/otp/verify";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from CreateAccount
  const userId = location.state?.userId;
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // OTP INPUT
  // =====================================================

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");

    setOtp(value.slice(0, 6));
    setError("");
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Make sure user ID came from registration
    if (!userId) {
      setError(
        "User information is missing. Please create your account again."
      );
      return;
    }

    // Validate OTP
    if (!otp) {
      setError("Please enter your verification code.");
      return;
    }

    if (otp.length !== 6) {
      setError("Verification code must contain 6 digits.");
      return;
    }

    try {
      setLoading(true);

      // This matches your otpController
      const requestBody = {
        user_id: userId,
        otp: otp,
      };

      console.log("Sending OTP verification:", requestBody);

      const response = await fetch(
        VERIFY_OTP_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestBody),
        }
      );

      // =================================================
      // SAFELY READ RESPONSE
      // =================================================

      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Backend returned non-JSON response:",
          text
        );

        if (response.status === 404) {
          throw new Error(
            "OTP verification route was not found. Check your backend route."
          );
        }

        throw new Error(
          `Server returned ${response.status} ${response.statusText}`
        );
      }

      console.log(
        "OTP verification response:",
        data
      );

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "OTP verification failed."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        data.message ||
          "OTP verified successfully"
      );

      // Go to login after successful verification
      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);

    } catch (err) {
      console.error(
        "OTP verification error:",
        err
      );

      if (
        err instanceof TypeError &&
        err.message === "Failed to fetch"
      ) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to verify OTP."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK TO REGISTRATION
  // =====================================================

  const handleBack = () => {
    navigate("/createaccount");
  };

  return (
    <div
      className="
        min-h-screen
        min-h-[100dvh]
        bg-neutral-50
        flex
        items-center
        justify-center
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          border
          border-neutral-200
          shadow-sm
        "
      >
        {/* HEADER */}

        <div
          className="
            px-5
            pt-8
            pb-6
            sm:px-8
            text-center
            border-b
            border-neutral-100
          "
        >
          <div
            className="
              mx-auto
              w-16
              h-16
              flex
              items-center
              justify-center
              rounded-full
              bg-[#201E64]/10
              mb-5
            "
          >
            <ShieldCheck
              size={32}
              style={{
                color: NAVY,
              }}
            />
          </div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-neutral-900
            "
          >
            Verify Your Email
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-neutral-500
            "
          >
            Enter the 6-digit verification
            code sent to
          </p>

          {email && (
            <p
              className="
                mt-1
                text-sm
                font-semibold
                break-all
              "
              style={{
                color: NAVY,
              }}
            >
              {email}
            </p>
          )}
        </div>

        {/* FORM */}

        <form
          onSubmit={handleVerify}
          className="
            px-5
            py-6
            sm:px-8
            sm:py-8
          "
        >
          {/* OTP */}

          <div>
            <label
              htmlFor="otp"
              className="
                block
                mb-2
                text-sm
                font-semibold
                text-neutral-800
              "
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              autoFocus
              disabled={
                loading || !!success
              }
              className="
                w-full
                h-16
                px-4
                border
                border-neutral-300
                bg-white
                text-center
                text-2xl
                sm:text-3xl
                font-bold
                tracking-[0.35em]
                sm:tracking-[0.45em]
                text-neutral-900
                outline-none
                transition
                focus:border-[#201E64]
                focus:ring-2
                focus:ring-[#201E64]/10
                disabled:bg-neutral-100
              "
            />

            <div
              className="
                flex
                justify-between
                items-center
                mt-2
                gap-3
              "
            >
              <p
                className="
                  text-xs
                  text-neutral-500
                "
              >
                Enter your 6-digit OTP.
              </p>

              <span
                className={`text-xs font-semibold ${
                  otp.length === 6
                    ? "text-green-600"
                    : "text-neutral-400"
                }`}
              >
                {otp.length}/6
              </span>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              <AlertCircle
                size={18}
                className="
                  shrink-0
                  mt-0.5
                "
              />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              className="
                mt-5
                flex
                items-start
                gap-3
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-sm
                text-green-700
              "
            >
              <CheckCircle2
                size={18}
                className="
                  shrink-0
                  mt-0.5
                "
              />

              <div>
                <p className="font-semibold">
                  Email Verified
                </p>

                <p className="mt-1">
                  {success}
                </p>

                <p className="mt-1 text-xs">
                  Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {/* VERIFY BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6 ||
              !!success
            }
            className="
              mt-6
              w-full
              h-12
              flex
              items-center
              justify-center
              bg-[#201E64]
              text-white
              text-sm
              font-semibold
              transition
              hover:bg-[#2B2889]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Verifying..."
              : success
              ? "Verified"
              : "Verify OTP"}
          </button>

          {/* BACK */}

          {!success && (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="
                mt-3
                w-full
                h-12
                flex
                items-center
                justify-center
                gap-2
                border
                border-neutral-300
                bg-white
                text-sm
                font-semibold
                text-neutral-700
                transition
                hover:border-[#201E64]
                hover:text-[#201E64]
                disabled:opacity-50
              "
            >
              <ArrowLeft size={17} />

              Back to Registration
            </button>
          )}

          {/* LOGIN */}

          <div
            className="
              mt-6
              pt-5
              border-t
              border-neutral-100
              text-center
            "
          >
            <p
              className="
                text-sm
                text-neutral-500
              "
            >
              Already verified?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="
                  font-semibold
                  text-[#201E64]
                  hover:underline
                "
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}