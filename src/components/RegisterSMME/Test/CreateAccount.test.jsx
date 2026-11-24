
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";
import {
    MemoryRouter,
    useLocation
} from "react-router-dom";

// Create a mock API function.
// This prevents tests from sending real requests to the backend.
const { mockPost } = vi.hoisted(() => ({
    mockPost: vi.fn()
}));

vi.mock("../../../API/axiosInstance", () => ({
    default: {
        post: mockPost
    }
}));

import CreateAccount from "../CreateAccount";

// This component allows us to see which page React Router navigates to.
function CurrentLocation() {
    const location = useLocation();

    return (
        <p data-testid="current-location">
            {location.pathname}
        </p>
    );
}

// Reusable function to render the registration component.
function renderCreateAccount() {
    return render(
        <MemoryRouter initialEntries={["/register"]}>
            <CreateAccount />
            <CurrentLocation />
        </MemoryRouter>
    );
}

// Reusable function that fills in all required registration fields.
async function fillValidForm(user) {
    await user.selectOptions(
        screen.getByLabelText("Title"),
        "Mr"
    );

    await user.type(
        screen.getByLabelText("First Name"),
        " Maanda "
    );

    await user.type(
        screen.getByLabelText("Last Name"),
        "Adivhaho"
    );

    await user.type(
        screen.getByLabelText("ID Number"),
        "9001015009087"
    );

    await user.selectOptions(
        screen.getByLabelText("Gender"),
        "Male"
    );

    await user.type(
        screen.getByLabelText("Phone Number"),
        "0712345678"
    );

    await user.type(
        screen.getByLabelText("Email Address"),
        " TEST@EXAMPLE.COM "
    );

    await user.type(
        screen.getByLabelText("Password"),
        "Password123"
    );

    await user.type(
        screen.getByLabelText("Confirm Password"),
        "Password123"
    );
}

// Run before every test.
beforeEach(() => {
    // Reset API mock history and previous mock behaviour.
    mockPost.mockReset();

    // Clear session storage so tests do not affect each other.
    sessionStorage.clear();
});

