import React, { useCallback, useEffect, useMemo, useState } from "react";

import {

  Search, Users, Building2, MapPin, BriefcaseBusiness, BadgeCheck,

  Wallet, UserRound, X, ChevronRight, FileText, CheckCircle2,

  XCircle, ExternalLink, RefreshCw, ShieldCheck, Phone, Mail,

  Eye, EyeOff, Save,

} from "lucide-react";

import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#201E64";

// API paths are relative to the shared Axios baseURL (/api).

const SUPPLIERS_ENDPOINT = "/suppliers";

const TAX_STATUS_ENDPOINT = (id) => `/tax-compliance/${id}/status`;

const TAX_PIN_ENDPOINT = (id) => `/tax-compliance/${id}/pin`;

const TAX_STATUSES = ["NOT_VERIFIED", "COMPLIANT", "NON_COMPLIANT"];

const REQUIREMENTS = [

  { key: "bee_document", label: "B-BBEE Certificate / Affidavit" },

  { key: "financial_statement", label: "Financial Statement" },

  { key: "company_registration", label: "Company Registration" },

  { key: "vat_registration", label: "VAT Registration" },

  { key: "tax_compliance_pin", label: "Tax Compliance PIN" },

];

const provided = (status) => ["SUBMITTED", "PROVIDED", "REGISTERED"].includes(String(status || "").toUpperCase());

const display = (value) => value === null || value === undefined || value === "" ? "Not provided" : String(value);

const formatBee = (value) => {

  const raw = String(value ?? "").trim();

  if (!raw) return "Not provided";

  if (/^(?:level\s*)?[1-8]$/i.test(raw)) return `Level ${raw.match(/[1-8]/)[0]}`;

  return raw;

};

const formatPercent = (value) => value === null || value === undefined || value === "" ? "Not provided" : `${Number(value)}%`;

const formatMoney = (value, range) => {

  if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) {

    return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(value));

  }

  return range || "Not provided";

};

const labelStatus = (value) => ({

  NOT_VERIFIED: "Not verified", COMPLIANT: "Compliant", NON_COMPLIANT: "Non-compliant",

  SUBMITTED: "Submitted", NOT_SUBMITTED: "Not submitted", REGISTERED: "Registered",

  NOT_REGISTERED: "Not registered", PROVIDED: "Provided", NOT_PROVIDED: "Not provided",

}[value] || display(value));

const docStatuses = (supplier) => ({

  bee_document: supplier.document_status?.bee_document || (supplier.bee_document_submitted ? "SUBMITTED" : "NOT_SUBMITTED"),

  financial_statement: supplier.document_status?.financial_statement || (supplier.has_financial_statement ? "SUBMITTED" : "NOT_SUBMITTED"),

  company_registration: supplier.document_status?.company_registration || (supplier.has_company_registration_document ? "SUBMITTED" : "NOT_SUBMITTED"),

  vat_registration: supplier.document_status?.vat_registration || (supplier.has_vat_registration ? "REGISTERED" : "NOT_REGISTERED"),

  tax_compliance_pin: supplier.document_status?.tax_compliance_pin || (supplier.has_tax_compliance_pin ? "PROVIDED" : "NOT_PROVIDED"),

});

// An affidavit is viewable but earns no B-BBEE document point.

// If the API does not identify the document type, do not award that point.

const beeDocumentType = (supplier) => {

  const explicit = String(supplier.bee_document_type || "").toUpperCase();

  if (explicit.includes("AFFIDAVIT")) return "BEE_AFFIDAVIT";

  if (explicit.includes("CERTIFICATE")) return "BEE_CERTIFICATE";

  const documents = supplier.documents || [];

  if (documents.some((doc) => String(doc.document_type).toUpperCase() === "BEE_AFFIDAVIT")) {

    return "BEE_AFFIDAVIT";

  }

  if (documents.some((doc) => String(doc.document_type).toUpperCase() === "BEE_CERTIFICATE")) {

    return "BEE_CERTIFICATE";

  }

  return null;

};

const earnsDocumentPoint = (supplier, key) => {

  if (!provided(docStatuses(supplier)[key])) return false;

  if (key === "bee_document") return beeDocumentType(supplier) === "BEE_CERTIFICATE";

  return true;

};

const docScore = (supplier) => REQUIREMENTS.filter(({ key }) => earnsDocumentPoint(supplier, key)).length;

