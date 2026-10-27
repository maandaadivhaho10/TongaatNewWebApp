import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";

// Your axios instance should have baseURL = http://localhost:5000/api
// so these resolve to /api/advisory and /api/advisory/my-requests.
const ADVISORY_URL = "/advisory";
const MY_REQUESTS_URL = "/advisory/my-requests";

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

const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-green-200 bg-green-50 text-green-700",
  completed: "border-green-200 bg-green-50 text-green-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

const TABS = {
  NEW: "new",
  MINE: "mine",
};

const formatStatus = (status) =>
  String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Accepts several common response shapes from the backend.
const extractRequests = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data?.requests)) return data.data.requests;
  return [];
};

export default function BusinessAdvisoryScreen() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.NEW);

  const [formData, setFormData] = useState({
    support_area: "",
    description: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // My requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

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

  // ---------- FETCH MY REQUESTS ----------
  // The axios instance attaches the JWT access token automatically
  // (via its request interceptor), so no manual header is needed here.
  const fetchMyRequests = useCallback(async () => {
    if (!isAuthenticated) return;

    setRequestsLoading(true);
    setRequestsError("");

    try {
      const response = await api.get(MY_REQUESTS_URL);
      const data = response.data;

      if (data?.success === false) {
        throw new Error(data.message || "Failed to load your requests.");
      }

      setRequests(extractRequests(data));
    } catch (err) {
      console.error("Fetch my advisory requests error:", err);

      if (err.response?.status === 401) {
        setRequestsError("Your session is no longer valid. Please log in again.");
      } else if (err.response?.status === 404) {
        setRequestsError(
          "Requests endpoint was not found. Check the backend route."
        );
      } else if (!err.response) {
        setRequestsError("Unable to connect to the server.");
      } else {
        setRequestsError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load your requests."
        );
      }
    } finally {
      setRequestsLoading(false);
    }
  }, [isAuthenticated]);

  // Load once the session is ready (also gives the tab its request count).
  useEffect(() => {
    if (authLoading || !isAuthenticated || !user?.user_id) return;
    fetchMyRequests();
  }, [authLoading, isAuthenticated, user?.user_id, fetchMyRequests]);

  const openTab = (tab) => {
    setActiveTab(tab);
    setDropdownOpen(false);

    // Always show fresh data when the person opens My Requests.
    if (tab === TABS.MINE && !authLoading && isAuthenticated) {
      fetchMyRequests();
    }
  };

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

      const response = await api.post(ADVISORY_URL, requestBody);

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

      // Refresh in the background so the new request is ready in My Requests.
      fetchMyRequests();
    } catch (err) {
      console.error("Business advisory request error:", err);

      if (err.response?.status === 401) {
        setError("Your session is no longer valid. Please log in again.");
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

  const tabClass = (tab) =>
    `relative -mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] ${
      activeTab === tab
        ? "border-[#201E64] text-[#201E64]"
        : "border-transparent text-neutral-500 hover:text-neutral-700"
    }`;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-5">
        <h1
          className="text-2xl font-extrabold leading-tight sm:text-3xl"
          style={{ color: NAVY }}
        >
          Business Advisory
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500">
          Request support for your business and track the requests you have
          already sent.
        </p>
      </div>

      {/* TABS */}
      <div
        role="tablist"
        aria-label="Business advisory"
        className="mb-5 flex max-w-3xl border-b border-neutral-200"
      >
        <button
          type="button"
          role="tab"
          id="tab-new"
          aria-selected={activeTab === TABS.NEW}
          aria-controls="panel-new"
          onClick={() => openTab(TABS.NEW)}
          className={tabClass(TABS.NEW)}
        >
          New Request
        </button>

        <button
          type="button"
          role="tab"
          id="tab-mine"
          aria-selected={activeTab === TABS.MINE}
          aria-controls="panel-mine"
          onClick={() => openTab(TABS.MINE)}
          className={tabClass(TABS.MINE)}
        >
          My Requests
          {requests.length > 0 && (
            <span
              className="min-w-[20px] px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white"
              style={{ backgroundColor: NAVY }}
            >
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* ========== TAB 1: NEW REQUEST ========== */}
      {activeTab === TABS.NEW && (
        <div
          role="tabpanel"
          id="panel-new"
          aria-labelledby="tab-new"
          className="w-full max-w-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
        >
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
                    {formData.support_area || "Select a business support area"}
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
                className="flex w-full flex-wrap items-center justify-between gap-2 border border-green-200 bg-green-50 px-3 py-2"
              >
                <p className="text-xs text-green-700">{success}</p>
                <button
                  type="button"
                  onClick={() => openTab(TABS.MINE)}
                  className="shrink-0 text-xs font-semibold text-green-800 underline"
                >
                  View my requests
                </button>
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
      )}

      {/* ========== TAB 2: MY REQUESTS ========== */}
      {activeTab === TABS.MINE && (
        <section
          role="tabpanel"
          id="panel-mine"
          aria-labelledby="tab-mine"
          className="w-full max-w-3xl"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {requests.length > 0
                ? `${requests.length} ${
                    requests.length === 1 ? "request" : "requests"
                  } submitted`
                : "Requests you submit will appear here."}
            </p>

            <button
              type="button"
              onClick={fetchMyRequests}
              disabled={requestsLoading || authLoading || !isAuthenticated}
              className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Loading (first load only) */}
          {requestsLoading && requests.length === 0 && (
            <div className="border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">
              Loading your requests...
            </div>
          )}

          {/* Error */}
          {requestsError && (
            <div
              role="alert"
              className="mb-3 flex items-center justify-between gap-3 border border-red-200 bg-red-50 px-3 py-2"
            >
              <p className="text-xs text-red-700">{requestsError}</p>
              <button
                type="button"
                onClick={fetchMyRequests}
                className="shrink-0 text-xs font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Not logged in */}
          {!authLoading && !isAuthenticated && (
            <div className="border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">
              Log in to see your advisory requests.
            </div>
          )}

          {/* Empty */}
          {isAuthenticated &&
            !requestsLoading &&
            !requestsError &&
            requests.length === 0 && (
              <div className="border border-neutral-200 bg-white px-4 py-6">
                <p className="text-sm text-neutral-500">
                  You haven't submitted any advisory requests yet.
                </p>
                <button
                  type="button"
                  onClick={() => openTab(TABS.NEW)}
                  className="mt-3 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: NAVY }}
                >
                  Make a request
                </button>
              </div>
            )}

          {/* List */}
          {requests.length > 0 && (
            <ul className="space-y-3">
              {requests.map((item, index) => {
                const id =
                  item.request_id ?? item.advisory_id ?? item.id ?? index;
                const statusKey = String(item.status || "pending")
                  .toLowerCase()
                  .replace(/\s+/g, "_");
                const badge =
                  STATUS_STYLES[statusKey] ||
                  "border-neutral-200 bg-neutral-100 text-neutral-600";

                return (
                  <li
                    key={id}
                    className="border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3
                        className="min-w-0 flex-1 text-sm font-bold"
                        style={{ color: NAVY }}
                      >
                        {item.subject || "Advisory request"}
                      </h3>

                      <span
                        className={`shrink-0 border px-2 py-0.5 text-[11px] font-semibold ${badge}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-5 text-neutral-600">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3 flex gap-1 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
                      <span className="font-semibold text-neutral-600">
                        Request date:
                      </span>
                      <span>{formatDate(item.request_date)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}