import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

import {
  CalendarDays,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

const NAVY = "#201E64";
const EVENTS_ENDPOINT = "/esd-activities";

// ======================================================
// API
// ======================================================

async function requestActivities(path = "", options = {}) {
  const {
    method = "GET",
    body,
    headers,
    ...rest
  } = options;

  try {
    const response = await api.request({
      url: `${EVENTS_ENDPOINT}${path}`,
      method,
      data: body,
      headers,
      ...rest,
    });

    if (response.data?.success === false) {
      throw new Error(
        response.data.message || "Request failed."
      );
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error(
        "Your session could not be authenticated. Please log in again."
      );
    }

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Unable to load events."
    );
  }
}

// ======================================================
// HELPERS
// ======================================================

function normalizeActivity(activity) {
  const rawDate = activity.activity_date;

  return {
    ...activity,
    id: activity.activity_id ?? activity.id,
    date:
      typeof rawDate === "string"
        ? rawDate.slice(0, 10)
        : rawDate
          ? new Date(rawDate).toISOString().slice(0, 10)
          : "",
    description: activity.description || "",
  };
}

function formatDate(date) {
  if (!date) return "Not scheduled";

  const parsed = new Date(
    `${String(date).slice(0, 10)}T00:00:00`
  );

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ======================================================
// MAIN SCREEN
// ======================================================

export default function MeetingsWorkshopsScreen() {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("events");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
  });

  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ====================================================
  // FETCH EVENTS
  // ====================================================

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await requestActivities();

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Unexpected API response: expected an array in data."
        );
      }

      setEvents(response.data.map(normalizeActivity));
    } catch (err) {
      setError(
        err.message || "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setEvents([]);
      setError("Please log in to view events.");
      return;
    }

    loadEvents();
  }, [
    authLoading,
    isAuthenticated,
    loadEvents,
  ]);

  // ====================================================
  // FILTER EVENTS
  // ====================================================

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return events.filter((item) =>
      `${item.name || ""} ${item.description || ""} ${item.date || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [events, search]);

  // ====================================================
  // CREATE EVENT
  // ====================================================

  async function handleSubmit(e) {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const activity_date = form.date;

    if (
      !name ||
      !description ||
      !activity_date ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Send a plain object to Axios.
      // Do not use JSON.stringify here.
      await requestActivities("", {
        method: "POST",
        body: {
          name,
          description,
          activity_date,
        },
      });

      setForm({
        name: "",
        description: "",
        date: "",
      });

      setActiveTab("events");
      setSearch("");

      await loadEvents();

      setSuccess(
        "Event created successfully."
      );
    } catch (err) {
      setError(
        err.message || "Failed to create event."
      );
    } finally {
      setSaving(false);
    }
  }

  const openCreate = () => {
    setActiveTab("create");
    setError("");
    setSuccess("");
  };

  const inputClass = `
    w-full border border-neutral-300 bg-white
    px-3 text-xs outline-none
    focus:border-[#201E64]
    focus:ring-1 focus:ring-[#201E64]/10
    sm:text-sm
  `;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full min-w-0">

      {/* HEADER */}
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={{ color: NAVY }}
          >
            Events
          </h1>

          <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
            Create and manage events for registered
            suppliers and SMMEs.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center justify-center gap-2 bg-[#201E64] px-4 text-xs font-bold text-white hover:bg-[#2B2889]"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </header>

      {/* EVENT STATISTICS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between border border-neutral-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              Total Events
            </p>

            <p
              className="mt-1 text-2xl font-extrabold"
              style={{ color: NAVY }}
            >
              {events.length}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center bg-[#201E64]/10">
            <CalendarDays
              className="h-5 w-5"
              style={{ color: NAVY }}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <nav
        className="flex gap-1 border-b border-neutral-200"
        aria-label="Events tabs"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("events");
            setError("");
          }}
          className={`flex h-11 items-center gap-2 border-b-2 px-4 text-xs font-bold ${
            activeTab === "events"
              ? "border-[#201E64] text-[#201E64]"
              : "border-transparent text-neutral-500 hover:text-[#201E64]"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          All Events

          <span className="bg-neutral-100 px-2 py-0.5 text-[10px]">
            {events.length}
          </span>
        </button>

        <button
          type="button"
          onClick={openCreate}
          className={`flex h-11 items-center gap-2 border-b-2 px-4 text-xs font-bold ${
            activeTab === "create"
              ? "border-[#201E64] text-[#201E64]"
              : "border-transparent text-neutral-500 hover:text-[#201E64]"
          }`}
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </nav>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ALL EVENTS */}
      {activeTab === "events" ? (
        <section className="mt-5">

          {/* SUCCESS */}
          {success && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 border border-green-200 bg-green-50 p-3 text-xs text-green-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          {/* SEARCH AND REFRESH */}
          <div className="flex flex-col gap-3 border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search events..."
                className="h-10 w-full border border-neutral-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#201E64] sm:text-sm"
              />
            </div>

            <button
              type="button"
              onClick={loadEvents}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-300 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {/* CREATED EVENTS HEADER */}
          <div className="mb-3 mt-4 flex items-center justify-between">
            <h2
              className="text-sm font-bold sm:text-base"
              style={{ color: NAVY }}
            >
              Created Events
            </h2>

            <span className="text-xs text-neutral-500">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "result"
                : "results"}
            </span>
          </div>

          {/* EVENT LIST */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 border border-neutral-200 bg-white p-10 text-sm text-neutral-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading events...
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-[#201E64]/30"
                >
                  <div className="flex h-9 w-9 items-center justify-center bg-[#201E64]/10">
                    <FileText
                      className="h-4 w-4"
                      style={{ color: NAVY }}
                    />
                  </div>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                    Event
                  </p>

                  <h3
                    className="mt-1 break-words text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    {item.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#201E64]" />

                    <span className="text-xs font-semibold text-neutral-700">
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <p
                    className={`mt-3 whitespace-pre-wrap break-words text-xs leading-5 text-neutral-500 ${
                      expanded.includes(item.id)
                        ? ""
                        : "line-clamp-3"
                    }`}
                  >
                    {item.description}
                  </p>

                  {item.description.length > 130 && (
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-[#201E64]"
                      onClick={() =>
                        setExpanded((old) =>
                          old.includes(item.id)
                            ? old.filter(
                                (id) => id !== item.id
                              )
                            : [...old, item.id]
                        )
                      }
                    >
                      {expanded.includes(item.id)
                        ? "See less"
                        : "See more"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
              {error
                ? "Events could not be loaded."
                : "No events found."}
            </div>
          )}
        </section>
      ) : (

        /* CREATE EVENT FORM */
        <section className="mx-auto mt-5 max-w-3xl">
          <div className="mb-4">
            <h2
              className="text-base font-bold sm:text-lg"
              style={{ color: NAVY }}
            >
              Create Event
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Enter the event name, description and date.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
          >
            {/* EVENT NAME */}
            <div>
              <label
                htmlFor="event-name"
                className="mb-1.5 block text-xs font-semibold text-neutral-700"
              >
                Event Name{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                id="event-name"
                name="name"
                type="text"
                required
                maxLength={150}
                value={form.name}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter event name"
                className={`h-10 ${inputClass}`}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <label
                htmlFor="event-description"
                className="mb-1.5 block text-xs font-semibold text-neutral-700"
              >
                Description{" "}
                <span className="text-red-600">*</span>
              </label>

              <textarea
                id="event-description"
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the event..."
                className={`resize-y py-2.5 ${inputClass}`}
              />
            </div>

            {/* EVENT DATE */}
            <div className="mt-4">
              <label
                htmlFor="event-date"
                className="mb-1.5 block text-xs font-semibold text-neutral-700"
              >
                Event Date{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                id="event-date"
                name="date"
                type="date"
                required
                value={form.date}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    date: e.target.value,
                  }))
                }
                className={`h-10 ${inputClass}`}
              />
            </div>

            {/* FORM BUTTONS */}
            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("events");
                  setError("");
                }}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-300 px-5 text-xs font-bold text-neutral-700 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 bg-[#201E64] px-5 text-xs font-bold text-white hover:bg-[#2B2889] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {saving
                  ? "Creating..."
                  : "Create Event"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}