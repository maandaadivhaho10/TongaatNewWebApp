import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#201E64";

// ======================================================
// SHARED STYLES
// ======================================================

const INPUT_CLASS = `
  w-full
  h-11
  sm:h-12
  px-3
  sm:px-4
  border
  border-neutral-300
  bg-white
  text-sm
  text-neutral-900
  placeholder:text-neutral-400
  outline-none
  transition
  focus:border-[#201E64]
  focus:ring-1
  focus:ring-[#201E64]/10
`;

const LABEL_CLASS = `
  block
  mb-1.5
  text-xs
  sm:text-sm
  font-semibold
  text-neutral-800
`;

// ======================================================
// CREATE ACCOUNT
// ======================================================

export default function CreateAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      alert(
        "Please accept the Terms and Conditions."
      );

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");

      return;
    }

    console.log(
      "Registration data:",
      formData
    );

    // Add your API registration request here
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
        bg-neutral-50
        px-3
        py-4
        sm:px-5
        sm:py-6
        md:px-8
        md:py-8
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100dvh-2rem)]
          w-full
          max-w-3xl
          items-center
          justify-center
          sm:min-h-[calc(100dvh-3rem)]
          md:min-h-[calc(100dvh-4rem)]
        "
      >
        {/* ==================================================
            CARD
        ================================================== */}

        <div
          className="
            w-full
            border
            border-neutral-200
            bg-white
            shadow-sm
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              border-b
              border-neutral-100
              px-4
              pb-4
              pt-5
              sm:px-6
              sm:pb-5
              sm:pt-6
              md:px-8
            "
          >
            <h1
              className="
                text-xl
                font-bold
                tracking-tight
                text-neutral-900
                sm:text-2xl
                md:text-3xl
              "
            >
              Create New Account
            </h1>

            <p
              className="
                mt-1
                max-w-xl
                text-xs
                leading-5
                text-neutral-500
                sm:mt-2
                sm:text-sm
              "
            >
              Create your account to access
              opportunities and business support.
            </p>
          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="
              px-4
              pb-5
              pt-4
              sm:px-6
              sm:pb-6
              sm:pt-5
              md:px-8
            "
          >
            {/* ==================================================
                TITLE
            ================================================== */}

            <div className="mb-4">
              <label
                htmlFor="title"
                className={LABEL_CLASS}
              >
                Title
              </label>

              <div className="relative">
                <select
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`
                    ${INPUT_CLASS}
                    appearance-none
                    pr-10
                  `}
                >
                  <option value="">
                    Select title
                  </option>

                  <option value="Mr">
                    Mr
                  </option>

                  <option value="Mrs">
                    Mrs
                  </option>

                  <option value="Ms">
                    Ms
                  </option>

                  <option value="Miss">
                    Miss
                  </option>

                  <option value="Dr">
                    Dr
                  </option>

                  <option value="Prof">
                    Prof
                  </option>
                </select>

                <ChevronDown
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-neutral-500
                    sm:right-4
                  "
                />
              </div>
            </div>

            {/* ==================================================
                FIRST NAME + LAST NAME
            ================================================== */}

            <div
              className="
                mb-4
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
              {/* FIRST NAME */}

              <div>
                <label
                  htmlFor="firstName"
                  className={LABEL_CLASS}
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  autoComplete="given-name"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              {/* LAST NAME */}

              <div>
                <label
                  htmlFor="lastName"
                  className={LABEL_CLASS}
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  autoComplete="family-name"
                  required
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="mb-4">
              <label
                htmlFor="email"
                className={LABEL_CLASS}
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                autoComplete="email"
                required
                className={INPUT_CLASS}
              />
            </div>

            {/* ==================================================
                PASSWORD ROW
            ================================================== */}

            <div
              className="
                mb-4
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className={LABEL_CLASS}
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    onChange={handleChange}
                    placeholder="Create password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={`
                      ${INPUT_CLASS}
                      pr-11
                      sm:pr-12
                    `}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      text-neutral-500
                      transition
                      hover:bg-neutral-50
                      hover:text-[#201E64]
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-[#201E64]
                      sm:h-12
                      sm:w-12
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>

                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-neutral-500
                    sm:text-xs
                  "
                >
                  Minimum 8 characters.
                </p>
              </div>

              {/* ==================================================
                  CONFIRM PASSWORD
              ================================================== */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className={LABEL_CLASS}
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                    className={`
                      ${INPUT_CLASS}
                      pr-11
                      sm:pr-12
                      ${
                        formData.confirmPassword !==
                          "" &&
                        formData.password !==
                          formData.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : ""
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      text-neutral-500
                      transition
                      hover:bg-neutral-50
                      hover:text-[#201E64]
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-[#201E64]
                      sm:h-12
                      sm:w-12
                    "
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>

                {/* ERROR */}

                {formData.confirmPassword !==
                  "" &&
                  formData.password !==
                    formData.confirmPassword && (
                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-red-600
                        sm:text-xs
                      "
                    >
                      Passwords do not match.
                    </p>
                  )}

                {/* MATCH */}

                {formData.confirmPassword !==
                  "" &&
                  formData.password ===
                    formData.confirmPassword && (
                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-green-600
                        sm:text-xs
                      "
                    >
                      Passwords match.
                    </p>
                  )}
              </div>
            </div>

            {/* ==================================================
                TERMS
            ================================================== */}

            <div
              className="
                mb-5
                border-t
                border-neutral-100
                pt-4
              "
            >
              <label
                className="
                  flex
                  cursor-pointer
                  items-start
                  gap-2.5
                  sm:gap-3
                "
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(
                      event.target.checked
                    )
                  }
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0
                    cursor-pointer
                    accent-[#201E64]
                    sm:mt-1
                  "
                />

                <span
                  className="
                    text-xs
                    leading-5
                    text-neutral-600
                    sm:text-sm
                    sm:leading-6
                  "
                >
                  I agree to the{" "}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/terms")
                    }
                    className="
                      font-semibold
                      text-[#201E64]
                      hover:underline
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#201E64]
                    "
                  >
                    Terms and Conditions
                  </button>

                  {" "}and acknowledge the
                  Privacy Policy.
                </span>
              </label>
            </div>

            {/* ==================================================
                CREATE ACCOUNT
            ================================================== */}

            <button
              type="submit"
              className="
                h-11
                w-full
                bg-[#201E64]
                px-4
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
              Create Account
            </button>

            {/* ==================================================
                LOGIN
            ================================================== */}

            <p
              className="
                mt-4
                text-center
                text-xs
                leading-5
                text-neutral-500
                sm:mt-5
                sm:text-sm
              "
            >
              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="
                  border-0
                  bg-transparent
                  p-0
                  font-semibold
                  text-[#201E64]
                  hover:underline
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#201E64]
                "
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}