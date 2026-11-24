import React, { useState } from "react";
import { formatDate, statusStyle } from "./fundingService";

const NAVY = "#201E64";
const DESCRIPTION_LIMIT = 90;

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle(
        status
      )}`}
    >
      {String(status || "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}

export default function FundingCard({ item, applied, submitting, hasLoadError, onApply }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description = item.description || "No description provided.";
  const isLongDescription = description.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    showFullDescription || !isLongDescription
      ? description
      : `${description.substring(0, DESCRIPTION_LIMIT).trim()}...`;

  const isOpen = item.status === "OPEN";
  const disabled = applied || !isOpen || submitting || hasLoadError;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <div className="flex h-full flex-1 flex-col p-4">
        {/* BADGES */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: NAVY }}
          >
            Funding
          </span>

          <StatusBadge status={item.status} />
        </div>

        {/* TITLE */}
        <h3 className="break-words text-base font-bold leading-5" style={{ color: NAVY }}>
          {item.title || "Not available"}
        </h3>

        {/* DESCRIPTION */}
        <div className="mt-2">
          <p className="whitespace-pre-wrap break-words text-xs leading-5 text-neutral-500">
            {displayedDescription}
          </p>

          {isLongDescription && (
            <button
              type="button"
              onClick={() => setShowFullDescription((previous) => !previous)}
              aria-expanded={showFullDescription}
              className="mt-1 text-xs font-semibold hover:underline"
              style={{ color: NAVY }}
            >
              {showFullDescription ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* DETAILS */}
        <dl className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
          {/* FUNDER */}
          <div className="flex items-start gap-3">
            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              Funder
            </dt>
            <dd className="min-w-0 break-words text-xs font-medium text-neutral-700">
              {item.institution_funder || "Not available"}
            </dd>
          </div>

          {/* PUBLISHED */}
          <div className="flex items-start gap-3">
            <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
              Published
            </dt>
            <dd className="text-xs font-medium text-neutral-700">
              {formatDate(item.created_at)}
            </dd>
          </div>
        </dl>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onApply(item)}
            className="flex flex-1 items-center justify-center px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: applied ? "#0F766E" : NAVY }}
          >
            {applied
              ? "Already Applied"
              : !isOpen
              ? "Applications Closed"
              : submitting
              ? "Applying..."
              : "Apply for Funding"}
          </button>
        </div>
      </div>
    </article>
  );
}