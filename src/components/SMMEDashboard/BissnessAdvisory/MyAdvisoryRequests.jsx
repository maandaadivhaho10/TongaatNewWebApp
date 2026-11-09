import React from "react";
import { STATUS_STYLES, formatDate, formatStatus } from "./advisoryService";

const NAVY = "#201E64";

export default function MyAdvisoryRequests({ requests, requestsLoading, requestsError, authLoading, isAuthenticated, onRefresh, onNewRequest }) {
  return (
    <section role="tabpanel" id="panel-mine" aria-labelledby="tab-mine" className="w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{requests.length > 0 ? `${requests.length} ${requests.length === 1 ? "request" : "requests"} submitted` : "Requests you submit will appear here."}</p>
        <button type="button" onClick={onRefresh} disabled={requestsLoading || authLoading || !isAuthenticated}
          className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60">
          {requestsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {requestsLoading && requests.length === 0 && <div className="border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">Loading your requests...</div>}
      {requestsError && (
        <div role="alert" className="mb-3 flex items-center justify-between gap-3 border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">{requestsError}</p>
          <button type="button" onClick={onRefresh} className="shrink-0 text-xs font-semibold text-red-700 underline">Try again</button>
        </div>
      )}
      {!authLoading && !isAuthenticated && <div className="border border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-500">Log in to see your advisory requests.</div>}
      {isAuthenticated && !requestsLoading && !requestsError && requests.length === 0 && (
        <div className="border border-neutral-200 bg-white px-4 py-6">
          <p className="text-sm text-neutral-500">You haven't submitted any advisory requests yet.</p>
          <button type="button" onClick={onNewRequest} className="mt-3 px-4 py-2 text-xs font-bold text-white transition hover:opacity-90" style={{ backgroundColor: NAVY }}>Make a request</button>
        </div>
      )}
      {requests.length > 0 && (
        <ul className="space-y-3">
          {requests.map((item, index) => {
            const id = item.request_id ?? item.advisory_request_id ?? item.advisory_id ?? item.id ?? index;
            const statusKey = String(item.status || "pending").toLowerCase().replace(/\s+/g, "_");
            const badge = STATUS_STYLES[statusKey] || "border-neutral-200 bg-neutral-100 text-neutral-600";
            return (
              <li key={id} className="border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 text-sm font-bold" style={{ color: NAVY }}>{item.subject || "Advisory request"}</h3>
                  <span className={`shrink-0 border px-2 py-0.5 text-[11px] font-semibold ${badge}`}>{formatStatus(item.status)}</span>
                </div>
                {item.description && <p className="mt-2 whitespace-pre-line break-words text-sm leading-5 text-neutral-600">{item.description}</p>}
                <div className="mt-3 flex gap-1 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-600">Request date:</span>
                  <span>{formatDate(item.request_date)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
