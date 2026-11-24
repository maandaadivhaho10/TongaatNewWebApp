import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OpportunityCard from "../OpportunityCard";
import ApplicationCard from "../ApplicationCard";
import DocumentViewerModal from "../DocumentViewerModal";

afterEach(() => vi.useRealTimers());

const longText = "x".repeat(200);
const base = { id: 1, type: "rfq", title: "Supply Laptops", description: "Short", closing: "2099-01-01", document_url: "http://d/a.pdf" };

describe("OpportunityCard", () => {
  const setup = (props = {}) => {
    const handlers = { onView: vi.fn(), onApplyRfq: vi.fn(), onApplyTender: vi.fn() };
    render(<OpportunityCard item={base} applied={false} applying={false} {...handlers} {...props} />);
    return handlers;
  };

  test("renders basics and fallbacks", () => {
    setup({ item: { ...base, description: "", location: "" } });
    expect(screen.getByText("Supply Laptops")).toBeInTheDocument();
    expect(screen.getByText("RFQ")).toBeInTheDocument();
    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("Not specified")).toBeInTheDocument();
  });

  test("shows closing-soon badge", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-11-11T00:00:00"));
    setup({ item: { ...base, closing: "2026-11-12" } });
    expect(screen.getByText("Closes in 1 day")).toBeInTheDocument();
  });

  test("no badge when closing far away", () => {
    setup();
    expect(screen.queryByText(/Closes in/)).not.toBeInTheDocument();
  });

  test("truncates long description and toggles", () => {
    setup({ item: { ...base, description: longText } });
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
    fireEvent.click(screen.getByText("See more"));
    expect(screen.getByText(longText)).toBeInTheDocument();
    fireEvent.click(screen.getByText("See less"));
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  test("view document is disabled without url, otherwise calls onView", () => {
    const { onView } = setup();
    fireEvent.click(screen.getByRole("button", { name: "View Document" }));
    expect(onView).toHaveBeenCalledWith(base);
  });

  test("view document disabled without url", () => {
    setup({ item: { ...base, document_url: null } });
    expect(screen.getByRole("button", { name: "View Document" })).toBeDisabled();
  });

  test("RFQ apply calls onApplyRfq", () => {
    const { onApplyRfq, onApplyTender } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApplyRfq).toHaveBeenCalledWith(base);
    expect(onApplyTender).not.toHaveBeenCalled();
  });

  test("tender apply calls onApplyTender and shows applying state", () => {
    const tender = { ...base, type: "tender" };
    const { onApplyTender } = setup({ item: tender });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onApplyTender).toHaveBeenCalledWith(tender);
  });

  test("applying and applied states disable the button", () => {
    const { unmount } = render(<OpportunityCard item={{ ...base, type: "tender" }} applying onView={vi.fn()} onApplyTender={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Applying..." })).toBeDisabled();
    unmount();
    render(<OpportunityCard item={base} applied onView={vi.fn()} onApplyRfq={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Applied" })).toBeDisabled();
  });

  test("shows error alert", () => {
    setup({ error: "Failed!" });
    expect(screen.getByRole("alert")).toHaveTextContent("Failed!");
  });
});

describe("ApplicationCard", () => {
  const app = {
    type: "rfq", title: "My RFQ", status: "under_review", proposal: "Short proposal",
    appliedAt: "2026-02-01", quoted_price: 1000, closing: "2026-03-01", location: "Pretoria",
    document_url: "http://d/a.pdf", quotation_link: "https://q/doc.pdf",
  };

  test("renders details, status, quote and quotation link", () => {
    render(<ApplicationCard item={app} onView={vi.fn()} />);
    expect(screen.getByText("Under Review")).toHaveClass("bg-blue-100");
    expect(screen.getByText("Short proposal")).toBeInTheDocument();
    expect(screen.getByText("Quote")).toBeInTheDocument();
    expect(screen.getByText("Pretoria")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My Quotation" })).toHaveAttribute("href", "https://q/doc.pdf");
  });

  test("tender hides quote and quotation link; unknown status gets default style", () => {
    render(<ApplicationCard item={{ ...app, type: "tender", status: "weird", quotation_link: null }} onView={vi.fn()} />);
    expect(screen.queryByText("Quote")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Weird")).toHaveClass("bg-neutral-200");
  });

  test("hides proposal section when empty, toggles when long", () => {
    const { rerender } = render(<ApplicationCard item={{ ...app, proposal: "" }} onView={vi.fn()} />);
    expect(screen.queryByText("Your proposal")).not.toBeInTheDocument();
    rerender(<ApplicationCard item={{ ...app, proposal: longText }} onView={vi.fn()} />);
    fireEvent.click(screen.getByText("See more"));
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test("view document", () => {
    const onView = vi.fn();
    render(<ApplicationCard item={app} onView={onView} />);
    fireEvent.click(screen.getByRole("button", { name: "View Document" }));
    expect(onView).toHaveBeenCalledWith(app);
  });
});

describe("DocumentViewerModal", () => {
  test("renders nothing without opportunity", () => {
    const { container } = render(<DocumentViewerModal opportunity={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("shows iframe and closes", () => {
    const onClose = vi.fn();
    render(<DocumentViewerModal opportunity={base} onClose={onClose} />);
    expect(screen.getByTitle("Supply Laptops document")).toHaveAttribute("src", base.document_url);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("shows fallback without url", () => {
    render(<DocumentViewerModal opportunity={{ ...base, document_url: null }} onClose={vi.fn()} />);
    expect(screen.getByText("Document unavailable.")).toBeInTheDocument();
  });
});