describe("CreateAccount Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should display the registration heading", () => {
        renderCreateAccount();

        expect(
            screen.getByRole("heading", {
                name: "Create New Account"
            })
        ).toBeInTheDocument();
    });

    it("should display the registration description", () => {
        renderCreateAccount();

        expect(
            screen.getByText(
                "Create your account to access opportunities and business support."
            )
        ).toBeInTheDocument();
    });

    it("should display all registration fields", () => {
        renderCreateAccount();

        expect(screen.getByLabelText("Title")).toBeInTheDocument();
        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("ID Number")).toBeInTheDocument();
        expect(screen.getByLabelText("Gender")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    it("should display the Create Account button", () => {
        renderCreateAccount();

        expect(
            screen.getByRole("button", {
                name: "Create Account"
            })
        ).toBeInTheDocument();
    });

    it("should display the Terms and Conditions checkbox", () => {
        renderCreateAccount();

        expect(
            screen.getByRole("checkbox")
        ).toBeInTheDocument();
    });

    it("should display the sign in button", () => {
        renderCreateAccount();

        expect(
            screen.getByRole("button", {
                name: "Sign in"
            })
        ).toBeInTheDocument();
    });


    // =====================================================
    // 2. INPUT AND DROPDOWN TESTS
    // =====================================================

    it("should allow the user to enter their first name", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const firstName = screen.getByLabelText("First Name");

        await user.type(firstName, "Maanda");

        expect(firstName).toHaveValue("Maanda");
    });

    it("should allow the user to enter their email address", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const email = screen.getByLabelText("Email Address");

        await user.type(email, "test@example.com");

        expect(email).toHaveValue("test@example.com");
    });

    it("should allow the user to select a title", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const title = screen.getByLabelText("Title");

        await user.selectOptions(title, "Mr");

        expect(title).toHaveValue("Mr");
    });

    it("should allow the user to select a gender", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const gender = screen.getByLabelText("Gender");

        await user.selectOptions(gender, "Male");

        expect(gender).toHaveValue("Male");
    });

    it("should limit the ID number to 13 characters", () => {
        renderCreateAccount();

        expect(
            screen.getByLabelText("ID Number")
        ).toHaveAttribute("maxlength", "13");
    });


    // =====================================================
    // 3. PASSWORD VISIBILITY TESTS
    // =====================================================

    it("should show and hide the password", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const password = screen.getByLabelText("Password");

        expect(password).toHaveAttribute("type", "password");

        await user.click(
            screen.getByRole("button", {
                name: "Show Password"
            })
        );

        expect(password).toHaveAttribute("type", "text");

        await user.click(
            screen.getByRole("button", {
                name: "Hide Password"
            })
        );

        expect(password).toHaveAttribute("type", "password");
    });

    it("should show and hide the confirmation password", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const confirmPassword =
            screen.getByLabelText("Confirm Password");

        expect(confirmPassword).toHaveAttribute("type", "password");

        await user.click(
            screen.getByRole("button", {
                name: "Show Confirm Password"
            })
        );

        expect(confirmPassword).toHaveAttribute("type", "text");

        await user.click(
            screen.getByRole("button", {
                name: "Hide Confirm Password"
            })
        );

        expect(confirmPassword).toHaveAttribute("type", "password");
    });

    it("should require passwords to have at least 8 characters", () => {
        renderCreateAccount();

        expect(
            screen.getByLabelText("Password")
        ).toHaveAttribute("minlength", "8");

        expect(
            screen.getByLabelText("Confirm Password")
        ).toHaveAttribute("minlength", "8");
    });

    it("should display a message when passwords match", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await user.type(
            screen.getByLabelText("Password"),
            "Password123"
        );

        await user.type(
            screen.getByLabelText("Confirm Password"),
            "Password123"
        );

        expect(
            screen.getByText("Passwords match.")
        ).toBeInTheDocument();
    });

    it("should display an error when passwords do not match", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await user.type(
            screen.getByLabelText("Password"),
            "Password123"
        );

        await user.type(
            screen.getByLabelText("Confirm Password"),
            "Different123"
        );

        expect(
            screen.getByText("Passwords do not match.")
        ).toBeInTheDocument();
    });

    it("should apply an error border when passwords do not match", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await user.type(
            screen.getByLabelText("Password"),
            "Password123"
        );

        const confirmPassword =
            screen.getByLabelText("Confirm Password");

        await user.type(confirmPassword, "Different123");

        expect(confirmPassword.className).toContain("border-red-500");
    });


    // =====================================================
    // 4. TERMS AND CONDITIONS TESTS
    // =====================================================

    it("should allow the user to accept the Terms and Conditions", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const checkbox = screen.getByRole("checkbox");

        expect(checkbox).not.toBeChecked();

        await user.click(checkbox);

        expect(checkbox).toBeChecked();
    });

    it("should prevent registration when terms are not accepted", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent(
            "Please accept the Terms and Conditions."
        );

        // The API must not be called.
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should navigate to the Terms and Conditions page", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await user.click(
            screen.getByRole("button", {
                name: "Terms and Conditions"
            })
        );

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/terms");
    });

    it("should navigate to the login page when Sign in is clicked", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await user.click(
            screen.getByRole("button", {
                name: "Sign in"
            })
        );

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/login");
    });


    // =====================================================
    // 5. FORM VALIDATION TESTS
    // =====================================================

    it("should prevent registration when passwords do not match", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        await fillValidForm(user);

        // Change the confirmation password.
        const confirmPassword =
            screen.getByLabelText("Confirm Password");

        await user.clear(confirmPassword);
        await user.type(confirmPassword, "Different123");

        // Accept the terms so that password validation is reached.
        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Passwords do not match.");

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should not submit when required fields are empty", async () => {
        const user = userEvent.setup();

        renderCreateAccount();

        const firstName = screen.getByLabelText("First Name");

        // Required fields are enforced by the browser.
        expect(firstName).toBeRequired();

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(mockPost).not.toHaveBeenCalled();
    });


    // =====================================================
    // 6. SUCCESSFUL REGISTRATION TESTS
    // =====================================================

    it("should submit the correct registration details to the API", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                user_id: 25
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/auth1/register/smme",
                {
                    title: "Mr",
                    first_name: "Maanda",
                    last_name: "Adivhaho",
                    id_number: "9001015009087",
                    gender: "Male",
                    phone_number: "0712345678",
                    email: "test@example.com",
                    password: "Password123"
                }
            );
        });
    });

    it("should save verification details in session storage after registration", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                user_id: 25
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        await waitFor(() => {
            const storedData = JSON.parse(
                sessionStorage.getItem("pending_smme_verification")
            );

            expect(storedData).toEqual({
                user_id: 25,
                email: "test@example.com"
            });
        });
    });

    it("should navigate to OTP verification after successful registration", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                user_id: 25
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/verify-otp");
        });
    });


    // =====================================================
    // 7. API RESPONSE TESTS
    // =====================================================

    it("should support a nested user_id API response", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                user: {
                    user_id: 30
                }
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/verify-otp");
        });
    });

    it("should display an error when the API does not return a user_id", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                message: "Registration completed"
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Registration completed, but the server did not return a user_id for OTP verification. Please contact support."
        );

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/register");
    });


    // =====================================================
    // 8. API ERROR HANDLING TESTS
    // =====================================================

    it("should display the backend error message", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    message: "Invalid registration details."
                }
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Invalid registration details.");
    });

    it("should display an error when the account is already registered", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                status: 409,
                data: {}
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "This account is already registered."
        );
    });

    it("should display a default error when the API request fails unexpectedly", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue(
            new Error("Network error")
        );

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Unable to create account. Please try again."
        );
    });

    it("should clear the error when the user changes a field", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                status: 409,
                data: {}
            }
        });

        renderCreateAccount();

        await fillValidForm(user);

        await user.click(screen.getByRole("checkbox"));

        await user.click(
            screen.getByRole("button", {
                name: "Create Account"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "This account is already registered."
        );

        await user.type(
            screen.getByLabelText("First Name"),
            "A"
        );

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

});
