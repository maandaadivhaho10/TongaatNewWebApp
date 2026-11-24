import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";

// Create a mock API function.
// This prevents tests from sending real requests to the backend.
const { mockGet } = vi.hoisted(() => ({
    mockGet: vi.fn()
}));

// NOTE: adjust this path if your folder structure is different.
// (The service itself imports "../../../API/axiosInstance".)
vi.mock("../../../../API/axiosInstance", () => ({
    default: {
        get: mockGet
    }
}));

import { getEvents } from "../eventsService";

const EVENTS = [
    {
        activity_id: 1,
        name: "Supplier Workshop"
    },
    {
        activity_id: 2,
        name: "Funding Webinar"
    }
];

// Run before every test.
beforeEach(() => {
    // Reset API mock history and previous mock behaviour.
    mockGet.mockReset();
});

describe("eventsService - getEvents", () => {

    // =====================================================
    // 1. REQUEST TESTS
    // =====================================================

    it("should request the ESD activities endpoint", async () => {
        mockGet.mockResolvedValue({ data: [] });

        await getEvents("token-123");

        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet.mock.calls[0][0]).toBe("/esd-activities");
    });

    it("should send the token as a Bearer authorization header", async () => {
        mockGet.mockResolvedValue({ data: [] });

        await getEvents("token-123");

        expect(mockGet).toHaveBeenCalledWith(
            "/esd-activities",
            expect.objectContaining({
                headers: {
                    Authorization: "Bearer token-123"
                }
            })
        );
    });

    it("should pass the abort signal to the request", async () => {
        mockGet.mockResolvedValue({ data: [] });

        const controller = new AbortController();

        await getEvents("token-123", controller.signal);

        expect(mockGet.mock.calls[0][1].signal).toBe(controller.signal);
    });

    it("should work when no abort signal is provided", async () => {
        mockGet.mockResolvedValue({ data: [] });

        await expect(getEvents("token-123")).resolves.toEqual([]);

        expect(mockGet.mock.calls[0][1].signal).toBeUndefined();
    });


    // =====================================================
    // 2. RESPONSE SHAPE TESTS
    // =====================================================

    it("should return the events from result.data", async () => {
        mockGet.mockResolvedValue({
            data: {
                data: EVENTS
            }
        });

        await expect(getEvents("token-123")).resolves.toEqual(EVENTS);
    });

    it("should return the events from result.activities", async () => {
        mockGet.mockResolvedValue({
            data: {
                activities: EVENTS
            }
        });

        await expect(getEvents("token-123")).resolves.toEqual(EVENTS);
    });

    it("should return the response body when it is already an array", async () => {
        mockGet.mockResolvedValue({
            data: EVENTS
        });

        await expect(getEvents("token-123")).resolves.toEqual(EVENTS);
    });

    it("should prefer result.data over result.activities", async () => {
        const other = [{ activity_id: 99, name: "Other" }];

        mockGet.mockResolvedValue({
            data: {
                data: EVENTS,
                activities: other
            }
        });

        await expect(getEvents("token-123")).resolves.toEqual(EVENTS);
    });

    it("should fall back to result.activities when result.data is not an array", async () => {
        mockGet.mockResolvedValue({
            data: {
                data: "not-an-array",
                activities: EVENTS
            }
        });

        await expect(getEvents("token-123")).resolves.toEqual(EVENTS);
    });

    it("should return an empty array when the response has no event list", async () => {
        mockGet.mockResolvedValue({
            data: {
                message: "OK"
            }
        });

        await expect(getEvents("token-123")).resolves.toEqual([]);
    });

    it.each([
        ["null", null],
        ["undefined", undefined],
        ["a string", "unexpected"],
        ["a number", 42],
        ["an object with a null data field", { data: null }]
    ])(
        "should return an empty array when the response body is %s",
        async (_label, body) => {
            mockGet.mockResolvedValue({ data: body });

            await expect(getEvents("token-123")).resolves.toEqual([]);
        }
    );


    // =====================================================
    // 3. ERROR HANDLING TESTS
    // =====================================================

    it("should rethrow request errors so the caller can handle them", async () => {
        const error = {
            response: {
                status: 401
            }
        };

        mockGet.mockRejectedValue(error);

        await expect(getEvents("token-123")).rejects.toBe(error);
    });

});