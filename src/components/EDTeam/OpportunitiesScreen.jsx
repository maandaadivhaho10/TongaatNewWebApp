import React, { useMemo, useRef, useState } from "react";
import {
  Search,
  FileText,
  ClipboardList,
  Building2,
  UserRound,
  CalendarDays,
  MapPin,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Users,
  BadgeCheck,
  Wallet,
  BriefcaseBusiness,
  Plus,
  Upload,
  Check,
  Send,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// INDUSTRIES
// Replace with API data later
// ======================================================

const INDUSTRIES = [
  "Agriculture",
  "Construction",
  "Engineering",
  "Information Technology",
  "Logistics & Transportation",
  "Cleaning & Facilities Management",
  "Manufacturing",
  "Professional Services",
  "Security Services",
  "Office Supplies",
  "Marketing & Communications",
  "Food & Catering",
];

// ======================================================
// DUMMY TENDERS
// ======================================================

const INITIAL_TENDERS = [
  {
    id: 1,
    title: "Agricultural Equipment Maintenance Services",
    reference: "TH-TEN-001",
    description:
      "Tongaat Hulett is inviting qualified suppliers to provide agricultural equipment maintenance and repair services.",
    closingDate: "2026-10-25",
    location: "KwaZulu-Natal",
    status: "OPEN",
    createdDate: "2026-10-01",
    industries: ["All Industries"],
    documentName: "agricultural-equipment-tender.pdf",

    responses: [
      {
        id: 1,
        supplierId: 4,
        firstName: "Sipho",
        lastName: "Khumalo",
        company: "Khumalo Engineering",
        email: "sipho@khumaloengineering.co.za",
        phone: "074 998 1132",
        submittedDate: "2026-10-04",
        beeLevel: "Level 3",
        bwoOwnership: 30,
        boOwnership: 60,
        serviceOffered:
          "Engineering, maintenance and equipment repairs",
        locality: "Richards Bay, KwaZulu-Natal",
        annualRevenue: "R10,000,000 - R20,000,000",
        permanentEmployees: 42,
        status: "SUBMITTED",
      },
      {
        id: 2,
        supplierId: 1,
        firstName: "Thabo",
        lastName: "Mokoena",
        company: "Mokoena Agricultural Services",
        email: "thabo@mokoena.co.za",
        phone: "071 234 5678",
        submittedDate: "2026-10-05",
        beeLevel: "Level 1",
        bwoOwnership: 100,
        boOwnership: 100,
        serviceOffered:
          "Agricultural services, crop maintenance and farm support",
        locality: "Johannesburg, Gauteng",
        annualRevenue: "R1,000,000 - R5,000,000",
        permanentEmployees: 12,
        status: "SUBMITTED",
      },
    ],
  },

  {
    id: 2,
    title: "Facilities Management Services",
    reference: "TH-TEN-002",
    description:
      "Request for qualified suppliers to provide cleaning and facilities management services.",
    closingDate: "2026-11-05",
    location: "Gauteng",
    status: "OPEN",
    createdDate: "2026-10-03",
    industries: ["All Industries"],
    documentName: "facilities-management.pdf",

    responses: [
      {
        id: 1,
        supplierId: 5,
        firstName: "Amanda",
        lastName: "Ndlovu",
        company: "Ndlovu Cleaning Services",
        email: "amanda@ndlovucleaning.co.za",
        phone: "076 334 8821",
        submittedDate: "2026-10-05",
        beeLevel: "Level 1",
        bwoOwnership: 100,
        boOwnership: 100,
        serviceOffered:
          "Commercial cleaning and facilities management",
        locality: "Johannesburg, Gauteng",
        annualRevenue: "R1,000,000 - R5,000,000",
        permanentEmployees: 34,
        status: "SUBMITTED",
      },
    ],
  },

  {
    id: 3,
    title: "ICT Support and Software Services",
    reference: "TH-TEN-003",
    description:
      "Appointment of an ICT supplier for technical support, cloud services and software development.",
    closingDate: "2026-09-30",
    location: "Gauteng",
    status: "CLOSED",
    createdDate: "2026-09-01",
    industries: ["All Industries"],
    documentName: "ict-support-tender.pdf",

    responses: [
      {
        id: 1,
        supplierId: 6,
        firstName: "Mpho",
        lastName: "Mahlangu",
        company: "Mahlangu ICT Solutions",
        email: "mpho@mahlanguict.co.za",
        phone: "078 229 4110",
        submittedDate: "2026-09-15",
        beeLevel: "Level 2",
        bwoOwnership: 40,
        boOwnership: 80,
        serviceOffered:
          "ICT support, software development and cloud services",
        locality: "Midrand, Gauteng",
        annualRevenue: "R5,000,000 - R10,000,000",
        permanentEmployees: 18,
        status: "SHORTLISTED",
      },
    ],
  },
];

// ======================================================
// DUMMY RFQS
// ======================================================

const INITIAL_RFQS = [
  {
    id: 1,
    title: "Supply of Office Equipment",
    reference: "TH-RFQ-001",
    description:
      "Request for quotations for the supply and delivery of office equipment and accessories.",
    closingDate: "2026-10-15",
    location: "Durban, KwaZulu-Natal",
    status: "OPEN",
    createdDate: "2026-10-02",

    industries: [
      "Office Supplies",
      "Professional Services",
    ],

    documentName: "office-equipment-rfq.pdf",

    responses: [
      {
        id: 1,
        supplierId: 3,
        firstName: "Nomsa",
        lastName: "Dlamini",
        company: "Dlamini Business Solutions",
        email: "nomsa@dlaminibusiness.co.za",
        phone: "073 441 2209",
        submittedDate: "2026-10-04",
        beeLevel: "Level 1",
        bwoOwnership: 100,
        boOwnership: 100,
        serviceOffered:
          "Business supplies and administrative services",
        locality: "Pretoria, Gauteng",
        annualRevenue: "R500,000 - R1,000,000",
        permanentEmployees: 7,
        quotationAmount: "R48,500",
        status: "SUBMITTED",
      },
      {
        id: 2,
        supplierId: 8,
        firstName: "Lwazi",
        lastName: "Mthembu",
        company: "Lwazi Office Supplies",
        email: "lwazi@officesupplies.co.za",
        phone: "079 554 2241",
        submittedDate: "2026-10-05",
        beeLevel: "Level 2",
        bwoOwnership: 51,
        boOwnership: 75,
        serviceOffered:
          "Office equipment and stationery",
        locality: "Durban, KwaZulu-Natal",
        annualRevenue: "R1,000,000 - R5,000,000",
        permanentEmployees: 10,
        quotationAmount: "R45,900",
        status: "SUBMITTED",
      },
    ],
  },

  {
    id: 2,
    title: "Transport Services",
    reference: "TH-RFQ-002",
    description:
      "Request for quotations from logistics suppliers for transport and delivery services.",
    closingDate: "2026-10-20",
    location: "KwaZulu-Natal",
    status: "OPEN",
    createdDate: "2026-10-04",

    industries: [
      "Logistics & Transportation",
      "Agriculture",
    ],

    documentName: "transport-services-rfq.pdf",

    responses: [
      {
        id: 1,
        supplierId: 2,
        firstName: "Lerato",
        lastName: "Nkosi",
        company: "Nkosi Logistics Solutions",
        email: "lerato@nkosilogistics.co.za",
        phone: "072 555 8214",
        submittedDate: "2026-10-05",
        beeLevel: "Level 2",
        bwoOwnership: 51,
        boOwnership: 75,
        serviceOffered:
          "Transportation, logistics and freight services",
        locality: "Durban, KwaZulu-Natal",
        annualRevenue: "R5,000,000 - R10,000,000",
        permanentEmployees: 28,
        quotationAmount: "R82,000",
        status: "SUBMITTED",
      },
    ],
  },

  {
    id: 3,
    title: "Printing and Branding Services",
    reference: "TH-RFQ-003",
    description:
      "Request for quotations for printing, signage and corporate branding services.",
    closingDate: "2026-10-30",
    location: "Gauteng",
    status: "OPEN",
    createdDate: "2026-10-05",

    industries: [
      "Marketing & Communications",
      "Professional Services",
    ],

    documentName: "printing-branding-rfq.pdf",

    responses: [],
  },
];

// ======================================================
// HELPERS
// ======================================================

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// ======================================================
// OPPORTUNITY STATUS
// ======================================================

function OpportunityStatusBadge({ status }) {
  let classes =
    "border-neutral-200 bg-neutral-50 text-neutral-600";

  if (status === "OPEN") {
    classes =
      "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "CLOSED") {
    classes =
      "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        border
        px-2
        py-1
        text-[9px]
        font-bold
        uppercase
        tracking-wide
        ${classes}
      `}
    >
      {status}
    </span>
  );
}

// ======================================================
// RESPONSE STATUS
// ======================================================

function ResponseStatusBadge({ status }) {
  let classes =
    "border-blue-200 bg-blue-50 text-blue-700";

  if (status === "SHORTLISTED") {
    classes =
      "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "REJECTED") {
    classes =
      "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        border
        px-2
        py-1
        text-[9px]
        font-bold
        uppercase
        tracking-wide
        ${classes}
      `}
    >
      {status}
    </span>
  );
}

// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-start
        gap-3
        border
        border-neutral-200
        bg-neutral-50
        p-3
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          bg-[#201E64]/10
        "
      >
        <Icon
          className="h-4 w-4"
          style={{ color: NAVY }}
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-neutral-400
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            text-xs
            font-semibold
            leading-5
            text-neutral-800
          "
        >
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// CREATE OPPORTUNITY FORM
// COMPACT + RESPONSIVE
// ======================================================

function CreateOpportunityForm({
  onCreateTender,
  onCreateRfq,
}) {
  const fileInputRef = useRef(null);

  const [opportunityType, setOpportunityType] =
    useState("rfq");

  const [form, setForm] = useState({
    title: "",
    description: "",
    closingDate: "",
    location: "",
  });

  const [selectedIndustries, setSelectedIndustries] =
    useState([]);

  const [pdfFile, setPdfFile] = useState(null);

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] =
    useState("");

  // ======================================================
  // CHANGE TYPE
  // ======================================================

  const changeOpportunityType = (type) => {
    setOpportunityType(type);

    setErrors({});
    setSuccessMessage("");

    if (type === "tender") {
      setSelectedIndustries([]);
    }
  };

  // ======================================================
  // FORM INPUT
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }

    setSuccessMessage("");
  };

  // ======================================================
  // INDUSTRIES
  // ======================================================

  const toggleIndustry = (industry) => {
    setSelectedIndustries((current) => {
      if (current.includes(industry)) {
        return current.filter(
          (item) => item !== industry
        );
      }

      return [...current, industry];
    });

    setErrors((current) => ({
      ...current,
      industries: undefined,
    }));

    setSuccessMessage("");
  };

  // ======================================================
  // PDF
  // ======================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setErrors((current) => ({
        ...current,
        document: "Only PDF documents are allowed.",
      }));

      event.target.value = "";
      return;
    }

    setPdfFile(file);

    setErrors((current) => ({
      ...current,
      document: undefined,
    }));

    setSuccessMessage("");
  };

  const removePdf = () => {
    setPdfFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Enter an opportunity title.";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Enter an opportunity description.";
    }

    if (!form.closingDate) {
      nextErrors.closingDate =
        "Select a closing date.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Enter a location.";
    }

    if (!pdfFile) {
      nextErrors.document =
        "Upload the opportunity PDF.";
    }

    if (
      opportunityType === "rfq" &&
      selectedIndustries.length === 0
    ) {
      nextErrors.industries =
        "Select at least one industry.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const opportunity = {
      title: form.title.trim(),
      description: form.description.trim(),
      closingDate: form.closingDate,
      location: form.location.trim(),

      status: "OPEN",

      createdDate: new Date()
        .toISOString()
        .split("T")[0],

      industries:
        opportunityType === "tender"
          ? ["All Industries"]
          : selectedIndustries,

      documentName: pdfFile.name,
      document: pdfFile,

      responses: [],
    };

    if (opportunityType === "tender") {
      onCreateTender(opportunity);
    } else {
      onCreateRfq(opportunity);
    }

    setSuccessMessage(
      opportunityType === "tender"
        ? "Tender created successfully."
        : "RFQ created successfully."
    );

    setForm({
      title: "",
      description: "",
      closingDate: "",
      location: "",
    });

    setSelectedIndustries([]);
    setPdfFile(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* HEADER */}

      <div className="mb-4">
        <h2
          className="text-lg font-bold sm:text-xl"
          style={{ color: NAVY }}
        >
          Create Business Opportunity
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          Create a Tender or RFQ for registered suppliers.
        </p>
      </div>

      {/* SUCCESS */}

      {successMessage && (
        <div
          className="
            mb-3
            flex
            items-center
            gap-2
            border
            border-green-200
            bg-green-50
            px-3
            py-2.5
          "
        >
          <Check className="h-4 w-4 shrink-0 text-green-700" />

          <p className="text-xs font-semibold text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        {/* ==================================================
            TYPE + TITLE + CLOSING DATE
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            lg:grid-cols-[220px_minmax(0,1fr)_190px]
          "
        >
          {/* TYPE */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
              Type
            </label>

            <div className="grid h-10 grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  changeOpportunityType("rfq")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  border
                  text-xs
                  font-bold
                  transition

                  ${
                    opportunityType === "rfq"
                      ? "border-[#201E64] bg-[#201E64] text-white"
                      : "border-neutral-300 bg-white text-neutral-600 hover:border-[#201E64]"
                  }
                `}
              >
                <ClipboardList className="h-3.5 w-3.5" />

                RFQ
              </button>

              <button
                type="button"
                onClick={() =>
                  changeOpportunityType("tender")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  border
                  border-l-0
                  text-xs
                  font-bold
                  transition

                  ${
                    opportunityType === "tender"
                      ? "border-[#201E64] bg-[#201E64] text-white"
                      : "border-neutral-300 bg-white text-neutral-600 hover:border-[#201E64]"
                  }
                `}
              >
                <FileText className="h-3.5 w-3.5" />

                Tender
              </button>
            </div>
          </div>

          {/* TITLE */}

          <div>
            <label
              htmlFor="opportunity-title"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Title
            </label>

            <input
              id="opportunity-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter opportunity title"
              className={`
                h-10
                w-full
                border
                bg-white
                px-3
                text-xs
                outline-none
                placeholder:text-neutral-400
                focus:border-[#201E64]
                focus:ring-1
                focus:ring-[#201E64]/10
                sm:text-sm

                ${
                  errors.title
                    ? "border-red-400"
                    : "border-neutral-300"
                }
              `}
            />

            {errors.title && (
              <p className="mt-1 text-[10px] text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          {/* DATE */}

          <div>
            <label
              htmlFor="closing-date"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Closing Date
            </label>

            <input
              id="closing-date"
              name="closingDate"
              type="date"
              value={form.closingDate}
              onChange={handleChange}
              className={`
                h-10
                w-full
                border
                bg-white
                px-3
                text-xs
                outline-none
                focus:border-[#201E64]
                focus:ring-1
                focus:ring-[#201E64]/10

                ${
                  errors.closingDate
                    ? "border-red-400"
                    : "border-neutral-300"
                }
              `}
            />

            {errors.closingDate && (
              <p className="mt-1 text-[10px] text-red-600">
                {errors.closingDate}
              </p>
            )}
          </div>
        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <div className="mt-3">
          <label
            htmlFor="opportunity-description"
            className="mb-1.5 block text-xs font-semibold text-neutral-700"
          >
            Description
          </label>

          <textarea
            id="opportunity-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Briefly describe the opportunity and supplier requirements..."
            className={`
              min-h-[82px]
              w-full
              resize-y
              border
              bg-white
              px-3
              py-2.5
              text-xs
              leading-5
              outline-none
              placeholder:text-neutral-400
              focus:border-[#201E64]
              focus:ring-1
              focus:ring-[#201E64]/10
              sm:text-sm

              ${
                errors.description
                  ? "border-red-400"
                  : "border-neutral-300"
              }
            `}
          />

          {errors.description && (
            <p className="mt-1 text-[10px] text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* ==================================================
            LOCATION + PDF
        ================================================== */}

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          {/* LOCATION */}

          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-xs font-semibold text-neutral-700"
            >
              Location
            </label>

            <div className="relative">
              <MapPin
                className="
                  absolute
                  left-3
                  top-1/2
                  h-3.5
                  w-3.5
                  -translate-y-1/2
                  text-neutral-400
                "
              />

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. KwaZulu-Natal"
                className={`
                  h-10
                  w-full
                  border
                  bg-white
                  pl-9
                  pr-3
                  text-xs
                  outline-none
                  placeholder:text-neutral-400
                  focus:border-[#201E64]
                  focus:ring-1
                  focus:ring-[#201E64]/10
                  sm:text-sm

                  ${
                    errors.location
                      ? "border-red-400"
                      : "border-neutral-300"
                  }
                `}
              />
            </div>

            {errors.location && (
              <p className="mt-1 text-[10px] text-red-600">
                {errors.location}
              </p>
            )}
          </div>

          {/* PDF */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
              Opportunity PDF
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!pdfFile ? (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`
                  flex
                  h-10
                  w-full
                  items-center
                  gap-2
                  border
                  bg-white
                  px-3
                  text-left
                  text-xs
                  transition
                  hover:border-[#201E64]

                  ${
                    errors.document
                      ? "border-red-400"
                      : "border-neutral-300"
                  }
                `}
              >
                <Upload
                  className="h-4 w-4 shrink-0"
                  style={{ color: NAVY }}
                />

                <span className="truncate text-neutral-500">
                  Upload PDF document
                </span>
              </button>
            ) : (
              <div
                className="
                  flex
                  h-10
                  items-center
                  justify-between
                  gap-2
                  border
                  border-neutral-300
                  bg-neutral-50
                  px-3
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                  "
                >
                  <FileText className="h-4 w-4 shrink-0 text-red-600" />

                  <span className="truncate text-xs font-medium text-neutral-700">
                    {pdfFile.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={removePdf}
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    text-red-600
                    hover:bg-red-50
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {errors.document && (
              <p className="mt-1 text-[10px] text-red-600">
                {errors.document}
              </p>
            )}
          </div>
        </div>

        {/* ==================================================
            TARGET INDUSTRIES
        ================================================== */}

        <div
          className="
            mt-4
            border-t
            border-neutral-100
            pt-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-xs font-bold text-neutral-700">
                Target Industry
              </p>

              <p className="mt-0.5 text-[10px] text-neutral-400">
                {opportunityType === "rfq"
                  ? "Select one or more industries for this RFQ."
                  : "This tender will be visible to all industries."}
              </p>
            </div>

            {opportunityType === "rfq" &&
              selectedIndustries.length > 0 && (
                <span
                  className="
                    w-fit
                    bg-[#201E64]/10
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    text-[#201E64]
                  "
                >
                  {selectedIndustries.length} selected
                </span>
              )}
          </div>

          {/* TENDER */}

          {opportunityType === "tender" && (
            <div
              className="
                mt-2
                flex
                h-10
                items-center
                gap-2
                border
                border-[#201E64]/20
                bg-[#201E64]/[0.03]
                px-3
              "
            >
              <Users
                className="h-4 w-4"
                style={{ color: NAVY }}
              />

              <span
                className="text-xs font-bold"
                style={{ color: NAVY }}
              >
                All Industries
              </span>

              <Check
                className="ml-auto h-4 w-4"
                style={{ color: NAVY }}
              />
            </div>
          )}

          {/* RFQ */}

          {opportunityType === "rfq" && (
            <>
              <div
                className="
                  mt-2
                  grid
                  max-h-[145px]
                  grid-cols-1
                  gap-1.5
                  overflow-y-auto
                  border
                  border-neutral-200
                  bg-neutral-50
                  p-2
                  min-[460px]:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {INDUSTRIES.map((industry) => {
                  const selected =
                    selectedIndustries.includes(
                      industry
                    );

                  return (
                    <button
                      key={industry}
                      type="button"
                      onClick={() =>
                        toggleIndustry(industry)
                      }
                      className={`
                        flex
                        min-h-[34px]
                        items-center
                        justify-between
                        gap-2
                        border
                        bg-white
                        px-2.5
                        py-1.5
                        text-left
                        text-[10px]
                        font-semibold
                        transition

                        ${
                          selected
                            ? "border-[#201E64] text-[#201E64]"
                            : "border-neutral-200 text-neutral-600 hover:border-[#201E64]/40"
                        }
                      `}
                    >
                      <span>{industry}</span>

                      <span
                        className={`
                          flex
                          h-4
                          w-4
                          shrink-0
                          items-center
                          justify-center
                          border

                          ${
                            selected
                              ? "border-[#201E64] bg-[#201E64] text-white"
                              : "border-neutral-300"
                          }
                        `}
                      >
                        {selected && (
                          <Check className="h-2.5 w-2.5" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.industries && (
                <p className="mt-1 text-[10px] text-red-600">
                  {errors.industries}
                </p>
              )}
            </>
          )}
        </div>

        {/* ==================================================
            SUBMIT
        ================================================== */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-neutral-100
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-[10px] text-neutral-400">
            {opportunityType === "tender"
              ? "Tender • All industries"
              : selectedIndustries.length > 0
              ? `RFQ • ${selectedIndustries.length} selected ${
                  selectedIndustries.length === 1
                    ? "industry"
                    : "industries"
                }`
              : "RFQ • Select target industries"}
          </p>

          <button
            type="submit"
            className="
              inline-flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              bg-[#201E64]
              px-5
              text-xs
              font-bold
              text-white
              transition
              hover:bg-[#2B2889]
              sm:w-auto
            "
          >
            <Send className="h-3.5 w-3.5" />

            Create{" "}
            {opportunityType === "rfq"
              ? "RFQ"
              : "Tender"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ======================================================
// SUPPLIER RESPONSE DETAILS
// ======================================================

function SupplierResponseDetails({
  response,
  type,
  opportunity,
  onBack,
}) {
  if (!response) return null;

  const fullName =
    `${response.firstName} ${response.lastName}`;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="
          mb-4
          inline-flex
          items-center
          gap-1.5
          text-xs
          font-bold
          text-[#201E64]
          hover:underline
        "
      >
        <ChevronLeft className="h-4 w-4" />

        Back to all responses
      </button>

      {/* SUPPLIER HEADER */}

      <div
        className="
          flex
          flex-col
          gap-3
          border
          border-neutral-200
          bg-white
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex items-center gap-3">
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
            <UserRound
              className="h-5 w-5"
              style={{ color: NAVY }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="text-base font-bold"
              style={{ color: NAVY }}
            >
              {fullName}
            </p>

            <p className="mt-0.5 text-xs text-neutral-500">
              {response.company}
            </p>
          </div>
        </div>

        <ResponseStatusBadge
          status={response.status}
        />
      </div>

      {/* RESPONSE INFORMATION */}

      <section className="mt-5">
        <h3
          className="text-sm font-bold"
          style={{ color: NAVY }}
        >
          Response Information
        </h3>

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <DetailItem
            icon={ClipboardList}
            label="Opportunity"
            value={opportunity.title}
          />

          <DetailItem
            icon={FileText}
            label="Reference"
            value={opportunity.reference}
          />

          <DetailItem
            icon={CalendarDays}
            label="Submitted Date"
            value={formatDate(
              response.submittedDate
            )}
          />

          <DetailItem
            icon={BadgeCheck}
            label="Response Status"
            value={response.status}
          />

          {type === "rfq" && (
            <DetailItem
              icon={Wallet}
              label="Quotation Amount"
              value={
                response.quotationAmount ||
                "Not provided"
              }
            />
          )}
        </div>
      </section>

      {/* SUPPLIER INFORMATION */}

      <section className="mt-6">
        <h3
          className="text-sm font-bold"
          style={{ color: NAVY }}
        >
          Supplier Information
        </h3>

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          <DetailItem
            icon={UserRound}
            label="Supplier Name"
            value={fullName}
          />

          <DetailItem
            icon={Building2}
            label="Company"
            value={response.company}
          />

          <DetailItem
            icon={Mail}
            label="Email Address"
            value={response.email}
          />

          <DetailItem
            icon={Phone}
            label="Phone Number"
            value={response.phone}
          />
        </div>
      </section>

      {/* BUSINESS INFORMATION */}

      <section className="mt-6">
        <h3
          className="text-sm font-bold"
          style={{ color: NAVY }}
        >
          Business Information
        </h3>

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <DetailItem
            icon={BadgeCheck}
            label="B-BBEE Level"
            value={response.beeLevel}
          />

          <DetailItem
            icon={UserRound}
            label="BWO Ownership"
            value={`${response.bwoOwnership}%`}
          />

          <DetailItem
            icon={Users}
            label="BO Ownership"
            value={`${response.boOwnership}%`}
          />

          <DetailItem
            icon={BriefcaseBusiness}
            label="Service Offered"
            value={response.serviceOffered}
          />

          <DetailItem
            icon={MapPin}
            label="Locality"
            value={response.locality}
          />

          <DetailItem
            icon={Wallet}
            label="Annual Revenue"
            value={response.annualRevenue}
          />

          <DetailItem
            icon={Users}
            label="Permanent Employees"
            value={response.permanentEmployees}
          />
        </div>
      </section>
    </div>
  );
}

// ======================================================
// MOBILE RESPONSE CARD
// ======================================================

function ResponseCard({
  response,
  type,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        border
        border-neutral-200
        bg-white
        p-4
        text-left
        transition
        hover:border-[#201E64]/40
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <p
            className="text-sm font-bold"
            style={{ color: NAVY }}
          >
            {response.company}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {response.firstName} {response.lastName}
          </p>
        </div>

        <ResponseStatusBadge
          status={response.status}
        />
      </div>

      <div
        className="
          mt-3
          space-y-2
          border-t
          border-neutral-100
          pt-3
        "
      >
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            {response.beeLevel}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            {response.locality}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            Submitted{" "}
            {formatDate(response.submittedDate)}
          </span>
        </div>

        {type === "rfq" &&
          response.quotationAmount && (
            <div
              className="
                flex
                items-center
                justify-between
                border-t
                border-neutral-100
                pt-3
              "
            >
              <span className="text-[10px] font-bold uppercase text-neutral-400">
                Quotation
              </span>

              <span
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                {response.quotationAmount}
              </span>
            </div>
          )}
      </div>

      <div
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-1
          text-xs
          font-bold
          text-[#201E64]
        "
      >
        View supplier details

        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

// ======================================================
// OPPORTUNITY DETAILS MODAL
// ======================================================

function OpportunityDetailsModal({
  opportunity,
  type,
  onClose,
}) {
  const [selectedResponse, setSelectedResponse] =
    useState(null);

  if (!opportunity) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/40
        sm:items-center
        sm:p-4
      "
      onClick={onClose}
    >
      <div
        className="
          flex
          max-h-[95dvh]
          w-full
          flex-col
          overflow-hidden
          bg-[#F5F6FA]
          shadow-xl
          sm:max-w-6xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-3
            border-b
            border-neutral-200
            bg-white
            p-4
            sm:p-5
          "
        >
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <span
                className="
                  bg-[#201E64]/10
                  px-2
                  py-1
                  text-[9px]
                  font-bold
                  uppercase
                  text-[#201E64]
                "
              >
                {type === "tender"
                  ? "Tender"
                  : "RFQ"}
              </span>

              <OpportunityStatusBadge
                status={opportunity.status}
              />
            </div>

            <h2
              className="
                mt-2
                break-words
                text-base
                font-bold
                sm:text-xl
              "
              style={{ color: NAVY }}
            >
              {selectedResponse
                ? "Supplier Response"
                : opportunity.title}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {opportunity.reference}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              text-neutral-500
              hover:bg-neutral-100
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-3
            sm:p-5
          "
        >
          {selectedResponse ? (
            <SupplierResponseDetails
              response={selectedResponse}
              type={type}
              opportunity={opportunity}
              onBack={() =>
                setSelectedResponse(null)
              }
            />
          ) : (
            <>
              {/* OPPORTUNITY DETAILS */}

              <div
                className="
                  border
                  border-neutral-200
                  bg-white
                  p-4
                "
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    min-[480px]:grid-cols-2
                    lg:grid-cols-4
                  "
                >
                  <DetailItem
                    icon={FileText}
                    label="Reference"
                    value={opportunity.reference}
                  />

                  <DetailItem
                    icon={CalendarDays}
                    label="Posted"
                    value={formatDate(
                      opportunity.createdDate
                    )}
                  />

                  <DetailItem
                    icon={CalendarDays}
                    label="Closing Date"
                    value={formatDate(
                      opportunity.closingDate
                    )}
                  />

                  <DetailItem
                    icon={MapPin}
                    label="Location"
                    value={opportunity.location}
                  />
                </div>

                {/* TARGET */}

                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                    Target Industries
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {opportunity.industries?.map(
                      (industry) => (
                        <span
                          key={industry}
                          className="
                            bg-[#201E64]/10
                            px-2
                            py-1
                            text-[10px]
                            font-bold
                            text-[#201E64]
                          "
                        >
                          {industry}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div
                  className="
                    mt-4
                    border-t
                    border-neutral-100
                    pt-4
                  "
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                    Description
                  </p>

                  <p className="mt-2 text-xs leading-5 text-neutral-600 sm:text-sm">
                    {opportunity.description}
                  </p>
                </div>

                {/* DOCUMENT */}

                {opportunity.documentName && (
                  <div
                    className="
                      mt-4
                      flex
                      min-w-0
                      items-center
                      gap-3
                      border-t
                      border-neutral-100
                      pt-4
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
                        bg-red-50
                      "
                    >
                      <FileText className="h-4 w-4 text-red-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-neutral-400">
                        PDF Document
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-neutral-700">
                        {opportunity.documentName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* RESPONSES HEADER */}

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ color: NAVY }}
                  >
                    Supplier Responses
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Select a supplier to view their
                    complete details.
                  </p>
                </div>

                <span
                  className="
                    w-fit
                    bg-[#201E64]/10
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[#201E64]
                  "
                >
                  {opportunity.responses.length} Responses
                </span>
              </div>

              {/* EMPTY */}

              {opportunity.responses.length === 0 && (
                <div
                  className="
                    mt-3
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    text-center
                  "
                >
                  <Users className="mx-auto h-7 w-7 text-neutral-300" />

                  <p className="mt-3 text-sm font-bold text-neutral-700">
                    No responses yet
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    No suppliers have responded to this
                    opportunity.
                  </p>
                </div>
              )}

              {/* MOBILE */}

              {opportunity.responses.length > 0 && (
                <div
                  className="
                    mt-3
                    grid
                    grid-cols-1
                    gap-3
                    md:hidden
                  "
                >
                  {opportunity.responses.map(
                    (response) => (
                      <ResponseCard
                        key={response.id}
                        response={response}
                        type={type}
                        onClick={() =>
                          setSelectedResponse(
                            response
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}

              {/* DESKTOP */}

              {opportunity.responses.length > 0 && (
                <div
                  className="
                    mt-3
                    hidden
                    overflow-x-auto
                    border
                    border-neutral-200
                    bg-white
                    md:block
                  "
                >
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                          Supplier
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                          B-BBEE
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                          Service
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                          Locality
                        </th>

                        {type === "rfq" && (
                          <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                            Quotation
                          </th>
                        )}

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-neutral-400">
                          Status
                        </th>

                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-neutral-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {opportunity.responses.map(
                        (response) => (
                          <tr
                            key={response.id}
                            onClick={() =>
                              setSelectedResponse(
                                response
                              )
                            }
                            className="
                              cursor-pointer
                              border-t
                              border-neutral-100
                              transition
                              hover:bg-[#201E64]/[0.02]
                            "
                          >
                            <td className="px-4 py-3">
                              <p className="text-xs font-bold text-neutral-800">
                                {response.company}
                              </p>

                              <p className="mt-1 text-[10px] text-neutral-500">
                                {response.firstName}{" "}
                                {response.lastName}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-xs text-neutral-600">
                              {response.beeLevel}
                            </td>

                            <td className="max-w-[220px] px-4 py-3">
                              <p className="line-clamp-2 text-xs text-neutral-600">
                                {response.serviceOffered}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-xs text-neutral-600">
                              {response.locality}
                            </td>

                            {type === "rfq" && (
                              <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-[#201E64]">
                                {response.quotationAmount ||
                                  "—"}
                              </td>
                            )}

                            <td className="px-4 py-3">
                              <ResponseStatusBadge
                                status={response.status}
                              />
                            </td>

                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  setSelectedResponse(
                                    response
                                  );
                                }}
                                className="text-xs font-bold text-[#201E64] hover:underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            shrink-0
            justify-end
            border-t
            border-neutral-200
            bg-white
            p-3
            sm:p-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              bg-[#201E64]
              px-5
              py-2.5
              text-xs
              font-bold
              text-white
              hover:bg-[#2B2889]
              sm:w-auto
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
// MOBILE OPPORTUNITY CARD
// ======================================================

function OpportunityCard({
  opportunity,
  type,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        border
        border-neutral-200
        bg-white
        p-4
        text-left
        shadow-sm
        transition
        hover:border-[#201E64]/40
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <span className="text-[9px] font-bold uppercase text-[#201E64]">
            {type === "tender"
              ? "Tender"
              : "RFQ"}
          </span>

          <h3
            className="
              mt-1
              text-sm
              font-bold
              leading-5
            "
            style={{ color: NAVY }}
          >
            {opportunity.title}
          </h3>

          <p className="mt-1 text-[10px] text-neutral-400">
            {opportunity.reference}
          </p>
        </div>

        <OpportunityStatusBadge
          status={opportunity.status}
        />
      </div>

      <p
        className="
          mt-3
          line-clamp-2
          text-xs
          leading-5
          text-neutral-500
        "
      >
        {opportunity.description}
      </p>

      {/* INDUSTRIES */}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {opportunity.industries
          ?.slice(0, 2)
          .map((industry) => (
            <span
              key={industry}
              className="
                bg-neutral-100
                px-2
                py-1
                text-[9px]
                font-semibold
                text-neutral-600
              "
            >
              {industry}
            </span>
          ))}

        {opportunity.industries?.length > 2 && (
          <span
            className="
              bg-neutral-100
              px-2
              py-1
              text-[9px]
              font-semibold
              text-neutral-500
            "
          >
            +
            {opportunity.industries.length -
              2}{" "}
            more
          </span>
        )}
      </div>

      {/* INFO */}

      <div
        className="
          mt-3
          space-y-2
          border-t
          border-neutral-100
          pt-3
        "
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            Closes{" "}
            {formatDate(
              opportunity.closingDate
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs text-neutral-600">
            {opportunity.location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-neutral-400" />

          <span className="text-xs font-semibold text-neutral-600">
            {opportunity.responses.length}{" "}
            {opportunity.responses.length === 1
              ? "response"
              : "responses"}
          </span>
        </div>
      </div>

      <div
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-1
          text-xs
          font-bold
          text-[#201E64]
        "
      >
        View responses

        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

// ======================================================
// OPPORTUNITY LIST
// ======================================================

function OpportunityList({
  opportunities,
  type,
  search,
  setSearch,
  onSelect,
}) {
  const filtered = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return opportunities;
    }

    return opportunities.filter(
      (opportunity) =>
        opportunity.title
          .toLowerCase()
          .includes(query) ||
        opportunity.reference
          .toLowerCase()
          .includes(query) ||
        opportunity.location
          .toLowerCase()
          .includes(query) ||
        opportunity.status
          .toLowerCase()
          .includes(query) ||
        opportunity.industries?.some(
          (industry) =>
            industry
              .toLowerCase()
              .includes(query)
        )
    );
  }, [opportunities, search]);

  const label =
    type === "tender"
      ? "Tenders"
      : "RFQs";

  return (
    <>
      {/* SEARCH */}

      <div
        className="
          border
          border-neutral-200
          bg-white
          p-3
          shadow-sm
          sm:p-4
        "
      >
        <div className="relative max-w-lg">
          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-neutral-400
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={`Search ${label.toLowerCase()}...`}
            className="
              h-10
              w-full
              border
              border-neutral-300
              bg-white
              pl-9
              pr-3
              text-xs
              outline-none
              placeholder:text-neutral-400
              focus:border-[#201E64]
              focus:ring-1
              focus:ring-[#201E64]/10
              sm:text-sm
            "
          />
        </div>
      </div>

      {/* COUNT */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <h2
          className="text-sm font-bold sm:text-base"
          style={{ color: NAVY }}
        >
          Posted {label}
        </h2>

        <span className="text-xs text-neutral-500">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "opportunity"
            : "opportunities"}
        </span>
      </div>

      {/* MOBILE CARDS */}

      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-3
          md:hidden
        "
      >
        {filtered.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            type={type}
            onClick={() =>
              onSelect(opportunity)
            }
          />
        ))}
      </div>

      {/* DESKTOP TABLE */}

      {filtered.length > 0 && (
        <div
          className="
            mt-3
            hidden
            overflow-x-auto
            border
            border-neutral-200
            bg-white
            shadow-sm
            md:block
          "
        >
          <table className="w-full min-w-[900px]">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Opportunity
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Reference
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Target
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Closing
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Responses
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Status
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((opportunity) => (
                <tr
                  key={opportunity.id}
                  onClick={() =>
                    onSelect(opportunity)
                  }
                  className="
                    cursor-pointer
                    border-t
                    border-neutral-100
                    transition
                    hover:bg-[#201E64]/[0.02]
                  "
                >
                  <td className="px-4 py-3">
                    <p
                      className="
                        max-w-[260px]
                        truncate
                        text-xs
                        font-bold
                      "
                      style={{ color: NAVY }}
                    >
                      {opportunity.title}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-neutral-600">
                    {opportunity.reference}
                  </td>

                  <td className="px-4 py-3">
                    <p className="max-w-[220px] truncate text-xs text-neutral-600">
                      {opportunity.industries?.join(
                        ", "
                      )}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600">
                    {formatDate(
                      opportunity.closingDate
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        bg-neutral-100
                        px-2
                        py-1
                      "
                    >
                      <Users className="h-3.5 w-3.5 text-neutral-500" />

                      <span className="text-xs font-bold text-neutral-700">
                        {opportunity.responses.length}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <OpportunityStatusBadge
                      status={opportunity.status}
                    />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        onSelect(opportunity);
                      }}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-xs
                        font-bold
                        text-[#201E64]
                        hover:underline
                      "
                    >
                      <Eye className="h-3.5 w-3.5" />

                      View Responses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY */}

      {filtered.length === 0 && (
        <div
          className="
            mt-3
            border
            border-neutral-200
            bg-white
            px-4
            py-10
            text-center
          "
        >
          <Search className="mx-auto h-6 w-6 text-neutral-300" />

          <p className="mt-3 text-sm font-bold text-neutral-700">
            No {label.toLowerCase()} found
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Try using a different search.
          </p>
        </div>
      )}
    </>
  );
}

// ======================================================
// MAIN SCREEN
// ======================================================

export default function OpportunitiesScreen() {
  const [activeTab, setActiveTab] =
    useState("tenders");

  const [tenders, setTenders] =
    useState(INITIAL_TENDERS);

  const [rfqs, setRfqs] =
    useState(INITIAL_RFQS);

  const [tenderSearch, setTenderSearch] =
    useState("");

  const [rfqSearch, setRfqSearch] =
    useState("");

  const [
    selectedOpportunity,
    setSelectedOpportunity,
  ] = useState(null);

  // ======================================================
  // CREATE TENDER
  // ======================================================

  const handleCreateTender = (data) => {
    const number = tenders.length + 1;

    const newTender = {
      ...data,

      id: Date.now(),

      reference: `TH-TEN-${String(
        number
      ).padStart(3, "0")}`,
    };

    setTenders((current) => [
      newTender,
      ...current,
    ]);

    console.log(
      "Tender created:",
      newTender
    );

    // API LATER:
    //
    // const formData = new FormData();
    // formData.append("title", data.title);
    // formData.append("description", data.description);
    // formData.append("closing_date", data.closingDate);
    // formData.append("location", data.location);
    // formData.append("document", data.document);
    //
    // await axios.post(
    //   "http://localhost:5000/api/tender",
    //   formData
    // );
  };

  // ======================================================
  // CREATE RFQ
  // ======================================================

  const handleCreateRfq = (data) => {
    const number = rfqs.length + 1;

    const newRfq = {
      ...data,

      id: Date.now(),

      reference: `TH-RFQ-${String(
        number
      ).padStart(3, "0")}`,
    };

    setRfqs((current) => [
      newRfq,
      ...current,
    ]);

    console.log(
      "RFQ created:",
      newRfq
    );

    // API LATER:
    //
    // const formData = new FormData();
    // formData.append("title", data.title);
    // formData.append("description", data.description);
    // formData.append("closing_date", data.closingDate);
    // formData.append("location", data.location);
    //
    // data.industries.forEach((industry) => {
    //   formData.append("industries", industry);
    // });
    //
    // formData.append("document", data.document);
    //
    // await axios.post(
    //   "http://localhost:5000/api/rfq",
    //   formData
    // );
  };

  return (
    <>
      <div className="w-full">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-5
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-extrabold
                tracking-tight
                sm:text-3xl
              "
              style={{ color: NAVY }}
            >
              Business Opportunities
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-xs
                leading-5
                text-neutral-500
                sm:text-sm
              "
            >
              Create and manage Tenders and RFQs and review
              responses from registered suppliers.
            </p>
          </div>

          {/* CREATE SHORTCUT */}

          {activeTab !== "create" && (
            <button
              type="button"
              onClick={() =>
                setActiveTab("create")
              }
              className="
                inline-flex
                h-10
                w-full
                items-center
                justify-center
                gap-2
                bg-[#201E64]
                px-4
                text-xs
                font-bold
                text-white
                transition
                hover:bg-[#2B2889]
                sm:w-auto
              "
            >
              <Plus className="h-4 w-4" />

              Create Opportunity
            </button>
          )}
        </div>

        {/* ==================================================
            TABS
        ================================================== */}

        <div
          className="
            overflow-x-auto
            border-b
            border-neutral-200
          "
        >
          <div className="flex min-w-max">
            {/* TENDERS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("tenders")
              }
              className={`
                flex
                h-11
                items-center
                gap-2
                border-b-2
                px-3
                text-xs
                font-bold
                transition
                sm:px-4

                ${
                  activeTab === "tenders"
                    ? "border-[#201E64] text-[#201E64]"
                    : "border-transparent text-neutral-500 hover:text-[#201E64]"
                }
              `}
            >
              <FileText className="h-4 w-4" />

              Tenders

              <span className="bg-neutral-100 px-2 py-0.5 text-[10px]">
                {tenders.length}
              </span>
            </button>

            {/* RFQ */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("rfqs")
              }
              className={`
                flex
                h-11
                items-center
                gap-2
                border-b-2
                px-3
                text-xs
                font-bold
                transition
                sm:px-4

                ${
                  activeTab === "rfqs"
                    ? "border-[#201E64] text-[#201E64]"
                    : "border-transparent text-neutral-500 hover:text-[#201E64]"
                }
              `}
            >
              <ClipboardList className="h-4 w-4" />

              RFQs

              <span className="bg-neutral-100 px-2 py-0.5 text-[10px]">
                {rfqs.length}
              </span>
            </button>

            {/* CREATE */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("create")
              }
              className={`
                flex
                h-11
                items-center
                gap-2
                border-b-2
                px-3
                text-xs
                font-bold
                transition
                sm:px-4

                ${
                  activeTab === "create"
                    ? "border-[#201E64] text-[#201E64]"
                    : "border-transparent text-neutral-500 hover:text-[#201E64]"
                }
              `}
            >
              <Plus className="h-4 w-4" />

              Create Opportunity
            </button>
          </div>
        </div>

        {/* ==================================================
            TAB CONTENT
        ================================================== */}

        <div className="mt-5">
          {/* TENDERS */}

          {activeTab === "tenders" && (
            <OpportunityList
              opportunities={tenders}
              type="tender"
              search={tenderSearch}
              setSearch={setTenderSearch}
              onSelect={
                setSelectedOpportunity
              }
            />
          )}

          {/* RFQS */}

          {activeTab === "rfqs" && (
            <OpportunityList
              opportunities={rfqs}
              type="rfq"
              search={rfqSearch}
              setSearch={setRfqSearch}
              onSelect={
                setSelectedOpportunity
              }
            />
          )}

          {/* CREATE */}

          {activeTab === "create" && (
            <CreateOpportunityForm
              onCreateTender={
                handleCreateTender
              }
              onCreateRfq={
                handleCreateRfq
              }
            />
          )}
        </div>
      </div>

      {/* ==================================================
          OPPORTUNITY DETAILS
      ================================================== */}

      <OpportunityDetailsModal
        key={
          selectedOpportunity
            ? `${activeTab}-${selectedOpportunity.id}`
            : "closed"
        }
        opportunity={
          selectedOpportunity
        }
        type={
          activeTab === "rfqs"
            ? "rfq"
            : "tender"
        }
        onClose={() =>
          setSelectedOpportunity(null)
        }
      />
    </>
  );
}