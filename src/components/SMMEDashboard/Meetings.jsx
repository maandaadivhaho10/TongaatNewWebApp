import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";
const EVENTS_ENDPOINT = "/esd-activities";

const formatDate = (value) => {
  if (!value) return "Not specified";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status }) {
  const currentStatus = String(status || "SCHEDULED").toUpperCase();
  const styles = {
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
    COMPLETED: "border-green-200 bg-green-50 text-green-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[currentStatus] || "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>
      {currentStatus}
    </span>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="border border-neutral-200 bg-white p-8 text-center">
      <CalendarDays className="mx-auto h-8 w-8 text-neutral-300" />
      <h3 className="mt-3 text-lg font-bold text-[#201E64]">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}

export default function MeetingsScreen() {
  const { token, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState([]);

  const fetchEvents = useCallback(async (signal) => {
    if (!isAuthenticated || !token) {
      setEvents([]);
      setError("Please log in to view events.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.get(EVENTS_ENDPOINT, {
        signal,
        // Remove this header if axiosInstance already injects the token.
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data;
      const activities = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.activities)
          ? result.activities
          : Array.isArray(result)
            ? result
            : [];

      if (!signal?.aborted) setEvents(activities);
    } catch (err) {
      if (signal?.aborted || err.code === "ERR_CANCELED") return;
      console.error("Fetch ESD events error:", err);
      const message = err.response?.status === 401
        ? "Your session has expired. Please log in again."
        : err.response?.status === 403
          ? "You do not have permission to view events."
          : err.response?.data?.message || err.message || "Unable to load events.";
      setError(message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    const controller = new AbortController();
    fetchEvents(controller.signal);
    return () => controller.abort();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => [
      event.name,
      event.description,
      event.activity_date,
      event.status,
    ].some((value) => String(value || "").toLowerCase().includes(query)));
  }, [events, search]);

  const toggleDescription = (id) => {
    setExpanded((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>Events</h1>
          <p className="mt-1 text-sm text-neutral-500">
            View Enterprise and Supplier Development activities organised by the ED Team.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchEvents()}
          disabled={loading || !isAuthenticated}
          className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-300 bg-white px-4 text-xs font-semibold text-[#201E64] transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-5 border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="h-10 w-full border border-neutral-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#201E64] sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="border border-neutral-200 bg-white p-10 text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#201E64]" />
          <p className="mt-3 text-sm text-neutral-500">Loading events...</p>
        </div>
      ) : error ? null : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events available"
          description={search ? "No events match your search." : "There are currently no ESD events available."}
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold sm:text-base" style={{ color: NAVY }}>Available Events</h2>
            <span className="text-xs text-neutral-500">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => {
              const isExpanded = expanded.includes(event.activity_id);
              return (
                <article
                  key={event.activity_id}
                  className="flex min-w-0 flex-col border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#201E64]/10">
                      <FileText className="h-5 w-5" style={{ color: NAVY }} />
                    </div>
                    <StatusBadge status={event.status} />
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">ESD Activity</p>
                    <h3 className="mt-1 break-words text-base font-bold leading-6" style={{ color: NAVY }}>
                      {event.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#201E64]" />
                    <span className="text-xs font-semibold text-neutral-700">{formatDate(event.activity_date)}</span>
                  </div>
                  <div className="mt-3">
                    <p className={`whitespace-pre-wrap break-words text-xs leading-5 text-neutral-500 ${isExpanded ? "" : "line-clamp-3"}`}>
                      {event.description}
                    </p>
                    {event.description?.length > 130 && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(event.activity_id)}
                        className="mt-2 text-xs font-semibold text-[#201E64] hover:underline"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
