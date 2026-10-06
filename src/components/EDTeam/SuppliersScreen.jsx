import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  Building2,
  MapPin,
  BriefcaseBusiness,
  BadgeCheck,
  Wallet,
  UserRound,
  X,
  ChevronRight,
} from "lucide-react";

const NAVY = "#201E64";

// ======================================================
// DUMMY SUPPLIER DATA
// Replace with API data later
// ======================================================

const SUPPLIERS = [
  {
    id: 1,
    firstName: "Thabo",
    lastName: "Mokoena",
    company: "Mokoena Agricultural Services",
    email: "thabo@mokoena.co.za",
    phone: "071 234 5678",

    beeLevel: "Level 1",
    bwoOwnership: 100,
    boOwnership: 100,

    serviceOffered:
      "Agricultural services, crop maintenance and farm support",

    locality: "Johannesburg, Gauteng",

    annualRevenue: "R1,000,000 - R5,000,000",

    permanentEmployees: 12,
  },

  {
    id: 2,
    firstName: "Lerato",
    lastName: "Nkosi",
    company: "Nkosi Logistics Solutions",
    email: "lerato@nkosilogistics.co.za",
    phone: "072 555 8214",

    beeLevel: "Level 2",
    bwoOwnership: 51,
    boOwnership: 75,

    serviceOffered:
      "Transportation, logistics and freight services",

    locality: "Durban, KwaZulu-Natal",

    annualRevenue: "R5,000,000 - R10,000,000",

    permanentEmployees: 28,
  },

  {
    id: 3,
    firstName: "Nomsa",
    lastName: "Dlamini",
    company: "Dlamini Business Solutions",
    email: "nomsa@dlaminibusiness.co.za",
    phone: "073 441 2209",

    beeLevel: "Level 1",
    bwoOwnership: 100,
    boOwnership: 100,

    serviceOffered:
      "Business consulting and administrative services",

    locality: "Pretoria, Gauteng",

    annualRevenue: "R500,000 - R1,000,000",

    permanentEmployees: 7,
  },

  {
    id: 4,
    firstName: "Sipho",
    lastName: "Khumalo",
    company: "Khumalo Engineering",
    email: "sipho@khumaloengineering.co.za",
    phone: "074 998 1132",

    beeLevel: "Level 3",
    bwoOwnership: 30,
    boOwnership: 60,

    serviceOffered:
      "Engineering, maintenance and equipment repairs",

    locality: "Richards Bay, KwaZulu-Natal",

    annualRevenue: "R10,000,000 - R20,000,000",

    permanentEmployees: 42,
  },

  {
    id: 5,
    firstName: "Amanda",
    lastName: "Ndlovu",
    company: "Ndlovu Cleaning Services",
    email: "amanda@ndlovucleaning.co.za",
    phone: "076 334 8821",

    beeLevel: "Level 1",
    bwoOwnership: 100,
    boOwnership: 100,

    serviceOffered:
      "Commercial cleaning and facilities management",

    locality: "Johannesburg, Gauteng",

    annualRevenue: "R1,000,000 - R5,000,000",

    permanentEmployees: 34,
  },

  {
    id: 6,
    firstName: "Mpho",
    lastName: "Mahlangu",
    company: "Mahlangu ICT Solutions",
    email: "mpho@mahlanguict.co.za",
    phone: "078 229 4110",

    beeLevel: "Level 2",
    bwoOwnership: 40,
    boOwnership: 80,

    serviceOffered:
      "ICT support, software development and cloud services",

    locality: "Midrand, Gauteng",

    annualRevenue: "R5,000,000 - R10,000,000",

    permanentEmployees: 18,
  },
];

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
          {value}
        </p>
      </div>
    </div>
  );
}

// ======================================================
// SUPPLIER DETAILS
// ======================================================

