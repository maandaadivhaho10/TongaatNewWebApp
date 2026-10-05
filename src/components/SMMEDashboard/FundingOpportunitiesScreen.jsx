import React from "react";

const NAVY = "#201E64";

export default function FundingOpportunitiesScreen() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-neutral-200 shadow-sm p-10 sm:p-14 text-center">

        <p
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: NAVY }}
        >
          SMME Portal
        </p>

        <h1
          className="mt-3 text-3xl sm:text-4xl font-extrabold"
          style={{ color: NAVY }}
        >
          Funding Opportunities
        </h1>

        <span className="inline-block mt-8 px-5 py-2 bg-[#201E64]/10 text-[#201E64] text-sm font-bold">
          Coming Soon
        </span>

        <p className="mt-5 text-neutral-500">
          Funding opportunities will be available here.
        </p>

      </div>
    </div>
  );
}