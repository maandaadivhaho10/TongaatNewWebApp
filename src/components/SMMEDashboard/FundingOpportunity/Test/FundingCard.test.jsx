import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import FundingCard, { StatusBadge } from "../FundingCard";

const baseItem = {
  funding_id: 1,
  title: "Youth Grant",
  institution_funder: "NYDA",
  description: "Short description.",
  status: "OPEN",
  created_at: "2024-03-15T10:00:00Z",
};

const renderCard = (props = {}) => {
  const onApply = vi.fn();
  render(
    <FundingCard
      item={baseItem}
      applied={false}
      submitting={false}
      hasLoadError={false}
      onApply={onApply}
      {...props}
    />
  );
  return { onApply };
};

describe("StatusBadge", () => {
  it("replaces underscores with spaces", () => {
    render(<StatusBadge status="UNDER_REVIEW" />);
    expect(screen.getByText("UNDER REVIEW")).toBeInTheDocument();
  });

  it("shows UNKNOWN when status is missing", () => {
    render(<StatusBadge />);
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
  });
});

describe("FundingCard", () => {
  it("renders title, funder, description, status and published date", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: "Youth Grant" })).toBeInTheDocument();
    expect(screen.getByText("NYDA")).toBeInTheDocument();
    expect(screen.getByText("Short description.")).toBeInTheDocument();
    expect(screen.getByText("OPEN")).toBeInTheDocument();
    expect(screen.getByText(/Published/)).toHaveTextContent(/2024/);
  });

  it("shows fallbacks for missing fields", () => {
    renderCard({ item: { funding_id: 2, status: "OPEN" } });
    expect(screen.getAllByText("Not available").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("No description provided.")).toBeInTheDocument();
  });

  it("does not show 'See more' for short descriptions", () => {
    renderCard();
    expect(screen.queryByRole("button", { name: /see more/i })).not.toBeInTheDocument();
  });

  it("expands and collapses long descriptions", async () => {
    const user = userEvent.setup();
    const longText = "a".repeat(200);
    renderCard({ item: { ...baseItem, description: longText } });

    const desc = screen.getByText(longText);
    expect(desc).toHaveClass("line-clamp-3");

    const toggle = screen.getByRole("button", { name: /see more/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(desc).not.toHaveClass("line-clamp-3");
    expect(screen.getByRole("button", { name: /see less/i })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /see less/i }));
    expect(desc).toHaveClass("line-clamp-3");
  });

  it("calls onApply with the item when Apply is clicked", async () => {
    const user = userEvent.setup();
    const { onApply } = renderCard();
    await user.click(screen.getByRole("button", { name: "Apply for Funding" }));
    expect(onApply).toHaveBeenCalledWith(baseItem);
  });

  it("is disabled and labelled 'Already Applied' when applied", () => {
    renderCard({ applied: true });
    expect(screen.getByRole("button", { name: "Already Applied" })).toBeDisabled();
  });

  it("is disabled and labelled 'Applications Closed' when not OPEN", () => {
    renderCard({ item: { ...baseItem, status: "CLOSED" } });
    expect(screen.getByRole("button", { name: "Applications Closed" })).toBeDisabled();
  });

  it("is disabled while submitting", () => {
    renderCard({ submitting: true });
    expect(screen.getByRole("button", { name: "Apply for Funding" })).toBeDisabled();
  });

  it("is disabled when there is a load error", () => {
    renderCard({ hasLoadError: true });
    expect(screen.getByRole("button", { name: "Apply for Funding" })).toBeDisabled();
  });

  it("does not call onApply when disabled", async () => {
    const user = userEvent.setup();
    const { onApply } = renderCard({ applied: true });
    await user.click(screen.getByRole("button", { name: "Already Applied" }));
    expect(onApply).not.toHaveBeenCalled();
  });
});