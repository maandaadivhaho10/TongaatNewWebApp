import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, X } from "lucide-react";
import FundingCard from "./FundingCard";
import FundingApplicationCard from "./FundingApplicationCard";
import FundingConfirmModal from "./FundingConfirmModal";
import { getError, getFundingOpportunities, getMyFundingApplications, submitFundingApplication } from "./fundingService";

const TABS = [{ id: "available", label: "Funding Opportunities" }, { id: "applied", label: "My Applications" }];

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

  const loadData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    const [opportunitiesResult, applicationsResult] = await Promise.allSettled([
      getFundingOpportunities(), getMyFundingApplications(),
    ]);
    const failures = [];
    if (opportunitiesResult.status === "fulfilled") {
      const payload = opportunitiesResult.value.data;
      if (payload?.success === false || !Array.isArray(payload?.data)) failures.push(payload?.message || "Unexpected funding opportunities response.");
      else setOpportunities(payload.data);
    } else failures.push(getError(opportunitiesResult.reason, "Could not load funding opportunities."));
    if (applicationsResult.status === "fulfilled") {
      const payload = applicationsResult.value.data;
      if (payload?.success === false || !Array.isArray(payload?.data)) failures.push(payload?.message || "Unexpected applications response.");
      else setApplications(payload.data);
    } else failures.push(getError(applicationsResult.reason, "Could not load your applications."));
    setLoadError(failures.join(" "));
    setLoading(false);
    setRefreshing(false);
    return failures.length === 0;
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const appliedIds = useMemo(() => new Set(applications.map(item => String(item.funding_id))), [applications]);
  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return opportunities.filter(item => !query || [item.title, item.institution_funder, item.description]
      .some(value => String(value || "").toLowerCase().includes(query)));
  }, [opportunities, search]);
  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter(item => !query || [item.title, item.institution_funder, item.description, item.status]
      .some(value => String(value || "").toLowerCase().includes(query)));
  }, [applications, search]);

  const openConfirm = (item) => {
    if (item.status !== "OPEN" || appliedIds.has(String(item.funding_id))) return;
    setActionError("");
    setNotice("");
    setConfirmOpportunity(item);
  };

  const applyForFunding = async () => {
    if (!confirmOpportunity || submittingId !== null) return;
    const selected = confirmOpportunity;
    const id = selected.funding_id;
    setSubmittingId(id);
    setActionError("");
    try {
      const response = await submitFundingApplication(id);
      if (response.data?.success !== true) throw new Error(response.data?.message || "Application could not be submitted.");
      const created = response.data?.data || {};
      setApplications(previous => previous.some(item => String(item.funding_id) === String(id)) ? previous : [{
        ...created, funding_id: id, title: selected.title, institution_funder: selected.institution_funder,
        description: selected.description, funding_status: selected.status,
        status: created.status || "SUBMITTED", response_date: new Date().toISOString(),
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
      } else setActionError(getError(error, "Unable to submit your funding application."));
    } finally { setSubmittingId(null); }
  };

  return <div className="w-full min-w-0 space-y-5 text-neutral-900">
    <header>
      <p className="text-xs font-bold uppercase tracking-wider text-[#201E64]">SMME Portal</p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#201E64] sm:text-3xl">Funding Opportunities</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">Explore funding opportunities, submit an application and track your application status.</p>
    </header>
    <div role="tablist" aria-label="Funding sections" className="flex flex-wrap gap-2 border-b border-neutral-200">
      {TABS.map(({ id, label }) => <button key={id} type="button" role="tab" aria-selected={tab === id}
        onClick={() => { setTab(id); setSearch(""); setNotice(""); }}
        className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-5 ${tab === id ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500 hover:text-[#201E64]"}`}>
        {label}{id === "applied" && <span className="bg-[#201E64]/10 px-2 py-0.5 text-xs text-[#201E64]">{applications.length}</span>}
      </button>)}
    </div>
    {notice && <div role="status" className="flex items-start gap-2 border border-green-200 bg-green-50 p-3 text-sm text-green-800">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" /><span className="flex-1">{notice}</span>
      <button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}><X size={17} /></button>
    </div>}
    {loadError && <div role="alert" className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" /><span className="flex-1">{loadError}</span>
      <button type="button" className="font-semibold underline" onClick={() => loadData(true)}>Retry</button>
    </div>}
    <section className="border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div><h2 className="text-base font-bold text-[#201E64]">{tab === "available" ? "Available Funding Opportunities" : "My Funding Applications"}</h2>
          <p className="mt-1 text-xs text-neutral-500">{tab === "available" ? `${filteredOpportunities.length} opportunities shown` : `${filteredApplications.length} applications shown`}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder={tab === "available" ? "Search funding..." : "Search applications..."} aria-label="Search funding" className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-[#201E64] sm:w-64" />
          <button type="button" disabled={loading || refreshing} onClick={() => loadData(true)} className="border border-neutral-300 px-4 py-2.5 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50">{refreshing ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>
      {loading ? <div className="flex min-h-48 items-center justify-center p-6 text-sm text-neutral-500">Loading funding information...</div>
        : tab === "available" ? filteredOpportunities.length === 0 ? <div className="px-5 py-14 text-center">
          <h3 className="font-bold">No funding opportunities found</h3><p className="mt-1 text-sm text-neutral-500">Try another search, or check again later.</p>
        </div> : <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 sm:p-5">
          {filteredOpportunities.map(item => <FundingCard key={item.funding_id} item={item} applied={appliedIds.has(String(item.funding_id))} submitting={submittingId !== null} hasLoadError={Boolean(loadError)} onApply={openConfirm} />)}
        </div> : filteredApplications.length === 0 ? <div className="px-5 py-14 text-center">
          <h3 className="font-bold">No applications found</h3><p className="mt-1 text-sm text-neutral-500">Apply for a funding opportunity to see it here.</p>
          <button type="button" onClick={() => { setTab("available"); setSearch(""); }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#201E64] hover:underline"><ArrowLeft size={16} /> Browse opportunities</button>
        </div> : <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 sm:p-5">
          {filteredApplications.map(item => <FundingApplicationCard key={item.funding_response_id || item.funding_id} item={item} />)}
        </div>}
    </section>
    <FundingConfirmModal opportunity={confirmOpportunity} submitting={submittingId !== null} error={actionError} onClose={() => setConfirmOpportunity(null)} onConfirm={applyForFunding} />
  </div>;
}
