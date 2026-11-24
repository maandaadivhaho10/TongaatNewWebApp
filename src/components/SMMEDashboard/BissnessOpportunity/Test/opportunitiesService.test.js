import { vi } from "vitest";
import api from "../../../../API/axiosInstance";
import {
  formatDate, formatPrice, formatStatus, daysUntil, apiError,
  loadList, loadApplications,
} from "../opportunitiesService";

vi.mock("../../../../API/axiosInstance", () => ({ __esModule: true, default: { get: vi.fn() } }));

afterEach(() => { vi.clearAllMocks(); vi.useRealTimers(); });

describe("formatters", () => {
  test("formatDate", () => {
    expect(formatDate(null)).toBe("Not specified");
    expect(formatDate("garbage")).toBe("garbage");
    expect(formatDate("2026-03-05T10:00:00Z")).toMatch(/5\s+Mar\w*\s+2026/);
  });

  test("formatPrice", () => {
    expect(formatPrice(null)).toBe("Not specified");
    expect(formatPrice(undefined)).toBe("Not specified");
    expect(formatPrice("abc")).toBe("Not specified");
    expect(formatPrice(1500)).toMatch(/R/);
    expect(formatPrice(1500)).toMatch(/1\D*500/);
  });

  test("formatStatus", () => {
    expect(formatStatus("under_review")).toBe("Under Review");
    expect(formatStatus(undefined)).toBe("Submitted");
  });

  test("daysUntil", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-11-11T00:00:00"));
    expect(daysUntil(null)).toBeNull();
    expect(daysUntil("2026-11-15")).toBe(4);
    expect(daysUntil("2026-11-10")).toBeLessThanOrEqual(-1);
  });
});

describe("apiError", () => {
  test("maps status codes and falls back", () => {
    expect(apiError({ response: { status: 401 } }, "x")).toMatch(/session has expired/i);
    expect(apiError({ response: { status: 403 } }, "x")).toMatch(/permission/i);
    expect(apiError({ response: { status: 500, data: { message: "Boom" } } }, "x")).toBe("Boom");
    expect(apiError({ response: { data: { error: "Bad" } } }, "x")).toBe("Bad");
    expect(apiError({ message: "Network Error" }, "x")).toBe("Network Error");
    expect(apiError({}, "fallback")).toBe("fallback");
  });
});

describe("loadList", () => {
  test("normalizes RFQs", async () => {
    api.get.mockResolvedValue({
      data: { data: { rfqs: [{ rfq_id: 3, title: "A", closing_date: "2026-12-01T00:00:00Z", image_url: "http://d/a.pdf" }] } },
    });
    const [item] = await loadList("/rfq/user", "rfq");
    expect(item).toMatchObject({ id: 3, type: "rfq", closing: "2026-12-01", document_url: "http://d/a.pdf", applied: false });
  });

  test("normalizes tenders from a plain array and applied flag", async () => {
    api.get.mockResolvedValue({ data: [{ tender_id: 9, title: "T", has_applied: true }] });
    const [item] = await loadList("/tender", "tender");
    expect(item).toMatchObject({ id: 9, type: "tender", closing: null, applied: true });
  });

  test("returns [] for unknown shapes and throws friendly error on failure", async () => {
    api.get.mockResolvedValueOnce({ data: { nothing: true } });
    expect(await loadList("/rfq/user", "rfq")).toEqual([]);
    api.get.mockRejectedValueOnce({ response: { status: 403 } });
    await expect(loadList("/rfq/user", "rfq")).rejects.toThrow(/permission/i);
  });
});

describe("loadApplications", () => {
  test("normalizes joined rfq application", async () => {
    api.get.mockResolvedValue({
      data: { applications: [{
        rfq_response_id: 5, rfq: { rfq_id: 2, title: "Joined", location: "JHB", closing_date: "2026-12-31T00:00:00Z" },
        created_at: "2026-01-01", status: "under_review", quotation_document_url: "https://q/doc.pdf",
      }] },
    });
    const [app] = await loadApplications("/rfq/my-applications/7", "rfq");
    expect(app).toMatchObject({
      type: "rfq", opportunityId: 2, applicationId: 5, title: "Joined", location: "JHB",
      closing: "2026-12-31", appliedAt: "2026-01-01", status: "under_review", quotation_link: "https://q/doc.pdf",
    });
  });

  test("falls back for title/status and rejects non-http quotation links", async () => {
    api.get.mockResolvedValue({ data: [{ rfq_id: 4, quotation_url: "ftp://nope" }] });
    const [app] = await loadApplications("/x", "rfq");
    expect(app.title).toBe("RFQ #4");
    expect(app.status).toBe("submitted");
    expect(app.quotation_link).toBeNull();
  });

  test("ignoreNotFound swallows 404 only", async () => {
    api.get.mockRejectedValue({ response: { status: 404 } });
    expect(await loadApplications("/x", "tender", { ignoreNotFound: true })).toEqual([]);
    await expect(loadApplications("/x", "tender")).rejects.toThrow();
  });
});