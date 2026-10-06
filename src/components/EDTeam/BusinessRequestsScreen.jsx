import React, { useMemo, useState } from "react";
import {
  Search,
  Inbox,
  UserRound,
  Building2,
  MapPin,
  BriefcaseBusiness,
  BadgeCheck,
  Wallet,
  Users,
  CalendarDays,
  MessageSquareText,
  X,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// DUMMY BUSINESS REQUEST DATA
// Replace with API data later
// ======================================================

const BUSINESS_REQUESTS = [
  {
    id: 1,

    subject: "Financial Management Support",

    description:
      "We need assistance with improving our financial management processes, budgeting, cash flow planning and preparing financial statements.",

    supportArea: "Financial Management",

    requestDate: "05 Oct 2026",

    preferredDate: "12 Oct 2026",

    status: "PENDING",

    supplier: {
      id: 1,

      firstName: "Thabo",

      lastName: "Mokoena",

      email: "thabo@mokoena.co.za",

      phone: "071 234 5678",

      company: "Mokoena Agricultural Services",

      beeLevel: "Level 1",

      bwoOwnership: 100,

      boOwnership: 100,

      serviceOffered:
        "Agricultural services, crop maintenance and farm support",

      locality: "Johannesburg, Gauteng",

      annualRevenue: "R1,000,000 - R5,000,000",

      permanentEmployees: 12,
    },
  },

  {
    id: 2,

    subject: "Funding Assistance",

    description:
      "Our business is looking for funding to purchase additional vehicles and equipment so that we can expand our logistics operations.",

    supportArea: "Funding & Investment",

    requestDate: "04 Oct 2026",

    preferredDate: "15 Oct 2026",

    status: "IN REVIEW",

    supplier: {
      id: 2,

      firstName: "Lerato",

      lastName: "Nkosi",

      email: "lerato@nkosilogistics.co.za",

      phone: "072 555 8214",

      company: "Nkosi Logistics Solutions",

      beeLevel: "Level 2",

      bwoOwnership: 51,

      boOwnership: 75,

      serviceOffered:
        "Transportation, logistics and freight services",

      locality: "Durban, KwaZulu-Natal",

      annualRevenue: "R5,000,000 - R10,000,000",

      permanentEmployees: 28,
    },
  },

  {
    id: 3,

    subject: "Business Strategy Guidance",

    description:
      "We would like assistance developing a growth strategy and identifying new opportunities for expanding our business into additional markets.",

    supportArea: "Business Strategy",

    requestDate: "03 Oct 2026",

    preferredDate: "10 Oct 2026",

    status: "PENDING",

    supplier: {
      id: 3,

      firstName: "Nomsa",

      lastName: "Dlamini",

      email: "nomsa@dlaminibusiness.co.za",

      phone: "073 441 2209",

      company: "Dlamini Business Solutions",

      beeLevel: "Level 1",

      bwoOwnership: 100,

      boOwnership: 100,

      serviceOffered:
        "Business consulting and administrative services",

      locality: "Pretoria, Gauteng",

      annualRevenue: "R500,000 - R1,000,000",

      permanentEmployees: 7,
    },
  },

  {
    id: 4,

    subject: "Tender Readiness Support",

    description:
      "We need assistance understanding tender requirements and preparing the correct compliance documentation before submitting tender applications.",

    supportArea: "Procurement & Tenders",

    requestDate: "01 Oct 2026",

    preferredDate: "09 Oct 2026",

    status: "IN REVIEW",

    supplier: {
      id: 4,

      firstName: "Sipho",

      lastName: "Khumalo",

      email: "sipho@khumaloengineering.co.za",

      phone: "074 998 1132",

      company: "Khumalo Engineering",

      beeLevel: "Level 3",

      bwoOwnership: 30,

      boOwnership: 60,

      serviceOffered:
        "Engineering, maintenance and equipment repairs",

      locality: "Richards Bay, KwaZulu-Natal",

      annualRevenue: "R10,000,000 - R20,000,000",

      permanentEmployees: 42,
    },
  },

  {
    id: 5,

    subject: "Marketing Support",

    description:
      "We would like guidance on improving our marketing strategy, online presence and customer acquisition process.",

    supportArea: "Marketing & Sales",

    requestDate: "30 Sep 2026",

    preferredDate: "08 Oct 2026",

    status: "COMPLETED",

    supplier: {
      id: 5,

      firstName: "Amanda",

      lastName: "Ndlovu",

      email: "amanda@ndlovucleaning.co.za",

      phone: "076 334 8821",

      company: "Ndlovu Cleaning Services",

      beeLevel: "Level 1",

      bwoOwnership: 100,

      boOwnership: 100,

      serviceOffered:
        "Commercial cleaning and facilities management",

      locality: "Johannesburg, Gauteng",

      annualRevenue: "R1,000,000 - R5,000,000",

      permanentEmployees: 34,
    },
  },

  {
    id: 6,

    subject: "Business Expansion Support",

    description:
      "We need advice on expanding our ICT services and identifying opportunities to provide technology services to larger organisations.",

    supportArea: "Growth & Expansion",

    requestDate: "28 Sep 2026",

    preferredDate: "07 Oct 2026",

    status: "COMPLETED",

    supplier: {
      id: 6,

      firstName: "Mpho",

      lastName: "Mahlangu",

      email: "mpho@mahlanguict.co.za",

      phone: "078 229 4110",

      company: "Mahlangu ICT Solutions",

      beeLevel: "Level 2",

      bwoOwnership: 40,

      boOwnership: 80,

      serviceOffered:
        "ICT support, software development and cloud services",

      locality: "Midrand, Gauteng",

      annualRevenue: "R5,000,000 - R10,000,000",

      permanentEmployees: 18,
    },
  },
];

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  let classes =
    "border-neutral-200 bg-neutral-50 text-neutral-600";

  if (status === "PENDING") {
    classes =
      "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "IN REVIEW") {
    classes =
      "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "COMPLETED") {
    classes =
      "border-green-200 bg-green-50 text-green-700";
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
            sm:text-sm
          "
        >
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// BUSINESS REQUEST DETAILS MODAL
// ======================================================

function BusinessRequestDetails({
  request,
  onClose,
  onStatusUpdate,
}) {
  if (!request) {
    return null;
  }

  const supplier = request.supplier;

  const fullName =
    `${supplier.firstName} ${supplier.lastName}`;

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
        sm:p-5
      "
      onClick={onClose}
    >
      <div
        className="
          flex
          max-h-[92dvh]
          w-full
          flex-col
          overflow-hidden
          bg-white
          shadow-xl
          sm:max-w-4xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ==================================================
            MODAL HEADER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-neutral-200
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h2
                className="
                  text-lg
                  font-bold
                  sm:text-xl
                "
                style={{ color: NAVY }}
              >
                Business Advisory Request
              </h2>

              <StatusBadge
                status={request.status}
              />
            </div>

            <p
              className="
                mt-1
                text-xs
                text-neutral-500
              "
            >
              Request #{request.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request details"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              text-neutral-500
              transition
              hover:bg-neutral-100
              hover:text-neutral-900
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ==================================================
            SCROLLABLE CONTENT
        ================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-5
          "
        >
          {/* ==================================================
              REQUEST INFORMATION
          ================================================== */}

          <section>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <MessageSquareText
                className="h-4 w-4"
                style={{ color: NAVY }}
              />

              <h3
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                Request Information
              </h3>
            </div>

            <div
              className="
                mt-3
                border
                border-neutral-200
                bg-neutral-50
                p-4
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                {/* SUBJECT */}

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Subject
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-bold
                      text-neutral-800
                    "
                  >
                    {request.subject}
                  </p>
                </div>

                {/* SUPPORT AREA */}

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Support Area
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-neutral-800
                    "
                  >
                    {request.supportArea}
                  </p>
                </div>

                {/* REQUEST DATE */}

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Request Date
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-neutral-700
                    "
                  >
                    {request.requestDate}
                  </p>
                </div>

                {/* PREFERRED DATE */}

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Preferred Date
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-neutral-700
                    "
                  >
                    {request.preferredDate}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}

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
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-neutral-400
                  "
                >
                  Description
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-neutral-600
                    sm:text-sm
                    sm:leading-6
                  "
                >
                  {request.description}
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================
              UPDATE STATUS
          ================================================== */}

          <section className="mt-6">
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <BadgeCheck
                className="h-4 w-4"
                style={{ color: NAVY }}
              />

              <h3
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                Update Request Status
              </h3>
            </div>

            <div
              className="
                mt-3
                border
                border-neutral-200
                bg-white
                p-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                {/* STATUS SELECT */}

                <div
                  className="
                    w-full
                    sm:max-w-xs
                  "
                >
                  <label
                    htmlFor={`status-${request.id}`}
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-neutral-700
                    "
                  >
                    Request Status
                  </label>

                  <select
                    id={`status-${request.id}`}
                    value={request.status}
                    onChange={(event) =>
                      onStatusUpdate(
                        request.id,
                        event.target.value
                      )
                    }
                    className="
                      h-10
                      w-full
                      border
                      border-neutral-300
                      bg-white
                      px-3
                      text-xs
                      font-medium
                      text-neutral-700
                      outline-none
                      transition
                      focus:border-[#201E64]
                      focus:ring-1
                      focus:ring-[#201E64]/10
                    "
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="IN REVIEW">
                      In Review
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>
                </div>

                {/* CURRENT STATUS */}

                <div>
                  <p
                    className="
                      mb-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Current Status
                  </p>

                  <StatusBadge
                    status={request.status}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              SUPPLIER INFORMATION
          ================================================== */}

          <section className="mt-6">
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <UserRound
                className="h-4 w-4"
                style={{ color: NAVY }}
              />

              <h3
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                Supplier Information
              </h3>
            </div>

            <div
              className="
                mt-3
                border
                border-neutral-200
                bg-white
                p-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                "
              >
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

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      text-base
                      font-bold
                    "
                    style={{ color: NAVY }}
                  >
                    {fullName}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-neutral-500
                    "
                  >
                    {supplier.company}
                  </p>
                </div>
              </div>

              {/* CONTACT INFORMATION */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                {/* EMAIL */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    border-t
                    border-neutral-100
                    pt-3
                  "
                >
                  <Mail
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-neutral-400
                    "
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        text-neutral-400
                      "
                    >
                      Email
                    </p>

                    <p
                      className="
                        mt-0.5
                        break-all
                        text-xs
                        text-neutral-700
                      "
                    >
                      {supplier.email}
                    </p>
                  </div>
                </div>

                {/* PHONE */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    border-t
                    border-neutral-100
                    pt-3
                  "
                >
                  <Phone
                    className="
                      h-4
                      w-4
                      shrink-0
                      text-neutral-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        text-neutral-400
                      "
                    >
                      Phone Number
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-neutral-700
                      "
                    >
                      {supplier.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              BUSINESS INFORMATION
          ================================================== */}

          <section className="mt-6">
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Building2
                className="h-4 w-4"
                style={{ color: NAVY }}
              />

              <h3
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                Business Information
              </h3>
            </div>

            <div
              className="
                mt-3
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              {/* COMPANY */}

              <DetailItem
                icon={Building2}
                label="Company"
                value={supplier.company}
              />

              {/* BEE */}

              <DetailItem
                icon={BadgeCheck}
                label="B-BBEE Level"
                value={supplier.beeLevel}
              />

              {/* BWO */}

              <DetailItem
                icon={UserRound}
                label="BWO Ownership"
                value={`${supplier.bwoOwnership}%`}
              />

              {/* BO */}

              <DetailItem
                icon={Users}
                label="BO Ownership"
                value={`${supplier.boOwnership}%`}
              />

              {/* SERVICE */}

              <DetailItem
                icon={BriefcaseBusiness}
                label="Service Offered"
                value={
                  supplier.serviceOffered
                }
              />

              {/* LOCALITY */}

              <DetailItem
                icon={MapPin}
                label="Locality"
                value={supplier.locality}
              />

              {/* REVENUE */}

              <DetailItem
                icon={Wallet}
                label="Annual Revenue"
                value={
                  supplier.annualRevenue
                }
              />

              {/* EMPLOYEES */}

              <DetailItem
                icon={Users}
                label="Permanent Employees"
                value={
                  supplier.permanentEmployees
                }
              />
            </div>
          </section>
        </div>

        {/* ==================================================
            MODAL FOOTER
        ================================================== */}

        <div
          className="
            flex
            shrink-0
            justify-end
            border-t
            border-neutral-200
            p-4
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
              transition
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
// MOBILE REQUEST CARD
// ======================================================

function RequestCard({
  request,
  onClick,
}) {
  const supplier = request.supplier;

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
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#201E64]
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
            className="
              text-sm
              font-bold
              leading-5
            "
            style={{ color: NAVY }}
          >
            {request.subject}
          </p>

          <p
            className="
              mt-1
              truncate
              text-xs
              text-neutral-500
            "
          >
            {supplier.company}
          </p>
        </div>

        <StatusBadge
          status={request.status}
        />
      </div>

      <div
        className="
          mt-3
          border-t
          border-neutral-100
          pt-3
        "
      >
        {/* SUPPLIER */}

        <div
          className="
            flex
            items-center
            gap-2
            text-[11px]
            text-neutral-500
          "
        >
          <UserRound className="h-3.5 w-3.5 shrink-0" />

          <span className="truncate">
            {supplier.firstName}{" "}
            {supplier.lastName}
          </span>
        </div>

        {/* SUPPORT AREA */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-[11px]
            text-neutral-500
          "
        >
          <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />

          <span className="truncate">
            {request.supportArea}
          </span>
        </div>

        {/* DATE */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-[11px]
            text-neutral-500
          "
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />

          <span>
            {request.requestDate}
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
          font-semibold
          text-[#201E64]
        "
      >
        View request

        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

// ======================================================
// BUSINESS REQUESTS SCREEN
// ======================================================

export default function BusinessRequestsScreen() {
  // ======================================================
  // STATE
  // ======================================================

  const [requests, setRequests] =
    useState(BUSINESS_REQUESTS);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null);

  // ======================================================
  // FILTER REQUESTS
  // ======================================================

  const filteredRequests = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return requests.filter(
      (request) => {
        const supplier =
          request.supplier;

        const fullName =
          `${supplier.firstName} ${supplier.lastName}`.toLowerCase();

        const matchesSearch =
          !query ||
          fullName.includes(query) ||
          supplier.company
            .toLowerCase()
            .includes(query) ||
          request.subject
            .toLowerCase()
            .includes(query) ||
          request.supportArea
            .toLowerCase()
            .includes(query) ||
          supplier.locality
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "ALL" ||
          request.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    requests,
    search,
    statusFilter,
  ]);

  // ======================================================
  // REQUEST COUNTS
  // ======================================================

  const pendingCount =
    requests.filter(
      (request) =>
        request.status === "PENDING"
    ).length;

  const reviewCount =
    requests.filter(
      (request) =>
        request.status === "IN REVIEW"
    ).length;

  const completedCount =
    requests.filter(
      (request) =>
        request.status === "COMPLETED"
    ).length;

  // ======================================================
  // UPDATE REQUEST STATUS
  // ======================================================

  const handleStatusUpdate = (
    requestId,
    newStatus
  ) => {
    // Update main request list

    setRequests(
      (currentRequests) =>
        currentRequests.map(
          (request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: newStatus,
                }
              : request
        )
    );

    // Update selected request modal immediately

    setSelectedRequest(
      (currentRequest) => {
        if (
          !currentRequest ||
          currentRequest.id !==
            requestId
        ) {
          return currentRequest;
        }

        return {
          ...currentRequest,
          status: newStatus,
        };
      }
    );

    console.log(
      `Request ${requestId} status changed to ${newStatus}`
    );

    // ==================================================
    // API WILL BE CONNECTED HERE LATER
    // ==================================================
    //
    // Example:
    //
    // try {
    //   await axios.patch(
    //     `http://localhost:5000/api/advisory/${requestId}/status`,
    //     {
    //       status: newStatus,
    //     }
    //   );
    // } catch (error) {
    //   console.error(
    //     "Failed to update request status:",
    //     error
    //   );
    // }
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
            gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
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
              Business Requests
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
              View, manage and update
              business advisory requests
              submitted by registered
              suppliers.
            </p>
          </div>

          {/* TOTAL REQUESTS */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              bg-[#201E64]/10
              px-3
              py-2
            "
          >
            <Inbox
              className="h-4 w-4"
              style={{ color: NAVY }}
            />

            <span
              className="
                text-xs
                font-bold
              "
              style={{ color: NAVY }}
            >
              {requests.length} Requests
            </span>
          </div>
        </div>

        {/* ==================================================
            STATUS COUNTS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            min-[420px]:grid-cols-3
          "
        >
          {/* PENDING */}

          <button
            type="button"
            onClick={() =>
              setStatusFilter("PENDING")
            }
            className="
              border
              border-neutral-200
              bg-white
              p-3
              text-left
              shadow-sm
              transition
              hover:border-amber-300
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-neutral-400
              "
            >
              Pending
            </p>

            <p
              className="
                mt-1
                text-xl
                font-extrabold
                text-amber-600
              "
            >
              {pendingCount}
            </p>
          </button>

          {/* IN REVIEW */}

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "IN REVIEW"
              )
            }
            className="
              border
              border-neutral-200
              bg-white
              p-3
              text-left
              shadow-sm
              transition
              hover:border-blue-300
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-neutral-400
              "
            >
              In Review
            </p>

            <p
              className="
                mt-1
                text-xl
                font-extrabold
                text-blue-600
              "
            >
              {reviewCount}
            </p>
          </button>

          {/* COMPLETED */}

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "COMPLETED"
              )
            }
            className="
              border
              border-neutral-200
              bg-white
              p-3
              text-left
              shadow-sm
              transition
              hover:border-green-300
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-neutral-400
              "
            >
              Completed
            </p>

            <p
              className="
                mt-1
                text-xl
                font-extrabold
                text-green-600
              "
            >
              {completedCount}
            </p>
          </button>
        </div>

        {/* ==================================================
            SEARCH + FILTER
        ================================================== */}

        <div
          className="
            mt-4
            border
            border-neutral-200
            bg-white
            p-3
            shadow-sm
            sm:p-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              md:flex-row
              md:items-center
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
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
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search supplier, company or request..."
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
                  transition
                  placeholder:text-neutral-400
                  focus:border-[#201E64]
                  focus:ring-1
                  focus:ring-[#201E64]/10
                  sm:text-sm
                "
              />
            </div>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="
                h-10
                w-full
                border
                border-neutral-300
                bg-white
                px-3
                text-xs
                text-neutral-700
                outline-none
                transition
                focus:border-[#201E64]
                focus:ring-1
                focus:ring-[#201E64]/10
                md:w-[180px]
              "
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="IN REVIEW">
                In Review
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* ==================================================
            RESULTS HEADER
        ================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <h2
            className="
              text-sm
              font-bold
              sm:text-base
            "
            style={{ color: NAVY }}
          >
            Advisory Requests
          </h2>

          <span className="text-xs text-neutral-500">
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1
              ? "result"
              : "results"}
          </span>
        </div>

        {/* ==================================================
            DESKTOP / TABLET TABLE
        ================================================== */}

        <div
          className="
            mt-3
            hidden
            overflow-hidden
            border
            border-neutral-200
            bg-white
            shadow-sm
            md:block
          "
        >
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[900px]
              "
            >
              <thead className="bg-neutral-50">
                <tr
                  className="
                    border-b
                    border-neutral-200
                  "
                >
                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Supplier
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Company
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Request
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Support Area
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Date
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-4
                      py-3
                      text-right
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map(
                  (request) => {
                    const supplier =
                      request.supplier;

                    return (
                      <tr
                        key={request.id}
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                        className="
                          cursor-pointer
                          border-b
                          border-neutral-100
                          transition
                          last:border-b-0
                          hover:bg-[#201E64]/[0.02]
                        "
                      >
                        {/* SUPPLIER */}

                        <td className="px-4 py-3">
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
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                bg-[#201E64]/10
                              "
                            >
                              <UserRound
                                className="h-4 w-4"
                                style={{
                                  color:
                                    NAVY,
                                }}
                              />
                            </div>

                            <span
                              className="
                                whitespace-nowrap
                                text-xs
                                font-bold
                                text-neutral-800
                              "
                            >
                              {
                                supplier.firstName
                              }{" "}
                              {
                                supplier.lastName
                              }
                            </span>
                          </div>
                        </td>

                        {/* COMPANY */}

                        <td
                          className="
                            max-w-[180px]
                            px-4
                            py-3
                            text-xs
                            text-neutral-600
                          "
                        >
                          <p className="truncate">
                            {
                              supplier.company
                            }
                          </p>
                        </td>

                        {/* REQUEST */}

                        <td
                          className="
                            max-w-[190px]
                            px-4
                            py-3
                            text-xs
                            font-semibold
                            text-neutral-700
                          "
                        >
                          <p className="truncate">
                            {
                              request.subject
                            }
                          </p>
                        </td>

                        {/* SUPPORT AREA */}

                        <td
                          className="
                            px-4
                            py-3
                            text-xs
                            text-neutral-500
                          "
                        >
                          {
                            request.supportArea
                          }
                        </td>

                        {/* DATE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-4
                            py-3
                            text-xs
                            text-neutral-500
                          "
                        >
                          {
                            request.requestDate
                          }
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-3">
                          <StatusBadge
                            status={
                              request.status
                            }
                          />
                        </td>

                        {/* VIEW */}

                        <td
                          className="
                            px-4
                            py-3
                            text-right
                          "
                        >
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              setSelectedRequest(
                                request
                              );
                            }}
                            className="
                              inline-flex
                              items-center
                              gap-1
                              text-xs
                              font-semibold
                              text-[#201E64]
                              hover:underline
                            "
                          >
                            View

                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            MOBILE CARDS
        ================================================== */}

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            md:hidden
          "
        >
          {filteredRequests.map(
            (request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() =>
                  setSelectedRequest(
                    request
                  )
                }
              />
            )
          )}
        </div>

        {/* ==================================================
            NO RESULTS
        ================================================== */}

        {filteredRequests.length ===
          0 && (
          <div
            className="
              mt-3
              border
              border-neutral-200
              bg-white
              px-4
              py-10
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                bg-neutral-100
              "
            >
              <Search className="h-5 w-5 text-neutral-400" />
            </div>

            <h3
              className="
                mt-3
                text-sm
                font-bold
                text-neutral-700
              "
            >
              No requests found
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-neutral-500
              "
            >
              Try changing your search or
              status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="
                mt-4
                text-xs
                font-semibold
                text-[#201E64]
                hover:underline
              "
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          REQUEST DETAILS MODAL
      ================================================== */}

      <BusinessRequestDetails
        request={selectedRequest}
        onClose={() =>
          setSelectedRequest(null)
        }
        onStatusUpdate={
          handleStatusUpdate
        }
      />
    </>
  );
}