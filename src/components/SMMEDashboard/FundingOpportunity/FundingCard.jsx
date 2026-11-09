import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDate, statusStyle } from "./fundingService";

export function StatusBadge({ status }) {
  return <span className={`inline-flex shrink-0 items-center border px-2.5 py-1 text-[11px] font-bold ${statusStyle(status)}`}>
    {String(status || "UNKNOWN").replaceAll("_", " ")}
  </span>;
}

export default function FundingCard({ item, applied, submitting, hasLoadError, onApply }) {
  const [expanded, setExpanded] = useState(false);
  const description = item.description || "No description provided.";
  const longDescription = description.length > 170;

  return <article className="group flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-none border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#201E64]/30 hover:shadow-md">
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="flex justify-end"><StatusBadge status={item.status} /></div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Title</p>
        <h3 className="mt-1 break-words text-lg font-bold leading-snug text-[#201E64]">{item.title || "Not available"}</h3>
      </div>
      <div className="mt-4 border border-neutral-100 bg-neutral-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Funder</p>
        <p className="mt-1 break-words text-sm font-semibold text-neutral-700">{item.institution_funder || "Not available"}</p>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description</p>
        <p className={`mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 ${!expanded && longDescription ? "line-clamp-3" : ""}`}>{description}</p>
        {longDescription && <button type="button" onClick={() => setExpanded(v => !v)} aria-expanded={expanded} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#201E64] hover:underline">
          {expanded ? "See less" : "See more"}{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>}
      </div>
      <div className="mt-auto pt-5">
        <div className="flex items-center gap-2 border-t border-neutral-100 py-3 text-xs text-neutral-500">Published {formatDate(item.created_at)}</div>
        <button type="button" disabled={applied || item.status !== "OPEN" || submitting || hasLoadError} onClick={() => onApply(item)} className="inline-flex w-full items-center justify-center gap-2 bg-[#201E64] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#302C85] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500">
          {applied ? "Already Applied" : item.status !== "OPEN" ? "Applications Closed" : "Apply for Funding"}
        </button>
      </div>
    </div>
  </article>;
}
