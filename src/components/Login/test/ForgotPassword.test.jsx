import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

// ForgotPassword imports axios directly, so we mock the axios package.
vi.mock("axios", () => ({
    default: {
        post: mockPost
    }
}));

import ForgotPassword from "../ForgotPassword";

// Same URL that is hard-coded in the component.
const API_URL = "http://localhost:5000/api";

// This component allows us to see which page React Router navigates to.
function CurrentLocation() {
    const location = useLocation();

    return (
        <p data-testid="current-location">
            {location.pathname}
        </p>
    );
}

// Reusable function to render the component.
function renderForgotPassword() {
    return render(
        <MemoryRouter initialEntries={["/forgot-password"]}>
            <ForgotPassword />
            <CurrentLocation />
        </MemoryRouter>
    );
}

// NOTE: The <label> elements in the component are not linked to their inputs
// (no htmlFor / id), so getByLabelText cannot be used. We find the inputs by
// placeholder instead.

// Step 1 helper: type the email and click "Send OTP".
async function submitEmail(user, email = "test@example.com") {
    await user.type(
        screen.getByPlaceholderText("Enter your email"),
        email
    );

    await user.click(
        screen.getByRole("button", {
            name: "Send OTP"
        })
    );
}

// Moves the component to step 2 (reset password) and clears the mock
// history so later assertions only see the reset-password request.
async function goToStep2(user, email = "test@example.com") {
    mockPost.mockResolvedValueOnce({
        data: {
            message: "OTP sent to your email."
        }
    });

    await submitEmail(user, email);

    await screen.findByRole("heading", {
        name: "Reset Your Password"
    });

    mockPost.mockClear();
}

// Step 2 helper: fill in the reset form and click "Reset Password".
async function submitResetForm(
    user,
    {
        otp = "123456",
        password = "NewPassword123",
        confirm = "NewPassword123"
    } = {}
) {
    if (otp) {
        await user.type(
            screen.getByPlaceholderText("Enter 6-digit OTP"),
            otp
        );
    }

    if (password) {
        await user.type(
            screen.getByPlaceholderText("Enter new password"),
            password
        );
    }

    if (confirm) {
        await user.type(
            screen.getByPlaceholderText("Confirm new password"),
            confirm
        );
    }

    await user.click(
        screen.getByRole("button", {
            name: "Reset Password"
        })
    );
}

// Run before every test.
beforeEach(() => {
    // Reset API mock history and previous mock behaviour.
    mockPost.mockReset();
});

