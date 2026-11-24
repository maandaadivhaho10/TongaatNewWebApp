
import React, { useEffect, useState } from "react";

const API_URL = "https://tongaatbackend-testing.up.railway.app/api/funding/latest";

function FundingCard({ item }) {
  return (
    <article className="flex flex-col bg-white rounded-lg border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-shadow">

      {/* Funding title */}
      <h3 className="text-lg font-bold leading-snug text-[#201E64]">
        {item.title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
        {item.description || "No description available."}
      </p>

      {/* Funding information */}
      <dl className="mt-5 space-y-3 text-sm">

        <div className="flex flex-col gap-1">
          <dt className="text-neutral-500 font-medium">
            Institution / Funder
          </dt>
          <dd className="text-neutral-800 font-semibold">
            {item.institution_funder || "Not specified"}
          </dd>
        </div>

        <div className="flex items-center gap-2">
          <dt className="text-neutral-500 font-medium">
            Status:
          </dt>
          <dd>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              item.status?.toUpperCase() === "OPEN"
                ? "bg-green-100 text-green-700"
                : "bg-neutral-100 text-neutral-600"
            }`}>
              {item.status || "Not specified"}
            </span>
          </dd>
        </div>

      </dl>
    </article>
  );
}

export default function FundingOpportunities() {

  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch latest funding opportunities from backend
  useEffect(() => {
    const fetchFunding = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to retrieve funding opportunities.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Unable to load funding opportunities."
          );
        }

        setFunding(result.data || []);

      } catch (err) {
        console.error("Funding API Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, []);

  return (
    <section
      id="funding"
      className="py-16 lg:py-20 bg-white text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#201E64]">
            Funding opportunities
          </h2>

          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Grants and finance available to help registered businesses grow.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-10 text-center py-10">
            <p className="text-neutral-500">
              Loading funding opportunities...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 font-medium">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-[#201E64] underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Funding cards */}
        {!loading && !error && funding.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funding.map((item) => (
              <FundingCard
                key={item.funding_id}
                item={item}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && funding.length === 0 && (
          <div className="mt-10 bg-[#F5F6FA] border border-neutral-200 rounded-lg p-10 text-center">
            <p className="font-semibold text-neutral-900">
              There are no funding opportunities available right now.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Please check back soon for new funding opportunities.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
