import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "./fundingService";
import { StatusBadge } from "./FundingCard";

export default function FundingApplicationCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const description = item.description || "No description provided.";
  const longDescription = description.length > 170;
  return <article className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-none border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
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
      <div className="mt-auto space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        <p>Opportunity status: <span className="font-semibold text-neutral-700">{item.funding_status || "Not available"}</span></p>
        <p>Applied {formatDate(item.response_date || item.created_at)}</p>
      </div>
    </div>
  </article>;
}