function SupplierDetails({
  supplier,
  onClose,
}) {
  if (!supplier) return null;

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
          max-h-[90dvh]
          w-full
          flex-col
          overflow-hidden
          bg-white
          shadow-xl
          sm:max-w-3xl
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
            gap-4
            border-b
            border-neutral-200
            px-4
            py-4
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
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
              <h2
                className="
                  truncate
                  text-lg
                  font-bold
                  sm:text-xl
                "
                style={{ color: NAVY }}
              >
                {fullName}
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-neutral-500
                "
              >
                {supplier.company}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close supplier details"
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

        {/* CONTENT */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-5
          "
        >
          {/* CONTACT */}

          <div
            className="
              mb-5
              border-b
              border-neutral-200
              pb-4
            "
          >
            <h3
              className="
                text-sm
                font-bold
              "
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
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">
                  Email
                </p>

                <p className="mt-1 break-all text-xs text-neutral-700">
                  {supplier.email}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-400">
                  Phone Number
                </p>

                <p className="mt-1 text-xs text-neutral-700">
                  {supplier.phone}
                </p>
              </div>
            </div>
          </div>

          {/* BUSINESS */}

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
            "
          >
            <DetailItem
              icon={Building2}
              label="Company"
              value={supplier.company}
            />

            <DetailItem
              icon={BadgeCheck}
              label="B-BBEE Level"
              value={supplier.beeLevel}
            />

            <DetailItem
              icon={UserRound}
              label="BWO Ownership"
              value={`${supplier.bwoOwnership}%`}
            />

            <DetailItem
              icon={Users}
              label="BO Ownership"
              value={`${supplier.boOwnership}%`}
            />

            <DetailItem
              icon={BriefcaseBusiness}
              label="Service Offered"
              value={supplier.serviceOffered}
            />

            <DetailItem
              icon={MapPin}
              label="Locality"
              value={supplier.locality}
            />

            <DetailItem
              icon={Wallet}
              label="Annual Revenue"
              value={supplier.annualRevenue}
            />

            <DetailItem
              icon={Users}
              label="Permanent Employees"
              value={
                supplier.permanentEmployees
              }
            />
          </div>
        </div>

        {/* FOOTER */}

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
// SUPPLIER MOBILE CARD
// ======================================================

function SupplierCard({
  supplier,
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
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#201E64]
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
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
              truncate
              text-sm
              font-bold
            "
            style={{ color: NAVY }}
          >
            {supplier.firstName}{" "}
            {supplier.lastName}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              text-neutral-500
            "
          >
            {supplier.company}
          </p>
        </div>

        <ChevronRight
          className="
            mt-2
            h-4
            w-4
            shrink-0
            text-neutral-400
          "
        />
      </div>

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          border-t
          border-neutral-100
          pt-3
          text-[11px]
          text-neutral-500
        "
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" />

        <span className="truncate">
          {supplier.locality}
        </span>
      </div>
    </button>
  );
}

// ======================================================
// SUPPLIERS SCREEN
// ======================================================

export default function SuppliersScreen() {
  const [search, setSearch] =
    useState("");

  const [
    selectedSupplier,
    setSelectedSupplier,
  ] = useState(null);

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredSuppliers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return SUPPLIERS;
    }

    return SUPPLIERS.filter(
      (supplier) => {
        const fullName =
          `${supplier.firstName} ${supplier.lastName}`.toLowerCase();

        return (
          fullName.includes(query) ||
          supplier.company
            .toLowerCase()
            .includes(query) ||
          supplier.locality
            .toLowerCase()
            .includes(query) ||
          supplier.serviceOffered
            .toLowerCase()
            .includes(query) ||
          supplier.beeLevel
            .toLowerCase()
            .includes(query)
        );
      }
    );
  }, [search]);

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
              Registered Suppliers
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
              View registered suppliers and
              their business information.
            </p>
          </div>

          {/* TOTAL */}

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
            <Users
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
              {SUPPLIERS.length} Registered
              Suppliers
            </span>
          </div>
        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

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
          <div
            className="
              relative
              w-full
              sm:max-w-md
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
              placeholder="Search supplier or company..."
              className="
                h-10
                w-full
                border
                border-neutral-300
                bg-white
                pl-9
                pr-3
                text-xs
                text-neutral-900
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

          <p
            className="
              mt-2
              text-[10px]
              text-neutral-400
              sm:text-[11px]
            "
          >
            Search by supplier name,
            company, locality, service or
            B-BBEE level.
          </p>
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
            Suppliers
          </h2>

          <span className="text-xs text-neutral-500">
            {filteredSuppliers.length}{" "}
            {filteredSuppliers.length === 1
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
                min-w-[760px]
              "
            >
              <thead
                className="
                  bg-neutral-50
                "
              >
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
                    Locality
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
                    B-BBEE
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
                {filteredSuppliers.map(
                  (supplier) => (
                    <tr
                      key={supplier.id}
                      onClick={() =>
                        setSelectedSupplier(
                          supplier
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
                      {/* NAME */}

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
                                color: NAVY,
                              }}
                            />
                          </div>

                          <div className="min-w-0">
                            <p
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
                            </p>

                            <p
                              className="
                                mt-0.5
                                max-w-[180px]
                                truncate
                                text-[10px]
                                text-neutral-400
                              "
                            >
                              {supplier.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COMPANY */}

                      <td
                        className="
                          px-4
                          py-3
                          text-xs
                          text-neutral-600
                        "
                      >
                        {supplier.company}
                      </td>

                      {/* LOCALITY */}

                      <td
                        className="
                          px-4
                          py-3
                          text-xs
                          text-neutral-500
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                          "
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />

                          <span>
                            {
                              supplier.locality
                            }
                          </span>
                        </div>
                      </td>

                      {/* BEE */}

                      <td className="px-4 py-3">
                        <span
                          className="
                            inline-flex
                            bg-[#201E64]/10
                            px-2
                            py-1
                            text-[10px]
                            font-bold
                            text-[#201E64]
                          "
                        >
                          {supplier.beeLevel}
                        </span>
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
                          onClick={(event) => {
                            event.stopPropagation();

                            setSelectedSupplier(
                              supplier
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
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            MOBILE SUPPLIER CARDS
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
          {filteredSuppliers.map(
            (supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onClick={() =>
                  setSelectedSupplier(
                    supplier
                  )
                }
              />
            )
          )}
        </div>

        {/* ==================================================
            NO RESULTS
        ================================================== */}

        {filteredSuppliers.length ===
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
              No suppliers found
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-neutral-500
              "
            >
              Try searching using a
              different supplier or company
              name.
            </p>

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="
                mt-4
                text-xs
                font-semibold
                text-[#201E64]
                hover:underline
              "
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          SUPPLIER DETAILS MODAL
      ================================================== */}

      <SupplierDetails
        supplier={selectedSupplier}
        onClose={() =>
          setSelectedSupplier(null)
        }
      />
    </>
  );
}