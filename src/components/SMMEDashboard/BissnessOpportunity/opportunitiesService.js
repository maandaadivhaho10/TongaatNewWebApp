import api from "../../../API/axiosInstance";

export const NAVY = "#201E64";
export const RFQ_ENDPOINT = "/rfq/user";
export const TENDER_ENDPOINT = "/tender";
export const RFQ_APPLICATIONS_ENDPOINT = "/rfq/my-applications";
// Placeholder until the tender applications backend route is available.
export const TENDER_APPLICATIONS_ENDPOINT = "/tenders/my-applications";

export const TABS = [

  { key: "all", label: "All" },

  { key: "rfq", label: "RFQs" },

  { key: "tender", label: "Tenders" },

  { key: "applications", label: "My Applications" },

];



export const TYPE_LABEL = {

  rfq: "RFQ",

  tender: "Tender",

};



export const STATUS_STYLES = {

  pending: "bg-amber-100 text-amber-800",

  submitted: "bg-amber-100 text-amber-800",

  under_review: "bg-blue-100 text-blue-800",

  shortlisted: "bg-blue-100 text-blue-800",

  approved: "bg-green-100 text-green-800",

  accepted: "bg-green-100 text-green-800",

  awarded: "bg-green-100 text-green-800",

  rejected: "bg-red-100 text-red-800",

  declined: "bg-red-100 text-red-800",

  withdrawn: "bg-neutral-200 text-neutral-700",

};



// ======================================================

// HELPERS

// ======================================================
export function formatDate(iso) {

  if (!iso) return "Not specified";



  const date = new Date(`${String(iso).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return String(iso);



  return date.toLocaleDateString("en-ZA", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

}



export function formatPrice(value) {

  const number = Number(value);

  if (value === null || value === undefined || !Number.isFinite(number)) {

    return "Not specified";

  }



  return new Intl.NumberFormat("en-ZA", {

    style: "currency",

    currency: "ZAR",

  }).format(number);

}



export function formatStatus(status) {

  return String(status || "submitted")

    .replace(/_/g, " ")

    .replace(/\b\w/g, (c) => c.toUpperCase());

}



export function daysUntil(iso) {

  if (!iso) return null;



  const today = new Date();

  const closing = new Date(`${String(iso).slice(0, 10)}T00:00:00`);



  return Math.ceil((closing - today) / (1000 * 60 * 60 * 24));

}



// Axios attaches the in-memory JWT from AuthContext via setAccessToken.

export function apiError(error, fallback) {

  if (error?.response?.status === 401)

    return "Your session has expired or is invalid. Please log in again.";



  if (error?.response?.status === 403)

    return "Your account does not have permission to access this resource.";



  return (

    error?.response?.data?.message ||

    error?.response?.data?.error ||

    error?.message ||

    fallback

  );

}



function extractList(payload, type, extraKeys = []) {

  const root = payload?.data ?? payload;



  const keys = [

    ...extraKeys,

    ...(type === "rfq"

      ? ["rfqs", "opportunities", "results"]

      : ["tenders", "opportunities", "results"]),

  ];



  if (Array.isArray(root)) return root;



  for (const key of keys) {

    if (Array.isArray(root?.[key])) return root[key];

  }



  return [];

}



function normalizeOpportunity(item, type) {

  const id =

    type === "rfq" ? (item.rfq_id ?? item.id) : (item.tender_id ?? item.id);

  const date = item.closing_date ?? item.closingDate ?? item.closing;

  const url = item.image_url ?? item.document_url ?? item.documentUrl ?? null;



  return {

    ...item,

    id,

    type,

    closing: date ? String(date).slice(0, 10) : null,

    document_url: url,

    applied: Boolean(item.applied ?? item.has_applied ?? item.already_applied),

  };

}



// An application row may be the response record itself, possibly joined with

// the RFQ / tender details. This reads the common field names defensively.

function normalizeApplication(item, type) {

  const opportunityId =

    type === "rfq"

      ? (item.rfq_id ?? item.rfq?.rfq_id ?? item.rfq?.id)

      : (item.tender_id ?? item.tender?.tender_id ?? item.tender?.id);



  const source = (type === "rfq" ? item.rfq : item.tender) || {};



  const closingDate =

    item.closing_date ??

    item.closingDate ??

    source.closing_date ??

    source.closingDate ??

    null;



  const appliedAt =

    item.applied_at ??

    item.application_date ??

    item.submitted_at ??

    item.response_date ??

    item.created_at ??

    item.createdAt ??

    null;



  const quotation =

    item.quotation_document_url ??

    item.quotation_url ??

    item.quotation_document ??

    null;



  return {

    ...item,

    type,

    opportunityId,

    applicationId:

      item.response_id ??

      item.rfq_response_id ??

      item.tender_response_id ??

      item.application_id ??

      item.id ??

      null,

    title:

      item.title ??

      item.rfq_title ??

      item.tender_title ??

      source.title ??

      `${TYPE_LABEL[type]} #${opportunityId ?? ""}`.trim(),

    description: item.description ?? source.description ?? "",

    location: item.location ?? source.location ?? null,

    closing: closingDate ? String(closingDate).slice(0, 10) : null,

    document_url:

      item.image_url ??

      item.document_url ??

      item.documentUrl ??

      source.image_url ??

      source.document_url ??

      null,

    appliedAt,

    status: item.status ?? item.response_status ?? "submitted",

    quotation_link:

      typeof quotation === "string" && /^https?:\/\//i.test(quotation)

        ? quotation

        : null,

  };

}



export async function loadList(url, type) {

  try {

    const response = await api.get(url);

    return extractList(response.data, type).map((item) =>

      normalizeOpportunity(item, type)

    );

  } catch (error) {

    throw new Error(apiError(error, `Failed to load ${TYPE_LABEL[type]}s.`));

  }

}



export async function loadApplications(url, type, { ignoreNotFound = false } = {}) {

  try {

    const response = await api.get(url);

    return extractList(response.data, type, ["applications"]).map((item) =>

      normalizeApplication(item, type)

    );

  } catch (error) {

    // The tender URL is a placeholder for now, so a 404 shouldn't show an error.

    if (ignoreNotFound && error?.response?.status === 404) return [];



    throw new Error(

      apiError(error, `Failed to load your ${TYPE_LABEL[type]} applications.`)

    );

  }

}



// =====================================================

// DOCUMENT VIEWER

// ======================================================