describe("ForgotPassword Component", () => {

    // =====================================================
    // 1. STEP 1 - RENDERING TESTS
    // =====================================================

    it("should display the forgot password heading", () => {
        renderForgotPassword();

        expect(
            screen.getByRole("heading", {
                name: "Forgot Password?"
            })
        ).toBeInTheDocument();
    });

    it("should display the step 1 description", () => {
        renderForgotPassword();

        expect(
            screen.getByText(
                "Enter your email address to receive a password reset OTP."
            )
        ).toBeInTheDocument();
    });

    it("should display the company logo", () => {
        renderForgotPassword();

        expect(
            screen.getByAltText("Tongaat Hulett")
        ).toBeInTheDocument();
    });

    it("should display the email field and Send OTP button", () => {
        renderForgotPassword();

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        ).toBeInTheDocument();
    });

    it("should not display the reset password fields on step 1", () => {
        renderForgotPassword();

        expect(
            screen.queryByPlaceholderText("Enter 6-digit OTP")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByPlaceholderText("Enter new password")
        ).not.toBeInTheDocument();
    });

    it("should display the Back to Login button", () => {
        renderForgotPassword();

        expect(
            screen.getByRole("button", {
                name: "Back to Login"
            })
        ).toBeInTheDocument();
    });

    it("should not display any message or error initially", () => {
        const { container } = renderForgotPassword();

        expect(
            container.querySelector(".bg-red-50")
        ).not.toBeInTheDocument();

        expect(
            container.querySelector(".bg-green-50")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 2. STEP 1 - INPUT TESTS
    // =====================================================

    it("should use a required email input", () => {
        renderForgotPassword();

        const email = screen.getByPlaceholderText("Enter your email");

        expect(email).toHaveAttribute("type", "email");
        expect(email).toBeRequired();
    });

    it("should allow the user to enter their email address", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        const email = screen.getByPlaceholderText("Enter your email");

        await user.type(email, "test@example.com");

        expect(email).toHaveValue("test@example.com");
    });


    // =====================================================
    // 3. STEP 1 - VALIDATION TESTS
    // =====================================================

    it("should display an error when the email is empty", () => {
        renderForgotPassword();

        // The browser normally blocks an empty required field before the
        // submit handler runs, so we submit the form directly to test the
        // component's own validation.
        const form = screen
            .getByRole("button", { name: "Send OTP" })
            .closest("form");

        fireEvent.submit(form);

        expect(
            screen.getByText("Please enter your email address.")
        ).toBeInTheDocument();

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should not call the API when the email is empty", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await user.click(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        );

        expect(mockPost).not.toHaveBeenCalled();
    });


    // =====================================================
    // 4. STEP 1 - SEND OTP TESTS
    // =====================================================

    it("should send the trimmed and lowercased email to the API", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                message: "OTP sent to your email."
            }
        });

        renderForgotPassword();

        await submitEmail(user, "  TEST@EXAMPLE.COM  ");

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                `${API_URL}/auth/forgot-password`,
                {
                    email: "test@example.com"
                }
            );
        });

        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it("should move to the reset password step after the OTP is sent", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                message: "OTP sent to your email."
            }
        });

        renderForgotPassword();

        await submitEmail(user);

        expect(
            await screen.findByRole("heading", {
                name: "Reset Your Password"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Enter the OTP sent to your email and choose a new password."
            )
        ).toBeInTheDocument();
    });

    it("should display the success message returned by the API", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                message: "OTP sent to your email."
            }
        });

        renderForgotPassword();

        await submitEmail(user);

        expect(
            await screen.findByText("OTP sent to your email.")
        ).toBeInTheDocument();
    });

    it("should show a loading state while the OTP is being sent", async () => {
        const user = userEvent.setup();

        // Keep the request pending so we can inspect the loading UI.
        let resolvePost;

        mockPost.mockReturnValue(
            new Promise((resolve) => {
                resolvePost = resolve;
            })
        );

        renderForgotPassword();

        await submitEmail(user);

        expect(
            await screen.findByRole("button", {
                name: "Sending OTP..."
            })
        ).toBeDisabled();

        // Finish the request.
        resolvePost({
            data: {
                message: "OTP sent to your email."
            }
        });

        expect(
            await screen.findByRole("heading", {
                name: "Reset Your Password"
            })
        ).toBeInTheDocument();
    });

    it("should display the backend error message when sending the OTP fails", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                data: {
                    message: "No account found for this email."
                }
            }
        });

        renderForgotPassword();

        await submitEmail(user);

        expect(
            await screen.findByText("No account found for this email.")
        ).toBeInTheDocument();
    });

    it("should display a default error when sending the OTP fails unexpectedly", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue(
            new Error("Network error")
        );

        renderForgotPassword();

        await submitEmail(user);

        expect(
            await screen.findByText("Unable to send OTP. Please try again.")
        ).toBeInTheDocument();
    });

    it("should stay on step 1 and re-enable the button when sending the OTP fails", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue(
            new Error("Network error")
        );

        renderForgotPassword();

        await submitEmail(user);

        await screen.findByText("Unable to send OTP. Please try again.");

        expect(
            screen.getByRole("heading", {
                name: "Forgot Password?"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        ).toBeEnabled();
    });

    it("should clear the previous error when the user tries again", async () => {
        const user = userEvent.setup();

        mockPost
            .mockRejectedValueOnce(new Error("Network error"))
            .mockResolvedValueOnce({
                data: {
                    message: "OTP sent to your email."
                }
            });

        renderForgotPassword();

        await submitEmail(user);

        await screen.findByText("Unable to send OTP. Please try again.");

        await user.click(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        );

        await screen.findByRole("heading", {
            name: "Reset Your Password"
        });

        expect(
            screen.queryByText("Unable to send OTP. Please try again.")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 5. STEP 2 - RENDERING TESTS
    // =====================================================

    it("should display all reset password fields on step 2", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        expect(
            screen.getByPlaceholderText("Enter 6-digit OTP")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter new password")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Confirm new password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Reset Password"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        ).toBeInTheDocument();
    });

    it("should not display the email field on step 2", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        expect(
            screen.queryByPlaceholderText("Enter your email")
        ).not.toBeInTheDocument();
    });

    it("should still display the Back to Login button on step 2", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        expect(
            screen.getByRole("button", {
                name: "Back to Login"
            })
        ).toBeInTheDocument();
    });

    it("should hide the password fields", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        expect(
            screen.getByPlaceholderText("Enter new password")
        ).toHaveAttribute("type", "password");

        expect(
            screen.getByPlaceholderText("Confirm new password")
        ).toHaveAttribute("type", "password");
    });


    // =====================================================
    // 6. STEP 2 - OTP INPUT TESTS
    // =====================================================

    it("should configure the OTP field for six numeric digits", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        const otp = screen.getByPlaceholderText("Enter 6-digit OTP");

        expect(otp).toHaveAttribute("maxlength", "6");
        expect(otp).toHaveAttribute("inputmode", "numeric");
        expect(otp).toBeRequired();
    });

    it("should remove non-numeric characters from the OTP", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        const otp = screen.getByPlaceholderText("Enter 6-digit OTP");

        await user.type(otp, "12ab-34");

        expect(otp).toHaveValue("1234");
    });

    it("should not accept more than six digits in the OTP", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        const otp = screen.getByPlaceholderText("Enter 6-digit OTP");

        await user.type(otp, "12345678");

        expect(otp).toHaveValue("123456");
    });


    // =====================================================
    // 7. STEP 2 - VALIDATION TESTS
    // =====================================================

    it("should display an error when the OTP is not six digits", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await submitResetForm(user, { otp: "12345" });

        expect(
            screen.getByText("Enter the six-digit OTP sent to your email.")
        ).toBeInTheDocument();

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should display an error when the new password is too short", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await submitResetForm(user, {
            password: "Pass123",
            confirm: "Pass123"
        });

        expect(
            screen.getByText("Password must contain at least 8 characters.")
        ).toBeInTheDocument();

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should accept a password with exactly 8 characters", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockResolvedValue({
            data: {
                message: "Password reset successfully."
            }
        });

        await submitResetForm(user, {
            password: "Pass1234",
            confirm: "Pass1234"
        });

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledTimes(1);
        });
    });

    it("should display an error when the passwords do not match", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await submitResetForm(user, {
            password: "NewPassword123",
            confirm: "Different123"
        });

        expect(
            screen.getByText("Passwords do not match.")
        ).toBeInTheDocument();

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should check the OTP before the password rules", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        // Invalid OTP AND a short, mismatched password.
        await submitResetForm(user, {
            otp: "123",
            password: "abc",
            confirm: "xyz"
        });

        expect(
            screen.getByText("Enter the six-digit OTP sent to your email.")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Password must contain at least 8 characters.")
        ).not.toBeInTheDocument();
    });

    it("should clear the success message when a validation error is shown", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        // The "OTP sent" message is visible after step 1.
        expect(
            screen.getByText("OTP sent to your email.")
        ).toBeInTheDocument();

        await submitResetForm(user, { otp: "12345" });

        expect(
            screen.queryByText("OTP sent to your email.")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 8. STEP 2 - RESET PASSWORD TESTS
    // =====================================================

    it("should send the correct reset details to the API", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        // The email is trimmed and lowercased in step 1 and reused in step 2.
        await goToStep2(user, "  TEST@EXAMPLE.COM  ");

        mockPost.mockResolvedValue({
            data: {
                message: "Password reset successfully."
            }
        });

        await submitResetForm(user);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                `${API_URL}/auth/reset-password`,
                {
                    email: "test@example.com",
                    otp: "123456",
                    newPassword: "NewPassword123"
                }
            );
        });

        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it("should not send the confirmation password to the API", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockResolvedValue({
            data: {
                message: "Password reset successfully."
            }
        });

        await submitResetForm(user);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
        });

        const payload = mockPost.mock.calls[0][1];

        expect(payload).not.toHaveProperty("confirmPassword");
    });

    it("should display the success message after the password is reset", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockResolvedValue({
            data: {
                message: "Password reset successfully."
            }
        });

        await submitResetForm(user);

        expect(
            await screen.findByText("Password reset successfully.")
        ).toBeInTheDocument();
    });

    it("should show a loading state while the password is being reset", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        // Keep the request pending so we can inspect the loading UI.
        let resolvePost;

        mockPost.mockReturnValue(
            new Promise((resolve) => {
                resolvePost = resolve;
            })
        );

        await submitResetForm(user);

        expect(
            await screen.findByRole("button", {
                name: "Resetting Password..."
            })
        ).toBeDisabled();

        // Finish the request.
        resolvePost({
            data: {
                message: "Password reset successfully."
            }
        });

        expect(
            await screen.findByText("Password reset successfully.")
        ).toBeInTheDocument();
    });

    it(
        "should return to the login page two seconds after a successful reset",
        async () => {
            const user = userEvent.setup();

            renderForgotPassword();

            await goToStep2(user);

            mockPost.mockResolvedValue({
                data: {
                    message: "Password reset successfully."
                }
            });

            await submitResetForm(user);

            await screen.findByText("Password reset successfully.");

            // The user should still be on the page right after success.
            expect(
                screen.getByTestId("current-location").textContent
            ).toBe("/forgot-password");

            // After the 2 second delay the user is sent to "/".
            await waitFor(
                () => {
                    expect(
                        screen.getByTestId("current-location").textContent
                    ).toBe("/");
                },
                { timeout: 4000 }
            );
        },
        10000
    );

    it("should display the backend error message when the reset fails", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid or expired OTP."
                }
            }
        });

        await submitResetForm(user);

        expect(
            await screen.findByText("Invalid or expired OTP.")
        ).toBeInTheDocument();
    });

    it("should display a default error when the reset fails unexpectedly", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockRejectedValue(
            new Error("Network error")
        );

        await submitResetForm(user);

        expect(
            await screen.findByText(
                "Unable to reset password. Please try again."
            )
        ).toBeInTheDocument();
    });

    it("should stay on the page and re-enable the button when the reset fails", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost.mockRejectedValue(
            new Error("Network error")
        );

        await submitResetForm(user);

        await screen.findByText("Unable to reset password. Please try again.");

        expect(
            screen.getByTestId("current-location").textContent
        ).toBe("/forgot-password");

        expect(
            screen.getByRole("button", {
                name: "Reset Password"
            })
        ).toBeEnabled();
    });

    it("should clear the previous error after a successful retry", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        mockPost
            .mockRejectedValueOnce({
                response: {
                    data: {
                        message: "Invalid or expired OTP."
                    }
                }
            })
            .mockResolvedValueOnce({
                data: {
                    message: "Password reset successfully."
                }
            });

        await submitResetForm(user);

        await screen.findByText("Invalid or expired OTP.");

        await user.click(
            screen.getByRole("button", {
                name: "Reset Password"
            })
        );

        expect(
            await screen.findByText("Password reset successfully.")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Invalid or expired OTP.")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 9. USE A DIFFERENT EMAIL TESTS
    // =====================================================

    it("should return to step 1 when Use a different email is clicked", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await user.click(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        );

        expect(
            screen.getByRole("heading", {
                name: "Forgot Password?"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument();
    });

    it("should keep the previously entered email when returning to step 1", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await user.click(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        );

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toHaveValue("test@example.com");
    });

    it("should clear the messages and errors when returning to step 1", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        // Create an error on step 2.
        await submitResetForm(user, { otp: "123" });

        expect(
            screen.getByText("Enter the six-digit OTP sent to your email.")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        );

        expect(
            screen.queryByText("Enter the six-digit OTP sent to your email.")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("OTP sent to your email.")
        ).not.toBeInTheDocument();
    });

    it("should clear the OTP when returning to step 1", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await user.type(
            screen.getByPlaceholderText("Enter 6-digit OTP"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        );

        // Request a new OTP and return to step 2.
        mockPost.mockResolvedValueOnce({
            data: {
                message: "New OTP sent."
            }
        });

        await user.click(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        );

        await screen.findByRole("heading", {
            name: "Reset Your Password"
        });

        expect(
            screen.getByPlaceholderText("Enter 6-digit OTP")
        ).toHaveValue("");
    });

    it("should use the new email when a different email is submitted", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user, "first@example.com");

        await user.click(
            screen.getByRole("button", {
                name: "Use a different email"
            })
        );

        const email = screen.getByPlaceholderText("Enter your email");

        await user.clear(email);
        await user.type(email, "second@example.com");

        mockPost.mockResolvedValueOnce({
            data: {
                message: "OTP sent."
            }
        });

        await user.click(
            screen.getByRole("button", {
                name: "Send OTP"
            })
        );

        await screen.findByRole("heading", {
            name: "Reset Your Password"
        });

        mockPost.mockResolvedValueOnce({
            data: {
                message: "Password reset successfully."
            }
        });

        await submitResetForm(user);

        await waitFor(() => {
            expect(mockPost).toHaveBeenLastCalledWith(
                `${API_URL}/auth/reset-password`,
                {
                    email: "second@example.com",
                    otp: "123456",
                    newPassword: "NewPassword123"
                }
            );
        });
    });


    // =====================================================
    // 10. NAVIGATION TESTS
    // =====================================================

    it("should navigate to the login page when Back to Login is clicked on step 1", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await user.click(
            screen.getByRole("button", {
                name: "Back to Login"
            })
        );

        expect(
            screen.getByTestId("current-location").textContent
        ).toBe("/");
    });

    it("should navigate to the login page when Back to Login is clicked on step 2", async () => {
        const user = userEvent.setup();

        renderForgotPassword();

        await goToStep2(user);

        await user.click(
            screen.getByRole("button", {
                name: "Back to Login"
            })
        );

        expect(
            screen.getByTestId("current-location").textContent
        ).toBe("/");
    });

});