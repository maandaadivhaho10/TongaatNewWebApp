import React, { useEffect, useState } from "react";

const NAVY = "#201E64";

const API_URL = "http://localhost:5000/api";

const RFQ_ENDPOINT = `${API_URL}/rfq`;
const TENDER_ENDPOINT = `${API_URL}/tender`;

// Change to false when your real APIs are ready
const USE_DUMMY_DATA = true;

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ======================================================
// DUMMY RFQs
// ======================================================

const DUMMY_RFQS = [
  {
    id: 1,
    title: "Packaging Materials Supply Contract",
    description:
      "Supply corrugated boxes and packaging film to our food production sites. Open to black-owned SMMEs with at least one year of trading history.",
    location: "KwaZulu-Natal",
    closing: "2026-10-15",
    value: "R500k – R1.2m per year",
    document_url:
      "https://example.com/documents/packaging-rfq.pdf",
  },
  {
    id: 2,
    title: "Site Cleaning and Facilities Services",
    description:
      "Three-year facilities services contract covering cleaning, waste handling and grounds maintenance across regional offices.",
    location: "Gauteng",
    closing: "2026-10-30",
    value: "R300k – R800k per year",
    document_url:
      "https://example.com/documents/facilities-rfq.pdf",
  },
  {
    id: 3,
    title: "Uniforms and Protective Clothing",
    description:
      "Supply of branded uniforms, safety boots and protective clothing for factory and warehouse staff. Quotes must include sizing and delivery timelines.",
    location: "Western Cape",
    closing: "2026-12-05",
    value: "R150k – R400k per year",
    document_url:
      "https://example.com/documents/uniforms-rfq.pdf",
  },
];

// ======================================================
// DUMMY TENDERS
// ======================================================

const DUMMY_TENDERS = [
  {
    id: 1,
    title: "Small-Scale Grower Support Programme",
    description:
      "Funding, mentorship and equipment access for emerging growers who want to scale up and join our agricultural value chain.",
    location: "Mpumalanga",
    closing: "2026-11-20",
    value: "Up to R250k grant funding",
    document_url:
      "https://example.com/documents/grower-support-tender.pdf",
  },
  {
    id: 2,
    title: "Road Freight and Logistics Services",
    description:
      "Appointment of transport partners for inbound and outbound freight between regional depots and distribution centres.",
    location: "Gauteng",
    closing: "2026-11-05",
    value: "R2m – R5m over 3 years",
    document_url:
      "https://example.com/documents/logistics-tender.pdf",
  },
  {
    id: 3,
    title: "Solar Installation for Regional Depots",
    description:
      "Design, supply and installation of rooftop solar systems at five regional depots. Contractors must be registered and hold relevant electrical certification.",
    location: "Eastern Cape",
    closing: "2027-01-31",
    value: "R3m – R8m total contract",
    document_url:
      "https://example.com/documents/solar-tender.pdf",
  },
];

// ======================================================
// TABS
// ======================================================

const TABS = [
  { key: "all", label: "All" },
  { key: "rfq", label: "RFQs" },
  { key: "tender", label: "Tenders" },
];

const TYPE_LABEL = {
  rfq: "RFQ",
  tender: "Tender",
};

// ======================================================
// HELPERS
// ======================================================

