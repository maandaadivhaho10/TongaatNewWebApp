import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import api from "../../../../API/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import Opportunities from "../BissnessOpportunities";

vi.mock("../../../../API/axiosInstance", () => ({
  __esModule: true,
  default: { get: vi.fn(), post: vi.fn() },
}));
vi.mock("../../../../context/AuthContext", () => ({ useAuth: vi.fn() }));

const rfqs = [{ rfq_id: 1, title: "Laptops RFQ", closing_date: "2099-06-01", description: "d" }];
const tenders = [{ tender_id: 10, title: "Roads Tender", closing_date: "2099-05-01", description: "d" }];

function mockApi({ rfqList = rfqs, tenderList = tenders, rfqApps = [], rfqFail = false } = {}) {
  api.get.mockImplementation((url) => {
    if (url === "/rfq/user") return rfqFail ? Promise.reject({ response: { status: 500, data: { message: "RFQ down" } } }) : Promise.resolve({ data: { rfqs: rfqList } });
    if (url === "/tender") return Promise.resolve({ data: { tenders: tenderList } });
    if (url === "/rfq/my-applications/7") return Promise.resolve({ data: { applications: rfqApps } });
    if (url === "/tenders/my-applications/7") return Promise.reject({ response: { status: 404 } });
    return Promise.reject(new Error("unexpected " + url));
  });
}

const loggedIn = () => useAuth.mockReturnValue({ user: { user_id: 7 }, isAuthenticated: true, loading: false });
const tab = (name) => screen.getByRole("tab", { name });

beforeEach(() => { vi.clearAllMocks(); loggedIn(); mockApi(); });

describe("Opportunities page", () => {
  test("loads and lists RFQs and tenders sorted by closing date", async () => {
    render(<Opportunities />);
    expect(screen.getByText("Loading opportunities...")).toBeInTheDocument();
    await screen.findByText("Laptops RFQ");
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(["Roads Tender", "Laptops RFQ"]);
  });

  test("tab counts", async () => {
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    expect(tab(/^All/)).toHaveTextContent("2");
    expect(tab(/^RFQs/)).toHaveTextContent("1");
    expect(tab(/^Tenders/)).toHaveTextContent("1");
  });

  test("filters by tab", async () => {
    const user = userEvent.setup();
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    await user.click(tab(/^RFQs/));
    expect(screen.getByText("Laptops RFQ")).toBeInTheDocument();
    expect(screen.queryByText("Roads Tender")).not.toBeInTheDocument();
    await user.click(tab(/^Tenders/));
    expect(screen.getByText("Roads Tender")).toBeInTheDocument();
    expect(screen.queryByText("Laptops RFQ")).not.toBeInTheDocument();
  });

  test("shows empty state", async () => {
    mockApi({ rfqList: [], tenderList: [] });
    render(<Opportunities />);
    expect(await screen.findByText("There are no opportunities open right now")).toBeInTheDocument();
  });

  test("one failing endpoint shows error but the other still renders", async () => {
    mockApi({ rfqFail: true });
    render(<Opportunities />);
    expect(await screen.findByText("RFQ down")).toBeInTheDocument();
    expect(screen.getByText("Roads Tender")).toBeInTheDocument();
  });

  test("marks opportunities already applied on the server", async () => {
    mockApi({ rfqApps: [{ rfq_id: 1, rfq_response_id: 3, title: "Laptops RFQ", status: "submitted" }] });
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    await waitFor(() => {
      const card = screen.getByText("Laptops RFQ").closest("article");
      expect(within(card).getByRole("button", { name: "Applied" })).toBeDisabled();
    });
  });

  test("My Applications tab lists applications and shows count", async () => {
    mockApi({ rfqApps: [{ rfq_id: 1, rfq_response_id: 3, title: "Laptops RFQ", status: "approved", proposal: "My plan" }] });
    const user = userEvent.setup();
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    await waitFor(() => expect(tab(/My Applications/)).toHaveTextContent("1"));
    await user.click(tab(/My Applications/));
    expect(await screen.findByText("Your proposal")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  test("My Applications empty state links back to browse", async () => {
    const user = userEvent.setup();
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    await user.click(tab(/My Applications/));
    expect(await screen.findByText("You haven't applied for anything yet")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Browse opportunities" }));
    expect(screen.getByText("Roads Tender")).toBeInTheDocument();
  });

  test("logged-out user is asked to log in and applications are not fetched", async () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, loading: false });
    const user = userEvent.setup();
    render(<Opportunities />);
    await screen.findByText("Laptops RFQ");
    await user.click(tab(/My Applications/));
    expect(screen.getByText("Log in to see your applications")).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalledWith(expect.stringContaining("my-applications"));
  });

  describe("tender apply", () => {
    const tenderApplyButton = () => within(screen.getByText("Roads Tender").closest("article")).getByRole("button", { name: /Appl/ });

    test("does nothing when confirm is cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);
      const user = userEvent.setup();
      render(<Opportunities />);
      await screen.findByText("Roads Tender");
      await user.click(tenderApplyButton());
      expect(api.post).not.toHaveBeenCalled();
    });

    test("posts and flips to Applied", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      api.post.mockResolvedValue({});
      const user = userEvent.setup();
      render(<Opportunities />);
      await screen.findByText("Roads Tender");
      await user.click(tenderApplyButton());
      expect(api.post).toHaveBeenCalledWith("/tender-responses/apply", { tender_id: 10 });
      await waitFor(() => expect(tenderApplyButton()).toHaveTextContent("Applied"));
    });

    test("shows error on failure and keeps Apply available", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      api.post.mockRejectedValue({ response: { status: 500, data: { message: "Already applied" } } });
      const user = userEvent.setup();
      render(<Opportunities />);
      await screen.findByText("Roads Tender");
      await user.click(tenderApplyButton());
      expect(await screen.findByRole("alert")).toHaveTextContent("Already applied");
      expect(tenderApplyButton()).toHaveTextContent("Apply");
    });
  });

  test("RFQ Apply opens modal and View Document opens viewer", async () => {
    const user = userEvent.setup();
    mockApi({ rfqList: [{ ...rfqs[0], image_url: "http://d/rfq.pdf" }] });
    render(<Opportunities />);
    const card = (await screen.findByText("Laptops RFQ")).closest("article");
    await user.click(within(card).getByRole("button", { name: "Apply" }));
    expect(screen.getByText("Apply for RFQ")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Apply for RFQ")).not.toBeInTheDocument();

    await user.click(within(card).getByRole("button", { name: "View Document" }));
    expect(screen.getByTitle("Laptops RFQ document")).toHaveAttribute("src", "http://d/rfq.pdf");
  });
});