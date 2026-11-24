import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../../API/axiosInstance", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("../fundingService", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFundingOpportunities: vi.fn(),
    getMyFundingApplications: vi.fn(),
    submitFundingApplication: vi.fn(),
  };
});

import {
  getFundingOpportunities,
  getMyFundingApplications,
  submitFundingApplication,
} from "../fundingService";
import FundingOpportunitiesScreen from "../FundingOpportunitiesScreen";

const ok = (data) => ({ data: { success: true, data } });

const alpha = {
  funding_id: 1,
  title: "Alpha Grant",
  institution_funder: "Funder One",
  description: "Supports startups.",
  status: "OPEN",
  created_at: "2024-01-10T00:00:00Z",
};
const beta = {
  funding_id: 2,
  title: "Beta Loan",
  institution_funder: "Funder Two",
  description: "Low interest loan.",
  status: "OPEN",
  created_at: "2024-02-10T00:00:00Z",
};
const closed = {
  funding_id: 3,
  title: "Gamma Fund",
  institution_funder: "Funder Three",
  description: "Closed programme.",
  status: "CLOSED",
  created_at: "2024-03-10T00:00:00Z",
};

const alphaApplication = {
  funding_response_id: 100,
  funding_id: 1,
  title: "Alpha Grant",
  institution_funder: "Funder One",
  description: "Supports startups.",
  status: "SUBMITTED",
  funding_status: "OPEN",
  response_date: "2024-04-01T00:00:00Z",
};

const renderScreen = () => render(<FundingOpportunitiesScreen />);
const getTab = (name) => screen.getByRole("tab", { name });

beforeEach(() => {
  vi.clearAllMocks();
  getFundingOpportunities.mockResolvedValue(ok([alpha, beta, closed]));
  getMyFundingApplications.mockResolvedValue(ok([]));
});

describe("loading and rendering", () => {
  it("shows a loading state, then the opportunities", async () => {
    renderScreen();
    expect(screen.getByText(/loading funding information/i)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta Loan" })).toBeInTheDocument();
    expect(screen.getByText("3 opportunities shown")).toBeInTheDocument();
    expect(getFundingOpportunities).toHaveBeenCalledTimes(1);
    expect(getMyFundingApplications).toHaveBeenCalledTimes(1);
  });

  it("shows the applications count on the tab badge", async () => {
    getMyFundingApplications.mockResolvedValue(ok([alphaApplication]));
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });
    expect(getTab(/my applications/i)).toHaveTextContent("1");
  });

  it("shows the empty state when there are no opportunities", async () => {
    getFundingOpportunities.mockResolvedValue(ok([]));
    renderScreen();
    expect(await screen.findByText("No funding opportunities found")).toBeInTheDocument();
  });
});

describe("load errors", () => {
  it("shows an error and disables Apply when opportunities fail to load", async () => {
    getFundingOpportunities.mockRejectedValue(new Error("boom"));
    getMyFundingApplications.mockResolvedValue(ok([]));
    renderScreen();
    expect(await screen.findByRole("alert")).toHaveTextContent("boom");
  });

  it("shows an error for an unexpected payload", async () => {
    getFundingOpportunities.mockResolvedValue({ data: { success: false, message: "Bad payload" } });
    renderScreen();
    expect(await screen.findByRole("alert")).toHaveTextContent("Bad payload");
  });

  it("shows an error when applications fail to load", async () => {
    getMyFundingApplications.mockRejectedValue({ response: { data: { message: "Apps down" } } });
    renderScreen();
    expect(await screen.findByRole("alert")).toHaveTextContent("Apps down");
    // Apply buttons are disabled while there is a load error
    await screen.findByRole("heading", { name: "Alpha Grant" });
    screen.getAllByRole("button", { name: "Apply for Funding" }).forEach((b) => expect(b).toBeDisabled());
  });

  it("retries loading and clears the error on success", async () => {
    const user = userEvent.setup();
    getFundingOpportunities.mockRejectedValueOnce(new Error("boom"));
    renderScreen();
    await screen.findByRole("alert");

    await user.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(await screen.findByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
    expect(getFundingOpportunities).toHaveBeenCalledTimes(2);
  });

  it("refreshes via the Refresh button", async () => {
    const user = userEvent.setup();
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });
    await user.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(getFundingOpportunities).toHaveBeenCalledTimes(2));
  });
});

