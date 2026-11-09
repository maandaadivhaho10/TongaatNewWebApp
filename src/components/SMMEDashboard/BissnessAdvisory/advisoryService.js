import api from "../../../API/axiosInstance";

const ADVISORY_URL = "/advisory";
const MY_REQUESTS_URL = "/advisory/my-requests";

export const SUPPORT_AREAS = [
  "Financial Management", "Marketing & Sales", "Business Strategy",
  "Business Compliance", "Procurement & Tenders", "Business Operations",
  "Human Resources", "Funding & Investment", "Growth & Expansion", "Other",
];

export const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-green-200 bg-green-50 text-green-700",
  completed: "border-green-200 bg-green-50 text-green-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

export const formatStatus = (status) => String(status || "pending")
  .replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const extractRequests = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data?.requests)) return data.data.requests;
  return [];
};

export const getMyAdvisoryRequests = async () => {
  const { data } = await api.get(MY_REQUESTS_URL);
  if (data?.success === false) throw new Error(data.message || "Failed to load your requests.");
  return extractRequests(data);
};

export const submitAdvisoryRequest = async (formData) => {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const { data } = await api.post(ADVISORY_URL, {
    subject: formData.support_area,
    description: formData.description.trim(),
    request_date: date,
    preferred_date: null,
  });
  if (data?.success === false) throw new Error(data.message || "Failed to submit advisory request.");
  return data;
};

export const getAdvisoryError = (err, action = "submit") => {
  if (err.response?.status === 401) return "Your session is no longer valid. Please log in again.";
  if (action === "submit" && err.response?.status === 403) return "Your account does not have permission to submit advisory requests.";
  if (err.response?.status === 404) return action === "submit"
    ? "Advisory API endpoint was not found. Check the backend route."
    : "Requests endpoint was not found. Check the backend route.";
  if (action === "submit" && err.code === "ECONNABORTED") return "The request timed out. Check whether it was saved before retrying.";
  if (!err.response && !err.message) return "Unable to connect to the server.";
  return err.response?.data?.message || err.message || (action === "submit"
    ? "Failed to submit advisory request." : "Failed to load your requests.");
};
