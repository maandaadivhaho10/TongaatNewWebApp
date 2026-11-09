import api from "../../../API/axiosInstance";

export const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
};

export const getError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export const statusStyle = (status) => {
  switch (status) {
    case "OPEN":
    case "ACCEPTED": return "border-green-200 bg-green-50 text-green-700";
    case "UNDER_REVIEW": return "border-blue-200 bg-blue-50 text-blue-700";
    case "SUBMITTED": return "border-amber-200 bg-amber-50 text-amber-700";
    case "REJECTED":
    case "CANCELLED": return "border-red-200 bg-red-50 text-red-700";
    default: return "border-neutral-200 bg-neutral-100 text-neutral-700";
  }
};

export const getFundingOpportunities = () => api.get("/funding");
export const getMyFundingApplications = () => api.get("/funding/my-applications");
export const submitFundingApplication = (id) => api.post(`/funding/${id}/apply`);
