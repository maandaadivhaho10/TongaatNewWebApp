import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ContactInfo from "../ContactInfo";

vi.mock("../contactService", () => ({
  CONTACT: {
    email: "support@example.org",
    phone: "0123456789",
    hours: "Monday – Friday, 08:00 – 17:00",
  },
}));

afterEach(cleanup);

describe("ContactInfo", () => {
  it("renders the email as a mailto link", () => {
    render(<ContactInfo />);
    const link = screen.getByRole("link", { name: "support@example.org" });
    expect(link).toHaveAttribute("href", "mailto:support@example.org");
  });

  it("renders the phone number as a tel link", () => {
    render(<ContactInfo />);
    const link = screen.getByRole("link", { name: "0123456789" });
    expect(link).toHaveAttribute("href", "tel:0123456789");
  });

  it("renders support hours as plain text, not a link", () => {
    render(<ContactInfo />);
    const hours = screen.getByText("Monday – Friday, 08:00 – 17:00");
    expect(hours).toBeInTheDocument();
    expect(hours.tagName).toBe("P");
    expect(screen.queryByRole("link", { name: /monday/i })).not.toBeInTheDocument();
  });

  it("renders the card titles", () => {
    render(<ContactInfo />);
    expect(screen.getByRole("heading", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Support Hours" })).toBeInTheDocument();
  });

  it("lists all help topics", () => {
    render(<ContactInfo />);
    expect(screen.getByRole("heading", { name: "What can we help you with?" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByText(/CIPC \/ CoReg documents/)).toBeInTheDocument();
    expect(screen.getByText(/Technical portal support/)).toBeInTheDocument();
  });
});