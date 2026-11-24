import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import FundingConfirmModal from "../FundingConfirmModal";

const opportunity = { funding_id: 1, title: "Youth Grant", institution_funder: "NYDA" };

const setup = (props = {}) => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  render(
    <FundingConfirmModal
      opportunity={opportunity}
      submitting={false}
      error=""
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    />
  );
  return { onClose, onConfirm };
};

describe("FundingConfirmModal", () => {
  it("renders nothing without an opportunity", () => {
    const { container } = render(
      <FundingConfirmModal opportunity={null} onClose={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an accessible dialog with the opportunity details", () => {
    setup();
    const dialog = screen.getByRole("dialog", { name: "Confirm Funding Application" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("Youth Grant");
    expect(dialog).toHaveTextContent("NYDA");
  });

  it("calls onConfirm when confirming", async () => {
    const user = userEvent.setup();
    const { onConfirm } = setup();
    await user.click(screen.getByRole("button", { name: "Confirm Application" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose via Cancel and the close icon", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Close confirmation" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("closes when the backdrop is pressed", () => {
    const { onClose } = setup();
    fireEvent.mouseDown(screen.getByRole("presentation"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the dialog body is pressed", () => {
    const { onClose } = setup();
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows an error alert", () => {
    setup({ error: "Something failed" });
    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });

  it("does not show an alert when there is no error", () => {
    setup();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  describe("while submitting", () => {
    it("shows progress text and disables all buttons", () => {
      setup({ submitting: true });
      expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Close confirmation" })).toBeDisabled();
    });

    it("ignores backdrop presses", () => {
      const { onClose } = setup({ submitting: true });
      fireEvent.mouseDown(screen.getByRole("presentation"));
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});