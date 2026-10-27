
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  ChevronRight,
  X,
  Inbox,
  FileText,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { SupplierDetails } from "./SuppliersScreen";

// ======================================================
// API ENDPOINTS
// ======================================================

const ADVISORY_ENDPOINT = "/advisory/requests";

// Placeholder API - backend will be created later
const STATUS_ENDPOINT = (id) =>
  `/advisory/requests/${id}/status`;

const STATUSES = ["PENDING", "IN REVIEW", "COMPLETED"];

const PAGE_SIZE = 10;
const NAVY = "#201E64";

// ======================================================
// HELPERS
// ======================================================

const display = (value) =>
  value == null || value === ""
    ? "Not provided"
    : String(value);

const statusName = (value) =>
  String(value || "PENDING")
    .toUpperCase()
    .replaceAll("_", " ");

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return display(value);
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(date);
};

const formatBeeLevel = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw) return "Not provided";

  const match = raw.match(/^(?:level\s*)?([1-8])$/i);

  return match ? `Level ${match[1]}` : raw;
};

const supplierName = (supplier = {}) =>
  [
    supplier.title,
    supplier.first_name,
    supplier.last_name,
  ]
    .filter(Boolean)
    .join(" ") || "Unknown supplier";

const provided = (status) =>
  ["SUBMITTED", "REGISTERED", "PROVIDED"].includes(
    String(status || "").toUpperCase()
  );

// ======================================================
// DOCUMENT STATUS
// ======================================================

const docStatuses = (supplier = {}) => ({
  bee_document:
    supplier.document_status?.bee_document ||
    (supplier.bee_document_submitted
      ? "SUBMITTED"
      : "NOT_SUBMITTED"),

  financial_statement:
    supplier.document_status?.financial_statement ||
    (supplier.has_financial_statement
      ? "SUBMITTED"
      : "NOT_SUBMITTED"),

  company_registration:
    supplier.document_status?.company_registration ||
    (supplier.has_company_registration_document
      ? "SUBMITTED"
      : "NOT_SUBMITTED"),

  vat_registration:
    supplier.document_status?.vat_registration ||
    (supplier.has_vat_registration
      ? "REGISTERED"
      : "NOT_REGISTERED"),

  tax_compliance_pin:
    supplier.document_status?.tax_compliance_pin ||
    (supplier.has_tax_compliance_pin
      ? "PROVIDED"
      : "NOT_PROVIDED"),
});

const beeDocumentType = (supplier = {}) => {
  const explicit = String(
    supplier.bee_document_type || ""
  ).toUpperCase();

  if (explicit.includes("AFFIDAVIT")) {
    return "BEE_AFFIDAVIT";
  }

  if (explicit.includes("CERTIFICATE")) {
    return "BEE_CERTIFICATE";
  }

  const docs = Array.isArray(supplier.documents)
    ? supplier.documents
    : [];

  if (
    docs.some(
      (doc) =>
        String(doc.document_type).toUpperCase() ===
        "BEE_AFFIDAVIT"
    )
  ) {
    return "BEE_AFFIDAVIT";
  }

  if (
    docs.some(
      (doc) =>
        String(doc.document_type).toUpperCase() ===
        "BEE_CERTIFICATE"
    )
  ) {
    return "BEE_CERTIFICATE";
  }

  return null;
};

const score = (supplier = {}) => {
  const statuses = docStatuses(supplier);

  const otherKeys = [
    "financial_statement",
    "company_registration",
    "vat_registration",
    "tax_compliance_pin",
  ];

  const otherPoints = otherKeys.filter((key) =>
    provided(statuses[key])
  ).length;

  const beePoint =
    provided(statuses.bee_document) &&
    beeDocumentType(supplier) === "BEE_CERTIFICATE"
      ? 1
      : 0;

  return otherPoints + beePoint;
};

// ======================================================
// DOCUMENT SCORE FILTERS
// ======================================================

