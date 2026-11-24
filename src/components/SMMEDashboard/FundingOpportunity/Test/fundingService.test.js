import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../API/axiosInstance", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from "../../../../API/axiosInstance";
import {
  formatDate,
  getError,
  statusStyle,
  getFundingOpportunities,
  getMyFundingApplications,
  submitFundingApplication,
} from "../fundingService";

describe("formatDate", () => {
  it("returns 'Not available' for empty values", () => {
    expect(formatDate(null)).toBe("Not available");
    expect(formatDate(undefined)).toBe("Not available");
    expect(formatDate("")).toBe("Not available");
  });

  it("returns 'Not available' for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("Not available");
  });

  it("formats a valid date and includes the year", () => {
    const result = formatDate("2024-03-15T10:00:00Z");
    expect(result).not.toBe("Not available");
    expect(result).toMatch(/2024/);
  });
});

describe("getError", () => {
  it("prefers the API response message", () => {
    const err = { response: { data: { message: "API says no" } }, message: "Network" };
    expect(getError(err, "fallback")).toBe("API says no");
  });

  it("falls back to error.message", () => {
    expect(getError(new Error("boom"), "fallback")).toBe("boom");
  });

  it("falls back to the provided fallback", () => {
    expect(getError({}, "fallback")).toBe("fallback");
    expect(getError(undefined, "fallback")).toBe("fallback");
  });
});

describe("statusStyle", () => {
  it.each([
    ["OPEN", "green"],
    ["ACCEPTED", "green"],
    ["UNDER_REVIEW", "blue"],
    ["SUBMITTED", "amber"],
    ["REJECTED", "red"],
    ["CANCELLED", "red"],
    ["SOMETHING_ELSE", "neutral"],
    [undefined, "neutral"],
  ])("maps %s to a %s style", (status, color) => {
    expect(statusStyle(status)).toContain(color);
  });
});

describe("API helpers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getFundingOpportunities calls GET /funding", async () => {
    api.get.mockResolvedValue({ data: [] });
    await getFundingOpportunities();
    expect(api.get).toHaveBeenCalledWith("/funding");
  });

  it("getMyFundingApplications calls GET /funding/my-applications", async () => {
    api.get.mockResolvedValue({ data: [] });
    await getMyFundingApplications();
    expect(api.get).toHaveBeenCalledWith("/funding/my-applications");
  });

  it("submitFundingApplication calls POST /funding/:id/apply", async () => {
    api.post.mockResolvedValue({ data: {} });
    await submitFundingApplication(42);
    expect(api.post).toHaveBeenCalledWith("/funding/42/apply");
  });
});