const SCORE_FILTERS = [

  { key: "all", label: "All Suppliers", match: () => true },

  { key: "compliant", label: "Compliant", match: (score) => score === 5 },

  { key: "semi", label: "Semi-compliant", match: (score) => score >= 3 && score <= 4 },

  { key: "non", label: "Non-compliant", match: (score) => score >= 1 && score <= 2 },

];

const documentUrl = (supplier, key) => {

  const types = {

    bee_document: ["BEE_CERTIFICATE", "BEE_AFFIDAVIT"],

    financial_statement: ["FINANCIAL_STATEMENT"],

    company_registration: ["COMPANY_REGISTRATION"],

  };

  const doc = (supplier.documents || []).find((d) => types[key]?.includes(d.document_type));

  return doc?.document_path || ({

    bee_document: supplier.bee_document_url,

    financial_statement: supplier.financial_statement_url,

    company_registration: supplier.company_registration_document_url,

  })[key] || null;

};

const safeHttps = (value) => {

  try { return new URL(value).protocol === "https:"; } catch { return false; }

};

function StatusPill({ status }) {

  const ok = provided(status) || status === "COMPLIANT";

  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold ${ok ? "bg-green-50 text-green-700" : status === "NON_COMPLIANT" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-600"}`}>

    {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{labelStatus(status)}

  </span>;

}

function DetailItem({ icon: Icon, label, value }) {

  return <div className="flex gap-3 border border-neutral-200 bg-neutral-50 p-3">

    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#201E64]/10"><Icon size={17} color={NAVY} /></div>

    <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-neutral-800">{display(value)}</p></div>

  </div>;

}

function DocumentScore({ supplier, onClick }) {

  return <button type="button" onClick={onClick} title="View document details" className="inline-flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs font-bold text-[#201E64] hover:bg-[#201E64]/5">

    <FileText size={16} />{docScore(supplier)}/5 <ChevronRight size={14} />

  </button>;

}

function TaxCompliancePanel({ supplier, onUpdated }) {

  const [status, setStatus] = useState(supplier.tax_compliance_status || "NOT_VERIFIED");

  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const [saveError, setSaveError] = useState("");

  const [pin, setPin] = useState(null);

  const [showPin, setShowPin] = useState(false);

  const [pinLoading, setPinLoading] = useState(false);

  const [pinError, setPinError] = useState("");

  useEffect(() => {

    setStatus(supplier.tax_compliance_status || "NOT_VERIFIED");

    setPin(null); setShowPin(false); setPinError(""); setSaveError(""); setSaveMessage("");

  }, [supplier.business_id, supplier.tax_compliance_status]);

  const save = async () => {

    setSaving(true); setSaveError(""); setSaveMessage("");

    try {

      const response = await api.patch(TAX_STATUS_ENDPOINT(supplier.business_id), { tax_compliance_status: status });

      const next = response.data?.data?.tax_compliance_status || status;

      onUpdated(supplier.business_id, next);

      setSaveMessage("Tax compliance status updated successfully.");

    } catch (err) {

      setSaveError(err.response?.data?.message || "Unable to update tax compliance status.");

    } finally { setSaving(false); }

  };

  const togglePin = async () => {

    if (showPin) { setShowPin(false); setPin(null); return; }

    setPinLoading(true); setPinError("");

    try {

      const response = await api.get(TAX_PIN_ENDPOINT(supplier.business_id));

      const fetched = response.data?.tax_compliance_pin ?? response.data?.data?.tax_compliance_pin;

      if (!fetched) throw new Error("The PIN was not returned by the server.");

      setPin(String(fetched)); setShowPin(true);

    } catch (err) {

      setPinError(err.response?.data?.message || err.message || "Unable to retrieve the PIN.");

    } finally { setPinLoading(false); }

  };

  const hasPin = provided(docStatuses(supplier).tax_compliance_pin);

  return <section className="space-y-4 border border-neutral-200 bg-neutral-50 p-4">

    <div className="flex flex-wrap items-center justify-between gap-2">

      <h3 className="flex items-center gap-2 text-sm font-bold text-[#201E64]"><ShieldCheck size={18} /> Tax Compliance</h3>

      <StatusPill status={supplier.tax_compliance_status || "NOT_VERIFIED"} />

    </div>

    <div className="grid gap-3 sm:grid-cols-2">

      <div className="border border-neutral-200 bg-white p-3">

        <p className="mb-2 text-xs font-semibold text-neutral-500">Tax Compliance PIN</p>

        {hasPin ? <>

          <p className="break-all font-mono text-sm font-semibold text-neutral-800">{showPin ? pin : "•••••••• (hidden)"}</p>

          <button type="button" onClick={togglePin} disabled={pinLoading} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#201E64] disabled:opacity-50">

            {showPin ? <EyeOff size={15} /> : <Eye size={15} />}{pinLoading ? "Loading..." : showPin ? "Hide PIN" : "Show PIN"}

          </button>

        </> : <p className="text-xs text-neutral-500">Not provided</p>}

        {pinError && <p role="alert" className="mt-2 text-xs text-red-700">{pinError}</p>}

      </div>

      <div className="border border-neutral-200 bg-white p-3">

        <label htmlFor="tax-compliance-select" className="mb-2 block text-xs font-semibold text-neutral-500">Tax Compliance Status</label>

        <select id="tax-compliance-select" value={status} onChange={(e) => { setStatus(e.target.value); setSaveMessage(""); }} className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-[#201E64] focus:outline-none">

          {TAX_STATUSES.map((item) => <option key={item} value={item}>{labelStatus(item)}</option>)}

        </select>

        <button type="button" disabled={saving || status === (supplier.tax_compliance_status || "NOT_VERIFIED")} onClick={save} className="mt-3 inline-flex items-center gap-2 bg-[#201E64] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Save size={14} />{saving ? "Saving..." : "Update Status"}</button>

        {saveMessage && <p role="status" className="mt-2 text-xs text-green-700">{saveMessage}</p>}

        {saveError && <p role="alert" className="mt-2 text-xs text-red-700">{saveError}</p>}

      </div>

    </div>

    <p className="text-xs leading-5 text-neutral-500">A submitted PIN does not confirm tax compliance. Only mark a business as compliant after verifying its status through an authorized SARS process.</p>

  </section>;

}

function DocumentsTab({ supplier, onUpdated }) {

  const statuses = docStatuses(supplier);

  const score = docScore(supplier);

  return <div className="space-y-4">

    <div className="border border-neutral-200 bg-neutral-50 p-4">

      <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-neutral-500">Document Submission Score</p><h3 className="mt-1 text-2xl font-extrabold text-[#201E64]">{score}/5</h3></div><ShieldCheck size={30} color={NAVY} /></div>

      <div className="mt-3 h-2 bg-neutral-200"><div className="h-full bg-[#201E64]" style={{ width: `${score * 20}%` }} /></div>

      <p className="mt-2 text-xs text-neutral-500">Affidavits do not earn a point. This is a document-submission score, not an official compliance rating.</p>

    </div>

    <div className="space-y-2">

      {REQUIREMENTS.map(({ key, label }) => {

        const status = statuses[key]; const url = documentUrl(supplier, key);

        return <div key={key} className="flex flex-col gap-2 border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0"><p className="text-sm font-semibold text-neutral-800">{label}</p>

            {key === "bee_document" && <p className="text-xs text-neutral-500">{beeDocumentType(supplier) === "BEE_AFFIDAVIT" ? "Affidavit submitted — 0 points" : beeDocumentType(supplier) === "BEE_CERTIFICATE" ? "Certificate — eligible for 1 point when submitted" : "Document type not confirmed — 0 points"}</p>}

            {key === "vat_registration" && supplier.vat_registration_number && <p className="text-xs text-neutral-500">VAT No: {supplier.vat_registration_number}</p>}

            {provided(status) && safeHttps(url) && <a className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#201E64] hover:underline" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> View document</a>}

          </div><div className="flex items-center gap-2"><StatusPill status={status} /><span className="text-xs font-bold text-neutral-600">{earnsDocumentPoint(supplier, key) ? "+1" : "+0"}</span></div>

        </div>;

      })}

    </div>

    <TaxCompliancePanel supplier={supplier} onUpdated={onUpdated} />

  </div>;

}

export function SupplierDetails({ supplier, initialTab, onClose, onUpdated }) {

  const [tab, setTab] = useState(initialTab);

  useEffect(() => { setTab(initialTab); }, [supplier?.user_id, initialTab]);

  useEffect(() => {

    if (!supplier) return;

    const onEscape = (event) => { if (event.key === "Escape") onClose(); };

    window.addEventListener("keydown", onEscape);

    return () => window.removeEventListener("keydown", onEscape);

  }, [supplier, onClose]);

  if (!supplier) return null;

  const name = [supplier.title, supplier.first_name, supplier.last_name].filter(Boolean).join(" ");

  const info = [

    [Mail, "Email", supplier.email], [Phone, "Phone", supplier.phone_number],

    [Building2, "Company", supplier.business_name], [BadgeCheck, "B-BBEE Level", formatBee(supplier.bee_level)],

    [UserRound, "BWO Ownership", formatPercent(supplier.bwo_ownership_percentage)],

    [Users, "BO Ownership", formatPercent(supplier.bo_ownership_percentage)],

    [BriefcaseBusiness, "Services Offered", supplier.services], [MapPin, "Business Address", supplier.business_address],

    [Building2, "Community", supplier.community], [BriefcaseBusiness, "Industry", supplier.industry],

    [Wallet, "Annual Revenue", formatMoney(supplier.annual_revenue, supplier.annual_revenue_range)],

    [Users, "Permanent Employees", supplier.permanent_employees], [Users, "Contract Employees", supplier.contract_employees],

    [Wallet, "Largest Contract Value", formatMoney(supplier.largest_contract_value)],

    [Building2, "Company Registration Number", supplier.company_registration_number],

    [BadgeCheck, "VAT Registration Number", supplier.vat_registration_number],

  ];

  return <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 sm:items-center sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>

    <div role="dialog" aria-modal="true" aria-label={`Supplier details: ${name}`} className="flex max-h-[95dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:max-h-[90dvh] sm:max-w-3xl">

      <header className="flex items-center justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5"><div className="min-w-0"><h2 className="truncate text-lg font-bold text-[#201E64]">{name}</h2><p className="truncate text-xs text-neutral-500">{supplier.business_name}</p></div><button type="button" aria-label="Close" onClick={onClose} className="p-2 hover:bg-neutral-100"><X size={20} /></button></header>

      <div className="flex border-b border-neutral-200 px-4">

        {[ ["information", "Supplier Information"], ["documents", `Documents (${docScore(supplier)}/5)`] ].map(([value, label]) => <button type="button" key={value} onClick={() => setTab(value)} className={`border-b-2 px-3 py-3 text-xs font-bold ${tab === value ? "border-[#201E64] text-[#201E64]" : "border-transparent text-neutral-500"}`}>{label}</button>)}

      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">

        {tab === "documents" ? <DocumentsTab supplier={supplier} onUpdated={onUpdated} /> : <div className="space-y-4"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{info.map(([Icon, label, value]) => <DetailItem key={label} icon={Icon} label={label} value={value} />)}</div><div className="flex flex-wrap gap-2"><StatusPill status={supplier.has_business_profile ? "SUBMITTED" : "NOT_SUBMITTED"} /><span className="bg-green-50 px-3 py-2 text-xs text-green-700">Business Profile & Maturity Registered</span></div></div>}

      </div>

      <footer className="flex justify-end border-t border-neutral-200 p-4"><button type="button" onClick={onClose} className="bg-[#201E64] px-5 py-2.5 text-xs font-bold text-white">Close</button></footer>

    </div>

  </div>;

}

export default function SuppliersScreen() {
  const { loading: authLoading, isAuthenticated } = useAuth();

  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");

  const [scoreFilter, setScoreFilter] = useState("all");

  const [selectedId, setSelectedId] = useState(null);

  const [initialTab, setInitialTab] = useState("information");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchSuppliers = useCallback(async () => {

    setLoading(true); setError("");

    try {

      const response = await api.get(SUPPLIERS_ENDPOINT);

      const payload = response.data;

      const rows = Array.isArray(payload?.suppliers) ? payload.suppliers : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      setSuppliers(rows.filter((s) => s.business_id != null && s.maturity_id != null));

    } catch (err) { setError(err.response?.data?.message || "Unable to load suppliers. Check the API route and authentication."); }

    finally { setLoading(false); }

  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      setError("Please log in to view registered suppliers.");
      return;
    }
    fetchSuppliers();
  }, [authLoading, isAuthenticated, fetchSuppliers]);

  const filtered = useMemo(() => {

    const selected = SCORE_FILTERS.find((item) => item.key === scoreFilter) || SCORE_FILTERS[0];

    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {

      const matchesSearch = [supplier.first_name, supplier.last_name, supplier.business_name, supplier.community, supplier.services, supplier.industry, formatBee(supplier.bee_level)]

        .some((value) => String(value || "").toLowerCase().includes(query));

      return matchesSearch && selected.match(docScore(supplier));

    });

  }, [suppliers, search, scoreFilter]);

  const selectedSupplier = suppliers.find((s) => s.user_id === selectedId) || null;

  const onUpdated = (businessId, status) => setSuppliers((current) => current.map((s) => s.business_id === businessId ? { ...s, tax_compliance_status: status } : s));

  const openSupplier = (supplier, tab) => { setInitialTab(tab); setSelectedId(supplier.user_id); };

  return <div className="w-full min-w-0">

    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-extrabold text-[#201E64] sm:text-3xl">Registered Suppliers</h1><p className="mt-1 text-sm text-neutral-500">Suppliers with both Business Profile and Business Maturity registrations.</p></div><div className="flex items-center gap-2"><span className="bg-[#201E64]/10 px-3 py-2 text-xs font-bold text-[#201E64]">{suppliers.length} Registered</span><button type="button" disabled={loading} onClick={fetchSuppliers} className="flex items-center gap-1 border border-neutral-200 px-3 py-2 text-xs font-semibold text-[#201E64]"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button></div></div>

    <div className="relative border border-neutral-200 bg-white p-4"><Search size={17} className="absolute left-7 top-1/2 -translate-y-1/2 text-neutral-400" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supplier or company..." className="w-full max-w-md border border-neutral-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#201E64]" /></div>

    <div className="mt-3 flex flex-wrap gap-2 border-b border-neutral-200 pb-3" role="group" aria-label="Filter suppliers by document submission score">

      {SCORE_FILTERS.map((filter) => {

        return <button key={filter.key} type="button" aria-pressed={scoreFilter === filter.key} onClick={() => setScoreFilter(filter.key)} className={`border px-3 py-2 text-xs font-semibold transition ${scoreFilter === filter.key ? "border-[#201E64] bg-[#201E64] text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-[#201E64]"}`}>

          {filter.label}

        </button>;

      })}

    </div>

    {error && <div role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

    <div className="mt-4 text-sm font-semibold text-[#201E64]">Suppliers <span className="font-normal text-neutral-500">({filtered.length} results)</span></div>

    {loading ? <div className="mt-3 border border-neutral-200 p-10 text-center text-sm text-neutral-500">Loading suppliers...</div> : <>

      <div className="mt-3 hidden overflow-x-auto border border-neutral-200 bg-white md:block"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-neutral-50 text-[11px] uppercase text-neutral-500"><tr>{["Supplier", "Company", "Locality", "B-BBEE", "Document Score", "Details"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{filtered.map((s) => <tr key={s.user_id} className="border-t border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3"><p className="font-bold text-neutral-800">{s.first_name} {s.last_name}</p><p className="text-neutral-500">{s.email}</p></td><td className="px-4 py-3">{s.business_name}</td><td className="px-4 py-3">{s.community || s.business_address || "Not provided"}</td><td className="px-4 py-3"><span className="bg-[#201E64]/10 px-2 py-1 font-bold text-[#201E64]">{formatBee(s.bee_level)}</span></td><td className="px-4 py-3"><DocumentScore supplier={s} onClick={() => openSupplier(s, "documents")} /></td><td className="px-4 py-3"><button type="button" onClick={() => openSupplier(s, "information")} className="font-bold text-[#201E64] hover:underline">View Details</button></td></tr>)}</tbody></table></div>

      <div className="mt-3 grid gap-3 md:hidden">{filtered.map((s) => <div key={s.user_id} className="border border-neutral-200 bg-white p-4"><p className="font-bold text-[#201E64]">{s.first_name} {s.last_name}</p><p className="mt-1 text-xs text-neutral-500">{s.business_name} · {formatBee(s.bee_level)}</p><div className="mt-3 flex items-center justify-between"><DocumentScore supplier={s} onClick={() => openSupplier(s, "documents")} /><button type="button" className="text-xs font-bold text-[#201E64]" onClick={() => openSupplier(s, "information")}>View Details</button></div></div>)}</div>

      {!filtered.length && <div className="mt-3 border border-neutral-200 p-8 text-center text-sm text-neutral-500">No registered suppliers found.</div>}

    </>}

    <SupplierDetails supplier={selectedSupplier} initialTab={initialTab} onClose={() => setSelectedId(null)} onUpdated={onUpdated} />

  </div>;

}
