

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";

// ======================================================

// FLOATING INPUT COMPONENT

// ======================================================

function FloatingInput({

  id,

  label,

  type = "text",

  value,

  onChange,

  autoComplete,

  error,

  trailing,

  disabled = false

}) {

  return (

    <div className="w-full">

      <div className="relative">

        <input

          id={id}

          type={type}

          value={value}

          onChange={onChange}

          autoComplete={autoComplete}

          disabled={disabled}

          placeholder=" "

          aria-invalid={!!error}

          className={`

            peer h-12 w-full min-w-0

            rounded-none border bg-white

            pl-4 pt-3.5 text-sm text-neutral-900

            outline-none transition

            sm:h-[52px] sm:pl-5

            disabled:cursor-not-allowed

            disabled:bg-neutral-50

            ${trailing ? "pr-12" : "pr-4"}

            ${

              error

                ? "border-red-500 focus:ring-1 focus:ring-red-200"

                : "border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/15"

            }

          `}

        />

        <label

          htmlFor={id}

          className="

            pointer-events-none absolute

            left-4 top-1/2 -translate-y-1/2

            text-sm text-neutral-500

            transition-all duration-150

            sm:left-5

            peer-focus:top-2

            peer-focus:translate-y-0

            peer-focus:text-[10px]

            peer-[:not(:placeholder-shown)]:top-2

            peer-[:not(:placeholder-shown)]:translate-y-0

            peer-[:not(:placeholder-shown)]:text-[10px]

          "

        >

          {label}

        </label>

        {trailing && (

          <div className="absolute right-2 top-1/2 -translate-y-1/2">

            {trailing}

          </div>

        )}

      </div>

      {error && (

        <p className="mt-1 ml-1 text-xs text-red-600">

          {error}

        </p>

      )}

    </div>

  );

}

// ======================================================

// GOOGLE ICON

// ======================================================

function GoogleIcon() {

  return (

    <svg

      viewBox="0 0 48 48"

      className="h-[17px] w-[17px] shrink-0"

      aria-hidden="true"

    >

      <path

        fill="#EA4335"

        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"

      />

      <path

        fill="#4285F4"

        d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.9 6.8-16.9z"

      />

      <path

        fill="#FBBC05"

        d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"

      />

      <path

        fill="#34A853"

        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.5 2.2-8.8 2.2-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"

      />

    </svg>

  );

}

// ======================================================

// LOGIN COMPONENT

