import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import ContactUsScreen from "../ContactUsScreen";
import { submitContactMessage } from "../contactService";

vi.mock("../contactService", () => ({
  CONTACT: { email: "support@example.org", phone: "0123456789", hours: "Mon – Fri" },
  INITIAL_FORM: { name: "", email: "", subject: "", message: "" },
  submitContactMessage: vi.fn(),
}));

async function fillForm(user) {
  await user.type(screen.getByLabelText(/^Name/), "Jane Doe");
  await user.type(screen.getByLabelText(/Email Address/), "jane@example.com");
  await user.type(screen.getByLabelText(/^Subject/), "Tax PIN help");
  await user.type(screen.getByLabelText(/^Message/), "I need help please");
}

const submitButton = () => screen.getByRole("button", { name: /send message|sending message/i });

afterEach(cleanup);

describe("ContactUsScreen", () => {
  let consoleSpy;

  beforeEach(() => {
    submitContactMessage.mockReset();
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("renders the page header, info panel and form", () => {
    render(<ContactUsScreen />);
    expect(screen.getByRole("heading", { level: 1, name: "Contact Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Support Hours" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Send Us a Message" })).toBeInTheDocument();
  });

  it("updates field values as the user types", async () => {
    const user = userEvent.setup();
    render(<ContactUsScreen />);
    await user.type(screen.getByLabelText(/^Name/), "Jane");
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Jane");
  });

  it("updates the character counter as the user types", async () => {
    const user = userEvent.setup();
    render(<ContactUsScreen />);
    await user.type(screen.getByLabelText(/^Message/), "Hello");
    expect(screen.getByText("5/1000")).toBeInTheDocument();
  });

  it("submits the form data, shows success and resets the form", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockResolvedValue("Sent!");
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    expect(submitContactMessage).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Tax PIN help",
      message: "I need help please",
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Sent!");
    expect(screen.getByLabelText(/^Name/)).toHaveValue("");
    expect(screen.getByLabelText(/Email Address/)).toHaveValue("");
    expect(screen.getByLabelText(/^Subject/)).toHaveValue("");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a loading state while submitting and blocks double submits", async () => {
    const user = userEvent.setup();
    let resolve;
    submitContactMessage.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    const button = await screen.findByRole("button", { name: /sending message/i });
    expect(button).toBeDisabled();
    expect(screen.getByLabelText(/^Name/)).toBeDisabled();

    await user.click(button);
    expect(submitContactMessage).toHaveBeenCalledTimes(1);

    resolve("Done");
    expect(await screen.findByRole("status")).toHaveTextContent("Done");
    expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled();
  });

  it("shows the API error message from the response", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockRejectedValue({
      response: { data: { message: "Server says no" } },
      message: "Request failed",
    });
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("Server says no");
    // form data is preserved so the user can retry
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Jane Doe");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("falls back to err.message when there is no response payload", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockRejectedValue(new Error("Please enter a valid email address."));
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please enter a valid email address."
    );
  });

  it("falls back to a generic message when the error has no message", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockRejectedValue({});
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(/check your connection/i);
  });

  it("logs submission errors to the console", async () => {
    const user = userEvent.setup();
    const err = new Error("boom");
    submitContactMessage.mockRejectedValue(err);
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());

    await screen.findByRole("alert");
    expect(consoleSpy).toHaveBeenCalledWith("Contact submission error:", err);
  });

  it("clears the error when the user edits a field", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockRejectedValue(new Error("Failed"));
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Name/), "x");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears the success message when the user edits a field", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockResolvedValue("Sent!");
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());
    expect(await screen.findByRole("status")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Name/), "J");
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it("allows submitting again after a failure", async () => {
    const user = userEvent.setup();
    submitContactMessage.mockRejectedValueOnce(new Error("Failed")).mockResolvedValueOnce("Sent!");
    render(<ContactUsScreen />);

    await fillForm(user);
    await user.click(submitButton());
    await screen.findByRole("alert");

    await user.click(submitButton());
    expect(await screen.findByRole("status")).toHaveTextContent("Sent!");
    expect(submitContactMessage).toHaveBeenCalledTimes(2);
  });
});