import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import api from "../../../../API/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import RfqApplyModal from "../RfqApplyModal";

vi.mock("../../../../API/axiosInstance", () => ({ __esModule: true, default: { post: vi.fn() } }));
vi.mock("../../../../context/AuthContext", () => ({ useAuth: vi.fn() }));

const opportunity = { id: 5, title: "Office Chairs" };

function setup(auth = { isAuthenticated: true, user: { user_id: 7 } }) {
  useAuth.mockReturnValue(auth);
  const onClose = vi.fn();
  const onApplied = vi.fn();
  const utils = render(<RfqApplyModal opportunity={opportunity} onClose={onClose} onApplied={onApplied} />);
  const fileInput = utils.container.querySelector('input[type="file"]');
  return { onClose, onApplied, fileInput, user: userEvent.setup() };
}

const fill = async ({ user, fileInput }, { proposal = "We can deliver", price = "250", file = true } = {}) => {
  if (proposal) await user.type(screen.getByPlaceholderText("Describe your proposal..."), proposal);
  if (price) await user.type(screen.getByPlaceholderText(/Example: 250000/), price);
  if (file) await user.upload(fileInput, new File(["x"], "quote.pdf", { type: "application/pdf" }));
};

const submit = (ctx) => ctx.user.click(screen.getByRole("button", { name: "Submit Application" }));

beforeEach(() => vi.clearAllMocks());

describe("RfqApplyModal", () => {
  test("shows opportunity title", () => {
    setup();
    expect(screen.getByText("Office Chairs")).toBeInTheDocument();
  });

  test("validates proposal, price and file in order", async () => {
    const ctx = setup();
    await submit(ctx);
    expect(screen.getByText("Please enter your proposal.")).toBeInTheDocument();

    await fill(ctx, { price: "", file: false });
    await submit(ctx);
    expect(screen.getByText("Please enter your quoted price.")).toBeInTheDocument();

    await ctx.user.type(screen.getByPlaceholderText(/Example: 250000/), "100");
    await submit(ctx);
    expect(screen.getByText("Please upload your quotation document.")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  test("rejects non-positive price", async () => {
    const ctx = setup();
    await fill(ctx, { price: "0" });
    await submit(ctx);
    expect(await screen.findByText(/greater than zero/i)).toBeInTheDocument();
  });

  test("requires login", async () => {
    const ctx = setup({ isAuthenticated: false, user: null });
    await fill(ctx);
    await submit(ctx);
    expect(await screen.findByText("Please log in to apply for this RFQ.")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  test("submits FormData and calls onApplied + onClose", async () => {
    api.post.mockResolvedValue({});
    const ctx = setup();
    await fill(ctx);
    expect(screen.getByText("Selected: quote.pdf")).toBeInTheDocument();
    await submit(ctx);

    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe("/rfq/5/apply");
    expect(JSON.parse(body.get("data"))).toEqual({ user_id: 7, proposal: "We can deliver", quoted_price: 250 });
    expect(body.get("quotation_document")).toBeInstanceOf(File);
    expect(ctx.onApplied).toHaveBeenCalledWith(opportunity);
    expect(ctx.onClose).toHaveBeenCalled();
  });

  test("shows API error and stays open", async () => {
    api.post.mockRejectedValue({ response: { status: 500, data: { message: "Server exploded" } } });
    const ctx = setup();
    await fill(ctx);
    await submit(ctx);
    expect(await screen.findByText("Server exploded")).toBeInTheDocument();
    expect(ctx.onApplied).not.toHaveBeenCalled();
    expect(ctx.onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Submit Application" })).toBeEnabled();
  });

  test("cancel closes", async () => {
    const ctx = setup();
    await ctx.user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(ctx.onClose).toHaveBeenCalled();
  });
});