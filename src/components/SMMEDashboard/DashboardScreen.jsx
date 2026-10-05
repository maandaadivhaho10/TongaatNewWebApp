import React from "react";
import {
  Building2,
  BriefcaseBusiness,
  FileText,
  MapPin,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// PROFILE DATA
// Replace with API data later
// ======================================================

const PROFILE = {
  businessName: "Maanda Business Solutions",
  completion: 70,

  completedItems: [
    "Company details",
    "Business information",
    "Contact information",
    "CIPC / CoReg document",
  ],

  missingItems: [
    "Tax PIN",
    "B-BBEE Certificate / Affidavit",
  ],
};

// ======================================================
// OPPORTUNITIES
// Replace with RFQ / Tender API data later
// ======================================================

const OPPORTUNITIES = [
  {
    id: 1,
    type: "RFQ",
    title: "Packaging Materials Supply Contract",
    description:
      "Supply corrugated boxes and packaging materials to production sites.",
    location: "KwaZulu-Natal",
    closing: "15 Oct 2026",
  },
  {
    id: 2,
    type: "Tender",
    title: "Road Freight and Logistics Services",
    description:
      "Appointment of transport partners for regional freight and distribution.",
    location: "Gauteng",
    closing: "05 Nov 2026",
  },
  {
    id: 3,
    type: "Tender",
    title: "Small-Scale Grower Support Programme",
    description:
      "Support programme for emerging growers participating in the agricultural value chain.",
    location: "Mpumalanga",
    closing: "20 Nov 2026",
  },
  {
    id: 4,
    type: "RFQ",
    title: "Uniforms and Protective Clothing",
    description:
      "Supply branded uniforms, safety boots and protective clothing.",
    location: "Western Cape",
    closing: "05 Dec 2026",
  },
];

// ======================================================
// HALF CIRCLE PROGRESS
// ======================================================

function ProfileProgress({ percentage }) {
  const radius = 80;
  const circumference = Math.PI * radius;

  const progress =
    circumference -
    (percentage / 100) * circumference;

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg
        viewBox="0 0 200 115"
        className="w-full"
      >
        {/* Background */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Progress */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={NAVY}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          text-center
        "
      >
        <p
          className="text-3xl font-extrabold sm:text-4xl"
          style={{ color: NAVY }}
        >
          {percentage}%
        </p>

        <p className="mt-1 text-xs font-medium text-neutral-500">
          Complete
        </p>
      </div>
    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

export default function DashboardScreen({ onNavigate }) {
  return (
    <div className="w-full">

      {/* ==================================================
          WELCOME
      ================================================== */}

      <div className="mb-7">
        <h1
          className="
            text-2xl
            font-extrabold
            tracking-tight
            sm:text-3xl
          "
          style={{ color: NAVY }}
        >
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-neutral-500 sm:text-base">
          View your company registration progress and current
          business opportunities.
        </p>
      </div>

      {/* ==================================================
          COMPANY REGISTRATION - FULL WIDTH
      ================================================== */}

      <section
        className="
          w-full
          border
          border-neutral-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
          lg:p-8
        "
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              bg-[#201E64]/10
            "
          >
            <Building2
              className="h-5 w-5"
              style={{ color: NAVY }}
            />
          </div>

          <div>
            <h2
              className="text-lg font-bold sm:text-xl"
              style={{ color: NAVY }}
            >
              Company Registration
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Complete your company registration and business
              documents to improve your readiness for ESD
              opportunities.
            </p>
          </div>
        </div>

        {/* Progress Content */}
        <div
          className="
            mt-8
            grid
            grid-cols-1
            items-center
            gap-8
            lg:grid-cols-[320px_1fr]
            lg:gap-12
          "
        >
          {/* LEFT - Progress */}
          <div>
            <ProfileProgress
              percentage={PROFILE.completion}
            />

            <p
              className="
                mx-auto
                mt-5
                max-w-xs
                text-center
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Your company registration is{" "}
              <span className="font-semibold text-neutral-800">
                {PROFILE.completion}% complete.
              </span>
            </p>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            <h3 className="text-base font-bold text-neutral-900">
              Registration Progress
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Review your completed information and finish the
              remaining registration requirements.
            </p>

            {/* Completed + Missing */}
            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >
              {/* Completed */}
              <div
                className="
                  border
                  border-neutral-200
                  p-4
                  sm:p-5
                "
              >
                <p className="text-sm font-bold text-neutral-900">
                  Completed
                </p>

                <div className="mt-4 space-y-3">
                  {PROFILE.completedItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        className="
                          mt-0.5
                          h-4
                          w-4
                          shrink-0
                          text-green-600
                        "
                      />

                      <span className="text-sm text-neutral-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remaining */}
              <div
                className="
                  border
                  border-amber-200
                  bg-amber-50
                  p-4
                  sm:p-5
                "
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="
                      mt-0.5
                      h-5
                      w-5
                      shrink-0
                      text-amber-600
                    "
                  />

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Still required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Complete the following information to finish
                      your company registration.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {PROFILE.missingItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5
                          shrink-0
                          rounded-full
                          bg-amber-600
                        "
                      />

                      <span className="text-sm text-amber-900">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onNavigate?.("profile")}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  sm:w-auto
                "
                style={{ backgroundColor: NAVY }}
              >
                Continue Registration

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          BUSINESS OPPORTUNITIES
      ================================================== */}

      <section className="mt-8">

        {/* Header */}
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  bg-[#201E64]/10
                "
              >
                <BriefcaseBusiness
                  className="h-5 w-5"
                  style={{ color: NAVY }}
                />
              </div>

              <div>
                <h2
                  className="text-xl font-bold sm:text-2xl"
                  style={{ color: NAVY }}
                >
                  Available Business Opportunities
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Latest RFQs and tenders available to your
                  business.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate?.("opportunities")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              hover:underline
            "
            style={{ color: NAVY }}
          >
            View all opportunities

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* ==================================================
            4 OPPORTUNITY CARDS
        ================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {OPPORTUNITIES.slice(0, 4).map(
            (opportunity) => {
              const isTender =
                opportunity.type === "Tender";

              return (
                <article
                  key={`${opportunity.type}-${opportunity.id}`}
                  className="
                    flex
                    min-w-0
                    flex-col
                    border
                    border-neutral-200
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >
                  {/* Type */}
                  <div>
                    <span
                      className="
                        inline-flex
                        px-2.5
                        py-1
                        text-xs
                        font-bold
                        text-white
                      "
                      style={{
                        backgroundColor: isTender
                          ? "#0F766E"
                          : NAVY,
                      }}
                    >
                      {opportunity.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="
                      mt-4
                      text-base
                      font-bold
                      leading-6
                    "
                    style={{ color: NAVY }}
                  >
                    {opportunity.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="
                      mt-2
                      line-clamp-3
                      text-sm
                      leading-6
                      text-neutral-500
                    "
                  >
                    {opportunity.description}
                  </p>

                  {/* Details */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="
                          h-4
                          w-4
                          shrink-0
                          text-neutral-400
                        "
                      />

                      <span className="text-xs text-neutral-600">
                        {opportunity.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays
                        className="
                          h-4
                          w-4
                          shrink-0
                          text-neutral-400
                        "
                      />

                      <span className="text-xs text-neutral-600">
                        Closes {opportunity.closing}
                      </span>
                    </div>
                  </div>

                  {/* View */}
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate?.("opportunities")
                    }
                    className="
                      mt-auto
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border
                      px-4
                      py-2.5
                      pt-2.5
                      text-sm
                      font-semibold
                      transition
                      hover:bg-[#201E64]/5
                    "
                    style={{
                      borderColor: NAVY,
                      color: NAVY,
                      marginTop: "20px",
                    }}
                  >
                    <FileText className="h-4 w-4" />

                    View Opportunity
                  </button>
                </article>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}