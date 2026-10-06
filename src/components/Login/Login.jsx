import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// FLOATING INPUT
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
          placeholder=" "
          aria-invalid={!!error}
          className={[
            `
              peer
              h-12
              w-full
              min-w-0
              rounded-none
              border
              bg-white
              pl-4
              pt-3.5
              text-sm
              text-neutral-900
              outline-none
              transition
              sm:h-13
              sm:pl-5
            `,
            trailing
              ? "pr-11 sm:pr-12"
              : "pr-4 sm:pr-5",
            error
              ? `
                  border-red-500
                  focus:ring-1
                  focus:ring-red-200
                `
              : `
                  border-neutral-300
                  hover:border-neutral-400
                  focus:border-[#201E64]
                  focus:ring-1
                  focus:ring-[#201E64]/15
                `,
          ].join(" ")}
        />

        <label
          htmlFor={id}
          className={[
            `
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-sm
              text-neutral-500
              transition-all
              duration-150
              sm:left-5
            `,
            `
              peer-focus:top-2
              peer-focus:translate-y-0
              peer-focus:text-[10px]
            `,
            `
              peer-[:not(:placeholder-shown)]:top-2
              peer-[:not(:placeholder-shown)]:translate-y-0
              peer-[:not(:placeholder-shown)]:text-[10px]
            `,
          ].join(" ")}
        >
          {label}
        </label>

        {trailing && (
          <div
            className="
              absolute
              right-1.5
              top-1/2
              -translate-y-1/2
              sm:right-2
            "
          >
            {trailing}
          </div>
        )}
      </div>

      {error && (
        <p
          className="
            ml-1
            mt-1
            text-[11px]
            text-red-600
            sm:ml-2
          "
        >
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
// LOGIN
// ======================================================

export default function Login() {
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [staySignedIn, setStaySignedIn] =
    useState(false);

  const [errors, setErrors] = useState({});

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = {};

    const username = identifier
      .trim()
      .toLowerCase();

    // ====================================================
    // VALIDATION
    // ====================================================

    if (!username) {
      next.identifier = "Enter your username";
    }

    if (!password) {
      next.password = "Enter your password";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    // ====================================================
    // TEMPORARY SMME LOGIN
    //
    // Username: adi
    // Password: 123
    // ====================================================

    if (
      username === "adi" &&
      password === "123"
    ) {
      console.log("Logged in as SMME");

      navigate("/Smmedashboard");

      return;
    }

    // ====================================================
    // TEMPORARY ED TEAM LOGIN
    //
    // Username: adi
    // Password: 124
    // ====================================================

    if (
      username === "adi" &&
      password === "124"
    ) {
      console.log("Logged in as ED Team");

      navigate("/EDTeamDashboard");

      return;
    }

    // ====================================================
    // INVALID LOGIN
    // ====================================================

    setErrors({
      identifier:
        "Invalid username or password",
      password:
        "Invalid username or password",
    });
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        min-h-screen
        min-h-[100dvh]
        w-full
        overflow-x-hidden
        bg-[#F5F6FA]
        text-neutral-900
      "
    >
      <div
        className="
          flex
          min-h-screen
          min-h-[100dvh]
          w-full
        "
      >
        {/* ==================================================
            LEFT BRANDING PANEL
        ================================================== */}

        <aside
          className="
            relative
            hidden
            min-h-screen
            w-[42%]
            shrink-0
            overflow-hidden
            bg-[#201E64]
            lg:flex
            xl:w-[45%]
          "
        >
          {/* DECORATIVE CIRCLES */}

          <div
            className="
              absolute
              -left-32
              -top-32
              h-80
              w-80
              rounded-full
              bg-white/5
              xl:h-96
              xl:w-96
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -right-32
              h-[420px]
              w-[420px]
              rounded-full
              bg-white/5
              xl:h-[500px]
              xl:w-[500px]
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10
              flex
              min-h-screen
              w-full
              flex-col
              justify-between
              p-8
              xl:p-12
              2xl:p-16
            "
          >
            {/* LOGO */}

            <div>
              <img
                src="/Tongaat-Huletts-Logo.png"
                alt="Tongaat Hulett"
                className="
                  h-auto
                  w-[210px]
                  xl:w-[260px]
                  2xl:w-[300px]
                "
                draggable="false"
              />
            </div>

            {/* BRANDING MESSAGE */}

            <div
              className="
                max-w-sm
                text-white
                xl:max-w-md
              "
            >
              <div
                className="
                  mb-5
                  h-1
                  w-10
                  rounded-full
                  bg-white/80
                  xl:mb-6
                  xl:w-12
                "
              />

              <h2
                className="
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-tight
                  xl:text-4xl
                  2xl:text-5xl
                "
              >
                Empowering businesses.
                <br />
                Growing communities.
              </h2>

              <p
                className="
                  mt-4
                  max-w-md
                  text-sm
                  leading-6
                  text-white/75
                  xl:mt-5
                  xl:text-base
                  xl:leading-7
                  2xl:text-lg
                "
              >
                Access your Tongaat Hulett
                business support platform and
                manage your opportunities,
                applications and business
                activities in one place.
              </p>
            </div>

            {/* FOOTER */}

            <div className="text-xs text-white/50 xl:text-sm">
              © {new Date().getFullYear()}{" "}
              Tongaat Hulett
            </div>
          </div>
        </aside>

        {/* ==================================================
            RIGHT LOGIN SECTION
        ================================================== */}

        <main
          className="
            flex
            min-h-[100dvh]
            min-w-0
            flex-1
            items-center
            justify-center
            px-4
            py-6
            sm:px-6
            sm:py-8
            md:px-10
            lg:px-8
            xl:px-12
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[420px]
            "
          >
            {/* ==================================================
                MOBILE / TABLET LOGO
            ================================================== */}

            <div
              className="
                mb-5
                flex
                justify-center
                sm:mb-6
                lg:hidden
              "
            >
              <img
                src="/Tongaat-Huletts-Logo.png"
                alt="Tongaat Hulett"
                className="
                  h-auto
                  w-[160px]
                  min-[360px]:w-[180px]
                  sm:w-[210px]
                  md:w-[230px]
                "
                draggable="false"
              />
            </div>

            {/* ==================================================
                LOGIN CARD
            ================================================== */}

            <div
              className="
                w-full
                rounded-none
                border
                border-neutral-200
                bg-white
                p-5
                shadow-sm
                sm:p-7
                md:p-8
              "
            >
              {/* HEADER */}

              <div
                className="
                  mb-5
                  text-center
                  sm:mb-6
                "
              >
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    sm:text-3xl
                  "
                  style={{ color: NAVY }}
                >
                  Welcome Back!
                </h1>

                <p
                  className="
                    mt-1
                    text-xs
                    text-neutral-500
                    sm:mt-2
                    sm:text-sm
                  "
                >
                  Sign in to your account to
                  continue.
                </p>
              </div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="
                  space-y-4
                  sm:space-y-5
                "
              >
                {/* USERNAME */}

                <FloatingInput
                  id="identifier"
                  label="Username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(
                      e.target.value
                    );

                    if (
                      errors.identifier ||
                      errors.password
                    ) {
                      setErrors({});
                    }
                  }}
                  autoComplete="username"
                  error={
                    errors.identifier
                  }
                />

                {/* PASSWORD */}

                <FloatingInput
                  id="password"
                  label="Password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(
                      e.target.value
                    );

                    if (
                      errors.identifier ||
                      errors.password
                    ) {
                      setErrors({});
                    }
                  }}
                  autoComplete="current-password"
                  error={errors.password}
                  trailing={
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-none
                        text-neutral-500
                        transition
                        hover:bg-neutral-100
                        hover:text-[#201E64]
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

                {/* ==================================================
                    OPTIONS
                ================================================== */}

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    px-0.5
                    min-[360px]:flex-row
                    min-[360px]:items-center
                    min-[360px]:justify-between
                  "
                >
                  {/* STAY SIGNED IN */}

                  <label
                    className="
                      inline-flex
                      cursor-pointer
                      select-none
                      items-center
                      gap-2
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        staySignedIn
                      }
                      onChange={(e) =>
                        setStaySignedIn(
                          e.target.checked
                        )
                      }
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        rounded
                        border-neutral-400
                        accent-[#201E64]
                      "
                    />

                    <span className="text-xs text-neutral-600">
                      Stay signed in
                    </span>
                  </label>

                  {/* FORGOT PASSWORD */}

                  <button
                    type="button"
                    className="
                      self-start
                      rounded-none
                      text-xs
                      font-medium
                      text-[#201E64]
                      hover:underline
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#201E64]
                      min-[360px]:self-auto
                    "
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* ==================================================
                    LOGIN BUTTON
                ================================================== */}

                <button
                  type="submit"
                  className="
                    h-11
                    w-full
                    rounded-none
                    bg-[#201E64]
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-[#2B2889]
                    hover:shadow-md
                    active:scale-[0.99]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#201E64]
                    focus-visible:ring-offset-2
                    sm:h-12
                  "
                >
                  Log In
                </button>
              </form>

              {/* ==================================================
                  DIVIDER
              ================================================== */}

              <div
                className="
                  my-5
                  flex
                  items-center
                  gap-3
                  sm:my-6
                  sm:gap-4
                "
              >
                <span className="h-px flex-1 bg-neutral-200" />

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-neutral-400
                  "
                >
                  OR
                </span>

                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              {/* ==================================================
                  GOOGLE
              ================================================== */}

              <button
                type="button"
                className="
                  inline-flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-none
                  border
                  border-neutral-300
                  bg-white
                  px-3
                  text-xs
                  font-medium
                  text-neutral-800
                  transition-all
                  hover:border-neutral-400
                  hover:bg-neutral-50
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#201E64]
                  focus-visible:ring-offset-2
                  sm:h-12
                  sm:gap-3
                  sm:text-sm
                "
              >
                <GoogleIcon />

                <span>
                  Continue with Google
                </span>
              </button>

              {/* ==================================================
                  REGISTER
              ================================================== */}

              <p
                className="
                  mt-5
                  text-center
                  text-xs
                  leading-5
                  text-neutral-500
                  sm:mt-6
                  sm:text-sm
                "
              >
                Don&apos;t have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/createaccount"
                    )
                  }
                  className="
                    rounded-none
                    font-semibold
                    text-[#201E64]
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

            {/* ==================================================
                MOBILE FOOTER
            ================================================== */}

            <p
              className="
                mt-4
                text-center
                text-[10px]
                text-neutral-400
                sm:text-xs
                lg:hidden
              "
            >
              © {new Date().getFullYear()}{" "}
              Tongaat Hulett
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}