function formatDate(iso) {
  if (!iso) return "Not specified";

  return new Date(`${iso}T00:00:00`).toLocaleDateString(
    "en-ZA",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function daysUntil(iso) {
  if (!iso) return null;

  const today = new Date();
  const closing = new Date(`${iso}T00:00:00`);

  return Math.ceil(
    (closing - today) / (1000 * 60 * 60 * 24)
  );
}

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// ======================================================
// LOAD DATA
// ======================================================

async function loadList(url, type) {
  if (USE_DUMMY_DATA) {
    await delay(300);

    const dummy =
      type === "rfq"
        ? DUMMY_RFQS
        : DUMMY_TENDERS;

    return dummy.map((item) => ({
      ...item,
      type,
    }));
  }

  const response = await fetch(url, {
    headers: authHeaders(),
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Failed to load ${TYPE_LABEL[type]}s.`
    );
  }

  const list = Array.isArray(data)
    ? data
    : data.data || [];

  return list.map((item) => ({
    ...item,
    type,
  }));
}

// ======================================================
// DOCUMENT VIEWER
// ======================================================

function DocumentViewerModal({
  opportunity,
  onClose,
}) {
  if (!opportunity) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        p-3
      "
    >
      <div
        className="
          flex
          h-[92vh]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
            border-b
            border-neutral-200
            px-4
            py-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
              "
              style={{ color: NAVY }}
            >
              {TYPE_LABEL[opportunity.type]} Document
            </p>

            <h2
              className="
                mt-1
                truncate
                text-lg
                font-bold
              "
              style={{ color: NAVY }}
            >
              {opportunity.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              text-xl
              text-neutral-500
              hover:bg-neutral-100
            "
          >
            ×
          </button>
        </div>

        {/* DOCUMENT */}

        <div className="min-h-0 flex-1 bg-neutral-100">
          {opportunity.document_url ? (
            <iframe
              src={opportunity.document_url}
              title={`${opportunity.title} document`}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-neutral-500">
                Document unavailable.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            justify-end
            border-t
            border-neutral-200
            p-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              border
              border-neutral-300
              px-4
              py-2
              text-xs
              font-semibold
              hover:bg-neutral-50
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// RFQ APPLICATION MODAL
// ======================================================

function RfqApplyModal({
  opportunity,
  onClose,
  onApplied,
}) {
  const [proposal, setProposal] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!proposal.trim()) {
      setError("Please enter your proposal.");
      return;
    }

    if (!quotedPrice) {
      setError("Please enter your quoted price.");
      return;
    }

    if (!file) {
      setError(
        "Please upload your quotation document."
      );
      return;
    }

    try {
      setSubmitting(true);

      if (USE_DUMMY_DATA) {
        await delay(600);

        onApplied(opportunity);
        onClose();

        return;
      }

      const formData = new FormData();

      formData.append("rfq_id", opportunity.id);
      formData.append("proposal", proposal);
      formData.append(
        "quoted_price",
        quotedPrice
      );
      formData.append("document", file);

      const response = await fetch(
        `${API_URL}/rfq/${opportunity.id}/apply`,
        {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit application."
        );
      }

      onApplied(opportunity);
      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while submitting."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/50
        p-3
      "
    >
      <div
        className="
          max-h-[92vh]
          w-full
          max-w-xl
          overflow-y-auto
          bg-white
          shadow-xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
            border-b
            border-neutral-200
            p-4
          "
        >
          <div>
            <p className="text-xs text-neutral-500">
              Apply for RFQ
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-bold
              "
              style={{ color: NAVY }}
            >
              {opportunity.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-neutral-500"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4"
        >
          {/* PROPOSAL */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold">
              Proposal
            </label>

            <textarea
              value={proposal}
              onChange={(e) =>
                setProposal(e.target.value)
              }
              rows={4}
              placeholder="Describe your proposal..."
              className="
                w-full
                resize-y
                border
                border-neutral-300
                px-3
                py-2
                text-sm
                outline-none
                focus:border-[#201E64]
              "
            />
          </div>

          {/* PRICE */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold">
              Quoted Price (R)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={quotedPrice}
              onChange={(e) =>
                setQuotedPrice(e.target.value)
              }
              placeholder="Example: 250000.00"
              className="
                w-full
                border
                border-neutral-300
                px-3
                py-2
                text-sm
                outline-none
                focus:border-[#201E64]
              "
            />
          </div>

          {/* DOCUMENT */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold">
              Quotation Document
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
              className="
                w-full
                border
                border-neutral-300
                p-2
                text-xs
              "
            />

            <p className="mt-1 text-[11px] text-neutral-500">
              PDF or Word format.
            </p>

            {file && (
              <p className="mt-1 break-all text-xs font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="border border-red-200 bg-red-50 p-2">
              <p className="text-xs text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              pt-4
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                border
                border-neutral-300
                px-4
                py-2
                text-xs
                font-semibold
                hover:bg-neutral-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                px-5
                py-2
                text-xs
                font-semibold
                text-white
                disabled:opacity-50
              "
              style={{
                backgroundColor: NAVY,
              }}
            >
              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// OPPORTUNITY CARD
// COMPACT VERSION
// ======================================================

function OpportunityCard({
  item,
  applied,
  applying,
  error,
  onView,
  onApplyRfq,
  onApplyTender,
}) {
  const [showFullDescription, setShowFullDescription] =
    useState(false);

  const daysLeft = daysUntil(item.closing);

  const closingSoon =
    daysLeft !== null &&
    daysLeft >= 0 &&
    daysLeft <= 14;

  const isTender = item.type === "tender";

  const description =
    item.description ||
    "No description provided.";

  const DESCRIPTION_LIMIT = 90;

  const isLongDescription =
    description.length > DESCRIPTION_LIMIT;

  const displayedDescription =
    showFullDescription || !isLongDescription
      ? description
      : `${description
          .substring(0, DESCRIPTION_LIMIT)
          .trim()}...`;

  return (
    <article
      className="
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        border
        border-neutral-200
        bg-white
        shadow-sm
        transition
        duration-200
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          h-full
          flex-1
          flex-col
          p-4
        "
      >
        {/* BADGES */}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="
              inline-flex
              items-center
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
            {TYPE_LABEL[item.type]}
          </span>

          {closingSoon && (
            <span
              className="
                inline-flex
                items-center
                bg-amber-100
                px-2
                py-1
                text-[10px]
                font-semibold
                text-amber-800
              "
            >
              Closes in {daysLeft}{" "}
              {daysLeft === 1
                ? "day"
                : "days"}
            </span>
          )}
        </div>

        {/* TITLE */}

        <h3
          className="
            break-words
            text-base
            font-bold
            leading-5
          "
          style={{ color: NAVY }}
        >
          {item.title}
        </h3>

        {/* DESCRIPTION */}

        <div className="mt-2">
          <p
            className="
              break-words
              text-xs
              leading-5
              text-neutral-500
            "
          >
            {displayedDescription}
          </p>

          {isLongDescription && (
            <button
              type="button"
              onClick={() =>
                setShowFullDescription(
                  (previous) => !previous
                )
              }
              className="
                mt-1
                text-xs
                font-semibold
                hover:underline
              "
              style={{ color: NAVY }}
            >
              {showFullDescription
                ? "See less"
                : "See more"}
            </button>
          )}
        </div>

        {/* DETAILS */}

        <dl
          className="
            mt-3
            space-y-2
            border-t
            border-neutral-100
            pt-3
          "
        >
          {/* LOCATION */}

          <div className="flex items-start gap-3">
            <dt
              className="
                w-16
                shrink-0
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-neutral-400
              "
            >
              Location
            </dt>

            <dd
              className="
                min-w-0
                break-words
                text-xs
                font-medium
                text-neutral-700
              "
            >
              {item.location ||
                "Not specified"}
            </dd>
          </div>

          {/* CLOSING */}

          <div className="flex items-start gap-3">
            <dt
              className="
                w-16
                shrink-0
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-neutral-400
              "
            >
              Closes
            </dt>

            <dd className="text-xs font-medium text-neutral-700">
              {formatDate(item.closing)}
            </dd>
          </div>
        </dl>

        {/* VALUE */}

        <div
          className="
            mt-3
            border-t
            border-neutral-100
            pt-3
          "
        >
          <p className="text-xs font-bold text-neutral-900">
            {item.value ||
              "Value not specified"}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mt-3
              border
              border-red-200
              bg-red-50
              px-3
              py-2
            "
          >
            <p
              className="
                break-words
                text-xs
                text-red-700
              "
              role="alert"
            >
              {error}
            </p>
          </div>
        )}

        {/* ACTIONS */}

        <div
          className="
            mt-auto
            flex
            gap-2
            pt-4
          "
        >
          {/* VIEW DOCUMENT */}

          <button
            type="button"
            onClick={() => onView(item)}
            disabled={!item.document_url}
            className="
              flex
              flex-1
              items-center
              justify-center
              border
              px-2
              py-2
              text-center
              text-xs
              font-bold
              transition
              hover:bg-[#201E64]/5
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            style={{
              borderColor: NAVY,
              color: NAVY,
            }}
          >
            View Document
          </button>

          {/* APPLY */}

          {isTender ? (
            <button
              type="button"
              disabled={applied || applying}
              onClick={() =>
                onApplyTender(item)
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                px-3
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              style={{
                backgroundColor: applied
                  ? "#0F766E"
                  : NAVY,
              }}
            >
              {applied
                ? "Applied"
                : applying
                ? "Applying..."
                : "Apply"}
            </button>
          ) : (
            <button
              type="button"
              disabled={applied}
              onClick={() =>
                onApplyRfq(item)
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                px-3
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              style={{
                backgroundColor: applied
                  ? "#0F766E"
                  : NAVY,
              }}
            >
              {applied
                ? "Applied"
                : "Apply"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ======================================================
// OPPORTUNITIES PAGE
// ======================================================

export default function Opportunities() {
  const [opportunities, setOpportunities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadErrors, setLoadErrors] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("all");

  const [rfqModalItem, setRfqModalItem] =
    useState(null);

  const [documentItem, setDocumentItem] =
    useState(null);

  const [appliedKeys, setAppliedKeys] =
    useState({});

  const [applyingKey, setApplyingKey] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const keyOf = (item) =>
    `${item.type}-${item.id}`;

  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const [rfqs, tenders] =
        await Promise.allSettled([
          loadList(RFQ_ENDPOINT, "rfq"),
          loadList(TENDER_ENDPOINT, "tender"),
        ]);

      if (cancelled) return;

      const merged = [
        ...(rfqs.status === "fulfilled"
          ? rfqs.value
          : []),

        ...(tenders.status === "fulfilled"
          ? tenders.value
          : []),
      ].sort(
        (a, b) =>
          new Date(a.closing) -
          new Date(b.closing)
      );

      setOpportunities(merged);

      setLoadErrors(
        [rfqs, tenders]
          .filter(
            (result) =>
              result.status === "rejected"
          )
          .map(
            (result) =>
              result.reason?.message ||
              "Failed to load opportunities."
          )
      );

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ======================================================
  // COUNTS
  // ======================================================

  const counts = {
    all: opportunities.length,

    rfq: opportunities.filter(
      (item) => item.type === "rfq"
    ).length,

    tender: opportunities.filter(
      (item) => item.type === "tender"
    ).length,
  };

  // ======================================================
  // FILTER
  // ======================================================

  const visible =
    activeTab === "all"
      ? opportunities
      : opportunities.filter(
          (item) =>
            item.type === activeTab
        );

  // ======================================================
  // MARK APPLIED
  // ======================================================

  const markApplied = (item) => {
    setAppliedKeys((prev) => ({
      ...prev,
      [keyOf(item)]: true,
    }));
  };

  // ======================================================
  // TENDER APPLY
  // ======================================================

  const handleTenderApply = async (item) => {
    const key = keyOf(item);

    if (
      !window.confirm(
        `Apply for "${item.title}"?`
      )
    ) {
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));

    setApplyingKey(key);

    try {
      if (USE_DUMMY_DATA) {
        await delay(600);

        markApplied(item);

        return;
      }

      const response = await fetch(
        `${API_URL}/tender/${item.id}/apply`,
        {
          method: "POST",
          headers: authHeaders(),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit application."
        );
      }

      markApplied(item);
    } catch (err) {
      console.error(err);

      setErrors((prev) => ({
        ...prev,

        [key]:
          err.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setApplyingKey(null);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      <section
        id="opportunities"
        className="
          w-full
          overflow-x-hidden
          bg-[#F5F6FA]
          pb-10
          text-neutral-900
        "
      >
        <div className="mx-auto w-full max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div>
            <h2
              className="
                text-2xl
                font-extrabold
                tracking-tight
                sm:text-3xl
              "
              style={{ color: NAVY }}
            >
              Business Opportunities
            </h2>

            <p
              className="
                mt-1
                max-w-xl
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Browse current RFQs and tenders open to
              registered suppliers. RFQs require a quotation,
              while tenders allow you to apply directly.
            </p>
          </div>

          {/* ==================================================
              TABS
          ================================================== */}

          <div
            role="tablist"
            aria-label="Opportunity type"
            className="
              mt-5
              flex
              max-w-full
              gap-1
              overflow-x-auto
              border-b
              border-neutral-200
            "
          >
            {TABS.map((tab) => {
              const active =
                activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`
                    -mb-px
                    shrink-0
                    border-b-2
                    px-4
                    py-2.5
                    text-sm
                    font-semibold

                    ${
                      active
                        ? ""
                        : "border-transparent text-neutral-500 hover:text-neutral-900"
                    }
                  `}
                  style={
                    active
                      ? {
                          borderColor: NAVY,
                          color: NAVY,
                        }
                      : undefined
                  }
                >
                  {tab.label}

                  <span className="ml-2 text-xs font-medium text-neutral-500">
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ==================================================
              ERRORS
          ================================================== */}

          {loadErrors.map((message) => (
            <div
              key={message}
              className="
                mt-4
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-xs
                text-red-700
              "
            >
              {message}
            </div>
          ))}

          {/* ==================================================
              CARDS
          ================================================== */}

          {loading ? (
            <div className="mt-5">
              <p className="text-sm text-neutral-500">
                Loading opportunities...
              </p>
            </div>
          ) : visible.length > 0 ? (
            <div
              className="
                mt-5
                grid
                grid-cols-1
                items-start
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {visible.map((item) => (
                <OpportunityCard
                  key={keyOf(item)}
                  item={item}
                  applied={
                    !!appliedKeys[keyOf(item)]
                  }
                  applying={
                    applyingKey === keyOf(item)
                  }
                  error={
                    errors[keyOf(item)]
                  }
                  onView={setDocumentItem}
                  onApplyRfq={setRfqModalItem}
                  onApplyTender={
                    handleTenderApply
                  }
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-5
                border
                border-neutral-200
                bg-white
                p-8
                text-center
              "
            >
              <p className="font-semibold text-neutral-900">
                {activeTab === "all"
                  ? "There are no opportunities open right now"
                  : `There are no ${TYPE_LABEL[activeTab]}s open right now`}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Check back soon for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          DOCUMENT
      ================================================== */}

      {documentItem && (
        <DocumentViewerModal
          opportunity={documentItem}
          onClose={() =>
            setDocumentItem(null)
          }
        />
      )}

      {/* ==================================================
          RFQ APPLICATION
      ================================================== */}

      {rfqModalItem && (
        <RfqApplyModal
          opportunity={rfqModalItem}
          onClose={() =>
            setRfqModalItem(null)
          }
          onApplied={markApplied}
        />
      )}
    </>
  );
}