import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Inbox,
  CalendarDays,
  BriefcaseBusiness,
  Bell,
  Menu,
  X,
  LogOut,
  Plus,
  UserRound,
  TrendingUp,
  ChevronRight,
  CircleDollarSign,
  MessageSquareText,
  ClipboardList,
} from "lucide-react";
import SuppliersScreen from "./SuppliersScreen";
import BusinessRequestsScreen from "./BusinessRequestsScreen";
import MeetingsWorkshopsScreen from "./MeetingsWorkshopsScreen";
import OpportunitiesScreen from "./OpportunitiesScreen";
const NAVY = "#201E64";

// ======================================================
// DUMMY DATA
// Replace with API data later
// ======================================================

const DASHBOARD_DATA = {
  teamName: "Enterprise Development Team",

  registeredSuppliers: 248,

  opportunitiesCreated: 36,

  fundingOpportunitiesCreated: 12,

  advisoryRequests: 28,

  meetingsCreated: 18,

  workshopsCreated: 9,

  programmesCreated: 6,

  genderDistribution: {
    male: 124,
    female: 109,
    other: 15,
  },
};

// ======================================================
// RECENT ADVISORY REQUESTS
// ======================================================

const RECENT_ADVISORY_REQUESTS = [
  {
    id: 1,
    businessName: "Mavuso Trading",
    supportArea: "Financial Management",
    date: "05 Oct 2026",
    status: "PENDING",
  },
  {
    id: 2,
    businessName: "Khula Agricultural Services",
    supportArea: "Funding & Investment",
    date: "04 Oct 2026",
    status: "PENDING",
  },
  {
    id: 3,
    businessName: "Greenway Logistics",
    supportArea: "Business Strategy",
    date: "03 Oct 2026",
    status: "IN REVIEW",
  },
];

// ======================================================
// NAVIGATION
// ======================================================

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    icon: Users,
  },
  {
    id: "requests",
    label: "Business Requests",
    icon: Inbox,
  },
  {
    id: "meetings",
    label: "Meetings & Workshops",
    icon: CalendarDays,
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: BriefcaseBusiness,
  },
];

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div
      className="
        min-w-0
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-500">
            {title}
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-extrabold
              tracking-tight
              sm:text-3xl
            "
            style={{ color: NAVY }}
          >
            {value}
          </p>
        </div>

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
          <Icon
            className="h-5 w-5"
            style={{ color: NAVY }}
          />
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-4 text-neutral-400">
        {description}
      </p>
    </div>
  );
}

// ======================================================
// QUICK ACTION
// ======================================================

