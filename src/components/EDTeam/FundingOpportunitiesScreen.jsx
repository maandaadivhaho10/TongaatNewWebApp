import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus, Search, RefreshCw, Landmark, Loader2,
  AlertCircle, CheckCircle2, CalendarDays, Building2,
  ChevronDown, ChevronUp, Wallet,
} from "lucide-react";
import api from "../../API/axiosInstance";

const NAVY = "#201E64";
const EMPTY_FORM = { title: "", institution_funder: "", description: "" };
const FILTERS = ["ALL", "OPEN", "CLOSED", "CANCELLED"];

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
};

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const statusClass = (status) => {
  switch (status) {
    case "OPEN": return "bg-green-50 text-green-700 border-green-200";
    case "CLOSED": return "bg-neutral-100 text-neutral-600 border-neutral-200";
    case "CANCELLED": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function FundingOpportunitiesScreen() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("list");
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const loadOpportunities = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    try {
      const response = await api.get("/funding");
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not fetch funding opportunities");
      }
      const data = response.data?.data;
      if (!Array.isArray(data)) throw new Error("Unexpected funding API response format");
      setOpportunities(data);
    } catch (error) {
      setLoadError(errorMessage(error, "Unable to load funding opportunities"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadOpportunities(); }, [loadOpportunities]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesStatus = filter === "ALL" || item.status === filter;
      const matchesQuery = !query || [item.title, item.institution_funder, item.description]
        .some((value) => String(value || "").toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [opportunities, search, filter]);

  const counts = useMemo(() => ({
    ALL: opportunities.length,
    OPEN: opportunities.filter((item) => item.status === "OPEN").length,
    CLOSED: opportunities.filter((item) => item.status === "CLOSED").length,
    CANCELLED: opportunities.filter((item) => item.status === "CANCELLED").length,
  }), [opportunities]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");
    const payload = {
      title: form.title.trim(),
      institution_funder: form.institution_funder.trim(),
      description: form.description.trim(),
    };
    if (!payload.title || !payload.institution_funder || !payload.description) {
      setFormError("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post("/funding", payload);
      if (response.data?.success !== true) {
        throw new Error(response.data?.message || "Unable to create funding opportunity");
      }
      setForm(EMPTY_FORM);
      setActiveTab("list");
      setSearch("");
      setFilter("ALL");
      setSuccess("Funding opportunity created successfully.");
      await loadOpportunities(true);
    } catch (error) {
      setFormError(errorMessage(error, "Failed to create funding opportunity"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-5 text-neutral-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#201E64]">Enterprise Development</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Funding Opportunities</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">Create and manage funding opportunities available to registered businesses.</p>
        </div>
      </div>

      <div role="tablist" aria-label="Funding opportunity sections" className="flex flex-wrap gap-2 border-b border-neutral-200">
        <button type="button" role="tab" aria-selected={activeTab === "list"}
          onClick={() => { setActiveTab("list"); setFormError(""); }}
          className={`px-4 py-3 text-sm font-semibold transition border-b-2 ${activeTab === "list" ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500 hover:text-[#201E64]"}`}>
          All Funding Opportunities
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "create"}
          onClick={() => { setActiveTab("create"); setFormError(""); setSuccess(""); }}
          className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition border-b-2 ${activeTab === "create" ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500 hover:text-[#201E64]"}`}>
          <Plus size={16} /> Create Funding Opportunity
        </button>
      </div>

      {success && activeTab === "list" && <div role="status" className="flex items-center gap-2 border border-green-200 bg-green-50 p-3 text-sm text-green-800"><CheckCircle2 size={18} />{success}</div>}

      {activeTab === "create" && (
        <section className="border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-4 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#201E64]">Create Funding Opportunity</h2>
            <p className="mt-1 text-xs text-neutral-500">Enter the funding programme details below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold text-neutral-700">
                Opportunity Title <span className="text-red-600">*</span>
                <input required maxLength={200} value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Small Business Growth Funding" className="mt-2 w-full border border-neutral-300 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]" />
              </label>
              <label className="block text-sm font-semibold text-neutral-700">
                Institution / Funder <span className="text-red-600">*</span>
                <input required maxLength={200} value={form.institution_funder} onChange={(e) => setForm((prev) => ({ ...prev, institution_funder: e.target.value }))}
                  placeholder="e.g. National Empowerment Fund" className="mt-2 w-full border border-neutral-300 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]" />
              </label>
            </div>
            <label className="block text-sm font-semibold text-neutral-700">
              Description <span className="text-red-600">*</span>
              <textarea required rows={5} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the funding opportunity, eligibility requirements and how it supports businesses..."
                className="mt-2 w-full resize-y border border-neutral-300 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]" />
            </label>
            <p className="text-xs text-neutral-500">New funding opportunities are published with an OPEN status automatically.</p>
            {formError && <p role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{formError}</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end">
              <button type="button" disabled={submitting} onClick={() => { setActiveTab("list"); setFormError(""); }} className="border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 bg-[#201E64] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#302C85] disabled:cursor-not-allowed disabled:opacity-60">
                {submitting ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                {submitting ? "Publishing..." : "Publish Opportunity"}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === "list" && (
        <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {FILTERS.map((key) => (
          <button key={key} type="button" onClick={() => setFilter(key)}
            className={`border p-4 text-left transition ${filter === key ? "border-[#201E64] bg-[#201E64]/5" : "border-neutral-200 bg-white hover:border-[#201E64]/40"}`}>
            <p className="text-xs font-semibold text-neutral-500">{key === "ALL" ? "Total Opportunities" : key.charAt(0) + key.slice(1).toLowerCase()}</p>
            <p className="mt-2 text-2xl font-extrabold text-[#201E64]">{counts[key]}</p>
          </button>
        ))}
      </div>

      <section className="border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-base font-bold text-[#201E64]">Published Opportunities</h2>
            <p className="mt-1 text-xs text-neutral-500">{filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} shown</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search funding..." aria-label="Search funding opportunities"
                className="w-full border border-neutral-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#201E64]" />
            </div>
            <button type="button" onClick={() => loadOpportunities(true)} disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {loadError && <div role="alert" className="m-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" /><span className="flex-1">{loadError}</span><button type="button" onClick={() => loadOpportunities(true)} className="font-semibold underline">Retry</button></div>}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-neutral-500"><Loader2 size={20} className="animate-spin text-[#201E64]" /> Loading funding opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <Wallet size={36} className="text-neutral-300" />
            <h3 className="mt-3 font-bold text-neutral-800">{opportunities.length === 0 ? "No funding opportunities yet" : "No matching opportunities"}</h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">{opportunities.length === 0 ? "Create your first funding opportunity to see it here." : "Try another search or select a different status."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
            {filtered.map((item) => {
              const expanded = expandedId === item.funding_id;
              return (
                <article key={item.funding_id} className="flex min-w-0 flex-col border border-neutral-200 bg-white p-4 transition hover:border-[#201E64]/30 hover:shadow-sm sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#201E64]/10 text-[#201E64]"><Landmark size={20} /></div>
                    <span className={`border px-2.5 py-1 text-[11px] font-bold ${statusClass(item.status)}`}>{item.status || "UNKNOWN"}</span>
                  </div>
                  <h3 className="mt-4 break-words text-base font-bold text-[#201E64]">{item.title}</h3>
                  <p className="mt-2 flex items-start gap-2 break-words text-xs font-medium text-neutral-600"><Building2 size={15} className="mt-0.5 shrink-0" />{item.institution_funder}</p>
                  <p className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 ${expanded ? "" : "line-clamp-3"}`}>{item.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400"><CalendarDays size={14} />{formatDate(item.created_at)}</span>
                      <button type="button" onClick={() => setExpandedId(expanded ? null : item.funding_id)} aria-expanded={expanded}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#201E64] hover:underline">
                        {expanded ? "Show less" : "View details"}{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                    {expanded && <div className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">Published by: {[item.publisher_first_name, item.publisher_last_name].filter(Boolean).join(" ") || "ED Team"}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
        </>
      )}
    </div>
  );
}
