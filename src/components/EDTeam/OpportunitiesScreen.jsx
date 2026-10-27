import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx"; // npm install xlsx
import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  FileText,
  ClipboardList,
  CalendarDays,
  MapPin,
  Eye,
  X,
  ChevronRight,
  Users,
  Plus,
  Upload,
  Check,
  Send,
  Download,
} from "lucide-react";

import { SupplierDetails } from "./SuppliersScreen"; // Adjust path if needed

const NAVY = "#201E64";

// Sector IDs match the database order (1–13).
const INDUSTRY_SECTORS = [
  { sector_id: 1, sector_name: "Agriculture" },
  { sector_id: 2, sector_name: "Agro-processing" },
  { sector_id: 3, sector_name: "Automotive Assembly" },
  { sector_id: 4, sector_name: "Financial Services" },
  { sector_id: 5, sector_name: "Fishing" },
  { sector_id: 6, sector_name: "Forestry" },
  { sector_id: 7, sector_name: "Heavy Industry" },
  { sector_id: 8, sector_name: "Information and Communications Technology (ICT)" },
  { sector_id: 9, sector_name: "Livestock Farming" },
  { sector_id: 10, sector_name: "Mining" },
  { sector_id: 11, sector_name: "R&D and Consulting" },
  { sector_id: 12, sector_name: "Tourism & Hospitality" },
  { sector_id: 13, sector_name: "Wholesale & Retail" },
];

// =====================================================
// API CONFIGURATION — adjust paths to your Express mounts
// =====================================================
const ENDPOINTS = {
  tenders: "/tender",
  rfqs: "/rfq",
  createTender: "/tender",
  createRfq: "/rfq",
  tenderDetails: (id) => `/tenders/${id}/details`,
  rfqDetails: (id) => `/rfqs/${id}/details`,
};