function QuickAction({
  title,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        border
        border-neutral-200
        bg-white
        p-3
        text-left
        transition
        hover:border-[#201E64]/40
        hover:bg-[#201E64]/[0.02]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#201E64]
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
        <Icon
          className="h-4 w-4"
          style={{ color: NAVY }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-xs
            font-bold
            sm:text-sm
          "
          style={{ color: NAVY }}
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            line-clamp-1
            text-[11px]
            text-neutral-500
          "
        >
          {description}
        </p>
      </div>

      <ChevronRight
        className="
          h-4
          w-4
          shrink-0
          text-neutral-400
          transition
          group-hover:text-[#201E64]
        "
      />
    </button>
  );
}

// ======================================================
// GENDER DISTRIBUTION ROW
// ======================================================

function GenderRow({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div
        className="
          mb-1.5
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span className="text-xs font-medium text-neutral-700">
          {label}
        </span>

        <span className="text-xs font-semibold text-neutral-700">
          {value} ({percentage}%)
        </span>
      </div>

      <div
        className="
          h-2
          w-full
          overflow-hidden
          bg-neutral-100
        "
      >
        <div
          className="h-full bg-[#201E64]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const style =
    status === "PENDING"
      ? `
          border-amber-200
          bg-amber-50
          text-amber-700
        `
      : `
          border-blue-200
          bg-blue-50
          text-blue-700
        `;

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
        ${style}
      `}
    >
      {status}
    </span>
  );
}

// ======================================================
// DASHBOARD CONTENT
// ======================================================

function DashboardContent() {
  const totalGender =
    DASHBOARD_DATA.genderDistribution.male +
    DASHBOARD_DATA.genderDistribution.female +
    DASHBOARD_DATA.genderDistribution.other;

  const handleQuickAction = (action) => {
    console.log("Quick action:", action);

    // Later:
    // Navigate to create screens or open modals here.
  };

  return (
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
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
            "
            style={{ color: NAVY }}
          >
            {DASHBOARD_DATA.teamName}
          </p>

          <h1
            className="
              mt-1
              text-2xl
              font-extrabold
              tracking-tight
              text-neutral-900
              sm:text-3xl
            "
          >
            ED Team Dashboard
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
            Manage suppliers, business support requests,
            meetings, workshops, programmes and business
            opportunities.
          </p>
        </div>
      </div>

      {/* ==================================================
          MAIN STATISTICS
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          min-[480px]:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          title="Registered Suppliers"
          value={
            DASHBOARD_DATA.registeredSuppliers
          }
          description="Total suppliers registered on the portal"
          icon={Users}
        />

        <StatCard
          title="Business Opportunities"
          value={
            DASHBOARD_DATA.opportunitiesCreated
          }
          description="Total tender and RFQ opportunities created"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Funding Opportunities"
          value={
            DASHBOARD_DATA
              .fundingOpportunitiesCreated
          }
          description="Total funding opportunities created"
          icon={CircleDollarSign}
        />

        <StatCard
          title="Business Advisory Requests"
          value={
            DASHBOARD_DATA.advisoryRequests
          }
          description="Total business advisory requests received"
          icon={MessageSquareText}
        />
      </div>

      {/* ==================================================
          SECONDARY STATISTICS
      ================================================== */}

      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-3
          min-[480px]:grid-cols-2
          xl:grid-cols-3
        "
      >
        <StatCard
          title="Meetings Created"
          value={
            DASHBOARD_DATA.meetingsCreated
          }
          description="Total ED meetings created"
          icon={CalendarDays}
        />

        <StatCard
          title="Workshops Created"
          value={
            DASHBOARD_DATA.workshopsCreated
          }
          description="Total supplier workshops created"
          icon={TrendingUp}
        />

        <StatCard
          title="Programmes Created"
          value={
            DASHBOARD_DATA.programmesCreated
          }
          description="Total supplier development programmes created"
          icon={ClipboardList}
        />
      </div>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="mt-6">
        <div className="mb-3">
          <h2
            className="
              text-base
              font-bold
              sm:text-lg
            "
            style={{ color: NAVY }}
          >
            Quick Actions
          </h2>

          <p className="mt-0.5 text-xs text-neutral-500">
            Create and manage ED activities.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* CREATE MEETING */}

          <QuickAction
            title="Create Meeting"
            description="Schedule a supplier meeting"
            icon={CalendarDays}
            onClick={() =>
              handleQuickAction(
                "create-meeting"
              )
            }
          />

          {/* CREATE WORKSHOP */}

          <QuickAction
            title="Create Workshop"
            description="Schedule a supplier workshop"
            icon={Users}
            onClick={() =>
              handleQuickAction(
                "create-workshop"
              )
            }
          />

          {/* CREATE BUSINESS OPPORTUNITY */}

          <QuickAction
            title="Create Business Opportunity"
            description="Create a tender or RFQ opportunity"
            icon={BriefcaseBusiness}
            onClick={() =>
              handleQuickAction(
                "create-business-opportunity"
              )
            }
          />

          {/* CREATE PROGRAMME */}

          <QuickAction
            title="Create Programme"
            description="Create a supplier development programme"
            icon={ClipboardList}
            onClick={() =>
              handleQuickAction(
                "create-programme"
              )
            }
          />
        </div>
      </section>

      {/* ==================================================
          GENDER DISTRIBUTION + ADVISORY INBOX
      ================================================== */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-5
        "
      >
        {/* ==================================================
            GENDER DISTRIBUTION
        ================================================== */}

        <section
          className="
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm
            sm:p-5
            xl:col-span-2
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
              <h2
                className="
                  text-base
                  font-bold
                  sm:text-lg
                "
                style={{ color: NAVY }}
              >
                Gender Distribution
              </h2>

              <p className="mt-0.5 text-xs text-neutral-500">
                Registered supplier representatives
              </p>
            </div>

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
              <UserRound
                className="h-4 w-4"
                style={{ color: NAVY }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <GenderRow
              label="Male"
              value={
                DASHBOARD_DATA
                  .genderDistribution.male
              }
              total={totalGender}
            />

            <GenderRow
              label="Female"
              value={
                DASHBOARD_DATA
                  .genderDistribution.female
              }
              total={totalGender}
            />

            <GenderRow
              label="Other / Not specified"
              value={
                DASHBOARD_DATA
                  .genderDistribution.other
              }
              total={totalGender}
            />
          </div>

          <div
            className="
              mt-5
              border-t
              border-neutral-100
              pt-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <span className="text-xs text-neutral-500">
                Total
              </span>

              <span
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                {totalGender}
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================
            BUSINESS ADVISORY INBOX
        ================================================== */}

        <section
          className="
            min-w-0
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm
            sm:p-5
            xl:col-span-3
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
              <h2
                className="
                  text-base
                  font-bold
                  sm:text-lg
                "
                style={{ color: NAVY }}
              >
                Business Advisory Inbox
              </h2>

              <p className="mt-0.5 text-xs text-neutral-500">
                Latest advisory requests from
                registered suppliers.
              </p>
            </div>

            <Inbox
              className="
                h-5
                w-5
                shrink-0
                text-neutral-400
              "
            />
          </div>

          {/* ==================================================
              DESKTOP / TABLET TABLE
          ================================================== */}

          <div
            className="
              mt-4
              hidden
              overflow-x-auto
              sm:block
            "
          >
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th
                    className="
                      pb-2
                      text-left
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Business
                  </th>

                  <th
                    className="
                      pb-2
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
                      pb-2
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
                      pb-2
                      text-right
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {RECENT_ADVISORY_REQUESTS.map(
                  (request) => (
                    <tr
                      key={request.id}
                      className="
                        border-b
                        border-neutral-100
                        last:border-b-0
                      "
                    >
                      <td
                        className="
                          py-3
                          pr-3
                          text-xs
                          font-semibold
                          text-neutral-800
                        "
                      >
                        {request.businessName}
                      </td>

                      <td
                        className="
                          py-3
                          pr-3
                          text-xs
                          text-neutral-500
                        "
                      >
                        {request.supportArea}
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          py-3
                          pr-3
                          text-xs
                          text-neutral-500
                        "
                      >
                        {request.date}
                      </td>

                      <td className="py-3 text-right">
                        <StatusBadge
                          status={
                            request.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              MOBILE ADVISORY CARDS
          ================================================== */}

          <div className="mt-4 space-y-2 sm:hidden">
            {RECENT_ADVISORY_REQUESTS.map(
              (request) => (
                <div
                  key={request.id}
                  className="
                    border
                    border-neutral-200
                    p-3
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-2
                    "
                  >
                    <p
                      className="
                        min-w-0
                        text-xs
                        font-bold
                        text-neutral-800
                      "
                    >
                      {request.businessName}
                    </p>

                    <StatusBadge
                      status={request.status}
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-[11px]
                      text-neutral-500
                    "
                  >
                    {request.supportArea}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-neutral-400
                    "
                  >
                    {request.date}
                  </p>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            className="
              mt-4
              inline-flex
              items-center
              gap-1
              text-xs
              font-semibold
              text-[#201E64]
              hover:underline
            "
          >
            View all advisory requests

            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </section>
      </div>
    </div>
  );
}

// ======================================================
// PLACEHOLDER SCREEN
// These screens will be implemented later.
// ======================================================

function PlaceholderScreen({ title }) {
  return (
    <div
      className="
        flex
        min-h-[55vh]
        items-center
        justify-center
      "
    >
      <div
        className="
          w-full
          max-w-xl
          border
          border-neutral-200
          bg-white
          p-6
          text-center
          shadow-sm
        "
      >
        <h1
          className="
            text-xl
            font-bold
            sm:text-2xl
          "
          style={{ color: NAVY }}
        >
          {title}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          This screen will be implemented later.
        </p>
      </div>
    </div>
  );
}

// ======================================================
// MAIN ED TEAM DASHBOARD
// ======================================================

export default function EDTeamDashboard() {
  const [activeScreen, setActiveScreen] =
    useState("dashboard");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleNavigation = (id) => {
    setActiveScreen(id);
    setMobileMenuOpen(false);
  };

  // ======================================================
  // SCREEN
  // ======================================================

  const renderScreen = () => {
    switch (activeScreen) {
      case "suppliers":
      return <SuppliersScreen />;

       case "requests":
      return <BusinessRequestsScreen />;

      case "meetings":
  return <MeetingsWorkshopsScreen />;

      case "opportunities":
  return <OpportunitiesScreen />;

      default:
        return <DashboardContent />;
    }
  };

  return (
    <div
      className="
        min-h-screen
        min-h-[100dvh]
        bg-[#F5F6FA]
        text-neutral-900
      "
    >
      {/* ==================================================
          MOBILE HEADER
      ================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          items-center
          justify-between
          border-b
          border-neutral-200
          bg-white
          px-4
          lg:hidden
        "
      >
        <img
          src="/Tongaat-Huletts-Logo.png"
          alt="Tongaat Hulett"
          className="
            h-auto
            w-[145px]
            sm:w-[170px]
          "
        />

        <div className="flex items-center gap-1">
          {/* NOTIFICATIONS */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              text-neutral-600
              transition
              hover:bg-neutral-100
            "
          >
            <Bell className="h-5 w-5" />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
          </button>

          {/* MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-[#201E64]
              transition
              hover:bg-neutral-100
            "
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}

      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-x-0
            top-16
            z-50
            border-b
            border-neutral-200
            bg-white
            p-3
            shadow-lg
            lg:hidden
          "
        >
          {/* TEAM NAME */}

          <div
            className="
              mb-3
              border-b
              border-neutral-100
              px-3
              pb-3
            "
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              ED Team
            </p>

            <p
              className="
                mt-1
                text-sm
                font-bold
              "
              style={{ color: NAVY }}
            >
              Enterprise Development
            </p>
          </div>

          {/* NAV */}

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const active =
                activeScreen === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.id
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-medium
                    transition

                    ${
                      active
                        ? "bg-[#201E64] text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* MOBILE LOGOUT */}

          <div
            className="
              mt-3
              border-t
              border-neutral-100
              pt-3
            "
          >
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                gap-3
                px-3
                py-2.5
                text-left
                text-sm
                font-medium
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          MAIN LAYOUT
      ================================================== */}

      <div className="flex min-h-screen min-h-[100dvh]">
        {/* ==================================================
            DESKTOP SIDEBAR
        ================================================== */}

        <aside
          className="
            fixed
            bottom-0
            left-0
            top-0
            z-30
            hidden
            w-64
            flex-col
            border-r
            border-neutral-200
            bg-white
            lg:flex
          "
        >
          {/* LOGO */}

          <div
            className="
              flex
              h-20
              shrink-0
              items-center
              border-b
              border-neutral-200
              px-5
            "
          >
            <img
              src="/Tongaat-Huletts-Logo.png"
              alt="Tongaat Hulett"
              className="h-auto w-[180px]"
            />
          </div>

          {/* TEAM */}

          <div
            className="
              border-b
              border-neutral-100
              px-5
              py-4
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-neutral-400
              "
            >
              ED Team
            </p>

            <p
              className="
                mt-1
                text-sm
                font-bold
              "
              style={{ color: NAVY }}
            >
              Enterprise Development
            </p>
          </div>

          {/* NAVIGATION */}

          <nav
            className="
              flex-1
              space-y-1
              overflow-y-auto
              p-3
            "
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const active =
                activeScreen === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.id
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-medium
                    transition

                    ${
                      active
                        ? "bg-[#201E64] text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  <span className="min-w-0 truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* LOGOUT */}

          <div
            className="
              shrink-0
              border-t
              border-neutral-200
              p-3
            "
          >
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                gap-3
                px-3
                py-2.5
                text-sm
                font-medium
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </aside>

        {/* ==================================================
            RIGHT CONTENT
        ================================================== */}

        <div
          className="
            min-w-0
            flex-1
            lg:ml-64
          "
        >
          {/* ==================================================
              DESKTOP TOP BAR
          ================================================== */}

          <header
            className="
              sticky
              top-0
              z-20
              hidden
              h-16
              items-center
              justify-between
              border-b
              border-neutral-200
              bg-white
              px-6
              lg:flex
            "
          >
            <div>
              <p className="text-xs text-neutral-400">
                SMME Portal
              </p>

              <p
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                ED Team
              </p>
            </div>

            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                text-neutral-600
                transition
                hover:bg-neutral-100
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span
                className="
                  absolute
                  right-1.5
                  top-1.5
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                "
              />
            </button>
          </header>

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <main
            className="
              mx-auto
              w-full
              max-w-[1500px]
              p-4
              sm:p-5
              md:p-6
              lg:p-6
              xl:p-8
            "
          >
            {renderScreen()}
          </main>
        </div>
      </div>
    </div>
  );
}