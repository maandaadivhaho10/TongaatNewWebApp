import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import EventCard from "../EventCard";

// Builds the expected date text the same way the component does.
// This keeps the tests independent of the Node / ICU version, because the
// exact "en-ZA" output (for example "Sep" vs "Sept") can differ.
function expectedDate(isoDate) {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Reusable function to build an event.
function buildEvent(overrides = {}) {
    return {
        activity_id: 1,
        name: "Supplier Workshop",
        description: "Training for local suppliers.",
        activity_date: "2026-03-15",
        status: "SCHEDULED",
        ...overrides
    };
}

// Reusable function to render the component.
function renderEventCard(overrides = {}) {
    return render(
        <EventCard event={buildEvent(overrides)} />
    );
}

describe("EventCard Component", () => {

    // =====================================================
    // 1. RENDERING TESTS
    // =====================================================

    it("should render the event as an article", () => {
        renderEventCard();

        expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("should display the event name as a heading", () => {
        renderEventCard();

        expect(
            screen.getByRole("heading", {
                level: 3,
                name: "Supplier Workshop"
            })
        ).toBeInTheDocument();
    });

    it("should display the ESD Activity label", () => {
        renderEventCard();

        expect(
            screen.getByText("ESD Activity")
        ).toBeInTheDocument();
    });

    it("should display the event description", () => {
        renderEventCard();

        expect(
            screen.getByText("Training for local suppliers.")
        ).toBeInTheDocument();
    });


    // =====================================================
    // 2. DATE FORMATTING TESTS
    // =====================================================

    it("should display the formatted event date", () => {
        renderEventCard({ activity_date: "2026-03-15" });

        expect(
            screen.getByText(expectedDate("2026-03-15"))
        ).toBeInTheDocument();
    });

    it("should include the day and year in the formatted date", () => {
        renderEventCard({ activity_date: "2026-03-15" });

        const text = screen.getByText(expectedDate("2026-03-15")).textContent;

        expect(text).toMatch(/15/);
        expect(text).toMatch(/2026/);
    });

    it("should only use the date part of an ISO date-time string", () => {
        renderEventCard({
            activity_date: "2026-03-15T22:30:00.000Z"
        });

        // Without slicing, the time zone could shift the displayed day.
        expect(
            screen.getByText(expectedDate("2026-03-15"))
        ).toBeInTheDocument();
    });

    it.each([
        ["missing", undefined],
        ["null", null],
        ["empty", ""],
        ["invalid", "not-a-date"]
    ])(
        "should display Not specified when the date is %s",
        (_label, value) => {
            renderEventCard({ activity_date: value });

            expect(
                screen.getByText("Not specified")
            ).toBeInTheDocument();
        }
    );


    // =====================================================
    // 3. STATUS TESTS
    // =====================================================

    it("should display the event status", () => {
        renderEventCard({ status: "COMPLETED" });

        expect(
            screen.getByText("COMPLETED")
        ).toBeInTheDocument();
    });

    it("should default the status to SCHEDULED when it is missing", () => {
        renderEventCard({ status: undefined });

        expect(
            screen.getByText("SCHEDULED")
        ).toBeInTheDocument();
    });

    it("should default the status to SCHEDULED when it is empty", () => {
        renderEventCard({ status: "" });

        expect(
            screen.getByText("SCHEDULED")
        ).toBeInTheDocument();
    });

    it("should convert the status to uppercase", () => {
        renderEventCard({ status: "cancelled" });

        expect(
            screen.getByText("CANCELLED")
        ).toBeInTheDocument();
    });

    it.each([
        ["SCHEDULED", "text-blue-700"],
        ["COMPLETED", "text-green-700"],
        ["CANCELLED", "text-red-700"],
        ["POSTPONED", "text-neutral-600"]
    ])(
        "should style the %s status badge with %s",
        (status, expectedClass) => {
            renderEventCard({ status });

            expect(
                screen.getByText(status).className
            ).toContain(expectedClass);
        }
    );

    it("should style a lowercase status the same as its uppercase version", () => {
        renderEventCard({ status: "completed" });

        expect(
            screen.getByText("COMPLETED").className
        ).toContain("text-green-700");
    });


    // =====================================================
    // 4. DESCRIPTION TESTS
    // =====================================================

    it("should not display See more for a short description", () => {
        renderEventCard({
            description: "Short description."
        });

        expect(
            screen.queryByRole("button", {
                name: "See more"
            })
        ).not.toBeInTheDocument();
    });

    it("should not display See more for a description of exactly 130 characters", () => {
        renderEventCard({
            description: "a".repeat(130)
        });

        expect(
            screen.queryByRole("button", {
                name: "See more"
            })
        ).not.toBeInTheDocument();
    });

    it("should display See more for a description longer than 130 characters", () => {
        renderEventCard({
            description: "a".repeat(131)
        });

        expect(
            screen.getByRole("button", {
                name: "See more"
            })
        ).toBeInTheDocument();
    });

    it("should clamp a long description to three lines by default", () => {
        const description = "a".repeat(200);

        renderEventCard({ description });

        expect(
            screen.getByText(description).className
        ).toContain("line-clamp-3");
    });

    it("should expand the description when See more is clicked", async () => {
        const user = userEvent.setup();

        const description = "a".repeat(200);

        renderEventCard({ description });

        await user.click(
            screen.getByRole("button", {
                name: "See more"
            })
        );

        expect(
            screen.getByText(description).className
        ).not.toContain("line-clamp-3");

        expect(
            screen.getByRole("button", {
                name: "See less"
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "See more"
            })
        ).not.toBeInTheDocument();
    });

    it("should collapse the description again when See less is clicked", async () => {
        const user = userEvent.setup();

        const description = "a".repeat(200);

        renderEventCard({ description });

        await user.click(
            screen.getByRole("button", {
                name: "See more"
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "See less"
            })
        );

        expect(
            screen.getByText(description).className
        ).toContain("line-clamp-3");

        expect(
            screen.getByRole("button", {
                name: "See more"
            })
        ).toBeInTheDocument();
    });

    it.each([
        ["missing", undefined],
        ["null", null],
        ["empty", ""]
    ])(
        "should render without a See more button when the description is %s",
        (_label, value) => {
            renderEventCard({ description: value });

            expect(
                screen.getByRole("heading", {
                    name: "Supplier Workshop"
                })
            ).toBeInTheDocument();

            expect(
                screen.queryByRole("button")
            ).not.toBeInTheDocument();
        }
    );

    it("should keep each card's expanded state independent", async () => {
        const user = userEvent.setup();

        render(
            <>
                <EventCard
                    event={buildEvent({
                        activity_id: 1,
                        name: "First",
                        description: "a".repeat(200)
                    })}
                />
                <EventCard
                    event={buildEvent({
                        activity_id: 2,
                        name: "Second",
                        description: "b".repeat(200)
                    })}
                />
            </>
        );

        const [firstButton] = screen.getAllByRole("button", {
            name: "See more"
        });

        await user.click(firstButton);

        // Only the first card is expanded.
        expect(
            screen.getAllByRole("button", { name: "See more" })
        ).toHaveLength(1);

        expect(
            screen.getAllByRole("button", { name: "See less" })
        ).toHaveLength(1);
    });

});