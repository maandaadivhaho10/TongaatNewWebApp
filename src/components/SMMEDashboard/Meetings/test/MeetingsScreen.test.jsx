import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

// Create mock functions.
// This prevents tests from sending real requests or using the real AuthContext.
const { mockGetEvents, mockUseAuth } = vi.hoisted(() => ({
    mockGetEvents: vi.fn(),
    mockUseAuth: vi.fn()
}));

// NOTE: adjust these paths if your folder structure is different.
// (The component itself imports "../../../context/AuthContext".)
vi.mock("../../../../context/AuthContext", () => ({
    useAuth: () => mockUseAuth()
}));

vi.mock("../eventsService", () => ({
    getEvents: mockGetEvents
}));

// EventCard has its own tests, so it is replaced with a simple stub here.
vi.mock("../EventCard", () => ({
    default: ({ event }) => (
        <div data-testid="event-card">
            {event.name}
        </div>
    )
}));

import MeetingsScreen from "../Meetings";

const EVENTS = [
    {
        activity_id: 1,
        name: "Supplier Workshop",
        description: "Training for local suppliers",
        activity_date: "2026-03-15",
        status: "SCHEDULED"
    },
    {
        activity_id: 2,
        name: "Funding Webinar",
        description: "Access to enterprise funding",
        activity_date: "2026-04-20",
        status: "COMPLETED"
    },
    {
        activity_id: 3,
        name: "Networking Day",
        description: null,
        activity_date: "2026-05-10",
        status: "CANCELLED"
    }
];

// Reusable function to render the screen.
function renderMeetingsScreen() {
    return render(<MeetingsScreen />);
}

// Waits until the loading indicator has disappeared.
async function waitForLoadingToFinish() {
    await waitFor(() => {
        expect(
            screen.queryByText("Loading events...")
        ).not.toBeInTheDocument();
    });
}

// Returns a promise that can be resolved or rejected from the test,
// so we can inspect the UI while a request is pending.
function createDeferred() {
    let resolve;
    let reject;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}

let consoleErrorSpy;

