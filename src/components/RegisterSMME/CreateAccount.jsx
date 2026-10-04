import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAVY = "#201E64";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Registration data:", formData);

    // Add your API registration request here
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-3xl">

        {/* CARD */}
        <div className="bg-white border border-neutral-200 shadow-sm">

          {/* HEADER */}
          <div className="px-6 sm:px-10 pt-8 pb-6">

            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Create New Account
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Create your account to access opportunities and business support.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="px-6 sm:px-10 pb-10"
          >

            {/* TITLE */}
            <div className="mb-5">

              <label
                htmlFor="title"
                className="block text-sm font-semibold text-neutral-800 mb-2"
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
                  className="
                    w-full
                    h-12
                    appearance-none
                    px-4
                    pr-10
                    border
                    border-neutral-300
                    bg-white
                    text-sm
                    text-neutral-900
                    outline-none
                    focus:border-[#201E64]
                    focus:ring-2
                    focus:ring-[#201E64]/10
                  "
                >
                  <option value="">Select title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>

                <ChevronDown
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-4
                    h-4
                    text-neutral-500
                    pointer-events-none
                  "
                />

              </div>

            </div>


            {/* FIRST NAME + LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

              {/* FIRST NAME */}
              <div>

                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
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
                  required
                  className="
                    w-full
                    h-12
                    px-4
                    border
                    border-neutral-300
                    bg-white
                    text-sm
                    text-neutral-900
                    placeholder:text-neutral-400
                    outline-none
                    focus:border-[#201E64]
                    focus:ring-2
                    focus:ring-[#201E64]/10
                  "
                />

              </div>


              {/* LAST NAME */}
              <div>

                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
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
                  required
                  className="
                    w-full
                    h-12
                    px-4
                    border
                    border-neutral-300
                    bg-white
                    text-sm
                    text-neutral-900
                    placeholder:text-neutral-400
                    outline-none
                    focus:border-[#201E64]
                    focus:ring-2
                    focus:ring-[#201E64]/10
                  "
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="mb-5">

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-800 mb-2"
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
                required
                className="
                  w-full
                  h-12
                  px-4
                  border
                  border-neutral-300
                  bg-white
                  text-sm
                  text-neutral-900
                  placeholder:text-neutral-400
                  outline-none
                  focus:border-[#201E64]
                  focus:ring-2
                  focus:ring-[#201E64]/10
                "
              />

            </div>


            {/* PASSWORD */}
            <div className="mb-5">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  minLength={8}
                  required
                  className="
                    w-full
                    h-12
                    px-4
                    pr-12
                    border
                    border-neutral-300
                    bg-white
                    text-sm
                    text-neutral-900
                    placeholder:text-neutral-400
                    outline-none
                    focus:border-[#201E64]
                    focus:ring-2
                    focus:ring-[#201E64]/10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="
                    absolute
                    right-0
                    top-0
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    text-neutral-500
                    hover:text-[#201E64]
                  "
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

              <p className="mt-2 text-xs text-neutral-500">
                Password must contain at least 8 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="mb-6">

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="
                    w-full
                    h-12
                    px-4
                    pr-12
                    border
                    border-neutral-300
                    bg-white
                    text-sm
                    text-neutral-900
                    placeholder:text-neutral-400
                    outline-none
                    focus:border-[#201E64]
                    focus:ring-2
                    focus:ring-[#201E64]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="
                    absolute
                    right-0
                    top-0
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    text-neutral-500
                    hover:text-[#201E64]
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

              {formData.confirmPassword !== "" &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">
                    Passwords do not match.
                  </p>
                )}

            </div>


            {/* TERMS */}
            <div className="mb-7">

              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  className="
                    mt-1
                    w-4
                    h-4
                    accent-[#201E64]
                    cursor-pointer
                  "
                />

                <span className="text-sm text-neutral-600 leading-relaxed">
                  I agree to the{" "}

                  <button
                    type="button"
                    onClick={() => navigate("/terms")}
                    className="font-semibold text-[#201E64] hover:underline"
                  >
                    Terms and Conditions
                  </button>

                  {" "}and acknowledge the Privacy Policy.
                </span>

              </label>

            </div>


            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="
                w-full
                h-12
                bg-[#201E64]
                hover:bg-[#2B2889]
                text-white
                font-semibold
                text-sm
                transition-all
                duration-200
                shadow-sm
                hover:shadow-md
                active:scale-[0.99]
              "
            >
              Create Account
            </button>


            {/* LOGIN */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  font-semibold
                  text-[#201E64]
                  hover:underline
                  bg-transparent
                  border-0
                  p-0
                  cursor-pointer
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