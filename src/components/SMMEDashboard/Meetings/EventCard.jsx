
import React, { useState } from "react";
import { CalendarDays, FileText } from "lucide-react";

const NAVY = "#201E64";

const STATUS_STYLES = {
  SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
  COMPLETED: "border-green-200 bg-green-50 text-green-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(
    `${String(value).slice(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);

  const status = String(
    event.status || "SCHEDULED"
  ).toUpperCase();

  const description = event.description || "";

  return (
    <article className="flex min-w-0 flex-col border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#201E64]/10">
          <FileText className="h-5 w-5" style={{ color: NAVY }} />
        </div>

        <span
          className={`inline-flex items-center border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            STATUS_STYLES[status] ||
            "border-neutral-200 bg-neutral-50 text-neutral-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
          ESD Activity
        </p>

        <h3
          className="mt-1 break-words text-base font-bold leading-6"
          style={{ color: NAVY }}
        >
          {event.name}
        </h3>
      </div>

      <div className="mt-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
        <CalendarDays className="h-4 w-4 shrink-0 text-[#201E64]" />

        <span className="text-xs font-semibold text-neutral-700">
          {formatDate(event.activity_date)}
        </span>
      </div>

      <div className="mt-3">
        <p
          className={`whitespace-pre-wrap break-words text-xs leading-5 text-neutral-500 ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>

        {description.length > 130 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-semibold text-[#201E64] hover:underline"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>

    </article>
  );
}
