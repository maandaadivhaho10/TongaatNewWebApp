
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
const { mockPost } = vi.hoisted(() => ({
    mockPost: vi.fn()
}));

vi.mock("../../../API/axiosInstance", () => ({
    default: {
        post: mockPost
    }
}));

import VerifyOtp from "../VerifyOtp";

// This component allows us to see the current route and navigation state.
function CurrentLocation() {
    const location = useLocation();

    return (
        <>
            <p data-testid="current-location">
                {location.pathname}
            </p>

            <p data-testid="navigation-state">
                {JSON.stringify(location.state)}
            </p>
        </>
    );
}

// Reusable function to render the OTP component.
function renderVerifyOtp(initialEntries = [
    {
        pathname: "/verify-otp",
        state: {
            user_id: 25,
            email: "test@example.com"
        }
    }
]) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <VerifyOtp />
            <CurrentLocation />
        </MemoryRouter>
    );
}

// Run before every test.
beforeEach(() => {
    mockPost.mockReset();

    sessionStorage.clear();
});

describe("VerifyOtp Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should display the OTP verification heading", () => {
        renderVerifyOtp();

        expect(
            screen.getByRole("heading", {
                name: "Verify Your Account"
            })
        ).toBeInTheDocument();
    });

    it("should display the registered email address", () => {
    renderVerifyOtp();

    expect(
        screen.getByText(/Enter the OTP sent to test@example.com/)
    ).toBeInTheDocument();
});

    it("should display the verification code input", () => {
        renderVerifyOtp();

        expect(
            screen.getByLabelText("Verification Code")
        ).toBeInTheDocument();
    });

    it("should display the Verify OTP button", () => {
        renderVerifyOtp();

        expect(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        ).toBeInTheDocument();
    });

    it("should display the Create Account link", () => {
        renderVerifyOtp();

        expect(
            screen.getByRole("link", {
                name: "Create Account"
            })
        ).toHaveAttribute("href", "/createaccount");
    });


    // =====================================================
    // 2. INPUT TESTS
    // =====================================================

    it("should allow the user to enter an OTP", async () => {
        const user = userEvent.setup();

        renderVerifyOtp();

        const otpInput =
            screen.getByLabelText("Verification Code");

        await user.type(otpInput, "123456");

        expect(otpInput).toHaveValue("123456");
    });

    it("should require the OTP input", () => {
        renderVerifyOtp();

        expect(
            screen.getByLabelText("Verification Code")
        ).toBeRequired();
    });

    it("should clear the error when the user changes the OTP", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid OTP."
                }
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "000000"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Invalid OTP.");

        await user.type(
            screen.getByLabelText("Verification Code"),
            "1"
        );

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });


    // =====================================================
    // 3. FORM VALIDATION TESTS
    // =====================================================

    it("should display an error when the OTP is empty", () => {
        renderVerifyOtp();

        const form =
            screen.getByRole("button", {
                name: "Verify OTP"
            }).closest("form");

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent(
            "Please enter your verification code."
        );

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should display an error when registration details are missing", () => {
        renderVerifyOtp([
            "/verify-otp"
        ]);

        const form =
            screen.getByLabelText("Verification Code").closest("form");

        fireEvent.submit(form);

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent(
            "Registration details were not found. Please create your account first."
        );

        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should disable the Verify OTP button when user ID is missing", () => {
        renderVerifyOtp([
            "/verify-otp"
        ]);

        expect(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        ).toBeDisabled();
    });


    // =====================================================
    // 4. SESSION STORAGE TESTS
    // =====================================================

    it("should retrieve user verification details from session storage", () => {
        sessionStorage.setItem(
            "pending_smme_verification",
            JSON.stringify({
                user_id: 25,
                email: "test@example.com"
            })
        );

        renderVerifyOtp([
            "/verify-otp"
        ]);

        expect(
            screen.getByText(/test@example.com/)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        ).toBeEnabled();
    });

    it("should use session storage when router state is unavailable", async () => {
        const user = userEvent.setup();

        sessionStorage.setItem(
            "pending_smme_verification",
            JSON.stringify({
                user_id: 25,
                email: "test@example.com"
            })
        );

        mockPost.mockResolvedValue({
            data: {
                success: true,
                message: "Account verified successfully."
            }
        });

        renderVerifyOtp([
            "/verify-otp"
        ]);

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/otp/verify",
                {
                    user_id: 25,
                    otp: "123456"
                }
            );
        });
    });


    // =====================================================
    // 5. SUCCESSFUL OTP VERIFICATION TESTS
    // =====================================================

    it("should submit the correct OTP and user ID to the API", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                success: true
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/otp/verify",
                {
                    user_id: 25,
                    otp: "123456"
                }
            );
        });
    });

    it("should redirect the user to login after successful verification", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                success: true,
                message: "Account verified successfully."
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/login");
        });

        expect(
            screen.getByTestId("navigation-state")
        ).toHaveTextContent(
            '{"verificationSuccess":true}'
        );
    });

    it("should remove pending verification data after successful verification", async () => {
        const user = userEvent.setup();

        sessionStorage.setItem(
            "pending_smme_verification",
            JSON.stringify({
                user_id: 25,
                email: "test@example.com"
            })
        );

        mockPost.mockResolvedValue({
            data: {
                success: true
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        await waitFor(() => {
            expect(
                sessionStorage.getItem(
                    "pending_smme_verification"
                )
            ).toBeNull();
        });
    });


    // =====================================================
    // 6. INVALID OTP TESTS
    // =====================================================

    it("should display an error when the OTP is incorrect", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    message: "Invalid OTP."
                }
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "000000"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Invalid OTP.");

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/verify-otp");
    });

    it("should display an error when the OTP has expired", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                status: 400,
                data: {
                    message: "OTP has expired. Please request a new one."
                }
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "OTP has expired. Please request a new one."
        );
    });


    // =====================================================
    // 7. API RESPONSE TESTS
    // =====================================================

    it("should display an error when the API returns success false", async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValue({
            data: {
                success: false,
                message: "Verification failed."
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Verification failed.");

        expect(
            screen.getByTestId("current-location")
        ).toHaveTextContent("/verify-otp");
    });

    it("should display the backend error message", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue({
            response: {
                data: {
                    error: "Verification code is invalid."
                }
            }
        });

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Verification code is invalid."
        );
    });

    it("should display a default error when the API request fails unexpectedly", async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValue(
            new Error("Network Error")
        );

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Network Error");
    });


    // =====================================================
    // 8. LOADING STATE TESTS
    // =====================================================

    it("should display Verifying while the API request is processing", async () => {
        const user = userEvent.setup();

        let resolveRequest;

        mockPost.mockReturnValue(
            new Promise((resolve) => {
                resolveRequest = resolve;
            })
        );

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        expect(
            screen.getByRole("button", {
                name: "Verifying..."
            })
        ).toBeDisabled();

        resolveRequest({
            data: {
                success: true
            }
        });

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/login");
        });
    });

    it("should prevent duplicate API requests while verification is processing", async () => {
        const user = userEvent.setup();

        let resolveRequest;

        mockPost.mockReturnValue(
            new Promise((resolve) => {
                resolveRequest = resolve;
            })
        );

        renderVerifyOtp();

        await user.type(
            screen.getByLabelText("Verification Code"),
            "123456"
        );

        const form =
            screen.getByLabelText("Verification Code").closest("form");

        await user.click(
            screen.getByRole("button", {
                name: "Verify OTP"
            })
        );

        fireEvent.submit(form);

        expect(mockPost).toHaveBeenCalledTimes(1);

        resolveRequest({
            data: {
                success: true
            }
        });

        await waitFor(() => {
            expect(
                screen.getByTestId("current-location")
            ).toHaveTextContent("/login");
        });
    });

});