function getStoredAccessToken() {
  try {
    const auth = JSON.parse(sessionStorage.getItem("tongaat_auth") || "{}");
    return (
      auth.accessToken ||
      auth.access_token ||
      auth.token ||
      auth.data?.accessToken ||
      auth.data?.access_token ||
      auth.data?.token ||
      null
    );
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;
  try {
    const token = getStoredAccessToken();
    const response = await api.request({
      url: path,
      method,
      data: body,
      ...rest,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Request failed.");
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Your session could not be authenticated. Please log in again.");
    }
    throw new Error(error.response?.data?.message || error.message || "Request failed.");
  }
}

function extractArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function normalizeOpportunity(row, type) {
  const id = row[type === "rfq" ? "rfq_id" : "tender_id"] ?? row.id;
  const sectors =
    row.sectors ||
    row.industries ||
    row.sector_names ||
    row.sector_ids ||
    (row.sector_name ? [row.sector_name] : []);
  const sectorList = Array.isArray(sectors)
    ? sectors
    : typeof sectors === "string"
    ? sectors.split(",").map((v) => v.trim())
    : [];
  return {
    ...row,
    id,
    reference:
      row.reference ||
      `${type === "rfq" ? "TH-RFQ" : "TH-TEN"}-${String(id).padStart(3, "0")}`,
    closingDate: dateOnly(row.closing_date ?? row.closingDate),
    createdDate: dateOnly(row.date_posted ?? row.created_at ?? row.createdDate),
    industries:
      type === "tender"
        ? ["All Industries"]
        : sectorList
            .map((v) =>
              typeof v === "string"
                ? INDUSTRY_SECTORS.find((s) => String(s.sector_id) === v)?.sector_name || v
                : typeof v === "number"
                ? INDUSTRY_SECTORS.find((s) => s.sector_id === v)?.sector_name || `Sector ${v}`
                : v.sector_name ||
                  v.name ||
                  INDUSTRY_SECTORS.find((s) => s.sector_id === Number(v.sector_id))?.sector_name
            )
            .filter(Boolean),
    documentName:
      row.documentName || (row.image_url ? String(row.image_url).split("/").pop() : null),
    documentUrl: row.image_url || null,
    responseCount: Number(
      row.number_of_responses ?? row.response_count ?? row.responses?.length ?? 0
    ),
    responses: row.responses || [],
  };
}

function normalizeResponse(row, type) {
  const s = row.supplier || row.business_profile || row;
  return {
    ...row,
    id: row.rfq_response_id ?? row.tender_response_id ?? row.id,
    supplierId: s.user_id ?? row.user_id,
    firstName: s.first_name || "",
    lastName: s.last_name || "",
    company: s.business_name || "Not provided",
    email: s.email || "",
    phone: s.phone_number || "",
    submittedDate: dateOnly(row.response_date ?? row.created_at),
    beeLevel: s.bee_level || "Not provided",
    bwoOwnership: s.bwo_ownership_percentage,
    boOwnership: s.bo_ownership_percentage,
    serviceOffered: s.services || "Not provided",
    locality: s.business_address || s.community || "Not provided",
    annualRevenue:
      s.annual_revenue_range ||
      (s.annual_revenue != null
        ? `R${Number(s.annual_revenue).toLocaleString("en-ZA")}`
        : "Not provided"),
    permanentEmployees: s.permanent_employees,
    quotationAmount:
      type === "rfq" && row.quoted_price != null
        ? `R${Number(row.quoted_price).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`
        : null,
    proposal: row.proposal,
    quotationDocumentPath: row.quotation_document_path,
    status: row.status || row.response_status || "SUBMITTED",
    supplier: s,
  };
}

function normalizeDetails(payload, type) {
  // Details endpoint is called only after a tender/RFQ is selected.
  // Expected: { success: true, data: { tender|rfq: {...}, responses: [...] } }
  const data = payload?.data ?? payload ?? {};
  const row = data[type] ?? data.opportunity ?? data;
  const opportunity = normalizeOpportunity(row, type);
  const responseRows = Array.isArray(data.responses)
    ? data.responses
    : Array.isArray(row.responses)
    ? row.responses
    : Array.isArray(data[`${type}_responses`])
    ? data[`${type}_responses`]
    : [];
  opportunity.responses = responseRows.map((r) => normalizeResponse(r, type));
  opportunity.responseCount = opportunity.responses.length;
  return opportunity;
}

// ======================================================
// HELPERS
// ======================================================

function formatDate(date) {
  if (!date) return "—";
  const normalized = dateOnly(date);
  const parsed = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Case-insensitive, trimmed text used for search / filters.
const norm = (value) => String(value ?? "").trim().toLowerCase();

// ======================================================
// OPPORTUNITY STATUS
// ======================================================

function OpportunityStatusBadge({ status }) {
  let classes = "border-neutral-200 bg-neutral-50 text-neutral-600";
  if (status === "OPEN") classes = "border-green-200 bg-green-50 text-green-700";
  if (status === "CLOSED") classes = "border-red-200 bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex whitespace-nowrap border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${classes}`}
    >
      {status}
    </span>
  );
}

// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#201E64]/10">
        <Icon className="h-4 w-4" style={{ color: NAVY }} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
          {label}
        </p>
        <p className="mt-1 break-words text-xs font-semibold leading-5 text-neutral-800">
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// CREATE OPPORTUNITY FORM
// COMPACT + RESPONSIVE
// ======================================================

function CreateOpportunityForm({ onCreateTender, onCreateRfq, sectors }) {
  const fileInputRef = useRef(null);

  const [opportunityType, setOpportunityType] = useState("rfq");

  const [form, setForm] = useState({
    title: "",
    description: "",
    closingDate: "",
    location: "",
  });

  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const changeOpportunityType = (type) => {
    setOpportunityType(type);
    setErrors({});
    setSuccessMessage("");
    if (type === "tender") setSelectedIndustries([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    setSuccessMessage("");
  };

  const toggleIndustry = (industry) => {
    setSelectedIndustries((current) =>
      current.includes(industry)
        ? current.filter((item) => item !== industry)
        : [...current, industry]
    );
    setErrors((current) => ({ ...current, industries: undefined }));
    setSuccessMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setErrors((current) => ({ ...current, document: "Only PDF documents are allowed." }));
      event.target.value = "";
      return;
    }

    setPdfFile(file);
    setErrors((current) => ({ ...current, document: undefined }));
    setSuccessMessage("");
  };

  const removePdf = () => {
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Enter an opportunity title.";
    if (!form.description.trim()) nextErrors.description = "Enter an opportunity description.";
    if (!form.closingDate) nextErrors.closingDate = "Select a closing date.";
    if (!form.location.trim()) nextErrors.location = "Enter a location.";
    if (!pdfFile) nextErrors.document = "Upload the opportunity PDF.";
    if (opportunityType === "rfq" && selectedIndustries.length === 0) {
      nextErrors.industries = "Select at least one industry.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const opportunity = {
      title: form.title.trim(),
      description: form.description.trim(),
      closingDate: form.closingDate,
      location: form.location.trim(),
      sector_ids: opportunityType === "rfq" ? selectedIndustries : [],
      document: pdfFile,
    };

    setSubmitting(true);
    try {
      if (opportunityType === "tender") {
        await onCreateTender(opportunity);
      } else {
        await onCreateRfq(opportunity);
      }
      setSuccessMessage(
        opportunityType === "tender"
          ? "Tender created successfully."
          : "RFQ created successfully."
      );
      setForm({ title: "", description: "", closingDate: "", location: "" });
      setSelectedIndustries([]);
      setPdfFile(null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full border bg-white text-xs outline-none placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/10 sm:text-sm";

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold sm:text-xl" style={{ color: NAVY }}>
          Create Business Opportunity
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Create a Tender or RFQ for registered suppliers.
        </p>
      </div>

      {/* SUCCESS */}
      {successMessage && (
        <div className="mb-3 flex items-center gap-2 border border-green-200 bg-green-50 px-3 py-2.5">
          <Check className="h-4 w-4 shrink-0 text-green-700" />
          <p className="text-xs font-semibold text-green-700">{successMessage}</p>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
      >
        {/* TYPE + TITLE + CLOSING DATE */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px_minmax(0,1fr)_190px]">
          {/* TYPE */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Type</label>

            <div className="grid h-10 grid-cols-2">
              <button
                type="button"
                onClick={() => changeOpportunityType("rfq")}
                className={`flex items-center justify-center gap-1.5 border text-xs font-bold transition ${
                  opportunityType === "rfq"
                    ? "border-[#201E64] bg-[#201E64] text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-[#201E64]"
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                RFQ
              </button>

              <button
                type="button"
                onClick={() => changeOpportunityType("tender")}
                className={`flex items-center justify-center gap-1.5 border border-l-0 text-xs font-bold transition ${
                  opportunityType === "tender"
                    ? "border-[#201E64] bg-[#201E64] text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-[#201E64]"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Tender
              </button>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label
              htmlFor="opportunity-title"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Title
            </label>
            <input
              id="opportunity-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter opportunity title"
              className={`h-10 px-3 ${inputBase} ${
                errors.title ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.title && <p className="mt-1 text-[10px] text-red-600">{errors.title}</p>}
          </div>

          {/* DATE */}
          <div>
            <label
              htmlFor="closing-date"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Closing Date
            </label>
            <input
              id="closing-date"
              name="closingDate"
              type="date"
              value={form.closingDate}
              onChange={handleChange}
              className={`h-10 px-3 ${inputBase} ${
                errors.closingDate ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.closingDate && (
              <p className="mt-1 text-[10px] text-red-600">{errors.closingDate}</p>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-3">
          <label
            htmlFor="opportunity-description"
            className="mb-1.5 block text-xs font-semibold text-neutral-700"
          >
            Description
          </label>
          <textarea
            id="opportunity-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Briefly describe the opportunity and supplier requirements..."
            className={`min-h-[82px] resize-y px-3 py-2.5 leading-5 ${inputBase} ${
              errors.description ? "border-red-400" : "border-neutral-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-[10px] text-red-600">{errors.description}</p>
          )}
        </div>

        {/* LOCATION + PDF */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* LOCATION */}
          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. KwaZulu-Natal"
                className={`h-10 pl-9 pr-3 ${inputBase} ${
                  errors.location ? "border-red-400" : "border-neutral-300"
                }`}
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-[10px] text-red-600">{errors.location}</p>
            )}
          </div>

          {/* PDF */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
              Opportunity PDF
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!pdfFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-10 w-full items-center gap-2 border bg-white px-3 text-left text-xs transition hover:border-[#201E64] ${
                  errors.document ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <Upload className="h-4 w-4 shrink-0" style={{ color: NAVY }} />
                <span className="truncate text-neutral-500">Upload PDF document</span>
              </button>
            ) : (
              <div className="flex h-10 items-center justify-between gap-2 border border-neutral-300 bg-neutral-50 px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-red-600" />
                  <span className="truncate text-xs font-medium text-neutral-700">
                    {pdfFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  aria-label="Remove PDF"
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {errors.document && (
              <p className="mt-1 text-[10px] text-red-600">{errors.document}</p>
            )}
          </div>
        </div>

        {/* TARGET INDUSTRIES */}
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-700">Target Industry</p>
              <p className="mt-0.5 text-[10px] text-neutral-400">
                {opportunityType === "rfq"
                  ? "Select one or more industries for this RFQ."
                  : "This tender will be visible to all industries."}
              </p>
            </div>

            {opportunityType === "rfq" && selectedIndustries.length > 0 && (
              <span className="w-fit bg-[#201E64]/10 px-2 py-1 text-[10px] font-bold text-[#201E64]">
                {selectedIndustries.length} selected
              </span>
            )}
          </div>

          {/* TENDER */}
          {opportunityType === "tender" && (
            <div className="mt-2 flex h-10 items-center gap-2 border border-[#201E64]/20 bg-[#201E64]/[0.03] px-3">
              <Users className="h-4 w-4" style={{ color: NAVY }} />
              <span className="text-xs font-bold" style={{ color: NAVY }}>
                All Industries
              </span>
              <Check className="ml-auto h-4 w-4" style={{ color: NAVY }} />
            </div>
          )}

          {/* RFQ */}
          {opportunityType === "rfq" && (
            <>
              <div className="mt-2 grid max-h-[145px] grid-cols-1 gap-1.5 overflow-y-auto border border-neutral-200 bg-neutral-50 p-2 min-[460px]:grid-cols-2 lg:grid-cols-3">
                {sectors.map((industry) => {
                  const industryId = Number(industry.sector_id);
                  const selected = selectedIndustries.includes(industryId);

                  return (
                    <button
                      key={industryId}
                      type="button"
                      onClick={() => toggleIndustry(industryId)}
                      className={`flex min-h-[34px] items-center justify-between gap-2 border bg-white px-2.5 py-1.5 text-left text-[10px] font-semibold transition ${
                        selected
                          ? "border-[#201E64] text-[#201E64]"
                          : "border-neutral-200 text-neutral-600 hover:border-[#201E64]/40"
                      }`}
                    >
                      <span>{industry.sector_name}</span>

                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                          selected
                            ? "border-[#201E64] bg-[#201E64] text-white"
                            : "border-neutral-300"
                        }`}
                      >
                        {selected && <Check className="h-2.5 w-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.industries && (
                <p className="mt-1 text-[10px] text-red-600">{errors.industries}</p>
              )}
            </>
          )}
        </div>

        {/* SUBMIT */}
        <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-neutral-400">
            {opportunityType === "tender"
              ? "Tender • All industries"
              : selectedIndustries.length > 0
              ? `RFQ • ${selectedIndustries.length} selected ${
                  selectedIndustries.length === 1 ? "industry" : "industries"
                }`
              : "RFQ • Select target industries"}
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 bg-[#201E64] px-5 text-xs font-bold text-white transition hover:bg-[#2B2889] disabled:opacity-60 sm:w-auto"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Creating..." : "Create"} {opportunityType === "rfq" ? "RFQ" : "Tender"}
          </button>
        </div>

        {errors.submit && (
          <p role="alert" className="mt-3 text-xs text-red-600">
            {errors.submit}
          </p>
        )}
      </form>
    </div>
  );
}

// ======================================================
// SUPPLIER RESPONSE DETAILS
// ======================================================

// Reuse the same full supplier modal as the Suppliers screen.
// The modal includes document status, score, tax verification and PIN actions.
function SupplierResponseDetails({ response, onBack, onSupplierUpdated }) {
  if (!response) return null;
  return (
    <SupplierDetails
      supplier={response.supplier}
      initialTab="information"
      onClose={onBack}
      onUpdated={(businessId, status) => onSupplierUpdated(businessId, status)}
    />
  );
}

// Match BusinessRequestsScreen document scoring. B-BBEE affidavits do not earn points.
function documentScore(supplier = {}) {
  const statuses = {
    bee_document:
      supplier.document_status?.bee_document ||
      (supplier.bee_document_submitted ? "SUBMITTED" : "NOT_SUBMITTED"),
    financial_statement:
      supplier.document_status?.financial_statement ||
      (supplier.has_financial_statement ? "SUBMITTED" : "NOT_SUBMITTED"),
    company_registration:
      supplier.document_status?.company_registration ||
      (supplier.has_company_registration_document ? "SUBMITTED" : "NOT_SUBMITTED"),
    vat_registration:
      supplier.document_status?.vat_registration ||
      (supplier.has_vat_registration ? "REGISTERED" : "NOT_REGISTERED"),
    tax_compliance_pin:
      supplier.document_status?.tax_compliance_pin ||
      (supplier.has_tax_compliance_pin ? "PROVIDED" : "NOT_PROVIDED"),
  };
  const provided = (value) =>
    ["SUBMITTED", "REGISTERED", "PROVIDED"].includes(String(value || "").toUpperCase());
  const docs = Array.isArray(supplier.documents) ? supplier.documents : [];
  const explicitType = String(supplier.bee_document_type || "").toUpperCase();
  const beeType = explicitType.includes("AFFIDAVIT")
    ? "AFFIDAVIT"
    : explicitType.includes("CERTIFICATE")
    ? "CERTIFICATE"
    : docs.some((d) => String(d.document_type || "").toUpperCase() === "BEE_AFFIDAVIT")
    ? "AFFIDAVIT"
    : docs.some((d) => String(d.document_type || "").toUpperCase() === "BEE_CERTIFICATE")
    ? "CERTIFICATE"
    : "";
  const others = [
    "financial_statement",
    "company_registration",
    "vat_registration",
    "tax_compliance_pin",
  ];
  return (
    others.filter((key) => provided(statuses[key])).length +
    (provided(statuses.bee_document) && beeType === "CERTIFICATE" ? 1 : 0)
  );
}

const COMPLIANCE_FILTERS = [
  { key: "all", label: "All Scores", match: () => true },
  { key: "Compliant", label: "Compliant", match: (n) => n === 5 },
  { key: "Semi-compliant", label: "Semi-compliant", match: (n) => n >= 3 && n <= 4 },
  { key: "Non-compliant", label: "Non-compliant", match: (n) => n >= 1 && n <= 2 },
];

function complianceLabel(value) {
  if (value === 5) return "Compliant";
  if (value >= 3) return "Semi-compliant";
  if (value >= 1) return "Non-compliant";
  return "No score";
}

function ComplianceLabel({ score }) {
  const label = complianceLabel(score);
  const styles =
    score === 5
      ? "bg-green-50 text-green-700"
      : score >= 3
      ? "bg-amber-50 text-amber-700"
      : score >= 1
      ? "bg-red-50 text-red-700"
      : "bg-neutral-100 text-neutral-600";
  return (
    <span className={`inline-flex px-2 py-1 text-[11px] font-bold ${styles}`}>{label}</span>
  );
}

// ======================================================
// EXCEL EXPORT
// Exports exactly the rows currently shown by the filters
// (all pages, not just the visible page).
// ======================================================

function exportResponsesToExcel(rows, opportunity, type) {
  const data = rows.map((r) => {
    const score = documentScore(r.supplier);

    return {
      Company: r.company,
      "Contact Person": `${r.firstName} ${r.lastName}`.trim(),
      Email: r.email,
      Phone: r.phone,
      "B-BBEE Level": r.beeLevel,
      "BWO Ownership (%)": r.bwoOwnership ?? "",
      "BO Ownership (%)": r.boOwnership ?? "",
      "Documents Score": `${score}/5`,
      Classification: complianceLabel(score),
      Locality: r.locality,
      "Annual Revenue": r.annualRevenue,
      "Permanent Employees": r.permanentEmployees ?? "",
      "Services Offered": r.serviceOffered,
      ...(type === "rfq"
        ? {
            "Quoted Price (R)": r.quoted_price != null ? Number(r.quoted_price) : "",
            Proposal: r.proposal || "",
          }
        : {}),
      Status: r.status,
      "Date Submitted": r.submittedDate ? formatDate(r.submittedDate) : "",
    };
  });

  const sheet = XLSX.utils.json_to_sheet(data);

  // Size each column to its longest value (capped).
  const headers = Object.keys(data[0] || {});
  sheet["!cols"] = headers.map((key) => ({
    wch: Math.min(
      45,
      Math.max(key.length, ...data.map((row) => String(row[key] ?? "").length)) + 2
    ),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Responses");

  const safe = (text) => String(text || "").replace(/[^a-z0-9-_]+/gi, "_");
  const today = new Date().toISOString().slice(0, 10);

  XLSX.writeFile(
    workbook,
    `${type.toUpperCase()}_${safe(opportunity.reference)}_responses_${today}.xlsx`
  );
}

function Pagination({ page, setPage, total, pageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-white p-3 text-xs">
      <span className="text-neutral-500">
        Showing {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} of{" "}
        {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="border px-3 py-2 disabled:opacity-40"
        >
          Previous
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ======================================================
// OPPORTUNITY DETAILS + RESPONSES
// ======================================================

function OpportunityDetailsScreen({ opportunity, type, onBack }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [beeLevelFilter, setBeeLevelFilter] = useState("all");
  const [localityFilter, setLocalityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [exportError, setExportError] = useState("");
  const pageSize = 8;
  const responses = opportunity.responses || [];

  // B-BBEE levels and localities are derived from the actual response results.
  // Selecting a compliance category narrows the available options.
  const complianceResponses = useMemo(
    () =>
      responses.filter((response) => {
        const score = documentScore(response.supplier);
        return (COMPLIANCE_FILTERS.find((item) => item.key === filter) || COMPLIANCE_FILTERS[0]).match(
          score
        );
      }),
    [responses, filter]
  );

  const beeLevelOptions = useMemo(
    () =>
      [
        ...new Set(
          complianceResponses
            .map((response) => String(response.beeLevel ?? "").trim())
            .filter((value) => value && value.toLowerCase() !== "not provided")
        ),
      ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [complianceResponses]
  );

  const localityOptions = useMemo(
    () =>
      [
        ...new Set(
          complianceResponses
            .map((response) => String(response.locality ?? "").trim())
            .filter((value) => value && value.toLowerCase() !== "not provided")
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [complianceResponses]
  );

  const filtered = useMemo(
    () =>
      responses.filter((response) => {
        const score = documentScore(response.supplier);
        const matchesFilter = (
          COMPLIANCE_FILTERS.find((item) => item.key === filter) || COMPLIANCE_FILTERS[0]
        ).match(score);
        const q = norm(search);
        const matchesSearch =
          !q ||
          [
            response.company,
            response.firstName,
            response.lastName,
            response.email,
            response.locality,
          ].some((value) => norm(value).includes(q));
        const matchesBeeLevel =
          beeLevelFilter === "all" || String(response.beeLevel ?? "").trim() === beeLevelFilter;
        const matchesLocality =
          localityFilter === "all" || String(response.locality ?? "").trim() === localityFilter;
        return matchesFilter && matchesBeeLevel && matchesLocality && matchesSearch;
      }),
    [responses, search, filter, beeLevelFilter, localityFilter]
  );

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDownload = () => {
    try {
      setExportError("");
      exportResponsesToExcel(filtered, opportunity, type);
    } catch (error) {
      console.error("Excel export failed:", error);
      setExportError("Could not create the Excel file. Please try again.");
    }
  };

  const updateSupplierTax = (businessId, status) => {
    setSelectedResponse((prev) =>
      prev?.supplier?.business_id === businessId
        ? { ...prev, supplier: { ...prev.supplier, tax_compliance_status: status } }
        : prev
    );
  };

  const selectClass =
    "h-10 w-full border border-neutral-300 bg-white px-3 text-sm focus:border-[#201E64] focus:outline-none";

  return (
    <div className="w-full space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-bold text-[#201E64] hover:underline"
      >
        ← Back to posted opportunities
      </button>

      <section className="border border-neutral-200 bg-white p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="bg-[#201E64]/10 px-2 py-1 text-[10px] font-bold text-[#201E64]">
            {type.toUpperCase()}
          </span>
          <OpportunityStatusBadge status={opportunity.status} />
          <span className="text-xs text-neutral-400">{opportunity.reference}</span>
        </div>

        <h2 className="text-xl font-extrabold text-[#201E64] sm:text-2xl">
          {opportunity.title}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DetailItem icon={CalendarDays} label="Posted" value={formatDate(opportunity.createdDate)} />
          <DetailItem icon={CalendarDays} label="Closing date" value={formatDate(opportunity.closingDate)} />
          <DetailItem icon={MapPin} label="Location" value={opportunity.location} />
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase text-neutral-400">Target sectors</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(opportunity.industries?.length ? opportunity.industries : ["Not provided"]).map(
              (name) => (
                <span
                  key={name}
                  className="bg-[#201E64]/10 px-2 py-1 text-xs font-semibold text-[#201E64]"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-[10px] font-bold uppercase text-neutral-400">Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
            {opportunity.description}
          </p>
        </div>

        {opportunity.documentUrl && (
          <a
            href={opportunity.documentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#201E64] hover:underline"
          >
            <FileText className="h-4 w-4" />
            View opportunity document
          </a>
        )}
      </section>

      <section className="space-y-3">
        {/* HEADER + DOWNLOAD */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#201E64]">Supplier Responses</h3>
            <p className="text-xs text-neutral-500">
              Document scores are based on submitted information, not verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-600">
              {responses.length} responses
            </span>

            <button
              type="button"
              onClick={handleDownload}
              disabled={filtered.length === 0}
              title="Download the responses currently shown (with your filters applied)"
              className="inline-flex h-9 items-center gap-2 bg-[#201E64] px-3 text-xs font-bold text-white transition hover:bg-[#2B2889] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Download Excel ({filtered.length})
            </button>
          </div>
        </div>

        {exportError && (
          <div role="alert" className="border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {exportError}
          </div>
        )}

        {/* Same compact filter tabs as Business Requests. */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter supplier responses by document score"
        >
          {COMPLIANCE_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={filter === item.key}
              onClick={() => {
                setFilter(item.key);
                setBeeLevelFilter("all");
                setLocalityFilter("all");
                setPage(1);
              }}
              className={`border px-3 py-2 text-xs font-semibold transition ${
                filter === item.key
                  ? "border-[#201E64] bg-[#201E64] text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-[#201E64]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col gap-2 bg-white p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search supplier, company or locality..."
              className="h-10 w-full border border-neutral-300 pl-9 pr-3 text-sm focus:border-[#201E64] focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              aria-label="Filter by B-BBEE level"
              value={beeLevelFilter}
              onChange={(e) => {
                setBeeLevelFilter(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">All B-BBEE levels</option>
              {beeLevelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-56">
            <select
              aria-label="Filter by locality"
              value={localityFilter}
              onChange={(e) => {
                setLocalityFilter(e.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">All localities</option>
              {localityOptions.map((locality) => (
                <option key={locality} value={locality}>
                  {locality}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border bg-white p-8 text-center text-sm text-neutral-500">
            No supplier responses match your filters.
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <div className="grid gap-3 md:hidden">
              {pageRows.map((r) => {
                const score = documentScore(r.supplier);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedResponse(r)}
                    className="border bg-white p-4 text-left"
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#201E64]">{r.company}</p>
                        <p className="text-xs text-neutral-500">
                          {r.firstName} {r.lastName}
                        </p>
                      </div>
                      <ComplianceLabel score={score} />
                    </div>
                    <p className="mt-2 text-xs">
                      B-BBEE: <strong>{r.beeLevel}</strong>
                    </p>
                    <p className="mt-1 text-xs">
                      Locality: <strong>{r.locality}</strong>
                    </p>
                    <p className="mt-3 text-xs">
                      Documents: <strong>{score}/5</strong>
                    </p>
                    {type === "rfq" && (
                      <p className="mt-1 text-xs">Quotation: {r.quotationAmount || "—"}</p>
                    )}
                    <p className="mt-2 text-xs font-bold text-[#201E64]">View supplier →</p>
                  </button>
                );
              })}
            </div>

            {/* DESKTOP */}
            <div className="hidden overflow-x-auto border bg-white md:block">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="bg-neutral-50 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">B-BBEE</th>
                    <th className="p-3">Documents</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Locality</th>
                    {type === "rfq" && <th className="p-3">Quotation</th>}
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => {
                    const score = documentScore(r.supplier);
                    return (
                      <tr key={r.id} className="border-t hover:bg-neutral-50">
                        <td className="p-3">
                          <strong>{r.company}</strong>
                          <p className="mt-1 text-neutral-500">
                            {r.firstName} {r.lastName}
                          </p>
                        </td>
                        <td className="p-3">{r.beeLevel}</td>
                        <td className="p-3 font-bold">{score}/5</td>
                        <td className="p-3">
                          <ComplianceLabel score={score} />
                        </td>
                        <td className="p-3">{r.locality}</td>
                        {type === "rfq" && <td className="p-3">{r.quotationAmount || "—"}</td>}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(r)}
                            className="font-bold text-[#201E64] hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination page={page} setPage={setPage} total={filtered.length} pageSize={pageSize} />
          </>
        )}
      </section>

      {selectedResponse && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-3 sm:p-6"
          onClick={() => setSelectedResponse(null)}
        >
          <div
            className="mx-auto max-w-6xl bg-white p-3 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedResponse(null)}
              className="mb-4 text-xs font-bold text-[#201E64]"
            >
              ← Back to responses
            </button>
            <SupplierResponseDetails
              response={selectedResponse}
              onBack={() => setSelectedResponse(null)}
              onSupplierUpdated={updateSupplierTax}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// MOBILE OPPORTUNITY CARD
// ======================================================

function OpportunityCard({ opportunity, type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:border-[#201E64]/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[9px] font-bold uppercase text-[#201E64]">
            {type === "tender" ? "Tender" : "RFQ"}
          </span>
          <h3 className="mt-1 text-sm font-bold leading-5" style={{ color: NAVY }}>
            {opportunity.title}
          </h3>
        </div>

        <OpportunityStatusBadge status={opportunity.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-500">
        {opportunity.description}
      </p>

      {/* INFO */}
      <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-600">
            Closes {formatDate(opportunity.closingDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-600">{opportunity.location}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-xs font-bold text-[#201E64]">
        View opportunity
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

// ======================================================
// OPPORTUNITY LIST
// ======================================================

function OpportunityList({ opportunities, type, search, setSearch, onSelect }) {
  const [locationFilter, setLocationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const label = type === "tender" ? "Tenders" : "RFQs";

  // Distinct locations of the posted opportunities.
  const locationOptions = useMemo(
    () =>
      [
        ...new Set(
          opportunities.map((o) => String(o.location ?? "").trim()).filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [opportunities]
  );

  const filtered = useMemo(() => {
    const query = norm(search);

    return opportunities.filter((opportunity) => {
      const matchesLocation =
        locationFilter === "all" ||
        String(opportunity.location ?? "").trim() === locationFilter;

      if (!matchesLocation) return false;
      if (!query) return true;

      // Search across the opportunity details.
      return [
        opportunity.title,
        opportunity.reference,
        opportunity.description,
        opportunity.location,
        opportunity.status,
        opportunity.closingDate,
        formatDate(opportunity.closingDate),
        opportunity.createdDate,
        formatDate(opportunity.createdDate),
      ].some((value) => norm(value).includes(query));
    });
  }, [opportunities, search, locationFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, type, locationFilter]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {/* SEARCH + LOCATION FILTER */}
      <div className="border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1 sm:max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${label.toLowerCase()} by title, reference, description, location or status...`}
              className="h-10 w-full border border-neutral-300 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/10 sm:text-sm"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              aria-label="Filter by location"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="h-10 w-full border border-neutral-300 bg-white px-3 text-xs outline-none focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/10 sm:text-sm"
            >
              <option value="all">All locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold sm:text-base" style={{ color: NAVY }}>
          Posted {label}
        </h2>

        <span className="text-xs text-neutral-500">
          {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
        </span>
      </div>

      {/* MOBILE CARDS */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:hidden">
        {pageRows.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            type={type}
            onClick={() => onSelect(opportunity)}
          />
        ))}
      </div>

      {/* DESKTOP TABLE */}
      {filtered.length > 0 && (
        <div className="mt-3 hidden overflow-x-auto border border-neutral-200 bg-white shadow-sm md:block">
          <table className="w-full min-w-[820px]">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Opportunity
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Closing
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pageRows.map((opportunity) => (
                <tr
                  key={opportunity.id}
                  onClick={() => onSelect(opportunity)}
                  className="cursor-pointer border-t border-neutral-100 transition hover:bg-[#201E64]/[0.02]"
                >
                  <td className="px-4 py-3">
                    <p
                      className="max-w-[300px] truncate text-xs font-bold"
                      style={{ color: NAVY }}
                    >
                      {opportunity.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">
                      {opportunity.reference}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="max-w-[220px] truncate text-xs text-neutral-600">
                      {opportunity.location || "—"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600">
                    {formatDate(opportunity.closingDate)}
                  </td>

                  <td className="px-4 py-3">
                    <OpportunityStatusBadge status={opportunity.status} />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(opportunity);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#201E64] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Opportunity
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination page={page} setPage={setPage} total={filtered.length} pageSize={pageSize} />
      )}

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="mt-3 border border-neutral-200 bg-white px-4 py-10 text-center">
          <Search className="mx-auto h-6 w-6 text-neutral-300" />
          <p className="mt-3 text-sm font-bold text-neutral-700">
            No {label.toLowerCase()} found
          </p>
          <p className="mt-1 text-xs text-neutral-500">Try a different search or location.</p>
        </div>
      )}
    </>
  );
}

// ======================================================
// MAIN SCREEN
// ======================================================

export default function OpportunitiesScreen() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("tenders");
  const [tenders, setTenders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const sectors = INDUSTRY_SECTORS;
  const [tenderSearch, setTenderSearch] = useState("");
  const [rfqSearch, setRfqSearch] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedType, setSelectedType] = useState("tender");
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [apiError, setApiError] = useState("");

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const [tenderResult, rfqResult] = await Promise.allSettled([
        apiRequest(ENDPOINTS.tenders),
        apiRequest(ENDPOINTS.rfqs),
      ]);
      const errors = [];
      if (tenderResult.status === "fulfilled") {
        setTenders(
          extractArray(tenderResult.value, ["tenders", "opportunities"]).map((r) =>
            normalizeOpportunity(r, "tender")
          )
        );
      } else {
        setTenders([]);
        errors.push(`Tenders: ${tenderResult.reason.message}`);
      }
      if (rfqResult.status === "fulfilled") {
        setRfqs(
          extractArray(rfqResult.value, ["rfqs", "opportunities"]).map((r) =>
            normalizeOpportunity(r, "rfq")
          )
        );
      } else {
        setRfqs([]);
        errors.push(`RFQs: ${rfqResult.reason.message}`);
      }
      setApiError(errors.join(" | "));
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      setApiError("Please log in to view opportunities.");
      return;
    }
    loadOpportunities();
  }, [authLoading, isAuthenticated]);

  const openOpportunity = async (item, type) => {
    const id =
      type === "tender" ? (item.tender_id ?? item.id) : (item.rfq_id ?? item.id);
    if (id == null) {
      setApiError(`Cannot open ${type}: missing opportunity ID.`);
      return;
    }

    setSelectedOpportunity(null);
    setSelectedType(type);
    setLoadingDetails(true);
    setApiError("");
    try {
      // Fetch responses for this selected opportunity, not the full listing.
      const path =
        type === "tender" ? ENDPOINTS.tenderDetails(id) : ENDPOINTS.rfqDetails(id);
      const result = await apiRequest(path);
      const details = normalizeDetails(result, type);
      setSelectedOpportunity(details);
    } catch (error) {
      console.error(`[Opportunities] Failed to load ${type} ${id}:`, error);
      setApiError(`Could not load ${type} responses: ${error.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  const createOpportunity = async (data, type) => {
    const formData = new FormData();
    const payload = {
      title: data.title,
      description: data.description,
      closing_date: data.closingDate,
      location: data.location,
      ...(type === "rfq" ? { sector_ids: data.sector_ids } : {}),
    };
    // published_by should ideally be obtained from the verified JWT on the backend.
    // If your current controller still requires it, populate from your logged-in user.
    const userId = Number(user?.user_id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("User ID is missing from your login session. Please log in again.");
    }
    payload.published_by = userId;
    formData.append(type === "rfq" ? "rfqData" : "data", JSON.stringify(payload));
    formData.append("opportunity_document", data.document);

    await apiRequest(type === "rfq" ? ENDPOINTS.createRfq : ENDPOINTS.createTender, {
      method: "POST",
      body: formData,
    });
    await loadOpportunities();
    setActiveTab(type === "rfq" ? "rfqs" : "tenders");
  };

  const handleCreateTender = (data) => createOpportunity(data, "tender");
  const handleCreateRfq = (data) => createOpportunity(data, "rfq");

  if (selectedOpportunity) {
    return (
      <OpportunityDetailsScreen
        key={`${selectedType}-${selectedOpportunity.id}`}
        opportunity={selectedOpportunity}
        type={selectedType}
        onBack={() => setSelectedOpportunity(null)}
      />
    );
  }

  const tabClass = (tab) =>
    `flex h-11 items-center gap-2 border-b-2 px-3 text-xs font-bold transition sm:px-4 ${
      activeTab === tab
        ? "border-[#201E64] text-[#201E64]"
        : "border-transparent text-neutral-500 hover:text-[#201E64]"
    }`;

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={{ color: NAVY }}
          >
            Business Opportunities
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500 sm:text-sm">
            Create and manage Tenders and RFQs and review responses from registered suppliers.
          </p>
        </div>

        {/* CREATE SHORTCUT */}
        {activeTab !== "create" && (
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className="inline-flex h-10 w-full items-center justify-center gap-2 bg-[#201E64] px-4 text-xs font-bold text-white transition hover:bg-[#2B2889] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Opportunity
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="overflow-x-auto border-b border-neutral-200">
        <div className="flex min-w-max">
          <button type="button" onClick={() => setActiveTab("tenders")} className={tabClass("tenders")}>
            <FileText className="h-4 w-4" />
            Tenders
            <span className="bg-neutral-100 px-2 py-0.5 text-[10px]">{tenders.length}</span>
          </button>

          <button type="button" onClick={() => setActiveTab("rfqs")} className={tabClass("rfqs")}>
            <ClipboardList className="h-4 w-4" />
            RFQs
            <span className="bg-neutral-100 px-2 py-0.5 text-[10px]">{rfqs.length}</span>
          </button>

          <button type="button" onClick={() => setActiveTab("create")} className={tabClass("create")}>
            <Plus className="h-4 w-4" />
            Create Opportunity
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-5">
        {apiError && (
          <div
            role="alert"
            className="mb-4 border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {apiError}
          </div>
        )}

        {(loading || loadingDetails) && (
          <p className="mb-3 text-xs text-neutral-500">
            {loadingDetails ? "Loading opportunity details..." : "Loading opportunities..."}
          </p>
        )}

        {activeTab === "tenders" && (
          <OpportunityList
            opportunities={tenders}
            type="tender"
            search={tenderSearch}
            setSearch={setTenderSearch}
            onSelect={(item) => openOpportunity(item, "tender")}
          />
        )}

        {activeTab === "rfqs" && (
          <OpportunityList
            opportunities={rfqs}
            type="rfq"
            search={rfqSearch}
            setSearch={setRfqSearch}
            onSelect={(item) => openOpportunity(item, "rfq")}
          />
        )}

        {activeTab === "create" && (
          <CreateOpportunityForm
            onCreateTender={handleCreateTender}
            onCreateRfq={handleCreateRfq}
            sectors={sectors}
          />
        )}
      </div>
    </div>
  );
}