describe("search and tabs", () => {
  it("filters opportunities by title, funder or description", async () => {
    const user = userEvent.setup();
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });
    const input = screen.getByLabelText("Search funding");

    await user.type(input, "beta");
    expect(screen.queryByRole("heading", { name: "Alpha Grant" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta Loan" })).toBeInTheDocument();
    expect(screen.getByText("1 opportunities shown")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "funder three");
    expect(screen.getByRole("heading", { name: "Gamma Fund" })).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "startups");
    expect(screen.getByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
  });

  it("shows an empty state when the search has no matches", async () => {
    const user = userEvent.setup();
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });
    await user.type(screen.getByLabelText("Search funding"), "zzzzz");
    expect(screen.getByText("No funding opportunities found")).toBeInTheDocument();
  });

  it("switches to My Applications, clears search, and can search by status", async () => {
    const user = userEvent.setup();
    getMyFundingApplications.mockResolvedValue(ok([alphaApplication]));
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });

    await user.type(screen.getByLabelText("Search funding"), "beta");
    await user.click(getTab(/my applications/i));

    expect(getTab(/my applications/i)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByLabelText("Search funding")).toHaveValue("");
    expect(screen.getByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
    expect(screen.getByText("1 applications shown")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search funding"), "submitted");
    expect(screen.getByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
  });

  it("shows an empty applications state with a link back to opportunities", async () => {
    const user = userEvent.setup();
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });
    await user.click(getTab(/my applications/i));

    expect(screen.getByText("No applications found")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /browse opportunities/i }));
    expect(getTab(/funding opportunities/i)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
  });
});

describe("apply button states", () => {
  it("disables Apply on closed opportunities and already-applied ones", async () => {
    getMyFundingApplications.mockResolvedValue(ok([alphaApplication]));
    renderScreen();
    await screen.findByRole("heading", { name: "Alpha Grant" });

    expect(screen.getByRole("button", { name: "Already Applied" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Applications Closed" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Apply for Funding" })).toBeEnabled();
  });
});

describe("applying for funding", () => {
  const openModal = async (user) => {
    await screen.findByRole("heading", { name: "Alpha Grant" });
    await user.click(screen.getAllByRole("button", { name: "Apply for Funding" })[0]);
    return screen.getByRole("dialog");
  };

  it("opens the confirmation modal and can cancel it", async () => {
    const user = userEvent.setup();
    renderScreen();
    const dialog = await openModal(user);
    expect(dialog).toHaveTextContent("Alpha Grant");
    expect(dialog).toHaveTextContent("Funder One");

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(submitFundingApplication).not.toHaveBeenCalled();
  });

  it("submits, closes the modal, shows a notice, and switches to My Applications", async () => {
    const user = userEvent.setup();
    let apps = [];
    getMyFundingApplications.mockImplementation(async () => ok(apps));
    submitFundingApplication.mockImplementation(async () => {
      apps = [alphaApplication];
      return { data: { success: true, data: { funding_response_id: 100, status: "SUBMITTED" } } };
    });

    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Your funding application was submitted successfully."
    );
    expect(submitFundingApplication).toHaveBeenCalledWith(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(getTab(/my applications/i)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { name: "Alpha Grant" })).toBeInTheDocument();
    // initial load + post-submit refresh
    await waitFor(() => expect(getMyFundingApplications).toHaveBeenCalledTimes(2));
  });

  it("dismisses the success notice", async () => {
    const user = userEvent.setup();
    submitFundingApplication.mockResolvedValue({ data: { success: true, data: {} } });
    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    await screen.findByRole("status");
    await user.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error in the modal when submission fails", async () => {
    const user = userEvent.setup();
    submitFundingApplication.mockRejectedValue({ response: { status: 500, data: { message: "Server down" } } });
    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    expect(await within(screen.getByRole("dialog")).findByRole("alert")).toHaveTextContent("Server down");
    expect(getTab(/funding opportunities/i)).toHaveAttribute("aria-selected", "true");
  });

  it("shows the API message when success is not true", async () => {
    const user = userEvent.setup();
    submitFundingApplication.mockResolvedValue({ data: { success: false, message: "Nope" } });
    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    expect(await within(screen.getByRole("dialog")).findByRole("alert")).toHaveTextContent("Nope");
  });

  it("handles a 409 conflict by telling the user they already applied", async () => {
    const user = userEvent.setup();
    submitFundingApplication.mockRejectedValue({ response: { status: 409 } });
    getMyFundingApplications.mockResolvedValue(ok([alphaApplication]));
    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You have already applied for this funding opportunity."
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(getTab(/my applications/i)).toHaveAttribute("aria-selected", "true");
  });

  it("disables the modal buttons while the request is in flight", async () => {
    const user = userEvent.setup();
    let resolveSubmit;
    submitFundingApplication.mockReturnValue(new Promise((r) => (resolveSubmit = r)));
    renderScreen();
    const dialog = await openModal(user);
    await user.click(within(dialog).getByRole("button", { name: "Confirm Application" }));

    expect(await within(dialog).findByRole("button", { name: /submitting/i })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(submitFundingApplication).toHaveBeenCalledTimes(1);

    resolveSubmit({ data: { success: true, data: {} } });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});