import React, { useState } from "react";
import {
  ChevronDown,
  CircleHelp,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// FAQ DATA
// ======================================================

const FAQS = [
  {
    id: 1,
    question: "What is the SMME Portal?",
    answer:
      "The SMME Portal provides registered businesses with access to company registration, business opportunities, funding opportunities, meetings, workshops, and business advisory support.",
  },
  {
    id: 2,
    question: "How do I complete my company registration?",
    answer:
      "Open the Company Registration section and complete all required steps. You will need to provide your personal information, company information, business maturity information, previous client references, and supporting documents.",
  },
  {
    id: 3,
    question: "What documents do I need to upload?",
    answer:
      "You may be required to upload supporting business documents such as your CIPC or company registration document, Tax Compliance PIN, and B-BBEE certificate or affidavit.",
  },
  {
    id: 4,
    question: "How do I apply for an RFQ?",
    answer:
      "Open Business Opportunities, select the RFQ you are interested in, review the opportunity information and supporting document, then select Apply to submit your quotation and required information.",
  },
  {
    id: 5,
    question: "How do I apply for a tender?",
    answer:
      "Go to Business Opportunities, select the relevant tender, review the requirements and closing date, and use the Apply option to submit your application.",
  },
  {
    id: 6,
    question: "Where can I find funding opportunities?",
    answer:
      "Funding opportunities available to registered SMMEs can be found under the Funding Opportunities section of the portal.",
  },
  {
    id: 7,
    question: "How do I request business advisory support?",
    answer:
      "Open Request Business Advisory from the portal menu, select the business area where you need assistance, describe the support you require, and submit your request.",
  },
  {
    id: 8,
    question: "Where can I see meetings and workshops?",
    answer:
      "Open Meetings & Workshops from the portal menu to view available meetings and workshops. You can review the details and respond to invitations where applicable.",
  },
  {
    id: 9,
    question: "Can I update my company information?",
    answer:
      "Yes. You can return to the Company Registration section to review and update your company information when updates are required.",
  },
  {
    id: 10,
    question: "What should I do if I need help using the portal?",
    answer:
      "If you experience a problem or need assistance, open the Contact Us section and send your enquiry to the support team.",
  },
];

// ======================================================
// FAQ ITEM
// ======================================================

function FAQItem({
  faq,
  isOpen,
  onToggle,
}) {
  return (
    <div
      className="
        overflow-hidden
        border
        border-neutral-200
        bg-white
        transition
      "
    >
      {/* QUESTION */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-4
          py-3
          text-left
          transition
          hover:bg-neutral-50
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[#201E64]
        "
      >
        <span
          className="
            text-sm
            font-semibold
            leading-5
          "
          style={{
            color: isOpen
              ? NAVY
              : "#262626",
          }}
        >
          {faq.question}
        </span>

        <ChevronDown
          className={`
            h-4
            w-4
            shrink-0
            transition-transform
            duration-200

            ${
              isOpen
                ? "rotate-180"
                : "rotate-0"
            }
          `}
          style={{ color: NAVY }}
        />
      </button>

      {/* ANSWER */}

      {isOpen && (
        <div
          className="
            border-t
            border-neutral-100
            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-neutral-500
            "
          >
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

// ======================================================
// FAQ SCREEN
// ======================================================

export default function FAQScreen() {
  const [openId, setOpenId] =
    useState(null);

  const handleToggle = (id) => {
    setOpenId((current) =>
      current === id ? null : id
    );
  };

  return (
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-5">
        <h1
          className="
            text-2xl
            font-extrabold
            leading-tight
            sm:text-3xl
          "
          style={{ color: NAVY }}
        >
          Frequently Asked Questions
        </h1>

        <p
          className="
            mt-1
            max-w-2xl
            text-sm
            leading-5
            text-neutral-500
          "
        >
          Find answers to common questions about company
          registration, business opportunities, funding,
          advisory support, meetings and using the SMME
          Portal.
        </p>
      </div>

      {/* ==================================================
          FAQ CARD
      ================================================== */}

      <div
        className="
          w-full
          max-w-3xl
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        {/* CARD HEADER */}

        <div
          className="
            flex
            items-start
            gap-3
            border-b
            border-neutral-200
            pb-4
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
            <CircleHelp
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
              How can we help?
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                leading-5
                text-neutral-500
              "
            >
              Select a question below to view the answer.
            </p>
          </div>
        </div>

        {/* ==================================================
            QUESTIONS
        ================================================== */}

        <div className="mt-4 space-y-2">
          {FAQS.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() =>
                handleToggle(faq.id)
              }
            />
          ))}
        </div>

        {/* ==================================================
            BOTTOM HELP
        ================================================== */}

        <div
          className="
            mt-4
            border-t
            border-neutral-200
            pt-4
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-neutral-500
            "
          >
            Can't find the answer you're looking for? Use
            the{" "}
            <span
              className="font-semibold"
              style={{ color: NAVY }}
            >
              Contact Us
            </span>{" "}
            section to send your enquiry to the support
            team.
          </p>
        </div>
      </div>
    </div>
  );
}