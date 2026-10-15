
import React, { useEffect, useRef, useState } from "react";
import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";

// Change this only if your backend uses a different route.
const ADVISORY_URL = "/advisory";

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
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    support_area: "",
    description: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);
  const submittingRef = useRef(false);

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSupportAreaSelect = (area) => {
    setFormData((previous) => ({
      ...previous,
      support_area: area,
    }));

    setDropdownOpen(false);
    setError("");
    setSuccess("");
  };

  const getRequestDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    setError("");
    setSuccess("");

    if (!formData.support_area || !formData.description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (authLoading) {
      setError("Please wait while your session is being restored.");
      return;
    }

    if (!isAuthenticated || !user?.user_id) {
      setError("Please log in to submit a business advisory request.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const requestBody = {
        subject: formData.support_area,
        description: formData.description.trim(),
        request_date: getRequestDate(),
        preferred_date: null,
      };

      // Axios automatically attaches the JWT access token.
      const response = await api.post(
        ADVISORY_URL,
        requestBody
      );

      const data = response.data;

      if (data?.success === false) {
        throw new Error(
          data.message || "Failed to submit advisory request."
        );
      }

      setSuccess(
        data?.message ||
          "Your business advisory request has been submitted successfully."
      );

      setFormData({
        support_area: "",
        description: "",
      });
    } catch (err) {
      console.error("Business advisory request error:", err);

      if (err.response?.status === 401) {
        setError(
          "Your session is no longer valid. Please log in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "Your account does not have permission to submit advisory requests."
        );
      } else if (err.response?.status === 404) {
        setError(
          "Advisory API endpoint was not found. Check the backend route."
        );
      } else if (err.code === "ECONNABORTED") {
        setError(
          "The request timed out. Check whether it was saved before retrying."
        );
      } else if (!err.response && !err.message) {
        setError("Unable to connect to the server.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to submit advisory request."
        );
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-5">
        <h1
          className="text-2xl font-extrabold leading-tight sm:text-3xl"
          style={{ color: NAVY }}
        >
          Request Business Advisory
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500">
          Select the business area where you need support and describe
          the assistance your business requires.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="w-full max-w-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* SUPPORT AREA */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
              Business Area You Need Support With
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div ref={dropdownRef} className="relative w-full">
              <button
                type="button"
                disabled={loading || authLoading}
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 border border-neutral-300 bg-white px-3 py-2.5 text-left text-sm outline-none transition focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64] disabled:opacity-60"
              >
                <span
                  className={`min-w-0 flex-1 truncate ${
                    formData.support_area
                      ? "text-neutral-700"
                      : "text-neutral-400"
                  }`}
                >
                  {formData.support_area ||
                    "Select a business support area"}
                </span>

                <svg
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
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

              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 w-full overflow-hidden border border-neutral-200 bg-white shadow-lg">
                  <div className="max-h-52 overflow-y-auto">
                    {SUPPORT_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleSupportAreaSelect(area)}
                        className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-neutral-50 ${
                          formData.support_area === area
                            ? "bg-[#201E64]/5 font-semibold text-[#201E64]"
                            : "text-neutral-700"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-1 text-[11px] text-neutral-400">
              Select the area where your business requires advisory support.
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="description"
                className="text-xs font-semibold text-neutral-700"
              >
                Describe the Support You Need
                <span className="ml-1 text-red-500">*</span>
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
              required
              disabled={loading || authLoading}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the challenge your business is facing and the type of assistance you need..."
              className="min-h-[120px] w-full resize-y border border-neutral-300 px-3 py-2.5 text-sm leading-5 outline-none transition placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64] disabled:opacity-60"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="w-full border border-red-200 bg-red-50 px-3 py-2"
            >
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div
              role="status"
              className="w-full border border-green-200 bg-green-50 px-3 py-2"
            >
              <p className="text-xs text-green-700">{success}</p>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-neutral-400">
              Fields marked with * are required.
            </p>

            <button
              type="submit"
              disabled={
                loading ||
                authLoading ||
                !formData.support_area ||
                !formData.description.trim()
              }
              className="w-full px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              style={{ backgroundColor: NAVY }}
            >
              {loading
                ? "Submitting..."
                : authLoading
                ? "Checking session..."
                : "Submit Advisory Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
