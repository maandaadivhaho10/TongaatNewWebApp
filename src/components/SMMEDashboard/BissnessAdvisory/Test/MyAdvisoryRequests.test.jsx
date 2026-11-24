import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

// The component imports helpers from advisoryService, which imports the
// axios instance. Mock the instance so no real HTTP client is created.
// NOTE: adjust this path if your folder structure is different.
vi.mock("../../../../API/axiosInstance", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

import MyAdvisoryRequests from "../MyAdvisoryRequests";
import { formatDate } from "../advisoryService";

const REQUESTS = [
    {
        request_id: 1,
        subject: "Business Strategy",
        description: "We need help with our strategy.",
        status: "pending",
        request_date: "2026-03-15T10:00:00"
    },
    {
        request_id: 2,
        subject: "Human Resources",
        description: "Help with hiring.",
        status: "approved",
        request_date: "2026-04-20T10:00:00"
    },
    {
        request_id: 3,
        subject: "Funding & Investment",
        description: "Access to funding.",
        status: "in_progress",
        request_date: "2026-05-10T10:00:00"
    }
];

// Reusable function to render the component with sensible defaults.
function renderRequests(props = {}) {
    const allProps = {
        requests: [],
        requestsLoading: false,
        requestsError: "",
        authLoading: false,
        isAuthenticated: true,
        onRefresh: vi.fn(),
        onNewRequest: vi.fn(),
        ...props
    };

    render(<MyAdvisoryRequests {...allProps} />);

    return allProps;
}

let consoleErrorSpy;

beforeEach(() => {
    // React logs duplicate key warnings with console.error.
    consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe("MyAdvisoryRequests Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should render the tab panel with the correct accessibility attributes", () => {
        renderRequests();

        const panel = screen.getByRole("tabpanel");

        expect(panel).toHaveAttribute("id", "panel-mine");
        expect(panel).toHaveAttribute("aria-labelledby", "tab-mine");
    });

    it("should display the Refresh button", () => {
        renderRequests();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeInTheDocument();
    });


    // =====================================================
    // 2. EMPTY STATE TESTS
    // =====================================================

    it("should display the placeholder summary when there are no requests", () => {
        renderRequests();

        expect(
            screen.getByText("Requests you submit will appear here.")
        ).toBeInTheDocument();
    });

    it("should display the empty state when there are no requests", () => {
        renderRequests();

        expect(
            screen.getByText("You haven't submitted any advisory requests yet.")
        ).toBeInTheDocument();
    });

    it("should call onNewRequest when Make a request is clicked", async () => {
        const user = userEvent.setup();

        const props = renderRequests();

        await user.click(
            screen.getByRole("button", {
                name: "Make a request"
            })
        );

        expect(props.onNewRequest).toHaveBeenCalledTimes(1);
    });

    it("should not display the empty state while requests are loading", () => {
        renderRequests({ requestsLoading: true });

        expect(
            screen.queryByText("You haven't submitted any advisory requests yet.")
        ).not.toBeInTheDocument();
    });

    it("should not display the empty state when there is an error", () => {
        renderRequests({ requestsError: "Failed to load your requests." });

        expect(
            screen.queryByText("You haven't submitted any advisory requests yet.")
        ).not.toBeInTheDocument();
    });

    it("should not display the empty state when the user is not authenticated", () => {
        renderRequests({ isAuthenticated: false });

        expect(
            screen.queryByText("You haven't submitted any advisory requests yet.")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 3. REQUEST LIST TESTS
    // =====================================================

    it("should display a list item for each request", () => {
        renderRequests({ requests: REQUESTS });

        expect(
            screen.getAllByRole("listitem")
        ).toHaveLength(3);
    });

    it("should display the request subjects as headings", () => {
        renderRequests({ requests: REQUESTS });

        expect(
            screen.getByRole("heading", { name: "Business Strategy" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Human Resources" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Funding & Investment" })
        ).toBeInTheDocument();
    });

    it("should display the request descriptions", () => {
        renderRequests({ requests: REQUESTS });

        expect(
            screen.getByText("We need help with our strategy.")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Help with hiring.")
        ).toBeInTheDocument();
    });

    it("should display the formatted request date", () => {
        renderRequests({ requests: [REQUESTS[0]] });

        const item = screen.getByRole("listitem");

        expect(
            within(item).getByText("Request date:")
        ).toBeInTheDocument();

        expect(
            within(item).getByText(formatDate("2026-03-15T10:00:00"))
        ).toBeInTheDocument();
    });

    it("should display a dash when the request date is missing", () => {
        renderRequests({
            requests: [{ request_id: 1, subject: "Other" }]
        });

        expect(
            screen.getByText("—")
        ).toBeInTheDocument();
    });

    it("should display a default title when the subject is missing", () => {
        renderRequests({
            requests: [{ request_id: 1, status: "pending" }]
        });

        expect(
            screen.getByRole("heading", { name: "Advisory request" })
        ).toBeInTheDocument();
    });

    it("should not display a description when it is missing", () => {
        renderRequests({
            requests: [{ request_id: 1, subject: "Other" }]
        });

        const item = screen.getByRole("listitem");

        expect(
            item.querySelector("p.whitespace-pre-line")
        ).not.toBeInTheDocument();
    });

    it("should display the number of requests", () => {
        renderRequests({ requests: REQUESTS });

        expect(
            screen.getByText("3 requests submitted")
        ).toBeInTheDocument();
    });

    it("should use the singular form for a single request", () => {
        renderRequests({ requests: [REQUESTS[0]] });

        expect(
            screen.getByText("1 request submitted")
        ).toBeInTheDocument();
    });

    it("should not display the placeholder summary when there are requests", () => {
        renderRequests({ requests: REQUESTS });

        expect(
            screen.queryByText("Requests you submit will appear here.")
        ).not.toBeInTheDocument();
    });

    it("should render requests that use different id fields without key warnings", () => {
        renderRequests({
            requests: [
                { request_id: 10, subject: "A" },
                { advisory_request_id: 20, subject: "B" },
                { advisory_id: 30, subject: "C" },
                { id: 40, subject: "D" },
                // No id at all: the component falls back to the index.
                { subject: "E" }
            ]
        });

        expect(
            screen.getAllByRole("listitem")
        ).toHaveLength(5);

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });


    // =====================================================
    // 4. STATUS BADGE TESTS
    // =====================================================

    it("should display a formatted status badge", () => {
        renderRequests({ requests: REQUESTS });

        const items = screen.getAllByRole("listitem");

        expect(within(items[0]).getByText("Pending")).toBeInTheDocument();
        expect(within(items[1]).getByText("Approved")).toBeInTheDocument();
        expect(within(items[2]).getByText("In Progress")).toBeInTheDocument();
    });

    it.each([
        ["pending", "Pending", "text-amber-700"],
        ["approved", "Approved", "text-green-700"],
        ["completed", "Completed", "text-green-700"],
        ["in_progress", "In Progress", "text-blue-700"],
        ["rejected", "Rejected", "text-red-700"],
        ["cancelled", "Cancelled", "text-neutral-600"]
    ])(
        "should style the %s status badge",
        (status, label, expectedClass) => {
            renderRequests({
                requests: [{ request_id: 1, subject: "Test", status }]
            });

            expect(
                screen.getByText(label).className
            ).toContain(expectedClass);
        }
    );

    it("should default the status to Pending when it is missing", () => {
        renderRequests({
            requests: [{ request_id: 1, subject: "Test" }]
        });

        const badge = screen.getByText("Pending");

        expect(badge.className).toContain("text-amber-700");
    });

    it("should style a status written with spaces and capitals", () => {
        renderRequests({
            requests: [{ request_id: 1, subject: "Test", status: "In Progress" }]
        });

        expect(
            screen.getByText("In Progress").className
        ).toContain("text-blue-700");
    });

    it("should use a neutral style for an unknown status", () => {
        renderRequests({
            requests: [{ request_id: 1, subject: "Test", status: "on_hold" }]
        });

        expect(
            screen.getByText("On Hold").className
        ).toContain("text-neutral-600");
    });


    // =====================================================
    // 5. LOADING TESTS
    // =====================================================

    it("should display a loading message when loading with no requests", () => {
        renderRequests({ requestsLoading: true });

        expect(
            screen.getByText("Loading your requests...")
        ).toBeInTheDocument();
    });

    it("should keep showing the existing requests while refreshing", () => {
        renderRequests({
            requests: REQUESTS,
            requestsLoading: true
        });

        expect(
            screen.queryByText("Loading your requests...")
        ).not.toBeInTheDocument();

        expect(
            screen.getAllByRole("listitem")
        ).toHaveLength(3);
    });

    it("should change the button text to Refreshing... while loading", () => {
        renderRequests({ requestsLoading: true });

        expect(
            screen.getByRole("button", {
                name: "Refreshing..."
            })
        ).toBeDisabled();
    });


    // =====================================================
    // 6. REFRESH BUTTON TESTS
    // =====================================================

    it("should call onRefresh when Refresh is clicked", async () => {
        const user = userEvent.setup();

        const props = renderRequests();

        await user.click(
            screen.getByRole("button", {
                name: "Refresh"
            })
        );

        expect(props.onRefresh).toHaveBeenCalledTimes(1);
    });

    it("should enable Refresh for an authenticated user who is not loading", () => {
        renderRequests();

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeEnabled();
    });

    it("should disable Refresh while the session is loading", () => {
        renderRequests({ authLoading: true });

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeDisabled();
    });

    it("should disable Refresh when the user is not authenticated", () => {
        renderRequests({ isAuthenticated: false });

        expect(
            screen.getByRole("button", {
                name: "Refresh"
            })
        ).toBeDisabled();
    });


    // =====================================================
    // 7. ERROR TESTS
    // =====================================================

    it("should display the error message", () => {
        renderRequests({
            requestsError: "Requests endpoint was not found. Check the backend route."
        });

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent(
            "Requests endpoint was not found. Check the backend route."
        );
    });

    it("should not display an alert when there is no error", () => {
        renderRequests();

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("should call onRefresh when Try again is clicked", async () => {
        const user = userEvent.setup();

        const props = renderRequests({
            requestsError: "Failed to load your requests."
        });

        await user.click(
            screen.getByRole("button", {
                name: "Try again"
            })
        );

        expect(props.onRefresh).toHaveBeenCalledTimes(1);
    });

    it("should still display existing requests when there is an error", () => {
        renderRequests({
            requests: REQUESTS,
            requestsError: "Failed to load your requests."
        });

        expect(
            screen.getByRole("alert")
        ).toBeInTheDocument();

        expect(
            screen.getAllByRole("listitem")
        ).toHaveLength(3);
    });


    // =====================================================
    // 8. AUTHENTICATION TESTS
    // =====================================================

    it("should ask the user to log in when they are not authenticated", () => {
        renderRequests({ isAuthenticated: false });

        expect(
            screen.getByText("Log in to see your advisory requests.")
        ).toBeInTheDocument();
    });

    it("should not ask the user to log in while the session is loading", () => {
        renderRequests({
            isAuthenticated: false,
            authLoading: true
        });

        expect(
            screen.queryByText("Log in to see your advisory requests.")
        ).not.toBeInTheDocument();
    });

    it("should not ask an authenticated user to log in", () => {
        renderRequests();

        expect(
            screen.queryByText("Log in to see your advisory requests.")
        ).not.toBeInTheDocument();
    });

});