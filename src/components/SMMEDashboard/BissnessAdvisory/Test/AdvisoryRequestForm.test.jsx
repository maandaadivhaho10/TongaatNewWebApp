import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    it,
    expect,
    vi
} from "vitest";

// The form only needs the list of support areas, so the service is replaced
// with a short list. This also avoids loading the real axios instance.
vi.mock("../advisoryService", () => ({
    SUPPORT_AREAS: ["Area One", "Area Two", "Area Three"]
}));

import AdvisoryRequestForm from "../AdvisoryRequestForm";

const PLACEHOLDER_TEXT = "Select a business support area";

// Reusable function to render the form with sensible defaults.
function renderForm(props = {}) {
    const allProps = {
        onSubmit: vi.fn().mockResolvedValue(true),
        onViewRequests: vi.fn(),
        onEdit: vi.fn(),
        loading: false,
        authLoading: false,
        error: "",
        success: "",
        ...props
    };

    const utils = render(<AdvisoryRequestForm {...allProps} />);

    return { ...utils, props: allProps };
}

// The dropdown toggle is the only element with aria-expanded.
function getToggle(container) {
    return container.querySelector("button[aria-expanded]");
}

function getDescription() {
    return screen.getByLabelText(/Describe the Support You Need/);
}

function getSubmitButton() {
    return screen.getByRole("button", {
        name: /Submit Advisory Request|Submitting\.\.\.|Checking session\.\.\./
    });
}

// Selects a support area from the dropdown.
async function selectArea(user, container, area = "Area Two") {
    await user.click(getToggle(container));

    await user.click(
        screen.getByRole("button", {
            name: area
        })
    );
}

// Fills in both required fields.
async function fillForm(
    user,
    container,
    area = "Area Two",
    description = "We need help with this."
) {
    await selectArea(user, container, area);
    await user.type(getDescription(), description);
}

