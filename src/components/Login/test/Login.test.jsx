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
import {
    MemoryRouter,
    useLocation
} from "react-router-dom";

// Create a mock login function.
// This prevents tests from calling the real AuthContext / backend.
const { mockLogin } = vi.hoisted(() => ({
    mockLogin: vi.fn()
}));

// NOTE: adjust this path if your folder structure is different.
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

import Login from "../Login";

// This component allows us to see which page React Router navigates to.
function CurrentLocation() {
    const location = useLocation();

    return (
        <p data-testid="current-location">
            {location.pathname}
        </p>
    );
}

// Reusable function to render the login component.
function renderLogin() {
    return render(
        <MemoryRouter initialEntries={["/login"]}>
            <Login />
            <CurrentLocation />
        </MemoryRouter>
    );
}

// Reusable function that fills in the form and clicks "Log In".
async function fillAndSubmit(
    user,
    email = "test@example.com",
    password = "Password123"
) {
    if (email) {
        await user.type(
            screen.getByLabelText("Email Address"),
            email
        );
    }

    if (password) {
        await user.type(
            screen.getByLabelText("Password"),
            password
        );
    }

    await user.click(
        screen.getByRole("button", {
            name: "Log In"
        })
    );
}

let consoleErrorSpy;

// Run before every test.
beforeEach(() => {
    // Reset the login mock history and previous behaviour.
    mockLogin.mockReset();

    // The component logs errors with console.error when login fails.
    // Silence it so the test output stays clean.
    consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe("Login Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should display the welcome heading", () => {
        renderLogin();

        expect(
            screen.getByRole("heading", {
                name: "Welcome Back!"
            })
        ).toBeInTheDocument();
    });

    it("should display the sign in description", () => {
        renderLogin();

        expect(
            screen.getByText("Sign in to your account to continue.")
        ).toBeInTheDocument();
    });

    it("should display the email and password fields", () => {
        renderLogin();

        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should display the Log In button", () => {
        renderLogin();

        expect(
            screen.getByRole("button", {
                name: "Log In"
            })
        ).toBeInTheDocument();
    });

    it("should display the Tongaat Hulett logos", () => {
        renderLogin();

        // One logo in the branding panel and one for mobile.
        expect(
            screen.getAllByAltText("Tongaat Hulett")
        ).toHaveLength(2);
    });

    it("should display the branding message", () => {
        renderLogin();

        expect(
            screen.getByText(/Empowering businesses\./)
        ).toBeInTheDocument();
    });

    it("should display the current year in the footer", () => {
        renderLogin();

        const year = new Date().getFullYear().toString();

        expect(
            screen.getAllByText(new RegExp(year)).length
        ).toBeGreaterThan(0);
    });

    it("should not display an error message initially", () => {
        renderLogin();

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 2. INPUT TESTS
    // =====================================================

    it("should use an email input for the email address", () => {
        renderLogin();

        expect(
            screen.getByLabelText("Email Address")
        ).toHaveAttribute("type", "email");
    });

    it("should allow the user to enter their email address", async () => {
        const user = userEvent.setup();

        renderLogin();

        const email = screen.getByLabelText("Email Address");

        await user.type(email, "test@example.com");

        expect(email).toHaveValue("test@example.com");
    });

    it("should allow the user to enter their password", async () => {
        const user = userEvent.setup();

        renderLogin();

        const password = screen.getByLabelText("Password");

        await user.type(password, "Password123");

        expect(password).toHaveValue("Password123");
    });

    it("should set the correct autocomplete attributes", () => {
        renderLogin();

        expect(
            screen.getByLabelText("Email Address")
        ).toHaveAttribute("autocomplete", "email");

        expect(
            screen.getByLabelText("Password")
        ).toHaveAttribute("autocomplete", "current-password");
    });


    // =====================================================
    // 3. PASSWORD VISIBILITY TESTS
    // =====================================================

    it("should hide the password by default", () => {
        renderLogin();

        expect(
            screen.getByLabelText("Password")
        ).toHaveAttribute("type", "password");
    });

    it("should show and hide the password", async () => {
        const user = userEvent.setup();

        renderLogin();

        const password = screen.getByLabelText("Password");

        await user.click(
            screen.getByRole("button", {
                name: "Show password"
            })
        );

        expect(password).toHaveAttribute("type", "text");

        await user.click(
            screen.getByRole("button", {
                name: "Hide password"
            })
        );

        expect(password).toHaveAttribute("type", "password");
    });

    it("should keep the typed password when toggling visibility", async () => {
        const user = userEvent.setup();

        renderLogin();

        const password = screen.getByLabelText("Password");

        await user.type(password, "Password123");

        await user.click(
            screen.getByRole("button", {
                name: "Show password"
            })
        );

        expect(password).toHaveValue("Password123");
    });


    // =====================================================
    // 4. NAVIGATION LINK TESTS
    // =====================================================

    it("should navigate to the forgot password page", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Forgot Password?"
            })
        );

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/forgot-password");
    });

    it("should navigate to the registration page", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Register"
            })
        );

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/createaccount");
    });

    it("should display a disabled Google login button", () => {
        renderLogin();

        expect(
            screen.getByRole("button", {
                name: "Continue with Google"
            })
        ).toBeDisabled();
    });


    // =====================================================
    // 5. FORM VALIDATION TESTS
    // =====================================================

    it("should display errors when both fields are empty", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        expect(
            screen.getByText("Email address is required")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Password is required")
        ).toBeInTheDocument();

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should treat a whitespace-only email as empty", async () => {
        const user = userEvent.setup();

        renderLogin();

        await fillAndSubmit(user, "   ", "Password123");

        expect(
            screen.getByText("Email address is required")
        ).toBeInTheDocument();

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should display an error for an invalid email address", async () => {
        const user = userEvent.setup();

        renderLogin();

        await fillAndSubmit(user, "not-an-email", "Password123");

        expect(
            screen.getByText("Enter a valid email address")
        ).toBeInTheDocument();

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should display an error when the password is missing", async () => {
        const user = userEvent.setup();

        renderLogin();

        await fillAndSubmit(user, "test@example.com", "");

        expect(
            screen.getByText("Password is required")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Email address is required")
        ).not.toBeInTheDocument();

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should mark invalid fields with aria-invalid", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        expect(
            screen.getByLabelText("Email Address")
        ).toHaveAttribute("aria-invalid", "true");

        expect(
            screen.getByLabelText("Password")
        ).toHaveAttribute("aria-invalid", "true");
    });

    it("should apply an error border to invalid fields", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        expect(
            screen.getByLabelText("Email Address").className
        ).toContain("border-red-500");
    });

    it("should clear validation errors when the user edits the email", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        expect(
            screen.getByText("Email address is required")
        ).toBeInTheDocument();

        await user.type(
            screen.getByLabelText("Email Address"),
            "a"
        );

        expect(
            screen.queryByText("Email address is required")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Password is required")
        ).not.toBeInTheDocument();
    });

    it("should clear validation errors when the user edits the password", async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        await user.type(
            screen.getByLabelText("Password"),
            "a"
        );

        expect(
            screen.queryByText("Password is required")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 6. SUCCESSFUL LOGIN TESTS
    // =====================================================

    it("should call login with the entered credentials", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({ role_id: 1 });

        renderLogin();

        await fillAndSubmit(user, "test@example.com", "Password123");

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        expect(mockLogin).toHaveBeenCalledWith(
            "test@example.com",
            "Password123"
        );
    });

    it("should trim and lowercase the email before logging in", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({ role_id: 1 });

        renderLogin();

        await fillAndSubmit(user, "  TEST@EXAMPLE.COM  ", "Password123");

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                "test@example.com",
                "Password123"
            );
        });
    });

    it("should not alter the password before logging in", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({ role_id: 1 });

        renderLogin();

        await fillAndSubmit(user, "test@example.com", " Pass Word123 ");

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                "test@example.com",
                " Pass Word123 "
            );
        });
    });

    it("should submit the form when Enter is pressed", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({ role_id: 1 });

        renderLogin();

        await user.type(
            screen.getByLabelText("Email Address"),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText("Password"),
            "Password123{enter}"
        );

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });
    });


    // =====================================================
    // 7. ROLE-BASED REDIRECT TESTS
    // =====================================================

    it.each([
        [1, "/Smmedashboard", "SMME"],
        [2, "/EDTeamDashboard", "ED Team"],
        [3, "/unauthorized", "Admin (not implemented yet)"],
        [4, "/super-admin", "Super Admin"],
        [99, "/unauthorized", "an unknown role"]
    ])(
        "should redirect role_id %i to %s (%s)",
        async (roleId, expectedPath) => {
            const user = userEvent.setup();

            mockLogin.mockResolvedValue({ role_id: roleId });

            renderLogin();

            await fillAndSubmit(user);

            await waitFor(() => {
                expect(
                    screen.getByTestId("current-location")
                ).toHaveTextContent(expectedPath);
            });
        }
    );

    it("should convert a string role_id to a number before redirecting", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({ role_id: "2" });

        renderLogin();

        await fillAndSubmit(user);

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/EDTeamDashboard");
        });
    });

    it("should redirect to unauthorized when role_id is missing", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue({});

        renderLogin();

        await fillAndSubmit(user);

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/unauthorized");
        });
    });


    // =====================================================
    // 8. LOADING STATE TESTS
    // =====================================================

    it("should show a loading state and disable the form while logging in", async () => {
        const user = userEvent.setup();

        // Keep the login request pending so we can inspect the loading UI.
        let resolveLogin;

        mockLogin.mockReturnValue(
            new Promise((resolve) => {
                resolveLogin = resolve;
            })
        );

        renderLogin();

        await fillAndSubmit(user);

        const loadingButton = await screen.findByRole("button", {
            name: /signing in/i
        });

        expect(loadingButton).toBeDisabled();
        expect(screen.getByLabelText("Email Address")).toBeDisabled();
        expect(screen.getByLabelText("Password")).toBeDisabled();

        expect(
            screen.getByRole("button", {
                name: "Show password"
            })
        ).toBeDisabled();

        // Finish the request.
        resolveLogin({ role_id: 1 });

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/Smmedashboard");
        });
    });

    it("should prevent duplicate submissions while loading", async () => {
        const user = userEvent.setup();

        let resolveLogin;

        mockLogin.mockReturnValue(
            new Promise((resolve) => {
                resolveLogin = resolve;
            })
        );

        renderLogin();

        await fillAndSubmit(user);

        const loadingButton = await screen.findByRole("button", {
            name: /signing in/i
        });

        await user.click(loadingButton);
        await user.click(loadingButton);

        expect(mockLogin).toHaveBeenCalledTimes(1);

        resolveLogin({ role_id: 1 });

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/Smmedashboard");
        });
    });

    it("should re-enable the form after a failed login", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue(new Error("Login failed"));

        renderLogin();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        expect(
            screen.getByRole("button", {
                name: "Log In"
            })
        ).toBeEnabled();

        expect(screen.getByLabelText("Email Address")).toBeEnabled();
        expect(screen.getByLabelText("Password")).toBeEnabled();
    });


    // =====================================================
    // 9. LOGIN ERROR HANDLING TESTS
    // =====================================================

    it("should display the backend message when login fails", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password."
                }
            }
        });

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Invalid email or password.");
    });

    it("should fall back to the backend error field when there is no message", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: {
                data: {
                    error: "Account is locked."
                }
            }
        });

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Account is locked.");
    });

    it("should display the error message when a network error occurs", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue(
            new Error("Network Error")
        );

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Network Error");
    });

    it("should display a default error when no error details are available", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({});

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Unable to log in. Please try again.");
    });

    it("should display an error when login returns no user details", async () => {
        const user = userEvent.setup();

        mockLogin.mockResolvedValue(undefined);

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Login failed. No user details returned.");
    });

    it("should stay on the login page when login fails", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password."
                }
            }
        });

        renderLogin();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/login");
    });

    it("should log the error to the console when login fails", async () => {
        const user = userEvent.setup();

        const error = new Error("Login failed");

        mockLogin.mockRejectedValue(error);

        renderLogin();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Login failed:",
            error
        );
    });

    it("should clear the login error when the user edits the email", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password."
                }
            }
        });

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toBeInTheDocument();

        await user.type(
            screen.getByLabelText("Email Address"),
            "a"
        );

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("should clear the login error when the user edits the password", async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password."
                }
            }
        });

        renderLogin();

        await fillAndSubmit(user);

        expect(
            await screen.findByRole("alert")
        ).toBeInTheDocument();

        await user.type(
            screen.getByLabelText("Password"),
            "a"
        );

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("should allow the user to retry successfully after a failed login", async () => {
        const user = userEvent.setup();

        mockLogin
            .mockRejectedValueOnce({
                response: {
                    data: {
                        message: "Invalid email or password."
                    }
                }
            })
            .mockResolvedValueOnce({ role_id: 1 });

        renderLogin();

        await fillAndSubmit(user);

        await screen.findByRole("alert");

        await user.click(
            screen.getByRole("button", {
                name: "Log In"
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/Smmedashboard");
        });

        expect(mockLogin).toHaveBeenCalledTimes(2);
    });

});