const SCORE_FILTERS = [
  {
    key: "ALL",
    label: "All Scores",
    match: () => true,
  },
  {
    key: "COMPLIANT",
    label: "Compliant",
    match: (value) => value === 5,
  },
  {
    key: "SEMI",
    label: "Semi-compliant",
    match: (value) => value >= 3 && value <= 4,
  },
  {
    key: "NON",
    label: "Non-compliant",
    match: (value) => value <= 2,
  },
];

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const current = statusName(status);

  const styles =
    current === "COMPLETED"
      ? "bg-green-50 text-green-700"
      : current === "IN REVIEW"
      ? "bg-blue-50 text-blue-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex whitespace-nowrap px-2.5 py-1 text-[11px] font-bold ${styles}`}
    >
      {current}
    </span>
  );
}

// ======================================================
// REQUEST DETAILS MODAL
// ======================================================

function RequestDetails({
  request,
  onClose,
  onOpenSupplier,
  onStatusUpdate,
  saving,
  updateError,
  supplierModalOpen,
  onMessageSupplier,
}) {
  const [draft, setDraft] = useState("PENDING");

  useEffect(() => {
    setDraft(statusName(request?.status));
  }, [
    request?.advisory_request_id,
    request?.status,
  ]);

  useEffect(() => {
    if (!request) return;

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !supplierModalOpen
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [request, onClose, supplierModalOpen]);

  if (!request) return null;

  const supplier = request.supplier || {};

  const supplierUserId = Number(
    supplier.user_id || request.user_id
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !supplierModalOpen
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Business advisory request details"
        className="flex max-h-[95dvh] w-full flex-col overflow-hidden bg-white shadow-xl sm:max-h-[90dvh] sm:max-w-3xl"
      >
        {/* HEADER */}
        <header className="flex items-start justify-between gap-3 border-b border-neutral-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-[#201E64]">
              Business Advisory Request #
              {request.advisory_request_id}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {display(request.subject)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </header>

        {/* MODAL CONTENT */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
          {/* REQUEST INFORMATION */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-sm font-bold text-[#201E64]">
                Request Information
              </h3>

              <StatusBadge
                status={request.status}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[11px] font-bold uppercase text-neutral-400">
                  Subject
                </p>

                <p className="mt-1 break-words text-sm font-semibold">
                  {display(request.subject)}
                </p>
              </div>

              <div className="border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[11px] font-bold uppercase text-neutral-400">
                  Request Date
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(request.request_date)}
                </p>
              </div>
            </div>

            <div className="border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-[11px] font-bold uppercase text-neutral-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral-700">
                {display(request.description)}
              </p>
            </div>
          </section>

          {/* UPDATE REQUEST STATUS */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-[#201E64]">
              Update Advisory Request Status
            </h3>

            <div className="flex flex-col gap-3 border border-neutral-200 p-4 sm:flex-row sm:items-end">
              <label className="flex flex-1 flex-col gap-2 text-xs font-semibold text-neutral-700">
                Request Status

                <select
                  value={draft}
                  onChange={(event) =>
                    setDraft(event.target.value)
                  }
                  disabled={saving}
                  className="h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#201E64]"
                >
                  {!STATUSES.includes(draft) && (
                    <option value={draft}>
                      {draft}
                    </option>
                  )}

                  {STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                disabled={
                  saving ||
                  draft === statusName(request.status)
                }
                onClick={() =>
                  onStatusUpdate(
                    request.advisory_request_id,
                    draft
                  )
                }
                className="h-11 bg-[#201E64] px-5 text-xs font-bold text-white transition hover:bg-[#17154b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Status"}
              </button>
            </div>

            {updateError && (
              <p
                role="alert"
                className="text-xs text-red-700"
              >
                {updateError}
              </p>
            )}
          </section>

          {/* SUPPLIER WHO APPLIED */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-[#201E64]">
              Supplier Who Applied
            </h3>

            <div className="border border-neutral-200 bg-white p-4">
              {/* NAME AND COMPANY */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-neutral-500">
                    Supplier Name
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-[#201E64]">
                    {supplierName(supplier)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-500">
                    Company Name
                  </p>

                  <p className="mt-1 break-words text-sm font-bold text-neutral-800">
                    {display(
                      supplier.business_name
                    )}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                {/* DOCUMENT SCORE */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenSupplier("documents")
                  }
                  className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-4 py-2.5 text-xs font-bold text-[#201E64] transition hover:bg-neutral-50"
                >
                  <FileText size={16} />

                  Document Score: {score(supplier)}/5
                </button>

                {/* MESSAGE SUPPLIER */}
                <button
                  type="button"
                  onClick={() =>
                    onMessageSupplier?.(
                      supplierUserId
                    )
                  }
                  disabled={
                    !supplierUserId ||
                    !onMessageSupplier
                  }
                  className="inline-flex items-center justify-center gap-2 border border-[#201E64]/20 px-4 py-2.5 text-xs font-bold text-[#201E64] transition hover:bg-indigo-50 disabled:opacity-40"
                >
                  <MessageCircle size={16} />
                  Message
                </button>

                {/* VIEW SUPPLIER */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenSupplier("information")
                  }
                  className="inline-flex items-center justify-center gap-2 bg-[#201E64] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#17154b]"
                >
                  View Supplier Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="flex justify-end border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#201E64] px-5 py-2.5 text-xs font-bold text-white"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

// ======================================================
// MAIN BUSINESS REQUESTS SCREEN
// ======================================================

export default function BusinessRequestsScreen({
  onMessageSupplier,
}) {
  const {
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  // DATA
  const [requests, setRequests] = useState([]);

  // FILTERS
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [scoreFilter, setScoreFilter] =
    useState("ALL");

  // PAGINATION
  const [page, setPage] = useState(1);

  // MODALS
  const [selectedId, setSelectedId] =
    useState(null);

  const [supplierTab, setSupplierTab] =
    useState(null);

  // LOADING AND ERRORS
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] =
    useState("");

  // ======================================================
  // FETCH ADVISORY REQUESTS
  // ======================================================

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        ADVISORY_ENDPOINT
      );

      if (
        !response.data?.success ||
        !Array.isArray(response.data.requests)
      ) {
        throw new Error(
          "Unexpected advisory API response"
        );
      }

      const normalizedRequests =
        response.data.requests.map((request) => ({
          ...request,
          status: statusName(request.status),
          supplier: request.supplier || {},
        }));

      setRequests(normalizedRequests);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load advisory requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setRequests([]);
      setError(
        "Please log in to view business advisory requests."
      );
      return;
    }

    fetchRequests();
  }, [
    authLoading,
    isAuthenticated,
    fetchRequests,
  ]);

  // ======================================================
  // SELECTED REQUEST
  // ======================================================

  const selected =
    requests.find(
      (request) =>
        String(request.advisory_request_id) ===
        String(selectedId)
    ) || null;

  // ======================================================
  // FILTER REQUESTS
  // ======================================================

  const filtered = useMemo(() => {
    return requests.filter((request) => {
      const supplier = request.supplier || {};

      const searchableText = [
        request.subject,
        request.description,
        supplier.first_name,
        supplier.last_name,
        supplier.business_name,
        supplier.bee_level,
        formatBeeLevel(supplier.bee_level),
        supplier.community,
        supplier.industry,
      ]
        .join(" ")
        .toLowerCase();

      const matchesStatus =
        filter === "ALL" ||
        request.status === filter;

      const selectedScoreFilter =
        SCORE_FILTERS.find(
          (item) => item.key === scoreFilter
        );

      const matchesScore =
        selectedScoreFilter?.match(
          score(supplier)
        ) ?? true;

      const matchesSearch =
        searchableText.includes(
          search.trim().toLowerCase()
        );

      return (
        matchesStatus &&
        matchesScore &&
        matchesSearch
      );
    });
  }, [requests, filter, scoreFilter, search]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginated = useMemo(() => {
    const start =
      (currentPage - 1) * PAGE_SIZE;

    return filtered.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filtered, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [search, filter, scoreFilter]);

  // ======================================================
  // STATUS COUNTS
  // ======================================================

  const count = (status) =>
    requests.filter(
      (request) =>
        request.status === status
    ).length;

  // ======================================================
  // UPDATE ADVISORY STATUS
  // ======================================================

  const updateStatus = async (id, status) => {
    if (authLoading || !isAuthenticated) {
      setUpdateError(
        "Please log in before updating a request."
      );
      return;
    }

    try {
      setSaving(true);
      setUpdateError("");

      // Placeholder backend API
      await api.patch(
        STATUS_ENDPOINT(id),
        { status }
      );

      // Update frontend only after API success
      setRequests((current) =>
        current.map((request) =>
          String(request.advisory_request_id) ===
          String(id)
            ? {
                ...request,
                status: statusName(status),
              }
            : request
        )
      );
    } catch (err) {
      setUpdateError(
        err.response?.data?.message ||
          "Unable to update request status. The backend PATCH endpoint may not be available yet."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // UPDATE TAX COMPLIANCE
  // ======================================================

  const updateTax = (businessId, status) => {
    setRequests((current) =>
      current.map((request) =>
        String(request.supplier?.business_id) ===
        String(businessId)
          ? {
              ...request,
              supplier: {
                ...request.supplier,
                tax_compliance_status: status,
              },
            }
          : request
      )
    );
  };

  // ======================================================
  // MODAL HANDLERS
  // ======================================================

  const openRequest = (id) => {
    setSelectedId(id);
    setSupplierTab(null);
    setUpdateError("");
  };

  const closeRequest = () => {
    setSelectedId(null);
    setSupplierTab(null);
  };

  const openSupplier = (id, tab) => {
    setSelectedId(id);
    setSupplierTab(tab);
    setUpdateError("");
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="w-full min-w-0">
      {/* PAGE HEADER */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#201E64] sm:text-3xl">
            Business Requests
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Business advisory requests from
            registered suppliers.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          disabled={
            loading ||
            authLoading ||
            !isAuthenticated
          }
          className="inline-flex items-center gap-2 border border-neutral-200 px-3 py-2 text-xs font-bold text-[#201E64] disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* STATUS SUMMARY */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["Pending", count("PENDING")],
          ["In Review", count("IN REVIEW")],
          ["Completed", count("COMPLETED")],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border border-neutral-200 bg-white p-4"
          >
            <p className="text-xs text-neutral-500">
              {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-[#201E64]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* SEARCH AND STATUS FILTER */}
      <div className="flex flex-col gap-3 border border-neutral-200 bg-white p-4 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search subject, supplier or company..."
            className="h-10 w-full border border-neutral-300 pl-9 pr-3 text-sm outline-none focus:border-[#201E64]"
          />
        </label>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="h-10 border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#201E64]"
        >
          <option value="ALL">
            All statuses
          </option>

          {STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* DOCUMENT SCORE FILTERS */}
      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by document score"
      >
        {SCORE_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() =>
              setScoreFilter(option.key)
            }
            aria-pressed={
              scoreFilter === option.key
            }
            className={`border px-3 py-2 text-xs font-semibold transition ${
              scoreFilter === option.key
                ? "border-[#201E64] bg-[#201E64] text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-[#201E64]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Document submission scores are not
        official compliance ratings.
        A submitted B-BBEE affidavit earns
        no point.
      </p>

      {/* ERROR */}
      {error && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={16} />
          {error}
        </p>
      )}

      {/* RESULTS COUNT */}
      <p className="mt-5 text-xs text-neutral-500">
        {filtered.length} advisory requests
      </p>

      {/* REQUEST LIST */}
      {loading ? (
        <p className="p-10 text-center text-sm text-neutral-500">
          Loading requests...
        </p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="mt-3 hidden overflow-x-auto border border-neutral-200 bg-white md:block">
            <table className="w-full min-w-[840px] text-left text-xs">
              <thead className="bg-neutral-50 uppercase text-neutral-500">
                <tr>
                  {[
                    "Subject",
                    "Supplier",
                    "B-BBEE Level",
                    "Request Date",
                    "Document Score",
                    "Status",
                    "Details",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginated.map((request) => (
                  <tr
                    key={
                      request.advisory_request_id
                    }
                    className="border-t border-neutral-100 hover:bg-neutral-50"
                  >
                    {/* SUBJECT */}
                    <td className="px-3 py-3 font-bold text-[#201E64]">
                      {display(request.subject)}
                    </td>

                    {/* SUPPLIER */}
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          openSupplier(
                            request.advisory_request_id,
                            "information"
                          )
                        }
                        className="text-left font-semibold text-[#201E64] hover:underline"
                      >
                        {supplierName(
                          request.supplier
                        )}
                      </button>
                    </td>

                    {/* B-BBEE */}
                    <td className="px-3 py-3">
                      <span className="bg-[#201E64]/10 px-2 py-1 font-bold text-[#201E64]">
                        {formatBeeLevel(
                          request.supplier?.bee_level
                        )}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-3 py-3">
                      {formatDate(
                        request.request_date
                      )}
                    </td>

                    {/* DOCUMENT SCORE */}
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          openSupplier(
                            request.advisory_request_id,
                            "documents"
                          )
                        }
                        className="inline-flex items-center gap-1 border border-neutral-200 px-2 py-1.5 font-bold text-[#201E64]"
                      >
                        <FileText size={14} />

                        {score(
                          request.supplier
                        )}/5

                        <ChevronRight size={14} />
                      </button>
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-3">
                      <StatusBadge
                        status={request.status}
                      />
                    </td>

                    {/* VIEW */}
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          openRequest(
                            request.advisory_request_id
                          )
                        }
                        className="font-bold text-[#201E64] hover:underline"
                      >
                        View Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="mt-3 grid gap-3 md:hidden">
            {paginated.map((request) => (
              <div
                key={
                  request.advisory_request_id
                }
                className="border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="break-words font-bold text-[#201E64]">
                    {display(request.subject)}
                  </p>

                  <StatusBadge
                    status={request.status}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openSupplier(
                      request.advisory_request_id,
                      "information"
                    )
                  }
                  className="mt-2 block text-left text-xs font-bold text-[#201E64]"
                >
                  {supplierName(
                    request.supplier
                  )}
                </button>

                <p className="mt-1 text-xs text-neutral-500">
                  {display(
                    request.supplier?.business_name
                  )}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#201E64]">
                  B-BBEE:{" "}
                  {formatBeeLevel(
                    request.supplier?.bee_level
                  )}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {formatDate(
                    request.request_date
                  )}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      openSupplier(
                        request.advisory_request_id,
                        "documents"
                      )
                    }
                    className="flex items-center gap-1 text-xs font-bold text-[#201E64]"
                  >
                    <FileText size={14} />

                    {score(
                      request.supplier
                    )}/5 Documents
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openRequest(
                        request.advisory_request_id
                      )
                    }
                    className="text-xs font-bold text-[#201E64]"
                  >
                    View Request
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {filtered.length > PAGE_SIZE && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-neutral-200 bg-white p-3">
              <span className="text-xs text-neutral-600">
                Showing{" "}
                {(currentPage - 1) *
                  PAGE_SIZE +
                  1}
                –
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )}{" "}
                of {filtered.length} requests
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((previous) =>
                      Math.max(
                        1,
                        previous - 1
                      )
                    )
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs font-semibold text-[#201E64] disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-xs font-semibold text-[#201E64]">
                  Page {currentPage} of{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(
                        totalPages,
                        previous + 1
                      )
                    )
                  }
                  className="border border-neutral-300 px-3 py-2 text-xs font-semibold text-[#201E64] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!filtered.length && (
            <div className="mt-3 border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
              <Inbox
                size={28}
                className="mx-auto mb-2"
              />

              No requests found.
            </div>
          )}
        </>
      )}

      {/* ADVISORY REQUEST DETAILS */}
      <RequestDetails
        request={selected}
        onClose={closeRequest}
        onOpenSupplier={setSupplierTab}
        onStatusUpdate={updateStatus}
        saving={saving}
        updateError={updateError}
        supplierModalOpen={Boolean(
          supplierTab
        )}
        onMessageSupplier={
          onMessageSupplier
        }
      />

      {/* SUPPLIER DETAILS MODAL */}
      {selected && supplierTab && (
        <SupplierDetails
          supplier={selected.supplier}
          initialTab={supplierTab}
          onClose={() =>
            setSupplierTab(null)
          }
          onUpdated={updateTax}
        />
      )}
    </div>
  );
}