// ======================================================

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  // ======================================================

  // STATE

  // ======================================================

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // ======================================================

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const email = identifier.trim().toLowerCase();
  const nextErrors = {};

  // ======================================================
  // VALIDATE EMAIL
  // ======================================================

  if (!email) {
    nextErrors.identifier = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.identifier = "Enter a valid email address";
  }

  // ======================================================
  // VALIDATE PASSWORD
  // ======================================================

  if (!password) {
    nextErrors.password = "Password is required";
  }

  setErrors(nextErrors);

  if (Object.keys(nextErrors).length > 0) return;

  setLoading(true);

  try {
    // ======================================================
    // LOGIN USING EXISTING AUTH CONTEXT
    // ======================================================

    const userDetails = await login(email, password);

    if (!userDetails) {
      throw new Error("Login failed. No user details returned.");
    }

    const roleId = Number(userDetails.role_id);

    // ======================================================
    // REDIRECT BASED ON USER ROLE
    // ======================================================

    switch (roleId) {
      case 1:
        // SMME
        navigate("/Smmedashboard", {
          replace: true,
        });
        break;

      case 2:
        // ED Team
        navigate("/EDTeamDashboard", {
          replace: true,
        });
        break;

      case 3:
        // Admin dashboard not implemented yet
        navigate("/unauthorized", {
          replace: true,
        });
        break;

      case 4:
        // Super Admin
        navigate("/super-admin", {
          replace: true,
        });
        break;

      default:
        navigate("/unauthorized", {
          replace: true,
        });
        break;
    }
  } catch (error) {
    console.error("Login failed:", error);

    setErrors({
      general:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to log in. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  // ======================================================

  // USER INTERFACE

  // ======================================================

  return (

    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#F5F6FA] text-neutral-900">

      <div className="flex min-h-[100dvh] w-full">

        {/* LEFT BRANDING PANEL */}

        <aside className="

          relative hidden min-h-screen

          w-[42%] shrink-0 overflow-hidden

          bg-[#201E64]

          lg:flex xl:w-[45%]

        ">

          <div className="

            absolute -left-32 -top-32

            h-80 w-80 rounded-full bg-white/5

            xl:h-96 xl:w-96

          " />

          <div className="

            absolute -bottom-40 -right-32

            h-[420px] w-[420px]

            rounded-full bg-white/5

            xl:h-[500px] xl:w-[500px]

          " />

          <div className="

            relative z-10 flex min-h-screen

            w-full flex-col justify-between

            p-8 xl:p-12 2xl:p-16

          ">

            <div>

              <img

                src="/Tongaat-Huletts-Logo.png"

                alt="Tongaat Hulett"

                className="h-auto w-[210px] xl:w-[260px] 2xl:w-[300px]"

                draggable="false"

              />

            </div>

            <div className="max-w-sm text-white xl:max-w-md">

              <div className="

                mb-5 h-1 w-10 rounded-full

                bg-white/80 xl:mb-6 xl:w-12

              " />

              <h2 className="

                text-3xl font-bold leading-tight

                tracking-tight xl:text-4xl 2xl:text-5xl

              ">

                Empowering businesses.

                <br />

                Growing communities.

              </h2>

              <p className="

                mt-4 max-w-md text-sm leading-6

                text-white/75 xl:mt-5

                xl:text-base xl:leading-7

                2xl:text-lg

              ">

                Access your Tongaat Hulett business

                support platform and manage your

                opportunities, applications and business

                activities in one place.

              </p>

            </div>

            <div className="text-xs text-white/50 xl:text-sm">

              © {new Date().getFullYear()} Tongaat Hulett

            </div>

          </div>

        </aside>

        {/* RIGHT LOGIN SECTION */}

        <main className="

          flex min-h-[100dvh] min-w-0 flex-1

          items-center justify-center

          px-4 py-6 sm:px-6 sm:py-8

          md:px-10 lg:px-8 xl:px-12

        ">

          <div className="mx-auto w-full max-w-[420px]">

            {/* MOBILE LOGO */}

            <div className="

              mb-5 flex justify-center

              sm:mb-6 lg:hidden

            ">

              <img

                src="/Tongaat-Huletts-Logo.png"

                alt="Tongaat Hulett"

                className="

                  h-auto w-[160px]

                  min-[360px]:w-[180px]

                  sm:w-[210px] md:w-[230px]

                "

                draggable="false"

              />

            </div>

            {/* LOGIN CARD */}

            <div className="

              w-full rounded-none

              border border-neutral-200

              bg-white p-5 shadow-sm

              sm:p-7 md:p-8

            ">

              <div className="mb-5 text-center sm:mb-6">

                <h1

                  className="

                    text-2xl font-bold tracking-tight

                    sm:text-3xl

                  "

                  style={{ color: NAVY }}

                >

                  Welcome Back!

                </h1>

                <p className="

                  mt-1 text-xs text-neutral-500

                  sm:mt-2 sm:text-sm

                ">

                  Sign in to your account to continue.

                </p>

              </div>

              {/* ERROR MESSAGE */}

              {errors.general && (

                <div

                  role="alert"

                  className="

                    mb-5 border border-red-200

                    bg-red-50 px-4 py-3

                    text-sm text-red-700

                  "

                >

                  {errors.general}

                </div>

              )}

              {/* LOGIN FORM */}

              <form

                onSubmit={handleSubmit}

                noValidate

                className="space-y-4 sm:space-y-5"

              >

                {/* EMAIL */}

                <FloatingInput

                  id="identifier"

                  label="Email Address"

                  type="email"

                  value={identifier}

                  onChange={(e) => {

                    setIdentifier(e.target.value);

                    if (Object.keys(errors).length) {

                      setErrors({});

                    }

                  }}

                  autoComplete="email"

                  error={errors.identifier}

                  disabled={loading}

                />

                {/* PASSWORD */}

                <FloatingInput

                  id="password"

                  label="Password"

                  type={showPassword ? "text" : "password"}

                  value={password}

                  onChange={(e) => {

                    setPassword(e.target.value);

                    if (Object.keys(errors).length) {

                      setErrors({});

                    }

                  }}

                  autoComplete="current-password"

                  error={errors.password}

                  disabled={loading}

                  trailing={

                    <button

                      type="button"

                      disabled={loading}

                      onClick={() =>

                        setShowPassword((current) => !current)

                      }

                      aria-label={

                        showPassword

                          ? "Hide password"

                          : "Show password"

                      }

                      className="

                        flex h-9 w-9 items-center justify-center

                        text-neutral-500 transition

                        hover:bg-neutral-100 hover:text-[#201E64]

                        focus:outline-none

                        focus-visible:ring-2

                        focus-visible:ring-[#201E64]

                      "

                    >

                      {showPassword ? (

                        <Eye className="h-4 w-4" />

                      ) : (

                        <EyeOff className="h-4 w-4" />

                      )}

                    </button>

                  }

                />

                {/* FORGOT PASSWORD */}

                <div className="flex items-center justify-end px-0.5">

                  <button

                    type="button"

                    className="

                      text-xs font-medium text-[#201E64]

                      hover:underline

                      focus:outline-none

                      focus-visible:ring-2

                      focus-visible:ring-[#201E64]

                    "

                  >

                    Forgot Password?

                  </button>

                </div>

                {/* LOGIN BUTTON */}

                <button

                  type="submit"

                  disabled={loading}

                  className="

                    flex h-11 w-full items-center

                    justify-center gap-2

                    rounded-none bg-[#201E64]

                    text-sm font-semibold text-white

                    shadow-sm transition-all duration-200

                    hover:bg-[#2B2889]

                    hover:shadow-md

                    active:scale-[0.99]

                    focus:outline-none

                    focus-visible:ring-2

                    focus-visible:ring-[#201E64]

                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed

                    disabled:opacity-60

                    sm:h-12

                  "

                >

                  {loading ? (

                    <>

                      <Loader2 className="h-4 w-4 animate-spin" />

                      Signing in...

                    </>

                  ) : (

                    "Log In"

                  )}

                </button>

              </form>

              {/* DIVIDER */}

              <div className="

                my-5 flex items-center gap-3

                sm:my-6 sm:gap-4

              ">

                <span className="h-px flex-1 bg-neutral-200" />

                <span className="text-[10px] font-medium text-neutral-400">

                  OR

                </span>

                <span className="h-px flex-1 bg-neutral-200" />

              </div>

              {/* GOOGLE LOGIN */}

              <button

                type="button"

                disabled

                title="Google login is not configured yet"

                className="

                  inline-flex h-11 w-full items-center

                  justify-center gap-2

                  rounded-none border border-neutral-300

                  bg-white px-3 text-xs font-medium

                  text-neutral-800 opacity-60

                  cursor-not-allowed

                  sm:h-12 sm:gap-3 sm:text-sm

                "

              >

                <GoogleIcon />

                <span>Continue with Google</span>

              </button>

              {/* REGISTER */}

              <p className="

                mt-5 text-center text-xs

                leading-5 text-neutral-500

                sm:mt-6 sm:text-sm

              ">

                Don&apos;t have an account?{" "}

                <button

                  type="button"

                  onClick={() => navigate("/createaccount")}

                  className="

                    font-semibold text-[#201E64]

                    hover:underline

                    focus:outline-none

                    focus-visible:ring-2

                    focus-visible:ring-[#201E64]

                  "

                >

                  Register

                </button>

              </p>

            </div>

            {/* MOBILE FOOTER */}

            <p className="

              mt-4 text-center text-[10px]

              text-neutral-400 sm:text-xs

              lg:hidden

            ">

              © {new Date().getFullYear()} Tongaat Hulett

            </p>

          </div>

        </main>

      </div>

    </div>

  );

}