// Run before every test.
beforeEach(() => {
    // Reset mock history and previous mock behaviour.
    mockGetEvents.mockReset();
    mockUseAuth.mockReset();

    // Default: a logged-in user and a successful request.
    mockUseAuth.mockReturnValue({
        token: "token-123",
        isAuthenticated: true
    });

    mockGetEvents.mockResolvedValue(EVENTS);

    // The component logs errors with console.error when loading fails.
    // Silence it so the test output stays clean.
    consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe("MeetingsScreen Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should display the Events heading", async () => {
        renderMeetingsScreen();

        expect(
            screen.getByRole("heading", {
                name: "Events"
            })
        ).toBeInTheDocument();

        await waitForLoadingToFinish();
    });

    it("should display the page description", async () => {
        renderMeetingsScreen();

        expect(
            screen.getByText(
                "View Enterprise and Supplier Development activities organised by the ED Team."
            )
        ).toBeInTheDocument();

        await waitForLoadingToFinish();
    });

    it("should display the search field", async () => {
        renderMeetingsScreen();

        expect(
            screen.getByPlaceholderText("Search events...")
        ).toBeInTheDocument();

        await waitForLoadingToFinish();
    });

    it("should display the Refresh button", async () => {
        renderMeetingsScreen();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeInTheDocument();

        await waitForLoadingToFinish();
    });


    // =====================================================
    // 2. LOADING STATE TESTS
    // =====================================================

    it("should display a loading message while events are being fetched", async () => {
        const deferred = createDeferred();

        mockGetEvents.mockReturnValue(deferred.promise);

        renderMeetingsScreen();

        expect(
            screen.getByText("Loading events...")
        ).toBeInTheDocument();

        deferred.resolve(EVENTS);

        await waitForLoadingToFinish();
    });

    it("should disable the Refresh button while loading", async () => {
        const deferred = createDeferred();

        mockGetEvents.mockReturnValue(deferred.promise);

        renderMeetingsScreen();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeDisabled();

        deferred.resolve(EVENTS);

        await waitForLoadingToFinish();
    });

    it("should hide the loading message and enable Refresh once events are loaded", async () => {
        renderMeetingsScreen();

        await waitForLoadingToFinish();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeEnabled();
    });


    // =====================================================
    // 3. FETCHING EVENTS TESTS
    // =====================================================

    it("should fetch events using the user's token and an abort signal", async () => {
        renderMeetingsScreen();

        await waitForLoadingToFinish();

        expect(mockGetEvents).toHaveBeenCalledTimes(1);

        expect(mockGetEvents).toHaveBeenCalledWith(
            "token-123",
            expect.any(AbortSignal)
        );
    });

    it("should display an event card for each event", async () => {
        renderMeetingsScreen();

        expect(
            await screen.findAllByTestId("event-card")
        ).toHaveLength(3);

        expect(screen.getByText("Supplier Workshop")).toBeInTheDocument();
        expect(screen.getByText("Funding Webinar")).toBeInTheDocument();
        expect(screen.getByText("Networking Day")).toBeInTheDocument();
    });

    it("should display the Available Events heading", async () => {
        renderMeetingsScreen();

        expect(
            await screen.findByRole("heading", {
                name: "Available Events"
            })
        ).toBeInTheDocument();
    });

    it("should display the number of events", async () => {
        renderMeetingsScreen();

        expect(
            await screen.findByText("3 events")
        ).toBeInTheDocument();
    });

    it("should use the singular form for a single event", async () => {
        mockGetEvents.mockResolvedValue([EVENTS[0]]);

        renderMeetingsScreen();

        expect(
            await screen.findByText("1 event")
        ).toBeInTheDocument();
    });

    it("should not display an error when events load successfully", async () => {
        renderMeetingsScreen();

        await waitForLoadingToFinish();

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 4. EMPTY STATE TESTS
    // =====================================================

    it("should display an empty state when there are no events", async () => {
        mockGetEvents.mockResolvedValue([]);

        renderMeetingsScreen();

        expect(
            await screen.findByText("No events available")
        ).toBeInTheDocument();

        expect(
            screen.getByText("There are currently no ESD events available.")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("event-card")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 5. SEARCH TESTS
    // =====================================================

    it("should allow the user to type in the search field", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await waitForLoadingToFinish();

        const search = screen.getByPlaceholderText("Search events...");

        await user.type(search, "workshop");

        expect(search).toHaveValue("workshop");
    });

    it("should filter events by name", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "workshop"
        );

        const cards = screen.getAllByTestId("event-card");

        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Supplier Workshop");
    });

    it("should filter events by description", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "enterprise funding"
        );

        const cards = screen.getAllByTestId("event-card");

        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Funding Webinar");
    });

    it("should filter events by date", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "2026-05"
        );

        const cards = screen.getAllByTestId("event-card");

        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Networking Day");
    });

    it("should filter events by status", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "completed"
        );

        const cards = screen.getAllByTestId("event-card");

        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Funding Webinar");
    });

    it("should ignore letter case when searching", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "SUPPLIER WORKSHOP"
        );

        expect(
            screen.getAllByTestId("event-card")
        ).toHaveLength(1);
    });

    it("should ignore leading and trailing spaces when searching", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "   networking   "
        );

        const cards = screen.getAllByTestId("event-card");

        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent("Networking Day");
    });

    it("should update the event count when searching", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findByText("3 events");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "workshop"
        );

        expect(
            screen.getByText("1 event")
        ).toBeInTheDocument();
    });

    it("should handle events with missing fields while searching", async () => {
        const user = userEvent.setup();

        // "Networking Day" has a null description.
        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "zzz"
        );

        expect(
            await screen.findByText("No events available")
        ).toBeInTheDocument();
    });

    it("should display a message when no events match the search", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "does not exist"
        );

        expect(
            screen.getByText("No events available")
        ).toBeInTheDocument();

        expect(
            screen.getByText("No events match your search.")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("event-card")
        ).not.toBeInTheDocument();
    });

    it("should show all events again when the search is cleared", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        const search = screen.getByPlaceholderText("Search events...");

        await user.type(search, "workshop");

        expect(
            screen.getAllByTestId("event-card")
        ).toHaveLength(1);

        await user.clear(search);

        expect(
            screen.getAllByTestId("event-card")
        ).toHaveLength(3);
    });

    it("should not call the API again when searching", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.type(
            screen.getByPlaceholderText("Search events..."),
            "workshop"
        );

        expect(mockGetEvents).toHaveBeenCalledTimes(1);
    });


    // =====================================================
    // 6. AUTHENTICATION TESTS
    // =====================================================

    it("should ask the user to log in when they are not authenticated", async () => {
        mockUseAuth.mockReturnValue({
            token: null,
            isAuthenticated: false
        });

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Please log in to view events.");

        expect(mockGetEvents).not.toHaveBeenCalled();
    });

    it("should ask the user to log in when the token is missing", async () => {
        mockUseAuth.mockReturnValue({
            token: "",
            isAuthenticated: true
        });

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Please log in to view events.");

        expect(mockGetEvents).not.toHaveBeenCalled();
    });

    it("should disable the Refresh button when the user is not authenticated", async () => {
        mockUseAuth.mockReturnValue({
            token: null,
            isAuthenticated: false
        });

        renderMeetingsScreen();

        await screen.findByRole("alert");

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeDisabled();
    });

    it("should not display events or the empty state when the user is not authenticated", async () => {
        mockUseAuth.mockReturnValue({
            token: null,
            isAuthenticated: false
        });

        renderMeetingsScreen();

        await screen.findByRole("alert");

        expect(
            screen.queryByTestId("event-card")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("No events available")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 7. ERROR HANDLING TESTS
    // =====================================================

    it("should display a session expired message for a 401 response", async () => {
        mockGetEvents.mockRejectedValue({
            response: {
                status: 401
            }
        });

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Your session has expired. Please log in again."
        );
    });

    it("should display a permission message for a 403 response", async () => {
        mockGetEvents.mockRejectedValue({
            response: {
                status: 403
            }
        });

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "You do not have permission to view events."
        );
    });

    it("should display the backend error message", async () => {
        mockGetEvents.mockRejectedValue({
            response: {
                status: 500,
                data: {
                    message: "Database is unavailable."
                }
            }
        });

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Database is unavailable.");
    });

    it("should display the error message when there is no response", async () => {
        mockGetEvents.mockRejectedValue(
            new Error("Network Error")
        );

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Network Error");
    });

    it("should display a default error message when no details are available", async () => {
        mockGetEvents.mockRejectedValue({});

        renderMeetingsScreen();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Unable to load events.");
    });

    it("should not display events or the empty state when loading fails", async () => {
        mockGetEvents.mockRejectedValue(
            new Error("Network Error")
        );

        renderMeetingsScreen();

        await screen.findByRole("alert");

        expect(
            screen.queryByTestId("event-card")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("No events available")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Available Events")
        ).not.toBeInTheDocument();
    });

    it("should log the error to the console when loading fails", async () => {
        const error = new Error("Network Error");

        mockGetEvents.mockRejectedValue(error);

        renderMeetingsScreen();

        await screen.findByRole("alert");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Fetch events error:",
            error
        );
    });

    it("should ignore cancelled requests", async () => {
        mockGetEvents.mockRejectedValue({
            code: "ERR_CANCELED"
        });

        renderMeetingsScreen();

        await waitForLoadingToFinish();

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });


    // =====================================================
    // 8. REFRESH TESTS
    // =====================================================

    it("should fetch the events again when Refresh is clicked", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(2);
        });

        expect(mockGetEvents).toHaveBeenLastCalledWith(
            "token-123",
            undefined
        );
    });

    it("should show the loading state while refreshing", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        const deferred = createDeferred();

        mockGetEvents.mockReturnValue(deferred.promise);

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        expect(
            await screen.findByText("Loading events...")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeDisabled();

        deferred.resolve(EVENTS);

        expect(
            await screen.findAllByTestId("event-card")
        ).toHaveLength(3);
    });

    it("should display updated events after refreshing", async () => {
        const user = userEvent.setup();

        mockGetEvents.mockResolvedValueOnce([EVENTS[0]]);

        renderMeetingsScreen();

        expect(
            await screen.findAllByTestId("event-card")
        ).toHaveLength(1);

        mockGetEvents.mockResolvedValueOnce(EVENTS);

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        await waitFor(() => {
            expect(
                screen.getAllByTestId("event-card")
            ).toHaveLength(3);
        });
    });

    it("should clear the error and show events when Refresh succeeds", async () => {
        const user = userEvent.setup();

        mockGetEvents.mockRejectedValueOnce(
            new Error("Network Error")
        );

        renderMeetingsScreen();

        await screen.findByRole("alert");

        mockGetEvents.mockResolvedValueOnce(EVENTS);

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        expect(
            await screen.findAllByTestId("event-card")
        ).toHaveLength(3);

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("should keep the search text after refreshing", async () => {
        const user = userEvent.setup();

        renderMeetingsScreen();

        await screen.findAllByTestId("event-card");

        const search = screen.getByPlaceholderText("Search events...");

        await user.type(search, "workshop");

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(2);
        });

        await screen.findAllByTestId("event-card");

        expect(search).toHaveValue("workshop");

        expect(
            screen.getAllByTestId("event-card")
        ).toHaveLength(1);
    });


    // =====================================================
    // 9. CLEANUP AND RE-FETCH TESTS
    // =====================================================

    it("should abort the request when the component unmounts", async () => {
        const { unmount } = renderMeetingsScreen();

        await waitForLoadingToFinish();

        const signal = mockGetEvents.mock.calls[0][1];

        expect(signal.aborted).toBe(false);

        unmount();

        expect(signal.aborted).toBe(true);
    });

    it("should fetch events again and abort the old request when the token changes", async () => {
        const { rerender } = renderMeetingsScreen();

        await waitForLoadingToFinish();

        const firstSignal = mockGetEvents.mock.calls[0][1];

        mockUseAuth.mockReturnValue({
            token: "new-token",
            isAuthenticated: true
        });

        rerender(<MeetingsScreen />);

        await waitFor(() => {
            expect(mockGetEvents).toHaveBeenCalledTimes(2);
        });

        expect(mockGetEvents).toHaveBeenLastCalledWith(
            "new-token",
            expect.any(AbortSignal)
        );

        expect(firstSignal.aborted).toBe(true);
    });

});