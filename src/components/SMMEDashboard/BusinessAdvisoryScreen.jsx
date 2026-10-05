import React, { useEffect, useRef, useState } from "react";

const NAVY = "#201E64";

// ======================================================
// SUPPORT AREAS
// ======================================================

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

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function BusinessAdvisoryScreen() {
  const [formData, setFormData] = useState({
    support_area: "",
    description: "",
  });

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const dropdownRef = useRef(null);

  // ======================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ======================================================
  // HANDLE DESCRIPTION
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ======================================================
  // SELECT SUPPORT AREA
  // ======================================================

  const handleSupportAreaSelect = (area) => {
    setFormData((prev) => ({
      ...prev,
      support_area: area,
    }));

    setDropdownOpen(false);
    setError("");
    setSuccess("");
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.support_area ||
      !formData.description.trim()
    ) {
      setError(
        "Please complete all required fields."
      );

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
        request_date: new Date()
          .toISOString()
          .split("T")[0],
      };

      console.log(
        "Business Advisory Request:",
        requestBody
      );

      // ==================================================
      // CONNECT YOUR API HERE
      // ==================================================

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
          data.message ||
            "Failed to submit advisory request"
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

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-5">
        <h1
          className="
            text-2xl
            font-extrabold
            leading-tight
            sm:text-3xl
          "
          style={{ color: NAVY }}
        >
          Request Business Advisory
        </h1>

        <p
          className="
            mt-1
            max-w-2xl
            text-sm
            leading-5
            text-neutral-500
          "
        >
          Select the business area where you need support
          and describe the assistance your business
          requires.
        </p>
      </div>

      {/* ==================================================
          FORM CARD
      ================================================== */}

      <div
        className="
          w-full
          max-w-3xl
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* ==================================================
              SUPPORT AREA
          ================================================== */}

          <div>
            <label
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-neutral-700
              "
            >
              Business Area You Need Support With

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            {/* CUSTOM DROPDOWN */}

            <div
              ref={dropdownRef}
              className="relative w-full"
            >

              {/* DROPDOWN BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setDropdownOpen(
                    (previous) => !previous
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  border
                  border-neutral-300
                  bg-white
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  outline-none
                  transition
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

                {/* ARROW */}

                <svg
                  className={`
                    h-4
                    w-4
                    shrink-0
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

              {/* ==================================================
                  DROPDOWN OPTIONS
              ================================================== */}

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
                    overflow-hidden
                    border
                    border-neutral-200
                    bg-white
                    shadow-lg
                  "
                >
                  <div className="max-h-52 overflow-y-auto">
                    {SUPPORT_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() =>
                          handleSupportAreaSelect(
                            area
                          )
                        }
                        className={`
                          block
                          w-full
                          px-3
                          py-2
                          text-left
                          text-sm
                          transition
                          hover:bg-neutral-50

                          ${
                            formData.support_area ===
                            area
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

            <p className="mt-1 text-[11px] text-neutral-400">
              Select the area where your business requires
              advisory support.
            </p>
          </div>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div>
            <div
              className="
                mb-1.5
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <label
                htmlFor="description"
                className="
                  text-xs
                  font-semibold
                  text-neutral-700
                "
              >
                Describe the Support You Need

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <span className="shrink-0 text-[11px] text-neutral-400">
                {formData.description.length}/1000
              </span>
            </div>

            <textarea
              id="description"
              name="description"
              rows={5}
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the challenge your business is facing and the type of assistance you need..."
              className="
                min-h-[120px]
                w-full
                resize-y
                border
                border-neutral-300
                px-3
                py-2.5
                text-sm
                leading-5
                outline-none
                transition
                placeholder:text-neutral-400
                focus:border-[#201E64]
                focus:ring-1
                focus:ring-[#201E64]
              "
            />
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                w-full
                border
                border-red-200
                bg-red-50
                px-3
                py-2
              "
            >
              <p className="text-xs text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div
              className="
                w-full
                border
                border-green-200
                bg-green-50
                px-3
                py-2
              "
            >
              <p className="text-xs text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* ==================================================
              BOTTOM
          ================================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-neutral-200
              pt-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p className="text-[11px] text-neutral-400">
              Fields marked with * are required.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
              style={{
                backgroundColor: NAVY,
              }}
            >
              {loading
                ? "Submitting..."
                : "Submit Advisory Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}