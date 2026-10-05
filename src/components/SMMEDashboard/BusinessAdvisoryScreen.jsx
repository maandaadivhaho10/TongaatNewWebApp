import React, { useEffect, useRef, useState } from "react";

const NAVY = "#201E64";

const SUPPORT_AREAS = [
  "Financial Management",
  "Marketing & Sales",
  "Business Strategy",
  "Business Compliance",
  "Procurement & Tenders",
  "Business Operations",
  "Human Resources",
  "Funding & Investment",
  "Growth & Expansion",
  "Other",
];

export default function BusinessAdvisoryScreen() {
  const [formData, setFormData] = useState({
    support_area: "",
    description: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSupportAreaSelect = (area) => {
    setFormData((prev) => ({
      ...prev,
      support_area: area,
    }));

    setDropdownOpen(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.support_area || !formData.description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const requestBody = {
        user_id: 1, // Replace with logged-in user ID
        support_area: formData.support_area,
        description: formData.description,
        request_date: new Date().toISOString().split("T")[0],
      };

      console.log("Business Advisory Request:", requestBody);

      // ==========================================
      // CONNECT YOUR API HERE
      // ==========================================

      /*
      const response = await fetch(
        "http://localhost:5000/api/advisory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit advisory request"
        );
      }
      */

      setSuccess(
        "Your business advisory request has been submitted successfully."
      );

      setFormData({
        support_area: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while submitting your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-50">
      <div
        className="
          mx-auto
          w-full
          min-w-0
          max-w-5xl
          px-4
          py-6
          sm:px-6
          sm:py-10
          lg:px-8
          lg:py-12
        "
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="
              text-2xl
              font-extrabold
              leading-tight
              sm:text-3xl
              lg:text-4xl
            "
            style={{ color: NAVY }}
          >
            Request Business Advisory
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-neutral-500
              sm:text-base
            "
          >
            Select the business area where you need support and
            describe the assistance your business requires.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="
            w-full
            min-w-0
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm
            sm:p-6
            md:p-8
            lg:p-10
          "
        >
          <form onSubmit={handleSubmit} className="w-full space-y-6">

            {/* Business Support Area */}
            <div className="w-full min-w-0">
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-neutral-700
                "
              >
                Business Area You Need Support With
                <span className="ml-1 text-red-500">*</span>
              </label>

              {/* Custom Dropdown */}
              <div
                ref={dropdownRef}
                className="relative w-full min-w-0"
              >
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="
                    flex
                    w-full
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    border
                    border-neutral-300
                    bg-white
                    px-3
                    py-3
                    text-left
                    text-sm
                    outline-none
                    transition
                    sm:px-4
                    focus:border-[#201E64]
                    focus:ring-1
                    focus:ring-[#201E64]
                  "
                >
                  <span
                    className={`
                      min-w-0
                      flex-1
                      truncate
                      ${
                        formData.support_area
                          ? "text-neutral-700"
                          : "text-neutral-400"
                      }
                    `}
                  >
                    {formData.support_area ||
                      "Select a business support area"}
                  </span>

                  {/* Arrow */}
                  <svg
                    className={`
                      h-4
                      w-4
                      flex-shrink-0
                      transition-transform
                      ${
                        dropdownOpen
                          ? "rotate-180"
                          : "rotate-0"
                      }
                    `}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown List */}
                {dropdownOpen && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-full
                      z-50
                      mt-1
                      w-full
                      min-w-0
                      overflow-hidden
                      border
                      border-neutral-200
                      bg-white
                      shadow-lg
                    "
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {SUPPORT_AREAS.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() =>
                            handleSupportAreaSelect(area)
                          }
                          className={`
                            block
                            w-full
                            break-words
                            px-4
                            py-3
                            text-left
                            text-sm
                            transition
                            hover:bg-neutral-50
                            ${
                              formData.support_area === area
                                ? "bg-[#201E64]/5 font-semibold text-[#201E64]"
                                : "text-neutral-700"
                            }
                          `}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-neutral-400">
                Select the area where your business requires advisory
                support.
              </p>
            </div>

            {/* Description */}
            <div className="w-full min-w-0">
              <div
                className="
                  mb-2
                  flex
                  flex-col
                  gap-1
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-neutral-700"
                >
                  Describe the Support You Need
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <span className="text-xs text-neutral-400">
                  {formData.description.length}/1000
                </span>
              </div>

              <textarea
                id="description"
                name="description"
                rows={7}
                maxLength={1000}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the challenge your business is facing and the type of assistance you need..."
                className="
                  min-h-[160px]
                  w-full
                  min-w-0
                  resize-y
                  border
                  border-neutral-300
                  px-3
                  py-3
                  text-sm
                  leading-6
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  sm:min-h-[180px]
                  sm:px-4
                  focus:border-[#201E64]
                  focus:ring-1
                  focus:ring-[#201E64]
                "
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  w-full
                  break-words
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                className="
                  w-full
                  break-words
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  text-green-700
                "
              >
                {success}
              </div>
            )}

            {/* Bottom Actions */}
            <div
              className="
                flex
                flex-col
                gap-4
                border-t
                border-neutral-200
                pt-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p className="text-xs text-neutral-400">
                Fields marked with * are required.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                  sm:px-8
                "
                style={{ backgroundColor: NAVY }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Advisory Request"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}