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
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-[210px]
      "
    >
      <svg
        viewBox="0 0 200 115"
        className="w-full"
        role="img"
        aria-label={`${percentage}% registration complete`}
      >
        {/* BACKGROUND */}

        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* PROGRESS */}

        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={NAVY}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      {/* PERCENTAGE */}

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
          className="
            text-2xl
            font-extrabold
            sm:text-3xl
          "
          style={{ color: NAVY }}
        >
          {percentage}%
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            font-medium
            text-neutral-500
          "
        >
          Complete
        </p>
      </div>
    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

export default function DashboardScreen({
  onNavigate,
}) {
  return (
    <div className="w-full">

      {/* ==================================================
          WELCOME
      ================================================== */}

      <div className="mb-5">
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

        <p
          className="
            mt-1
            text-sm
            leading-5
            text-neutral-500
          "
        >
          View your company registration progress and
          current business opportunities.
        </p>
      </div>

      {/* ==================================================
          COMPANY REGISTRATION
      ================================================== */}

      <section
        className="
          w-full
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              bg-[#201E64]/10
            "
          >
            <Building2
              className="h-4 w-4"
              style={{ color: NAVY }}
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-base
                font-bold
                sm:text-lg
              "
              style={{ color: NAVY }}
            >
              Company Registration
            </h2>

            <p
              className="
                mt-1
                max-w-2xl
                text-xs
                leading-5
                text-neutral-500
              "
            >
              Complete your company registration and
              business documents to improve your readiness
              for ESD opportunities.
            </p>
          </div>
        </div>

        {/* ==================================================
            PROGRESS CONTENT
        ================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            items-center
            gap-5
            lg:grid-cols-[220px_1fr]
            lg:gap-6
          "
        >
          {/* ==================================================
              LEFT - PROGRESS
          ================================================== */}

          <div>
            <ProfileProgress
              percentage={PROFILE.completion}
            />

            <p
              className="
                mx-auto
                mt-3
                max-w-[220px]
                text-center
                text-xs
                leading-5
                text-neutral-500
              "
            >
              Your company registration is{" "}
              <span className="font-semibold text-neutral-800">
                {PROFILE.completion}% complete.
              </span>
            </p>
          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-bold
                text-neutral-900
              "
            >
              Registration Progress
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-neutral-500
              "
            >
              Review your completed information and finish
              the remaining registration requirements.
            </p>

            {/* ==================================================
                COMPLETED + MISSING
            ================================================== */}

            <div
              className="
                mt-3
                grid
                grid-cols-1
                gap-3
                md:grid-cols-2
              "
            >
              {/* ==================================================
                  COMPLETED
              ================================================== */}

              <div
                className="
                  border
                  border-neutral-200
                  p-3
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    text-neutral-900
                  "
                >
                  Completed
                </p>

                <div className="mt-2 space-y-2">
                  {PROFILE.completedItems.map(
                    (item) => (
                      <div
                        key={item}
                        className="
                          flex
                          items-start
                          gap-2
                        "
                      >
                        <CheckCircle2
                          className="
                            mt-0.5
                            h-3.5
                            w-3.5
                            shrink-0
                            text-green-600
                          "
                        />

                        <span
                          className="
                            text-xs
                            leading-5
                            text-neutral-600
                          "
                        >
                          {item}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ==================================================
                  STILL REQUIRED
              ================================================== */}

              <div
                className="
                  border
                  border-amber-200
                  bg-amber-50
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-2
                  "
                >
                  <AlertCircle
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                      text-amber-600
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-bold
                        text-amber-900
                      "
                    >
                      Still required
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        leading-4
                        text-amber-800
                      "
                    >
                      Complete the following information to
                      finish your company registration.
                    </p>
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  {PROFILE.missingItems.map(
                    (item) => (
                      <div
                        key={item}
                        className="
                          flex
                          items-center
                          gap-2
                        "
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

                        <span
                          className="
                            text-xs
                            text-amber-900
                          "
                        >
                          {item}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================
                CONTINUE
            ================================================== */}

            <div className="mt-4">
              <button
                type="button"
                onClick={() =>
                  onNavigate?.("profile")
                }
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  sm:w-auto
                "
                style={{
                  backgroundColor: NAVY,
                }}
              >
                Continue Registration

                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          BUSINESS OPPORTUNITIES
      ================================================== */}

      <section className="mt-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                bg-[#201E64]/10
              "
            >
              <BriefcaseBusiness
                className="h-4 w-4"
                style={{ color: NAVY }}
              />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  sm:text-xl
                "
                style={{ color: NAVY }}
              >
                Available Business Opportunities
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-neutral-500
                "
              >
                Latest RFQs and tenders available to your
                business.
              </p>
            </div>
          </div>

          {/* VIEW ALL */}

          <button
            type="button"
            onClick={() =>
              onNavigate?.("opportunities")
            }
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              hover:underline
            "
            style={{ color: NAVY }}
          >
            View all opportunities

            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ==================================================
            OPPORTUNITY CARDS
        ================================================== */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            items-stretch
            gap-3
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
                    p-4
                    shadow-sm
                    transition
                    duration-200
                    hover:shadow-md
                  "
                >
                  {/* ==========================================
                      TYPE
                  ========================================== */}

                  <div>
                    <span
                      className="
                        inline-flex
                        px-2
                        py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
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

                  {/* ==========================================
                      TITLE
                  ========================================== */}

                  <h3
                    className="
                      mt-2
                      text-sm
                      font-bold
                      leading-5
                    "
                    style={{ color: NAVY }}
                  >
                    {opportunity.title}
                  </h3>

                  {/* ==========================================
                      DESCRIPTION
                  ========================================== */}

                  <p
                    className="
                      mt-1.5
                      line-clamp-2
                      text-xs
                      leading-5
                      text-neutral-500
                    "
                  >
                    {opportunity.description}
                  </p>

                  {/* ==========================================
                      DETAILS
                  ========================================== */}

                  <div
                    className="
                      mt-3
                      space-y-2
                      border-t
                      border-neutral-100
                      pt-3
                    "
                  >
                    {/* LOCATION */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                      "
                    >
                      <MapPin
                        className="
                          mt-0.5
                          h-3.5
                          w-3.5
                          shrink-0
                          text-neutral-400
                        "
                      />

                      <span
                        className="
                          text-[11px]
                          leading-4
                          text-neutral-600
                        "
                      >
                        {opportunity.location}
                      </span>
                    </div>

                    {/* CLOSING DATE */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                      "
                    >
                      <CalendarDays
                        className="
                          mt-0.5
                          h-3.5
                          w-3.5
                          shrink-0
                          text-neutral-400
                        "
                      />

                      <span
                        className="
                          text-[11px]
                          leading-4
                          text-neutral-600
                        "
                      >
                        Closes{" "}
                        {opportunity.closing}
                      </span>
                    </div>
                  </div>

                  {/* ==========================================
                      VIEW BUTTON
                  ========================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      onNavigate?.(
                        "opportunities"
                      )
                    }
                    className="
                      mt-auto
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-1.5
                      border
                      px-3
                      py-2
                      pt-2
                      text-xs
                      font-semibold
                      transition
                      hover:bg-[#201E64]/5
                    "
                    style={{
                      borderColor: NAVY,
                      color: NAVY,
                      marginTop: "14px",
                    }}
                  >
                    <FileText className="h-3.5 w-3.5" />

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