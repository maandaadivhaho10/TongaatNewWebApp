
import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const NAVY = "#201E64";

const API_URL =
  "http://localhost:5000/api/landing/opportunities/latest";

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  });
}

// ======================================================
// DAYS UNTIL CLOSING
// ======================================================

function daysUntil(date) {
  if (!date) return null;

  const closingDate = new Date(date);

  if (Number.isNaN(closingDate.getTime())) {
    return null;
  }

  return Math.ceil(
    (closingDate.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
}

// ======================================================
// OPPORTUNITY CARD
// ======================================================

function OpportunityCard({ item }) {
  const daysLeft = daysUntil(item.closing_date);

  const closingSoon =
    daysLeft !== null &&
    daysLeft >= 0 &&
    daysLeft <= 14;

  return (
    <article
      className="
        flex flex-col
        bg-white
        rounded-none
        border border-neutral-200
        shadow-sm
        p-6
        hover:shadow-md
        transition-shadow duration-200
        h-full
      "
    >
      {/* TYPE AND CLOSING STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">

        <span
          className="
            inline-flex items-center
            px-3 py-1
            text-xs font-bold uppercase
            bg-[#201E64]/10
            text-[#201E64]
          "
        >
          {item.type}
        </span>

        {closingSoon && (
          <span
            className="
              text-xs font-semibold
              px-2.5 py-1
              bg-amber-100
              text-amber-800
            "
          >
            {daysLeft === 0
              ? "Closes today"
              : `Closes in ${daysLeft} ${
                  daysLeft === 1 ? "day" : "days"
                }`}
          </span>
        )}

      </div>

      {/* TITLE */}
      <h3
        className="text-lg font-bold leading-snug break-words"
        style={{ color: NAVY }}
      >
        {item.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="mt-3 text-sm text-neutral-600 leading-relaxed line-clamp-4">
        {item.description || "No description available."}
      </p>

      {/* LOCATION AND CLOSING DATE */}
      <dl className="mt-auto pt-6 space-y-2 text-sm">

        <div className="flex flex-wrap gap-2">
          <dt className="text-neutral-500">
            Location:
          </dt>

          <dd className="text-neutral-800 font-medium">
            {item.location || "Not specified"}
          </dd>
        </div>

        <div className="flex flex-wrap gap-2">
          <dt className="text-neutral-500">
            Closes:
          </dt>

          <dd className="text-neutral-800 font-medium">
            {formatDate(item.closing_date)}
          </dd>
        </div>

      </dl>
    </article>
  );
}

// ======================================================
// MAIN OPPORTUNITIES COMPONENT
// ======================================================

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // ====================================================
  // FETCH LATEST OPPORTUNITIES
  // ====================================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch opportunities: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success === false) {
          throw new Error(
            data.message || "Failed to retrieve opportunities"
          );
        }

        // Latest 3 tenders
        const tenders = (data.tenders || [])
          .slice(0, 3)
          .map((tender, index) => ({
            ...tender,
            id: `tender-${index}`,
            type: "Tender",
          }));

        // Latest 3 RFQs
        const rfqs = (data.rfqs || [])
          .slice(0, 3)
          .map((rfq, index) => ({
            ...rfq,
            id: `rfq-${index}`,
            type: "RFQ",
          }));

        // Combine tenders and RFQs
        const combined = [...tenders, ...rfqs];

        if (!controller.signal.aborted) {
          setOpportunities(combined);
        }

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Error fetching opportunities:",
            err
          );

          setError(
            "Unable to load business opportunities. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOpportunities();

    return () => controller.abort();
  }, [refreshKey]);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <section
      id="opportunities"
      className="py-16 lg:py-20 bg-[#F5F6FA] text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <div className="max-w-2xl">

          <h2
            className="
              text-3xl sm:text-4xl
              font-extrabold tracking-tight
            "
            style={{ color: NAVY }}
          >
            Business Opportunities
          </h2>

          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Explore the latest tenders and requests for
            quotations available to registered suppliers.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div
            className="
              mt-10 grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  bg-white border border-neutral-200
                  p-6 animate-pulse
                  min-h-[250px]
                "
              >
                <div className="h-5 bg-neutral-200 w-20 mb-5" />
                <div className="h-6 bg-neutral-200 w-3/4 mb-4" />
                <div className="h-4 bg-neutral-200 w-full mb-2" />
                <div className="h-4 bg-neutral-200 w-5/6 mb-2" />
                <div className="h-4 bg-neutral-200 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            className="
              mt-10 bg-white
              border border-neutral-200
              p-8 text-center
            "
          >
            <p className="text-neutral-700">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="
                mt-5 inline-flex
                items-center gap-2
                px-5 py-3
                bg-[#201E64]
                text-white
                font-semibold text-sm
                hover:opacity-90
                transition
              "
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* OPPORTUNITIES */}
        {!loading && !error && opportunities.length > 0 && (
          <div
            className="
              mt-10 grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {opportunities.map((item) => (
              <OpportunityCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && opportunities.length === 0 && (
          <div
            className="
              mt-10 bg-white
              border border-neutral-200
              p-10 text-center
            "
          >
            <p className="font-semibold text-neutral-900">
              There are no opportunities open right now.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Check back soon for new tenders and RFQs.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
