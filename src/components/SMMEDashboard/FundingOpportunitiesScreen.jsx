import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, RefreshCw, CalendarDays,
  CheckCircle2, AlertCircle,
  Loader2, Send, ArrowLeft, X, ChevronDown, ChevronUp,
} from "lucide-react";
import api from "../../API/axiosInstance";

const NAVY = "#201E64";
const TABS = [
  { id: "available", label: "Funding Opportunities" },
  { id: "applied", label: "My Applications" },
];

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function getError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function statusStyle(status) {
  switch (status) {
    case "OPEN":
    case "ACCEPTED": return "border-green-200 bg-green-50 text-green-700";
    case "UNDER_REVIEW": return "border-blue-200 bg-blue-50 text-blue-700";
    case "SUBMITTED": return "border-amber-200 bg-amber-50 text-amber-700";
    case "REJECTED":
    case "CANCELLED": return "border-red-200 bg-red-50 text-red-700";
    default: return "border-neutral-200 bg-neutral-100 text-neutral-700";
  }
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex shrink-0 items-center border px-2.5 py-1 text-[11px] font-bold ${statusStyle(status)}`}>
      {String(status || "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}

export default function FundingOpportunitiesScreen() {
  const [tab, setTab] = useState("available");
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [confirmOpportunity, setConfirmOpportunity] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const toggleDescription = (key) => setExpandedDescriptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const loadData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setLoadError("");

    // Both requests are necessary: the opportunity list alone cannot tell us
    // which opportunities the authenticated supplier has already applied for.
    const [opportunitiesResult, applicationsResult] = await Promise.allSettled([
      api.get("/funding"),
      api.get("/funding/my-applications"),
    ]);

    const failures = [];
    if (opportunitiesResult.status === "fulfilled") {
      const payload = opportunitiesResult.value.data;
      if (payload?.success === false || !Array.isArray(payload?.data)) {
        failures.push(payload?.message || "Unexpected funding opportunities response.");
      } else {
        setOpportunities(payload.data);
      }
    } else {
      failures.push(getError(opportunitiesResult.reason, "Could not load funding opportunities."));
    }

    if (applicationsResult.status === "fulfilled") {
      const payload = applicationsResult.value.data;
      if (payload?.success === false || !Array.isArray(payload?.data)) {
        failures.push(payload?.message || "Unexpected applications response.");
      } else {
        setApplications(payload.data);
      }
    } else {
      failures.push(getError(applicationsResult.reason, "Could not load your applications."));
    }

    setLoadError(failures.join(" "));
    setLoading(false);
    setRefreshing(false);
    return failures.length === 0;
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const appliedIds = useMemo(
    () => new Set(applications.map((item) => String(item.funding_id))),
    [applications]
  );

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return opportunities.filter((item) => {
      const searchMatches = !query || [item.title, item.institution_funder, item.description]
        .some((value) => String(value || "").toLowerCase().includes(query));
      return searchMatches;
    });
  }, [opportunities, search]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((item) => !query || [
      item.title, item.institution_funder, item.description, item.status,
    ].some((value) => String(value || "").toLowerCase().includes(query)));
  }, [applications, search]);

  const openConfirm = (item) => {
    if (item.status !== "OPEN" || appliedIds.has(String(item.funding_id))) return;
    setActionError("");
    setNotice("");
    setConfirmOpportunity(item);
  };

  const applyForFunding = async () => {
    if (!confirmOpportunity || submittingId !== null) return;
    const id = confirmOpportunity.funding_id;
    setSubmittingId(id);
    setActionError("");
    try {
      const response = await api.post(`/funding/${id}/apply`);
      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Application could not be submitted.");
      }
      // Update immediately even if a follow-up fetch is temporarily unavailable.
      const created = response.data?.data || {};
      setApplications((previous) => previous.some((item) => String(item.funding_id) === String(id))
        ? previous
        : [{
            ...created,
            funding_id: id,
            title: confirmOpportunity.title,
            institution_funder: confirmOpportunity.institution_funder,
            description: confirmOpportunity.description,
            funding_status: confirmOpportunity.status,
            status: created.status || "SUBMITTED",
            response_date: new Date().toISOString(),
          }, ...previous]);
      setConfirmOpportunity(null);
      setNotice("Your funding application was submitted successfully.");
      setTab("applied");
      setSearch("");
      await loadData(true);
    } catch (error) {
      if (error?.response?.status === 409) {
        setConfirmOpportunity(null);
        setNotice("You have already applied for this funding opportunity.");
        setTab("applied");
        await loadData(true);
      } else {
        setActionError(getError(error, "Unable to submit your funding application."));
      }
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-5 text-neutral-900">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-[#201E64]">SMME Portal</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: NAVY }}>
          Funding Opportunities
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Explore funding opportunities, submit an application and track your application status.
        </p>
      </header>

      <div role="tablist" aria-label="Funding sections" className="flex flex-wrap gap-2 border-b border-neutral-200">
        {TABS.map(({ id, label }) => ( 
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => { setTab(id); setSearch(""); setNotice(""); }}
            className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-5 ${
              tab === id ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500 hover:text-[#201E64]"
            }`}
          >
            {label}
            {id === "applied" && <span className="bg-[#201E64]/10 px-2 py-0.5 text-xs text-[#201E64]">{applications.length}</span>}
          </button>
        ))}
      </div>

      {notice && (
        <div role="status" className="flex items-start gap-2 border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{notice}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}><X size={17} /></button>
        </div>
      )}
      {loadError && (
        <div role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="flex-1">{loadError}</span>
          <button type="button" className="font-semibold underline" onClick={() => loadData(true)}>Retry</button>
        </div>
      )}

      <section className="border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-base font-bold text-[#201E64]">
              {tab === "available" ? "Available Funding Opportunities" : "My Funding Applications"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {tab === "available" ? `${filteredOpportunities.length} opportunities shown` : `${filteredApplications.length} applications shown`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-64">
              
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={tab === "available" ? "Search funding..." : "Search applications..."}
                aria-label="Search funding"
                className="w-full border border-neutral-300 py-2.5 px-3 text-sm outline-none focus:border-[#201E64]"
              />
            </div>
            <button
              type="button"
              disabled={loading || refreshing}
              onClick={() => loadData(true)}
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 p-6 text-sm text-neutral-500">
            Loading funding information...
          </div>
        ) : tab === "available" ? (
          filteredOpportunities.length === 0 ? (
            <div className="px-5 py-14 text-center">
              
              <h3 className="mt-3 font-bold">No funding opportunities found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try another search, or check again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 sm:p-5">
              {filteredOpportunities.map((item) => {
                const applied = appliedIds.has(String(item.funding_id));
                const descriptionKey = `opportunity-${item.funding_id}`;
                const expanded = Boolean(expandedDescriptions[descriptionKey]);
                const description = item.description || "No description provided.";
                const longDescription = description.length > 170;
                return (
                  <article key={item.funding_id} className="group flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-none border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#201E64]/30 hover:shadow-md">
                    
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex justify-end">
                        
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Title</p>
                        <h3 className="mt-1 break-words text-lg font-bold leading-snug text-[#201E64]">{item.title || "Not available"}</h3>
                      </div>
                      <div className="mt-4 border border-neutral-100 bg-neutral-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Funder</p>
                        <p className="mt-1 flex items-start gap-2 break-words text-sm font-semibold text-neutral-700">{item.institution_funder || "Not available"}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description</p>
                        <p className={`mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 ${!expanded && longDescription ? "line-clamp-3" : ""}`}>{description}</p>
                        {longDescription && (
                          <button type="button" onClick={() => toggleDescription(descriptionKey)} aria-expanded={expanded} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#201E64] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#201E64]">
                            {expanded ? "See less" : "See more"} {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                        )}
                      </div>
                      <div className="mt-auto pt-5">
                        <div className="flex items-center gap-2 border-t border-neutral-100 py-3 text-xs text-neutral-500">Published {formatDate(item.created_at)}</div>
                        <button type="button" disabled={applied || item.status !== "OPEN" || submittingId !== null || Boolean(loadError)} onClick={() => openConfirm(item)} className="inline-flex w-full items-center justify-center gap-2 bg-[#201E64] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#302C85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#201E64] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500">
                          {applied ? <>Already Applied</> : item.status !== "OPEN" ? "Applications Closed" : <>Apply for Funding</>}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : filteredApplications.length === 0 ? (
          <div className="px-5 py-14 text-center">
            
            <h3 className="mt-3 font-bold">No applications found</h3>
            <p className="mt-1 text-sm text-neutral-500">Apply for a funding opportunity to see it here.</p>
            <button type="button" onClick={() => { setTab("available"); setSearch(""); }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#201E64] hover:underline">
              <ArrowLeft size={16} /> Browse opportunities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 sm:p-5">
            {filteredApplications.map((item) => {
              const descriptionKey = `application-${item.funding_response_id || item.funding_id}`;
              const expanded = Boolean(expandedDescriptions[descriptionKey]);
              const description = item.description || "No description provided.";
              const longDescription = description.length > 170;
              return (
                <article key={item.funding_response_id || item.funding_id} className="flex min-h-[360px] min-w-0 flex-col overflow-hidden rounded-none border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex justify-end">
                      
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Title</p>
                      <h3 className="mt-1 break-words text-lg font-bold leading-snug text-[#201E64]">{item.title || "Not available"}</h3>
                    </div>
                    <div className="mt-4 border border-neutral-100 bg-neutral-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Funder</p>
                      <p className="mt-1 flex items-start gap-2 break-words text-sm font-semibold text-neutral-700">{item.institution_funder || "Not available"}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description</p>
                      <p className={`mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 ${!expanded && longDescription ? "line-clamp-3" : ""}`}>{description}</p>
                      {longDescription && <button type="button" onClick={() => toggleDescription(descriptionKey)} aria-expanded={expanded} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#201E64] hover:underline">{expanded ? "See less" : "See more"}{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>}
                    </div>
                    <div className="mt-auto space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                      <p>Opportunity status: <span className="font-semibold text-neutral-700">{item.funding_status || "Not available"}</span></p>
                      <p className="flex items-center gap-2"> Applied {formatDate(item.response_date || item.created_at)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {confirmOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && submittingId === null) setConfirmOpportunity(null);
        }}>
          <div role="dialog" aria-modal="true" aria-labelledby="funding-confirm-title" className="w-full max-w-lg border border-neutral-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex justify-end">
              <h2 id="funding-confirm-title" className="text-lg font-bold text-[#201E64]">Confirm Funding Application</h2>
              <button type="button" disabled={submittingId !== null} onClick={() => setConfirmOpportunity(null)} aria-label="Close confirmation" className="text-neutral-500 hover:text-neutral-900 disabled:opacity-50"><X size={20} /></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Apply for <strong>{confirmOpportunity.title}</strong> offered by <strong>{confirmOpportunity.institution_funder}</strong>?
            </p>
            <p className="mt-3 text-xs leading-5 text-neutral-500">Your registered business information will be associated with this application. You can submit only once per opportunity.</p>
            {actionError && <div role="alert" className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{actionError}</div>}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={submittingId !== null} onClick={() => setConfirmOpportunity(null)} className="border border-neutral-300 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50">Cancel</button>
              <button type="button" disabled={submittingId !== null} onClick={applyForFunding} className="inline-flex items-center justify-center gap-2 bg-[#201E64] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#302C85] disabled:opacity-50">
                {submittingId !== null && <Loader2 size={17} className="animate-spin" />}
                {submittingId !== null ? "Submitting..." : "Confirm Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
