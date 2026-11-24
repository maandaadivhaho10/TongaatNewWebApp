import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
const { mockGetMyRequests, mockSubmitRequest, mockUseAuth } = vi.hoisted(() => ({
    mockGetMyRequests: vi.fn(),
    mockSubmitRequest: vi.fn(),
    mockUseAuth: vi.fn()
}));

// NOTE: adjust these paths if your folder structure is different.
vi.mock("../../../../context/AuthContext", () => ({
    useAuth: () => mockUseAuth()
}));

// The child components import from advisoryService, which imports the axios
// instance. Mock the instance so no real HTTP client is created.
vi.mock("../../../../API/axiosInstance", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

// Keep the real constants and helpers (SUPPORT_AREAS, getAdvisoryError, ...)
// and only replace the two functions that talk to the API.
vi.mock("../advisoryService", async () => {
    const actual = await vi.importActual("../advisoryService");

    return {
        ...actual,
        getMyAdvisoryRequests: mockGetMyRequests,
        submitAdvisoryRequest: mockSubmitRequest
    };
});

import BusinessAdvisoryScreen from "../BusinessAdvisoryScreen";

const AUTHENTICATED = {
    user: { user_id: 5 },
    isAuthenticated: true,
    loading: false
};

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
    }
];

// Reusable function to render the screen.
function renderScreen() {
    return render(<BusinessAdvisoryScreen />);
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

function getDescription() {
    return screen.getByLabelText(/Describe the Support You Need/);
}

function getSubmitButton() {
    return screen.getByRole("button", {
        name: /Submit Advisory Request|Submitting\.\.\.|Checking session\.\.\./
    });
}

function getMyRequestsTab() {
    return screen.getByRole("tab", { name: /My Requests/ });
}

// Fills in both required fields (without submitting).
async function fillForm(
    user,
    area = "Business Strategy",
    description = "We need help with our strategy."
) {
    await user.click(
        screen.getByRole("button", {
            name: /select a business support area/i
        })
    );

    await user.click(
        screen.getByRole("button", {
            name: area
        })
    );

    await user.type(getDescription(), description);
}

// Fills in the form and clicks the submit button.
async function fillAndSubmit(user, area, description) {
    await fillForm(user, area, description);

    await user.click(getSubmitButton());
}

let consoleErrorSpy;

// Run before every test.
beforeEach(() => {
    // Reset mock history and previous mock behaviour.
    mockGetMyRequests.mockReset();
    mockSubmitRequest.mockReset();
    mockUseAuth.mockReset();

    // Default: a logged-in user with no requests and a successful submit.
    mockUseAuth.mockReturnValue(AUTHENTICATED);
    mockGetMyRequests.mockResolvedValue([]);
    mockSubmitRequest.mockResolvedValue({
        success: true,
        message: "Request submitted."
    });

    // The component logs errors with console.error when a request fails.
    // Silence it so the test output stays clean.
    consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe("BusinessAdvisoryScreen Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should display the Business Advisory heading", async () => {
        renderScreen();

        expect(
            screen.getByRole("heading", {
                name: "Business Advisory"
            })
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });
    });

    it("should display the page description", async () => {
        renderScreen();

        expect(
            screen.getByText(
                "Request support for your business and track the requests you have already sent."
            )
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });
    });

    it("should display both tabs inside an accessible tab list", async () => {
        renderScreen();

        expect(
            screen.getByRole("tablist", {
                name: "Business advisory"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("tab", { name: "New Request" })
        ).toBeInTheDocument();

        expect(getMyRequestsTab()).toBeInTheDocument();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });
    });

    it("should open on the New Request tab", async () => {
        renderScreen();

        expect(
            screen.getByRole("tab", { name: "New Request" })
        ).toHaveAttribute("aria-selected", "true");

        expect(getMyRequestsTab()).toHaveAttribute("aria-selected", "false");

        expect(
            screen.getByRole("tabpanel")
        ).toHaveAttribute("id", "panel-new");

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });
    });

    it("should link the tabs to their panels", async () => {
        renderScreen();

        expect(
            screen.getByRole("tab", { name: "New Request" })
        ).toHaveAttribute("aria-controls", "panel-new");

        expect(getMyRequestsTab()).toHaveAttribute("aria-controls", "panel-mine");

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });
    });


    // =====================================================
    // 2. INITIAL LOADING TESTS
    // =====================================================

    it("should fetch the user's requests when the screen loads", async () => {
        renderScreen();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
        });
    });

    it("should not fetch requests while the session is loading", () => {
        mockUseAuth.mockReturnValue({
            ...AUTHENTICATED,
            loading: true
        });

        renderScreen();

        expect(mockGetMyRequests).not.toHaveBeenCalled();
    });

    it("should not fetch requests when the user is not authenticated", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            loading: false
        });

        renderScreen();

        expect(mockGetMyRequests).not.toHaveBeenCalled();
    });

    it("should not fetch requests when the user has no user_id", () => {
        mockUseAuth.mockReturnValue({
            user: {},
            isAuthenticated: true,
            loading: false
        });

        renderScreen();

        expect(mockGetMyRequests).not.toHaveBeenCalled();
    });

    it("should fetch the requests once the session has finished loading", async () => {
        mockUseAuth.mockReturnValue({
            ...AUTHENTICATED,
            loading: true
        });

        const { rerender } = renderScreen();

        expect(mockGetMyRequests).not.toHaveBeenCalled();

        mockUseAuth.mockReturnValue(AUTHENTICATED);

        rerender(<BusinessAdvisoryScreen />);

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
        });
    });


    // =====================================================
    // 3. REQUEST COUNT BADGE TESTS
    // =====================================================

    it("should show the number of requests on the My Requests tab", async () => {
        mockGetMyRequests.mockResolvedValue(REQUESTS);

        renderScreen();

        await waitFor(() => {
            expect(getMyRequestsTab()).toHaveTextContent("2");
        });
    });

    it("should not show a badge when there are no requests", async () => {
        renderScreen();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalled();
        });

        expect(getMyRequestsTab().textContent).toBe("My Requests");
    });


    // =====================================================
    // 4. TAB NAVIGATION TESTS
    // =====================================================

    it("should switch to the My Requests tab", async () => {
        const user = userEvent.setup();

        mockGetMyRequests.mockResolvedValue(REQUESTS);

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(getMyRequestsTab()).toHaveAttribute("aria-selected", "true");

        expect(
            screen.getByRole("tabpanel")
        ).toHaveAttribute("id", "panel-mine");

        expect(
            await screen.findByText("Business Strategy")
        ).toBeInTheDocument();
    });

    it("should refresh the requests when opening the My Requests tab", async () => {
        const user = userEvent.setup();

        renderScreen();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
        });

        await user.click(getMyRequestsTab());

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(2);
        });
    });

    it("should not fetch requests when opening My Requests while logged out", async () => {
        const user = userEvent.setup();

        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            loading: false
        });

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(mockGetMyRequests).not.toHaveBeenCalled();

        expect(
            screen.getByText("Log in to see your advisory requests.")
        ).toBeInTheDocument();
    });

    it("should not fetch requests when opening My Requests while the session is loading", async () => {
        const user = userEvent.setup();

        mockUseAuth.mockReturnValue({
            ...AUTHENTICATED,
            loading: true
        });

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(mockGetMyRequests).not.toHaveBeenCalled();
    });

    it("should switch back to the New Request tab", async () => {
        const user = userEvent.setup();

        renderScreen();

        await user.click(getMyRequestsTab());

        await user.click(
            screen.getByRole("tab", { name: "New Request" })
        );

        expect(
            screen.getByRole("tabpanel")
        ).toHaveAttribute("id", "panel-new");

        expect(
            screen.getByRole("button", { name: "Submit Advisory Request" })
        ).toBeInTheDocument();
    });

    it("should open the New Request tab from the empty state", async () => {
        const user = userEvent.setup();

        renderScreen();

        await user.click(getMyRequestsTab());

        await user.click(
            await screen.findByRole("button", { name: "Make a request" })
        );

        expect(
            screen.getByRole("tabpanel")
        ).toHaveAttribute("id", "panel-new");
    });

    it("should reset the form when the user switches tabs and comes back", async () => {
        // This documents the current behaviour: the form is unmounted when
        // the My Requests tab is open, so a half-written draft is lost.
        const user = userEvent.setup();

        renderScreen();

        await user.type(getDescription(), "Draft text");

        await user.click(getMyRequestsTab());

        await user.click(
            screen.getByRole("tab", { name: "New Request" })
        );

        expect(getDescription()).toHaveValue("");
    });


    // =====================================================
    // 5. MY REQUESTS TAB TESTS
    // =====================================================

    it("should display the user's requests on the My Requests tab", async () => {
        const user = userEvent.setup();

        mockGetMyRequests.mockResolvedValue(REQUESTS);

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(
            await screen.findByRole("heading", { name: "Business Strategy" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Human Resources" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("2 requests submitted")
        ).toBeInTheDocument();
    });

    it("should show a loading message while the requests are loading", async () => {
        const user = userEvent.setup();

        const deferred = createDeferred();

        mockGetMyRequests.mockReturnValue(deferred.promise);

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(
            await screen.findByText("Loading your requests...")
        ).toBeInTheDocument();

        deferred.resolve(REQUESTS);

        expect(
            await screen.findByText("Business Strategy")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Loading your requests...")
        ).not.toBeInTheDocument();
    });

    it("should refetch the requests when Refresh is clicked", async () => {
        const user = userEvent.setup();

        renderScreen();

        await user.click(getMyRequestsTab());

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(2);
        });

        await user.click(
            await screen.findByRole("button", { name: "Refresh" })
        );

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(3);
        });
    });

    it("should display an error when the requests cannot be loaded", async () => {
        const user = userEvent.setup();

        mockGetMyRequests.mockRejectedValue({
            response: { status: 404 }
        });

        renderScreen();

        await user.click(getMyRequestsTab());

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Requests endpoint was not found. Check the backend route."
        );
    });

    it("should log the error when the requests cannot be loaded", async () => {
        const error = new Error("Network Error");

        mockGetMyRequests.mockRejectedValue(error);

        renderScreen();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Fetch my advisory requests error:",
                error
            );
        });
    });

    it("should retry loading the requests when Try again is clicked", async () => {
        const user = userEvent.setup();

        mockGetMyRequests
            .mockRejectedValueOnce(new Error("Network Error"))
            .mockRejectedValueOnce(new Error("Network Error"))
            .mockResolvedValueOnce(REQUESTS);

        renderScreen();

        await user.click(getMyRequestsTab());

        await user.click(
            await screen.findByRole("button", { name: "Try again" })
        );

        expect(
            await screen.findByText("Business Strategy")
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 6. SUBMISSION TESTS
    // =====================================================

    it("should submit the selected area and description", async () => {
        const user = userEvent.setup();

        renderScreen();

        await fillAndSubmit(user, "Business Strategy", "We need help with our strategy.");

        await waitFor(() => {
            expect(mockSubmitRequest).toHaveBeenCalledTimes(1);
        });

        expect(mockSubmitRequest).toHaveBeenCalledWith({
            support_area: "Business Strategy",
            description: "We need help with our strategy."
        });
    });

    it("should display the success message returned by the API", async () => {
        const user = userEvent.setup();

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("status")
        ).toHaveTextContent("Request submitted.");
    });

    it("should display a default success message when the API returns none", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockResolvedValue({ success: true });

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("status")
        ).toHaveTextContent(
            "Your business advisory request has been submitted successfully."
        );
    });

    it("should display a default success message when the API returns no data", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockResolvedValue(undefined);

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("status")
        ).toHaveTextContent(
            "Your business advisory request has been submitted successfully."
        );
    });

    it("should clear the form after a successful submission", async () => {
        const user = userEvent.setup();

        renderScreen();

        await fillAndSubmit(user);

        await screen.findByRole("status");

        expect(getDescription()).toHaveValue("");

        expect(
            screen.getByRole("button", {
                name: /select a business support area/i
            })
        ).toBeInTheDocument();
    });

    it("should refresh the list of requests after a successful submission", async () => {
        const user = userEvent.setup();

        renderScreen();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
        });

        await fillAndSubmit(user);

        await screen.findByRole("status");

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(2);
        });
    });

    it("should open the My Requests tab from the success message", async () => {
        const user = userEvent.setup();

        mockGetMyRequests.mockResolvedValue(REQUESTS);

        renderScreen();

        await fillAndSubmit(user);

        await user.click(
            await screen.findByRole("button", { name: "View my requests" })
        );

        expect(getMyRequestsTab()).toHaveAttribute("aria-selected", "true");

        expect(
            await screen.findByText("Business Strategy")
        ).toBeInTheDocument();
    });

    it("should show a submitting state while the request is being sent", async () => {
        const user = userEvent.setup();

        const deferred = createDeferred();

        mockSubmitRequest.mockReturnValue(deferred.promise);

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("button", { name: "Submitting..." })
        ).toBeDisabled();

        deferred.resolve({ success: true, message: "Request submitted." });

        expect(
            await screen.findByRole("status")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Submit Advisory Request" })
        ).toBeInTheDocument();
    });

    it("should ignore a second submission while one is already in progress", async () => {
        const user = userEvent.setup();

        const deferred = createDeferred();

        mockSubmitRequest.mockReturnValue(deferred.promise);

        renderScreen();

        await fillForm(user);

        const form = getSubmitButton().closest("form");

        await user.click(getSubmitButton());

        await screen.findByRole("button", { name: "Submitting..." });

        // The disabled button blocks clicks, so submit the form directly.
        fireEvent.submit(form);
        fireEvent.submit(form);

        expect(mockSubmitRequest).toHaveBeenCalledTimes(1);

        deferred.resolve({ success: true });

        await screen.findByRole("status");
    });

    it("should allow another submission after the first one finishes", async () => {
        const user = userEvent.setup();

        renderScreen();

        await fillAndSubmit(user);

        await screen.findByRole("status");

        await fillAndSubmit(user, "Human Resources", "Help with hiring.");

        await waitFor(() => {
            expect(mockSubmitRequest).toHaveBeenCalledTimes(2);
        });
    });


    // =====================================================
    // 7. SUBMISSION ERROR TESTS
    // =====================================================

    it("should display an error when the submission fails", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockRejectedValue({
            response: { status: 403 }
        });

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Your account does not have permission to submit advisory requests."
        );
    });

    it("should display the backend message when the submission fails", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockRejectedValue({
            response: {
                status: 400,
                data: { message: "Description is too short." }
            }
        });

        renderScreen();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Description is too short.");
    });

    it("should log the error when the submission fails", async () => {
        const user = userEvent.setup();

        const error = new Error("Network Error");

        mockSubmitRequest.mockRejectedValue(error);

        renderScreen();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Business advisory request error:",
            error
        );
    });

    it("should keep the form data and re-enable the button when the submission fails", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockRejectedValue(new Error("Network Error"));

        renderScreen();

        await fillAndSubmit(user, "Business Strategy", "Need help.");

        await screen.findByRole("alert");

        expect(getDescription()).toHaveValue("Need help.");

        expect(
            screen.getByRole("button", { name: "Business Strategy" })
        ).toBeInTheDocument();

        expect(getSubmitButton()).toBeEnabled();
    });

    it("should not refresh the requests when the submission fails", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockRejectedValue(new Error("Network Error"));

        renderScreen();

        await waitFor(() => {
            expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
        });

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        expect(mockGetMyRequests).toHaveBeenCalledTimes(1);
    });

    it("should clear the error when the user edits the form", async () => {
        const user = userEvent.setup();

        mockSubmitRequest.mockRejectedValue(new Error("Network Error"));

        renderScreen();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        await user.type(getDescription(), "!");

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("should clear the success message when the user edits the form", async () => {
        const user = userEvent.setup();

        renderScreen();

        await fillAndSubmit(user);

        await screen.findByRole("status");

        await user.type(getDescription(), "New request");

        expect(
            screen.queryByRole("status")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 8. SUBMISSION VALIDATION TESTS
    // =====================================================

    // The submit button is disabled in these situations, so the form is
    // submitted directly to test the screen's own validation.

    it("should reject a submission with missing fields", () => {
        renderScreen();

        const form = getSubmitButton().closest("form");

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Please complete all required fields.");

        expect(mockSubmitRequest).not.toHaveBeenCalled();
    });

    it("should reject a submission while the session is being restored", async () => {
        const user = userEvent.setup();

        const { rerender } = renderScreen();

        await fillForm(user);

        const form = getSubmitButton().closest("form");

        mockUseAuth.mockReturnValue({
            ...AUTHENTICATED,
            loading: true
        });

        rerender(<BusinessAdvisoryScreen />);

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Please wait while your session is being restored.");

        expect(mockSubmitRequest).not.toHaveBeenCalled();
    });

    it("should reject a submission when the user is not authenticated", async () => {
        const user = userEvent.setup();

        const { rerender } = renderScreen();

        await fillForm(user);

        const form = getSubmitButton().closest("form");

        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            loading: false
        });

        rerender(<BusinessAdvisoryScreen />);

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Please log in to submit a business advisory request.");

        expect(mockSubmitRequest).not.toHaveBeenCalled();
    });

    it("should reject a submission when the user has no user_id", async () => {
        const user = userEvent.setup();

        const { rerender } = renderScreen();

        await fillForm(user);

        const form = getSubmitButton().closest("form");

        mockUseAuth.mockReturnValue({
            user: {},
            isAuthenticated: true,
            loading: false
        });

        rerender(<BusinessAdvisoryScreen />);

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Please log in to submit a business advisory request.");

        expect(mockSubmitRequest).not.toHaveBeenCalled();
    });

});