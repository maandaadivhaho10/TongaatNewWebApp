import React, { useCallback, useEffect, useMemo, useState } from "react";



import { Search, RefreshCw, ChevronRight, X, Inbox, FileText, AlertCircle, MessageCircle } from "lucide-react";



import api from "../../API/axiosInstance";

import { useAuth } from "../../context/AuthContext";



import { SupplierDetails } from "./SuppliersScreen";



const ADVISORY_ENDPOINT = "/advisory/requests";



const STATUS_ENDPOINT = (id) => `/advisory/requests/${id}/status`;



const STATUSES = ["PENDING", "IN REVIEW", "COMPLETED"];



const display = (value) => value == null || value === "" ? "Not provided" : String(value);



const statusName = (value) => String(value || "PENDING").toUpperCase().replaceAll("_", " ");



const formatDate = (value) => {



  if (!value) return "Not provided";



  const d = new Date(value);



  return Number.isNaN(d.getTime()) ? display(value) : new Intl.DateTimeFormat("en-ZA", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Johannesburg" }).format(d);



};



const formatBeeLevel = (value) => {



  const raw = String(value ?? "").trim();



  if (!raw) return "Not provided";



  const match = raw.match(/^(?:level\s*)?([1-8])$/i);



  return match ? `Level ${match[1]}` : raw;



};



const supplierName = (supplier = {}) => [supplier.title, supplier.first_name, supplier.last_name].filter(Boolean).join(" ") || "Unknown supplier";



const provided = (status) => ["SUBMITTED", "REGISTERED", "PROVIDED"].includes(String(status || "").toUpperCase());



const docStatuses = (supplier = {}) => ({



  bee_document: supplier.document_status?.bee_document || (supplier.bee_document_submitted ? "SUBMITTED" : "NOT_SUBMITTED"),



  financial_statement: supplier.document_status?.financial_statement || (supplier.has_financial_statement ? "SUBMITTED" : "NOT_SUBMITTED"),



  company_registration: supplier.document_status?.company_registration || (supplier.has_company_registration_document ? "SUBMITTED" : "NOT_SUBMITTED"),



  vat_registration: supplier.document_status?.vat_registration || (supplier.has_vat_registration ? "REGISTERED" : "NOT_REGISTERED"),



  tax_compliance_pin: supplier.document_status?.tax_compliance_pin || (supplier.has_tax_compliance_pin ? "PROVIDED" : "NOT_PROVIDED"),



});



// Match the scoring logic in SuppliersScreen: affidavits are visible, but worth zero points.



const beeDocumentType = (supplier = {}) => {



  const explicit = String(supplier.bee_document_type || "").toUpperCase();



  if (explicit.includes("AFFIDAVIT")) return "BEE_AFFIDAVIT";



  if (explicit.includes("CERTIFICATE")) return "BEE_CERTIFICATE";



  const docs = supplier.documents || [];



  if (docs.some(d => String(d.document_type).toUpperCase() === "BEE_AFFIDAVIT")) return "BEE_AFFIDAVIT";



  if (docs.some(d => String(d.document_type).toUpperCase() === "BEE_CERTIFICATE")) return "BEE_CERTIFICATE";



  return null;



};



const score = (supplier = {}) => {



  const statuses = docStatuses(supplier);



  const otherKeys = ["financial_statement", "company_registration", "vat_registration", "tax_compliance_pin"];



  const otherPoints = otherKeys.filter(key => provided(statuses[key])).length;



  return otherPoints + (provided(statuses.bee_document) && beeDocumentType(supplier) === "BEE_CERTIFICATE" ? 1 : 0);



};



const SCORE_FILTERS = [



  { key: "ALL", label: "All Scores", match: () => true },



  { key: "COMPLIANT", label: "Compliant", match: n => n === 5 },



  { key: "SEMI", label: "Semi-compliant", match: n => n >= 3 && n <= 4 },



  { key: "NON", label: "Non-compliant", match: n => n >= 1 && n <= 2 },



];



function StatusBadge({ status }) {



  const s = statusName(status);



  const cls = s === "COMPLETED" ? "bg-green-50 text-green-700" : s === "IN REVIEW" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700";



  return <span className={`inline-flex whitespace-nowrap px-2.5 py-1 text-[11px] font-bold ${cls}`}>{s}</span>;



}



function RequestDetails({ request, onClose, onOpenSupplier, onStatusUpdate, saving, updateError, supplierModalOpen, onMessageSupplier }) {



  const [draft, setDraft] = useState("PENDING");



  useEffect(() => setDraft(statusName(request?.status)), [request?.advisory_request_id, request?.status]);



  useEffect(() => {



    if (!request) return;



    const keydown = (e) => { if (e.key === "Escape" && !supplierModalOpen) onClose(); };



    window.addEventListener("keydown", keydown);



    return () => window.removeEventListener("keydown", keydown);



  }, [request, onClose, supplierModalOpen]);



  if (!request) return null;



  const supplier = request.supplier || {};



  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-5" onMouseDown={e => { if (e.target === e.currentTarget && !supplierModalOpen) onClose(); }}>



    <div role="dialog" aria-modal="true" aria-label="Advisory request details" className="flex max-h-[95dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:max-h-[90dvh] sm:max-w-3xl">



      <header className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5">



        <div><h2 className="text-lg font-bold text-[#201E64]">Business Advisory Request #{request.advisory_request_id}</h2><p className="mt-1 text-sm text-neutral-500">{display(request.subject)}</p></div>



        <button type="button" aria-label="Close" onClick={onClose} className="p-2 hover:bg-neutral-100"><X size={20} /></button>



      </header>



      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">



        <section className="space-y-3">



          <div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-bold text-[#201E64]">Request Information</h3><StatusBadge status={request.status}/></div>



          <div className="grid gap-3 sm:grid-cols-2">



            {[["Subject", request.subject], ["Request Date", formatDate(request.request_date)], ["Preferred Date", formatDate(request.preferred_date)], ["Assigned To (User ID)", request.assigned_to]].map(([label, value]) =>



              <div key={label} className="border border-neutral-200 bg-neutral-50 p-3"><p className="text-[11px] font-bold uppercase text-neutral-400">{label}</p><p className="mt-1 break-words text-sm font-semibold">{display(value)}</p></div>)}



          </div>



          <div className="border border-neutral-200 bg-neutral-50 p-4"><p className="text-[11px] font-bold uppercase text-neutral-400">Description</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{display(request.description)}</p></div>



        </section>



        <section className="space-y-3">



          <h3 className="text-sm font-bold text-[#201E64]">Update Advisory Request Status</h3>



          <div className="flex flex-wrap items-end gap-3 border border-neutral-200 p-4">



            <label className="flex min-w-[170px] flex-1 flex-col gap-1 text-xs font-semibold">Status



              <select value={draft} onChange={e => setDraft(e.target.value)} disabled={saving} className="h-10 border border-neutral-300 bg-white px-3 text-sm">



                {!STATUSES.includes(draft) && <option value={draft}>{draft}</option>}



                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}



              </select>



            </label>



            <button type="button" disabled={saving || draft === statusName(request.status)} onClick={() => onStatusUpdate(request.advisory_request_id, draft)} className="h-10 bg-[#201E64] px-4 text-xs font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Status"}</button>



          </div>



          {updateError && <p role="alert" className="text-xs text-red-700">{updateError}</p>}



        </section>



        <section className="space-y-3">



          <h3 className="text-sm font-bold text-[#201E64]">Supplier Who Applied</h3>



          <div className="flex flex-wrap items-center justify-between gap-4 border border-neutral-200 p-4">



            <div><p className="font-bold text-[#201E64]">{supplierName(supplier)}</p><p className="mt-1 text-xs text-neutral-500">{display(supplier.business_name)}</p><p className="mt-2 text-xs font-semibold text-[#201E64]">B-BBEE: {formatBeeLevel(supplier.bee_level)}</p><p className="mt-2 text-xs text-neutral-500">Document Score: <strong className="text-[#201E64]">{score(supplier)}/5</strong></p></div>



            <div className="flex flex-wrap gap-2">



              <button type="button" onClick={() => onOpenSupplier("documents")} className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-2 text-xs font-bold text-[#201E64]"><FileText size={15}/>{score(supplier)}/5 Documents</button>



              <button type="button" onClick={() => onMessageSupplier?.(Number(supplier.user_id || request.user_id))} disabled={!Number(supplier.user_id || request.user_id)} title="Message this supplier" className="inline-flex items-center gap-1 rounded-lg border border-[#201E64]/20 px-3 py-2 text-xs font-bold text-[#201E64] hover:bg-indigo-50 disabled:opacity-40"><MessageCircle size={16}/> Message</button>
              <button type="button" onClick={() => onOpenSupplier("information")} className="inline-flex items-center gap-1 bg-[#201E64] px-3 py-2 text-xs font-bold text-white">View Supplier Details <ChevronRight size={15}/></button>



            </div>



          </div>



          <p className="text-xs text-neutral-500">View Supplier Details opens the exact same supplier information and document tabs as your Suppliers screen, including tax compliance controls.</p>



        </section>



      </div>



      <footer className="flex justify-end border-t border-neutral-200 p-4"><button onClick={onClose} className="bg-[#201E64] px-5 py-2 text-xs font-bold text-white">Close</button></footer>



    </div>



  </div>;



}



export default function BusinessRequestsScreen({ onMessageSupplier }) {

  const { loading: authLoading, isAuthenticated } = useAuth();



  const [requests, setRequests] = useState([]);



  const [search, setSearch] = useState("");



  const [filter, setFilter] = useState("ALL");



  const [scoreFilter, setScoreFilter] = useState("ALL");



  const [page, setPage] = useState(1);



  const PAGE_SIZE = 10;



  const [selectedId, setSelectedId] = useState(null);



  const [supplierTab, setSupplierTab] = useState(null);



  const [loading, setLoading] = useState(true);



  const [error, setError] = useState("");



  const [saving, setSaving] = useState(false);



  const [updateError, setUpdateError] = useState("");



  const fetchRequests = useCallback(async () => {



    try {



      setLoading(true); setError("");



      const response = await api.get(ADVISORY_ENDPOINT);



      if (!response.data?.success || !Array.isArray(response.data.requests)) throw new Error("Unexpected advisory API response");



      setRequests(response.data.requests.map(r => ({ ...r, status: statusName(r.status), supplier: r.supplier || {} })));



    } catch (err) { setError(err.response?.data?.message || err.message || "Failed to load requests"); }



    finally { setLoading(false); }



  }, []);



  useEffect(() => {

    if (authLoading) return;

    if (!isAuthenticated) {

      setLoading(false);

      setRequests([]);

      setError("Please log in to view business advisory requests.");

      return;

    }

    fetchRequests();

  }, [authLoading, isAuthenticated, fetchRequests]);



  const selected = requests.find(r => r.advisory_request_id === selectedId) || null;



  const filtered = useMemo(() => requests.filter(r => {



    const s = r.supplier || {};



    const text = [r.subject, r.description, s.first_name, s.last_name, s.business_name, s.bee_level, formatBeeLevel(s.bee_level), s.community, s.industry].join(" ").toLowerCase();



    return (filter === "ALL" || r.status === filter) && SCORE_FILTERS.find(f => f.key === scoreFilter).match(score(s)) && text.includes(search.trim().toLowerCase());



  }), [requests, filter, scoreFilter, search]);



  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));



  const currentPage = Math.min(page, totalPages);



  const paginated = useMemo(() => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filtered, currentPage]);



  useEffect(() => { setPage(1); }, [search, filter, scoreFilter]);



  const count = status => requests.filter(r => r.status === status).length;



  const updateStatus = async (id, status) => {

    if (authLoading || !isAuthenticated) {

      setUpdateError("Please log in before updating a request.");

      return;

    }



    try {



      setSaving(true); setUpdateError("");



      await api.patch(STATUS_ENDPOINT(id), { status });



      setRequests(current => current.map(r => r.advisory_request_id === id ? { ...r, status } : r));



    } catch (err) { setUpdateError(err.response?.data?.message || "Unable to save status. Check that the PATCH endpoint exists and is authorized."); }



    finally { setSaving(false); }



  };



  const updateTax = (businessId, status) => setRequests(current => current.map(r => r.supplier?.business_id === businessId ? { ...r, supplier: { ...r.supplier, tax_compliance_status: status } } : r));



  const open = id => { setSelectedId(id); setSupplierTab(null); setUpdateError(""); };



  const close = () => { setSelectedId(null); setSupplierTab(null); };



  return <div className="w-full min-w-0">



    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-extrabold text-[#201E64] sm:text-3xl">Business Requests</h1><p className="mt-1 text-sm text-neutral-500">Business advisory requests from registered suppliers.</p></div><button onClick={fetchRequests} disabled={loading || authLoading || !isAuthenticated} className="inline-flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs font-bold text-[#201E64]"><RefreshCw size={15} className={loading ? "animate-spin" : ""}/> Refresh</button></div>



    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{[["Pending", count("PENDING")], ["In Review", count("IN REVIEW")], ["Completed", count("COMPLETED")]].map(([label, value]) => <div key={label} className="border border-neutral-200 bg-white p-4"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 text-2xl font-bold text-[#201E64]">{value}</p></div>)}</div>



    <div className="flex flex-col gap-3 border border-neutral-200 p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subject, supplier or B-BBEE level..." className="h-10 w-full border border-neutral-300 pl-9 pr-3 text-sm"/></label><select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 border border-neutral-300 px-3 text-sm"><option value="ALL">All statuses</option>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>



    {/* Filter by document submission score (not official compliance). */}



    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter requests by document score">



      {SCORE_FILTERS.map(option => (



        <button key={option.key} type="button" onClick={() => setScoreFilter(option.key)} aria-pressed={scoreFilter === option.key}



          className={`border px-3 py-2 text-xs font-semibold transition ${scoreFilter === option.key ? "border-[#201E64] bg-[#201E64] text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-[#201E64]"}`}>



          {option.label}



        </button>



      ))}



    </div>



    <p className="mt-2 text-xs text-neutral-500">Document submission scores are not official compliance ratings. A submitted B-BBEE affidavit earns no point.</p>



    {error && <p role="alert" className="mt-3 flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={16}/>{error}</p>}



    <p className="mt-5 text-xs text-neutral-500">{filtered.length} advisory requests</p>



    {loading ? <p className="p-10 text-center text-sm">Loading requests...</p> : <>



      <div className="mt-3 hidden overflow-x-auto border border-neutral-200 md:block"><table className="w-full min-w-[840px] text-left text-xs"><thead className="bg-neutral-50 uppercase text-neutral-500"><tr>{["Subject", "Supplier", "B-BBEE Level", "Request Date", "Document Score", "Status", "Details"].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{paginated.map(r => <tr key={r.advisory_request_id} className="border-t border-neutral-100"><td className="px-3 py-3 font-bold text-[#201E64]">{display(r.subject)}</td><td className="px-3 py-3"><button type="button" className="font-semibold text-[#201E64] hover:underline" onClick={() => { open(r.advisory_request_id); setSupplierTab("information"); }}>{supplierName(r.supplier)}</button></td><td className="px-3 py-3"><span className="bg-[#201E64]/10 px-2 py-1 font-bold text-[#201E64]">{formatBeeLevel(r.supplier.bee_level)}</span></td><td className="px-3 py-3">{formatDate(r.request_date)}</td><td className="px-3 py-3"><button onClick={() => { open(r.advisory_request_id); setSupplierTab("documents"); }} className="inline-flex items-center gap-1 border border-neutral-200 px-2 py-1.5 font-bold text-[#201E64]"><FileText size={14}/>{score(r.supplier)}/5 <ChevronRight size={14}/></button></td><td className="px-3 py-3"><StatusBadge status={r.status}/></td><td className="px-3 py-3"><button onClick={() => open(r.advisory_request_id)} className="font-bold text-[#201E64]">View Request</button></td></tr>)}</tbody></table></div>



      <div className="mt-3 grid gap-3 md:hidden">{paginated.map(r => <div key={r.advisory_request_id} className="border border-neutral-200 p-4"><div className="flex justify-between gap-2"><p className="font-bold text-[#201E64]">{display(r.subject)}</p><StatusBadge status={r.status}/></div><button onClick={() => { open(r.advisory_request_id); setSupplierTab("information"); }} className="mt-2 block text-xs font-bold text-[#201E64]">{supplierName(r.supplier)}</button><p className="mt-1 text-xs font-semibold text-[#201E64]">B-BBEE: {formatBeeLevel(r.supplier.bee_level)}</p><p className="mt-1 text-xs text-neutral-500">{formatDate(r.request_date)}</p><div className="mt-3 flex justify-between gap-3"><button onClick={() => { open(r.advisory_request_id); setSupplierTab("documents"); }} className="flex items-center gap-1 text-xs font-bold text-[#201E64]"><FileText size={14}/>{score(r.supplier)}/5 Documents</button><button onClick={() => open(r.advisory_request_id)} className="text-xs font-bold text-[#201E64]">View Request</button></div></div>)}</div>



      {filtered.length > PAGE_SIZE && (



  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-neutral-200 bg-white p-3">



    <span className="text-xs text-neutral-600">



      Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} requests



    </span>



    <div className="flex items-center gap-2">



      <button type="button" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="border border-neutral-300 px-3 py-2 text-xs font-semibold text-[#201E64] disabled:opacity-40">Previous</button>



      <span className="text-xs font-semibold text-[#201E64]">Page {currentPage} of {totalPages}</span>



      <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="border border-neutral-300 px-3 py-2 text-xs font-semibold text-[#201E64] disabled:opacity-40">Next</button>



    </div>



  </div>



)}



      {!filtered.length && <div className="mt-3 border border-neutral-200 p-10 text-center text-sm text-neutral-500"><Inbox className="mx-auto mb-2"/>No requests found.</div>}



    </>}



    <RequestDetails request={selected} onClose={close} onOpenSupplier={setSupplierTab} onStatusUpdate={updateStatus} saving={saving} updateError={updateError} supplierModalOpen={Boolean(supplierTab)} onMessageSupplier={onMessageSupplier}/>



    {selected && supplierTab && <SupplierDetails supplier={selected.supplier} initialTab={supplierTab} onClose={() => setSupplierTab(null)} onUpdated={updateTax}/>}



  </div>;



}
