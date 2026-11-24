import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import FAQScreen from "../FAQScreen";

afterEach(cleanup);

const QUESTIONS = [
  "What is the SMME Portal?",
  "How do I complete my company registration?",
  "What documents do I need to upload?",
  "How do I apply for an RFQ?",
  "How do I apply for a tender?",
  "Where can I find funding opportunities?",
  "How do I request business advisory support?",
  "Where can I see meetings and workshops?",
  "Can I update my company information?",
  "What should I do if I need help using the portal?",
];

// [question, unique snippet from its answer]
const QA_PAIRS = [
  [QUESTIONS[0], /provides registered businesses with access to company registration/i],
  [QUESTIONS[1], /Open the Company Registration section and complete all required steps/i],
  [QUESTIONS[2], /Tax Compliance PIN, and B-BBEE certificate or affidavit/i],
  [QUESTIONS[3], /select the RFQ you are interested in/i],
  [QUESTIONS[4], /select the relevant tender, review the requirements and closing date/i],
  [QUESTIONS[5], /found under the Funding Opportunities section of the portal/i],
  [QUESTIONS[6], /Open Request Business Advisory from the portal menu/i],
  [QUESTIONS[7], /Open Meetings & Workshops from the portal menu/i],
  [QUESTIONS[8], /return to the Company Registration section to review and update/i],
  [QUESTIONS[9], /open the Contact Us section and send your enquiry to the support team/i],
];

const questionButton = (question) => screen.getByRole("button", { name: question });

describe("FAQScreen", () => {
  describe("layout", () => {
    it("renders the page header and description", () => {
      render(<FAQScreen />);
      expect(
        screen.getByRole("heading", { level: 1, name: "Frequently Asked Questions" })
      ).toBeInTheDocument();
      expect(screen.getByText(/Find answers to common questions about company/i)).toBeInTheDocument();
    });

    it("renders the card header", () => {
      render(<FAQScreen />);
      expect(screen.getByRole("heading", { level: 2, name: "How can we help?" })).toBeInTheDocument();
      expect(screen.getByText("Select a question below to view the answer.")).toBeInTheDocument();
    });

    it("renders all 10 questions as buttons", () => {
      render(<FAQScreen />);
      expect(screen.getAllByRole("button")).toHaveLength(10);
      QUESTIONS.forEach((q) => expect(questionButton(q)).toBeInTheDocument());
    });

    it("renders the questions in order", () => {
      render(<FAQScreen />);
      const labels = screen.getAllByRole("button").map((b) => b.textContent);
      expect(labels).toEqual(QUESTIONS);
    });

    it("shows the bottom help text pointing to Contact Us", () => {
      render(<FAQScreen />);
      expect(screen.getByText(/Can't find the answer you're looking for\?/i)).toBeInTheDocument();
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });
  });

  describe("initial state", () => {
    it("has every question collapsed", () => {
      render(<FAQScreen />);
      screen.getAllByRole("button").forEach((button) => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("does not render any answer", () => {
      render(<FAQScreen />);
      QA_PAIRS.forEach(([, answer]) => {
        expect(screen.queryByText(answer)).not.toBeInTheDocument();
      });
    });
  });

  describe("expanding and collapsing", () => {
    it.each(QA_PAIRS)("opens the correct answer for: %s", async (question, answer) => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);

      await user.click(questionButton(question));

      expect(questionButton(question)).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText(answer)).toBeInTheDocument();
    });

    it("collapses an open question when clicked again", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [question, answer] = QA_PAIRS[0];

      await user.click(questionButton(question));
      expect(screen.getByText(answer)).toBeInTheDocument();

      await user.click(questionButton(question));
      expect(screen.queryByText(answer)).not.toBeInTheDocument();
      expect(questionButton(question)).toHaveAttribute("aria-expanded", "false");
    });

    it("only keeps one question open at a time", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [firstQuestion, firstAnswer] = QA_PAIRS[0];
      const [secondQuestion, secondAnswer] = QA_PAIRS[1];

      await user.click(questionButton(firstQuestion));
      await user.click(questionButton(secondQuestion));

      expect(screen.queryByText(firstAnswer)).not.toBeInTheDocument();
      expect(screen.getByText(secondAnswer)).toBeInTheDocument();
      expect(questionButton(firstQuestion)).toHaveAttribute("aria-expanded", "false");
      expect(questionButton(secondQuestion)).toHaveAttribute("aria-expanded", "true");
    });

    it("has at most one expanded button after several clicks", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);

      await user.click(questionButton(QUESTIONS[2]));
      await user.click(questionButton(QUESTIONS[5]));
      await user.click(questionButton(QUESTIONS[9]));

      const expanded = screen
        .getAllByRole("button")
        .filter((b) => b.getAttribute("aria-expanded") === "true");
      expect(expanded).toHaveLength(1);
      expect(expanded[0]).toHaveTextContent(QUESTIONS[9]);
    });

    it("can reopen a question after closing it", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [question, answer] = QA_PAIRS[3];

      await user.click(questionButton(question));
      await user.click(questionButton(question));
      await user.click(questionButton(question));

      expect(screen.getByText(answer)).toBeInTheDocument();
    });

    it("renders the answer inside the same item as its question", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [question, answer] = QA_PAIRS[4];

      await user.click(questionButton(question));

      const item = questionButton(question).parentElement;
      expect(within(item).getByText(answer)).toBeInTheDocument();
    });
  });

  describe("keyboard and styling", () => {
    it("toggles with the Enter key", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [question, answer] = QA_PAIRS[0];

      questionButton(question).focus();
      await user.keyboard("{Enter}");
      expect(screen.getByText(answer)).toBeInTheDocument();

      await user.keyboard("{Enter}");
      expect(screen.queryByText(answer)).not.toBeInTheDocument();
    });

    it("toggles with the Space key", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const [question, answer] = QA_PAIRS[0];

      questionButton(question).focus();
      await user.keyboard(" ");

      expect(screen.getByText(answer)).toBeInTheDocument();
    });

    it("highlights the open question in navy", async () => {
      const user = userEvent.setup({ delay: null });
      render(<FAQScreen />);
      const label = screen.getByText(QUESTIONS[0]);

      expect(label).toHaveStyle({ color: "rgb(38, 38, 38)" });

      await user.click(questionButton(QUESTIONS[0]));
      expect(label).toHaveStyle({ color: "rgb(32, 30, 100)" });
    });
  });
});