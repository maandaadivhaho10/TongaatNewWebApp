import React, { useState } from "react";

const NAVY = "#201E64";

const DOCUMENTS = [
  {
    title: "CIPC / CoReg Document",
    description:
      "Proof that your business is officially registered. This document helps verify your company name, registration number, directors, and registration status.",
    required: true,
  },
  {
    title: "Tax PIN",
    description:
      "Your SARS Tax Compliance Status PIN allows the ESD team to verify whether your business is tax compliant.",
    required: true,
  },
  {
    title: "B-BBEE Certificate / Affidavit",
    description:
      "Provides information about your business's B-BBEE status and ownership profile. Depending on your business size, this may be a valid B-BBEE certificate or sworn affidavit.",
    required: true,
  },
  {
    title: "Other Business Documents",
    description:
      "Additional supporting documents may be requested depending on the opportunity or support programme. These may include company profiles, financial documents, proof of address, or other relevant business records.",
    required: false,
  },
];

const FAQS = [
  {
    question: "What is Enterprise and Supplier Development (ESD)?",
    answer:
      "Enterprise and Supplier Development supports small businesses by helping them improve their capabilities, sustainability, and readiness to participate in supply chains and business opportunities.",
  },
  {
    question: "Why do I need to upload business documents?",
    answer:
      "Business documents help the ESD team verify your business information, compliance status, ownership profile, and readiness for development or supplier opportunities.",
  },
  {
    question: "What happens after I submit my documents?",
    answer:
      "Your submitted information and documents can be reviewed by the ESD team. If additional information or updated documents are required, you may be contacted or asked to provide them.",
  },
  {
    question: "Why is my B-BBEE information required?",
    answer:
      "B-BBEE information helps the ESD team understand your business ownership and transformation profile and may be relevant when assessing businesses for Enterprise Development, Supplier Development, or procurement opportunities.",
  },
  {
    question: "What if one of my documents has expired?",
    answer:
      "You should upload the latest valid version of the document. Keeping your business documents current helps prevent delays when your business is being considered for support or opportunities.",
  },
  {
    question: "Does registering guarantee that I will receive opportunities?",
    answer:
      "No. Registration allows your business information to be considered, but opportunities may have their own requirements, evaluation criteria, capacity requirements, and selection processes.",
  },
  {
    question: "What is the difference between Enterprise Development and Supplier Development?",
    answer:
      "Enterprise Development focuses on helping qualifying businesses grow and become sustainable. Supplier Development focuses more specifically on developing businesses that are existing or potential suppliers within a company's supply chain.",
  },
  {
    question: "Can I request business support through the portal?",
    answer:
      "Yes. You can submit a Business Advisory request and explain the area where your business needs assistance. The ESD team can then review the request and determine the appropriate support.",
  },
  {
    question: "What kind of business support can I request?",
    answer:
      "Support may include areas such as financial management, business strategy, marketing and sales, compliance, procurement and tenders, operations, human resources, funding readiness, and business growth.",
  },
];

export default function FAQScreen() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-50">
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          py-6
          sm:px-6
          sm:py-10
          lg:px-8
          lg:py-12
        "
      >
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="
              text-2xl
              font-extrabold
              leading-tight
              sm:text-3xl
              lg:text-4xl
            "
            style={{ color: NAVY }}
          >
            Help & Frequently Asked Questions
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 sm:text-base">
            Find information about the business documents required
            for your profile and answers to common questions about
            Enterprise and Supplier Development.
          </p>
        </div>

        {/* ====================================================== */}
        {/* REQUIRED DOCUMENTS */}
        {/* ====================================================== */}

        <section className="mb-12">
          <div className="mb-5">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: NAVY }}
            >
              Business Documents
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              These documents help the ESD team verify your business
              information and assess your business for relevant
              development and supplier opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {DOCUMENTS.map((document) => (
              <div
                key={document.title}
                className="
                  flex
                  min-w-0
                  flex-col
                  border
                  border-neutral-200
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-6
                "
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="
                      min-w-0
                      text-base
                      font-bold
                      leading-6
                      sm:text-lg
                    "
                    style={{ color: NAVY }}
                  >
                    {document.title}
                  </h3>

                  <span
                    className={`
                      shrink-0
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${
                        document.required
                          ? "bg-[#201E64]/10 text-[#201E64]"
                          : "bg-neutral-100 text-neutral-500"
                      }
                    `}
                  >
                    {document.required
                      ? "Required"
                      : "If requested"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {document.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Note */}
        <div
          className="
            mb-12
            border-l-4
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
          style={{ borderLeftColor: NAVY }}
        >
          <h3
            className="text-base font-bold"
            style={{ color: NAVY }}
          >
            Keep your documents up to date
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Make sure the documents submitted through your business
            profile are valid, readable, and current. Outdated or
            incorrect documents may delay verification or your
            participation in certain ESD opportunities.
          </p>
        </div>

        {/* ====================================================== */}
        {/* FAQ */}
        {/* ====================================================== */}

        <section>
          <div className="mb-5">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: NAVY }}
            >
              Frequently Asked Questions
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Common questions about your business profile, ESD
              support, documents, and opportunities.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFAQ === index;

              return (
                <div
                  key={faq.question}
                  className="
                    w-full
                    min-w-0
                    overflow-hidden
                    border
                    border-neutral-200
                    bg-white
                  "
                >
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      px-4
                      py-4
                      text-left
                      transition
                      hover:bg-neutral-50
                      sm:px-6
                      sm:py-5
                    "
                  >
                    <span
                      className="
                        min-w-0
                        text-sm
                        font-semibold
                        leading-6
                        sm:text-base
                      "
                      style={{ color: NAVY }}
                    >
                      {faq.question}
                    </span>

                    {/* Arrow */}
                    <svg
                      className={`
                        h-5
                        w-5
                        shrink-0
                        transition-transform
                        duration-200
                        ${
                          isOpen
                            ? "rotate-180"
                            : "rotate-0"
                        }
                      `}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div
                      className="
                        border-t
                        border-neutral-100
                        px-4
                        py-4
                        sm:px-6
                        sm:py-5
                      "
                    >
                      <p className="text-sm leading-6 text-neutral-500">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}