describe("AdvisoryRequestForm Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should render the tab panel with the correct accessibility attributes", () => {
        renderForm();

        const panel = screen.getByRole("tabpanel");

        expect(panel).toHaveAttribute("id", "panel-new");
        expect(panel).toHaveAttribute("aria-labelledby", "tab-new");
    });

    it("should display the support area label and helper text", () => {
        renderForm();

        expect(
            screen.getByText(/Business Area You Need Support With/)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Select the area where your business requires advisory support."
            )
        ).toBeInTheDocument();
    });

    it("should display the dropdown with a placeholder", () => {
        const { container } = renderForm();

        expect(getToggle(container)).toHaveTextContent(PLACEHOLDER_TEXT);
    });

    it("should display the description field", () => {
        renderForm();

        const description = getDescription();

        expect(description).toBeInTheDocument();
        expect(description).toHaveAttribute(
            "placeholder",
            "Explain the challenge your business is facing and the type of assistance you need..."
        );
    });

    it("should configure the description field as required with a 1000 character limit", () => {
        renderForm();

        const description = getDescription();

        expect(description).toBeRequired();
        expect(description).toHaveAttribute("maxlength", "1000");
    });

    it("should display the character counter", () => {
        renderForm();

        expect(
            screen.getByText("0/1000")
        ).toBeInTheDocument();
    });

    it("should display the required fields note", () => {
        renderForm();

        expect(
            screen.getByText("Fields marked with * are required.")
        ).toBeInTheDocument();
    });

    it("should display the submit button", () => {
        renderForm();

        expect(
            screen.getByRole("button", {
                name: "Submit Advisory Request"
            })
        ).toBeInTheDocument();
    });

    it("should not display an error or success message initially", () => {
        renderForm();

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });


    // =====================================================
    // 2. DROPDOWN TESTS
    // =====================================================

    it("should keep the dropdown closed initially", () => {
        const { container } = renderForm();

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");

        expect(
            screen.queryByRole("button", { name: "Area One" })
        ).not.toBeInTheDocument();
    });

    it("should open the dropdown and show every support area", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await user.click(getToggle(container));

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "true");

        expect(screen.getByRole("button", { name: "Area One" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Area Two" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Area Three" })).toBeInTheDocument();
    });

    it("should close the dropdown when the toggle is clicked again", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await user.click(getToggle(container));
        await user.click(getToggle(container));

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");

        expect(
            screen.queryByRole("button", { name: "Area One" })
        ).not.toBeInTheDocument();
    });

    it("should select a support area and close the dropdown", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await selectArea(user, container, "Area Two");

        expect(getToggle(container)).toHaveTextContent("Area Two");
        expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");

        expect(
            screen.queryByRole("button", { name: "Area One" })
        ).not.toBeInTheDocument();
    });

    it("should call onEdit when a support area is selected", async () => {
        const user = userEvent.setup();

        const { container, props } = renderForm();

        await selectArea(user, container);

        expect(props.onEdit).toHaveBeenCalledTimes(1);
    });

    it("should highlight the selected support area", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await selectArea(user, container, "Area Two");

        await user.click(getToggle(container));

        // The toggle shows the selected area too, so the option is the last
        // button with that name.
        const matches = screen.getAllByRole("button", { name: "Area Two" });
        const option = matches[matches.length - 1];

        expect(option.className).toContain("font-semibold");

        expect(
            screen.getByRole("button", { name: "Area One" }).className
        ).not.toContain("font-semibold");
    });

    it("should close the dropdown when the user clicks outside it", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await user.click(getToggle(container));

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "true");

        await user.click(document.body);

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "false");
    });

    it("should keep the dropdown open when the user clicks inside it", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await user.click(getToggle(container));

        // Pressing the mouse button on the option list itself must not
        // count as an outside click.
        await user.pointer({
            keys: "[MouseLeft>]",
            target: screen.getByRole("button", { name: "Area One" }).parentElement
        });

        expect(getToggle(container)).toHaveAttribute("aria-expanded", "true");
    });

    it("should remove the outside click listener when the component unmounts", () => {
        const removeSpy = vi.spyOn(document, "removeEventListener");

        const { unmount } = renderForm();

        unmount();

        expect(removeSpy).toHaveBeenCalledWith(
            "mousedown",
            expect.any(Function)
        );

        removeSpy.mockRestore();
    });


    // =====================================================
    // 3. DESCRIPTION TESTS
    // =====================================================

    it("should allow the user to type a description", async () => {
        const user = userEvent.setup();

        renderForm();

        await user.type(getDescription(), "Need help");

        expect(getDescription()).toHaveValue("Need help");
    });

    it("should update the character counter while typing", async () => {
        const user = userEvent.setup();

        renderForm();

        await user.type(getDescription(), "Hello");

        expect(
            screen.getByText("5/1000")
        ).toBeInTheDocument();
    });

    it("should call onEdit for every change to the description", async () => {
        const user = userEvent.setup();

        const { props } = renderForm();

        await user.type(getDescription(), "abc");

        expect(props.onEdit).toHaveBeenCalledTimes(3);
    });


    // =====================================================
    // 4. SUBMIT BUTTON STATE TESTS
    // =====================================================

    it("should disable the submit button when the form is empty", () => {
        renderForm();

        expect(getSubmitButton()).toBeDisabled();
    });

    it("should disable the submit button when only a support area is selected", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await selectArea(user, container);

        expect(getSubmitButton()).toBeDisabled();
    });

    it("should disable the submit button when only a description is entered", async () => {
        const user = userEvent.setup();

        renderForm();

        await user.type(getDescription(), "Need help");

        expect(getSubmitButton()).toBeDisabled();
    });

    it("should disable the submit button when the description is only spaces", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await selectArea(user, container);
        await user.type(getDescription(), "     ");

        expect(getSubmitButton()).toBeDisabled();
    });

    it("should enable the submit button when both fields are completed", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await fillForm(user, container);

        expect(getSubmitButton()).toBeEnabled();
    });

    it("should show Submitting... and disable the form while loading", () => {
        const { container } = renderForm({ loading: true });

        expect(
            screen.getByRole("button", { name: "Submitting..." })
        ).toBeDisabled();

        expect(getDescription()).toBeDisabled();
        expect(getToggle(container)).toBeDisabled();
    });

    it("should show Checking session... and disable the form while the session is loading", () => {
        const { container } = renderForm({ authLoading: true });

        expect(
            screen.getByRole("button", { name: "Checking session..." })
        ).toBeDisabled();

        expect(getDescription()).toBeDisabled();
        expect(getToggle(container)).toBeDisabled();
    });

    it("should show Submitting... when both loading flags are set", () => {
        renderForm({ loading: true, authLoading: true });

        expect(
            screen.getByRole("button", { name: "Submitting..." })
        ).toBeInTheDocument();
    });


    // =====================================================
    // 5. SUBMISSION TESTS
    // =====================================================

    it("should call onSubmit with the selected area and description", async () => {
        const user = userEvent.setup();

        const { container, props } = renderForm();

        await fillForm(user, container, "Area Three", "Need help with hiring.");

        await user.click(getSubmitButton());

        expect(props.onSubmit).toHaveBeenCalledTimes(1);

        expect(props.onSubmit).toHaveBeenCalledWith({
            support_area: "Area Three",
            description: "Need help with hiring."
        });
    });

    it("should clear the form after a successful submission", async () => {
        const user = userEvent.setup();

        const { container } = renderForm();

        await fillForm(user, container);

        await user.click(getSubmitButton());

        // The form is cleared once onSubmit resolves with true.
        await waitFor(() => {
            expect(getDescription()).toHaveValue("");
        });

        expect(getToggle(container)).toHaveTextContent(PLACEHOLDER_TEXT);

        expect(
            screen.getByText("0/1000")
        ).toBeInTheDocument();
    });

    it("should keep the form data when the submission fails", async () => {
        const user = userEvent.setup();

        const { container, props } = renderForm({
            onSubmit: vi.fn().mockResolvedValue(false)
        });

        await fillForm(user, container, "Area Two", "Need help.");

        await user.click(getSubmitButton());

        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(getDescription()).toHaveValue("Need help.");
        expect(getToggle(container)).toHaveTextContent("Area Two");
    });


    // =====================================================
    // 6. ERROR AND SUCCESS MESSAGE TESTS
    // =====================================================

    it("should display the error message", () => {
        renderForm({
            error: "Please complete all required fields."
        });

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent("Please complete all required fields.");
    });

    it("should display the success message", () => {
        renderForm({
            success: "Your business advisory request has been submitted successfully."
        });

        expect(
            screen.getByRole("status")
        ).toHaveTextContent(
            "Your business advisory request has been submitted successfully."
        );
    });

    it("should call onViewRequests when View my requests is clicked", async () => {
        const user = userEvent.setup();

        const { props } = renderForm({
            success: "Submitted."
        });

        await user.click(
            screen.getByRole("button", {
                name: "View my requests"
            })
        );

        expect(props.onViewRequests).toHaveBeenCalledTimes(1);
    });

    it("should not display the View my requests button without a success message", () => {
        renderForm();

        expect(
            screen.queryByRole("button", {
                name: "View my requests"
            })
        ).not.toBeInTheDocument();
    });

});