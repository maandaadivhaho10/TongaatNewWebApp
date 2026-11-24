import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import FundingApplicationCard from "../FundingApplicationCard";

const baseItem = {
  funding_response_id: 10,
  funding_id: 1,
  title: "Youth Grant",
  institution_funder: "NYDA",
  description: "Short description.",
  status: "SUBMITTED",
  funding_status: "OPEN",
  response_date: "2024-04-01T08:00:00Z",
};

describe("FundingApplicationCard", () => {
  it("renders application details", () => {
    render(<FundingApplicationCard item={baseItem} />);
    expect(screen.getByRole("heading", { name: "Youth Grant" })).toBeInTheDocument();
    expect(screen.getByText("NYDA")).toBeInTheDocument();
    expect(screen.getByText("Short description.")).toBeInTheDocument();
    expect(screen.getByText("SUBMITTED")).toBeInTheDocument();
    expect(screen.getByText("OPEN")).toBeInTheDocument();
    expect(screen.getByText(/^Applied/)).toHaveTextContent(/2024/);
  });

  it("falls back to created_at when response_date is missing", () => {
    render(
      <FundingApplicationCard
        item={{ ...baseItem, response_date: undefined, created_at: "2023-01-05T00:00:00Z" }}
      />
    );
    expect(screen.getByText(/^Applied/)).toHaveTextContent(/2023/);
  });

  it("shows 'Not available' fallbacks", () => {
    render(<FundingApplicationCard item={{ funding_id: 2 }} />);
    expect(screen.getAllByText("Not available").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
  });

  it("toggles long descriptions", async () => {
    const user = userEvent.setup();
    const longText = "b".repeat(250);
    render(<FundingApplicationCard item={{ ...baseItem, description: longText }} />);

    const desc = screen.getByText(longText);
    expect(desc).toHaveClass("line-clamp-3");

    await user.click(screen.getByRole("button", { name: /see more/i }));
    expect(desc).not.toHaveClass("line-clamp-3");

    await user.click(screen.getByRole("button", { name: /see less/i }));
    expect(desc).toHaveClass("line-clamp-3");
  });

  it("does not render a toggle for short descriptions", () => {
    render(<FundingApplicationCard item={baseItem} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});