import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

// Create mock API functions.
// This prevents tests from sending real requests to the backend.
const { mockGet, mockPost } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn()
}));

// NOTE: adjust this path if your folder structure is different.
// (The service itself imports "../../../API/axiosInstance".)
vi.mock("../../../../API/axiosInstance", () => ({
    default: {
        get: mockGet,
        post: mockPost
    }
}));

import {
    SUPPORT_AREAS,
    STATUS_STYLES,
    formatStatus,
    formatDate,
    getMyAdvisoryRequests,
    submitAdvisoryRequest,
    getAdvisoryError
} from "../advisoryService";

const REQUESTS = [
    { request_id: 1, subject: "Business Strategy" },
    { request_id: 2, subject: "Human Resources" }
];

// Run before every test.
beforeEach(() => {
    // Reset API mock history and previous mock behaviour.
    mockGet.mockReset();
    mockPost.mockReset();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("advisoryService", () => {

    // =====================================================
    // 1. CONSTANT TESTS
    // =====================================================

    describe("SUPPORT_AREAS", () => {

        it("should contain 10 support areas", () => {
            expect(SUPPORT_AREAS).toHaveLength(10);
        });

        it("should not contain duplicate support areas", () => {
            expect(new Set(SUPPORT_AREAS).size).toBe(SUPPORT_AREAS.length);
        });

        it("should include the expected support areas", () => {
            expect(SUPPORT_AREAS).toEqual(
                expect.arrayContaining([
                    "Financial Management",
                    "Marketing & Sales",
                    "Business Strategy",
                    "Business Compliance",
                    "Procurement & Tenders",
                    "Business Operations",
                    "Human Resources",
                    "Funding & Investment",
                    "Growth & Expansion"
                ])
            );
        });

        it("should list Other last", () => {
            expect(SUPPORT_AREAS[SUPPORT_AREAS.length - 1]).toBe("Other");
        });

    });

    describe("STATUS_STYLES", () => {

        it("should define a style for every known status", () => {
            expect(Object.keys(STATUS_STYLES)).toEqual(
                expect.arrayContaining([
                    "pending",
                    "approved",
                    "completed",
                    "in_progress",
                    "rejected",
                    "cancelled"
                ])
            );
        });

        it.each([
            ["pending", "text-amber-700"],
            ["approved", "text-green-700"],
            ["completed", "text-green-700"],
            ["in_progress", "text-blue-700"],
            ["rejected", "text-red-700"],
            ["cancelled", "text-neutral-600"]
        ])("should style %s with %s", (status, expectedClass) => {
            expect(STATUS_STYLES[status]).toContain(expectedClass);
        });

    });


    // =====================================================
    // 2. formatStatus TESTS
    // =====================================================

    describe("formatStatus", () => {

        it.each([
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["in_progress", "In Progress"],
            ["some_new_status", "Some New Status"]
        ])("should format %s as %s", (input, expected) => {
            expect(formatStatus(input)).toBe(expected);
        });

        it.each([
            ["undefined", undefined],
            ["null", null],
            ["an empty string", ""]
        ])("should default to Pending when the status is %s", (_label, input) => {
            expect(formatStatus(input)).toBe("Pending");
        });

        it("should only capitalise the first letter of each word", () => {
            expect(formatStatus("APPROVED")).toBe("APPROVED");
        });

    });


    // =====================================================
    // 3. formatDate TESTS
    // =====================================================

    describe("formatDate", () => {

        it.each([
            ["undefined", undefined],
            ["null", null],
            ["an empty string", ""]
        ])("should return a dash when the date is %s", (_label, input) => {
            expect(formatDate(input)).toBe("—");
        });

        it("should return the original text when the date is invalid", () => {
            expect(formatDate("not-a-date")).toBe("not-a-date");
        });

        it("should format a valid date", () => {
            // Built the same way as the service so the test does not depend
            // on the machine's locale.
            const expected = new Date("2026-03-15T10:00:00").toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );

            expect(formatDate("2026-03-15T10:00:00")).toBe(expected);
        });

        it("should include the year in the formatted date", () => {
            expect(formatDate("2026-03-15T10:00:00")).toContain("2026");
        });

    });


    // =====================================================
    // 4. getMyAdvisoryRequests TESTS
    // =====================================================

    describe("getMyAdvisoryRequests", () => {

        it("should request the my-requests endpoint", async () => {
            mockGet.mockResolvedValue({ data: [] });

            await getMyAdvisoryRequests();

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith("/advisory/my-requests");
        });

        it.each([
            ["a bare array", REQUESTS],
            ["data", { data: REQUESTS }],
            ["requests", { requests: REQUESTS }],
            ["data.requests", { data: { requests: REQUESTS } }]
        ])("should return the requests from %s", async (_label, body) => {
            mockGet.mockResolvedValue({ data: body });

            await expect(getMyAdvisoryRequests()).resolves.toEqual(REQUESTS);
        });

        it.each([
            ["undefined", undefined],
            ["null", null],
            ["a string", "unexpected"],
            ["an object without a list", { message: "OK" }],
            ["a null data field", { data: null }]
        ])("should return an empty array when the response is %s", async (_label, body) => {
            mockGet.mockResolvedValue({ data: body });

            await expect(getMyAdvisoryRequests()).resolves.toEqual([]);
        });

        it("should throw the backend message when success is false", async () => {
            mockGet.mockResolvedValue({
                data: {
                    success: false,
                    message: "Not allowed."
                }
            });

            await expect(getMyAdvisoryRequests()).rejects.toThrow("Not allowed.");
        });

        it("should throw a default message when success is false without a message", async () => {
            mockGet.mockResolvedValue({
                data: {
                    success: false
                }
            });

            await expect(getMyAdvisoryRequests()).rejects.toThrow(
                "Failed to load your requests."
            );
        });

        it("should not throw when success is true", async () => {
            mockGet.mockResolvedValue({
                data: {
                    success: true,
                    data: REQUESTS
                }
            });

            await expect(getMyAdvisoryRequests()).resolves.toEqual(REQUESTS);
        });

        it("should rethrow request errors", async () => {
            const error = { response: { status: 500 } };

            mockGet.mockRejectedValue(error);

            await expect(getMyAdvisoryRequests()).rejects.toBe(error);
        });

    });


    // =====================================================
    // 5. submitAdvisoryRequest TESTS
    // =====================================================

    describe("submitAdvisoryRequest", () => {

        it("should post the request to the advisory endpoint", async () => {
            mockPost.mockResolvedValue({ data: { success: true } });

            await submitAdvisoryRequest({
                support_area: "Business Strategy",
                description: "Need help"
            });

            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost.mock.calls[0][0]).toBe("/advisory");
        });

        it("should send the subject, trimmed description and today's date", async () => {
            // Only fake the Date so promises still resolve normally.
            vi.useFakeTimers({ toFake: ["Date"] });
            vi.setSystemTime(new Date(2026, 11, 25, 10, 0, 0));

            mockPost.mockResolvedValue({ data: { success: true } });

            await submitAdvisoryRequest({
                support_area: "Business Strategy",
                description: "  Need help with strategy  "
            });

            expect(mockPost).toHaveBeenCalledWith("/advisory", {
                subject: "Business Strategy",
                description: "Need help with strategy",
                request_date: "2026-12-25",
                preferred_date: null
            });
        });

        it("should zero-pad single digit months and days", async () => {
            vi.useFakeTimers({ toFake: ["Date"] });
            vi.setSystemTime(new Date(2026, 2, 5, 10, 0, 0));

            mockPost.mockResolvedValue({ data: { success: true } });

            await submitAdvisoryRequest({
                support_area: "Other",
                description: "Help"
            });

            expect(mockPost.mock.calls[0][1].request_date).toBe("2026-03-05");
        });

        it("should return the response data", async () => {
            const data = {
                success: true,
                message: "Request submitted."
            };

            mockPost.mockResolvedValue({ data });

            await expect(
                submitAdvisoryRequest({
                    support_area: "Other",
                    description: "Help"
                })
            ).resolves.toEqual(data);
        });

        it("should throw the backend message when success is false", async () => {
            mockPost.mockResolvedValue({
                data: {
                    success: false,
                    message: "Duplicate request."
                }
            });

            await expect(
                submitAdvisoryRequest({
                    support_area: "Other",
                    description: "Help"
                })
            ).rejects.toThrow("Duplicate request.");
        });

        it("should throw a default message when success is false without a message", async () => {
            mockPost.mockResolvedValue({
                data: {
                    success: false
                }
            });

            await expect(
                submitAdvisoryRequest({
                    support_area: "Other",
                    description: "Help"
                })
            ).rejects.toThrow("Failed to submit advisory request.");
        });

        it("should rethrow request errors", async () => {
            const error = { response: { status: 500 } };

            mockPost.mockRejectedValue(error);

            await expect(
                submitAdvisoryRequest({
                    support_area: "Other",
                    description: "Help"
                })
            ).rejects.toBe(error);
        });

    });


    // =====================================================
    // 6. getAdvisoryError TESTS
    // =====================================================

    describe("getAdvisoryError", () => {

        it.each(["submit", "fetch"])(
            "should return a session message for a 401 when the action is %s",
            (action) => {
                expect(
                    getAdvisoryError({ response: { status: 401 } }, action)
                ).toBe("Your session is no longer valid. Please log in again.");
            }
        );

        it("should return a permission message for a 403 when submitting", () => {
            expect(
                getAdvisoryError({ response: { status: 403 } }, "submit")
            ).toBe(
                "Your account does not have permission to submit advisory requests."
            );
        });

        it("should not return the permission message for a 403 when fetching", () => {
            expect(
                getAdvisoryError({ response: { status: 403 } }, "fetch")
            ).toBe("Failed to load your requests.");
        });

        it("should return an endpoint message for a 404 when submitting", () => {
            expect(
                getAdvisoryError({ response: { status: 404 } }, "submit")
            ).toBe("Advisory API endpoint was not found. Check the backend route.");
        });

        it("should return an endpoint message for a 404 when fetching", () => {
            expect(
                getAdvisoryError({ response: { status: 404 } }, "fetch")
            ).toBe("Requests endpoint was not found. Check the backend route.");
        });

        it("should return a timeout message when submitting and the request timed out", () => {
            expect(
                getAdvisoryError(
                    { code: "ECONNABORTED", message: "timeout of 5000ms exceeded" },
                    "submit"
                )
            ).toBe(
                "The request timed out. Check whether it was saved before retrying."
            );
        });

        it("should return the error message for a timeout when fetching", () => {
            expect(
                getAdvisoryError(
                    { code: "ECONNABORTED", message: "timeout of 5000ms exceeded" },
                    "fetch"
                )
            ).toBe("timeout of 5000ms exceeded");
        });

        it("should return a connection message when there is no response and no message", () => {
            expect(getAdvisoryError({}, "submit")).toBe(
                "Unable to connect to the server."
            );
        });

        it("should prefer the backend message over the error message", () => {
            expect(
                getAdvisoryError(
                    {
                        message: "Request failed with status code 500",
                        response: {
                            status: 500,
                            data: { message: "Database is unavailable." }
                        }
                    },
                    "submit"
                )
            ).toBe("Database is unavailable.");
        });

        it("should fall back to the error message", () => {
            expect(
                getAdvisoryError({ message: "Network Error" }, "submit")
            ).toBe("Network Error");
        });

        it("should return a default submit message when no details are available", () => {
            expect(
                getAdvisoryError({ response: { status: 500 } }, "submit")
            ).toBe("Failed to submit advisory request.");
        });

        it("should return a default fetch message when no details are available", () => {
            expect(
                getAdvisoryError({ response: { status: 500 } }, "fetch")
            ).toBe("Failed to load your requests.");
        });

        it("should treat the action as submit by default", () => {
            expect(
                getAdvisoryError({ response: { status: 403 } })
            ).toBe(
                "Your account does not have permission to submit advisory requests."
            );
        });

        it("should check the 401 status before any other rule", () => {
            expect(
                getAdvisoryError(
                    {
                        response: {
                            status: 401,
                            data: { message: "Token expired." }
                        }
                    },
                    "submit"
                )
            ).toBe("Your session is no longer valid. Please log in again.");
        });

    });

});