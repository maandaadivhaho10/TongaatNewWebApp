
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { getEvents } from "./eventsService";
import EventCard from "./EventCard";

const NAVY = "#201E64";

export default function MeetingsScreen() {
  const { token, isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH EVENTS
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
      const activities = await getEvents(token, signal);

      if (!signal?.aborted) {
        setEvents(activities);
      }
    } catch (err) {
      if (signal?.aborted || err.code === "ERR_CANCELED") {
        return;
      }

      console.error("Fetch events error:", err);

      const message =
        err.response?.status === 401
          ? "Your session has expired. Please log in again."
          : err.response?.status === 403
            ? "You do not have permission to view events."
            : err.response?.data?.message ||
              err.message ||
              "Unable to load events.";

      setError(message);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [token, isAuthenticated]);

  // LOAD EVENTS ON MOUNT
  useEffect(() => {
    const controller = new AbortController();

    fetchEvents(controller.signal);

    return () => controller.abort();
  }, [fetchEvents]);

  // SEARCH EVENTS
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) =>
      [
        event.name,
        event.description,
        event.activity_date,
        event.status,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [events, search]);

  return (
    <div className="w-full min-w-0">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-extrabold sm:text-3xl"
            style={{ color: NAVY }}
          >
            Events
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            View Enterprise and Supplier Development activities
            organised by the ED Team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchEvents()}
          disabled={loading || !isAuthenticated}
          className="inline-flex h-10 items-center justify-center gap-2 border border-neutral-300 bg-white px-4 text-xs font-semibold text-[#201E64] transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
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

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="border border-neutral-200 bg-white p-10 text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#201E64]" />
          <p className="mt-3 text-sm text-neutral-500">
            Loading events...
          </p>
        </div>
      ) : error ? null : filteredEvents.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-8 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-neutral-300" />

          <h3 className="mt-3 text-lg font-bold text-[#201E64]">
            No events available
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            {search
              ? "No events match your search."
              : "There are currently no ESD events available."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-sm font-bold sm:text-base"
              style={{ color: NAVY }}
            >
              Available Events
            </h2>

            <span className="text-xs text-neutral-500">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.activity_id}
                event={event}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
