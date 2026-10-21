import api from "../../API/axiosInstance";
import { useEffect, useCallback } from "react";
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
import ChatScreen from "../Chat/ChatScreen";
import { openSupplierConversation } from "../../API/chatApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const NAVY = "#201E64";
// ======================================================
// Dashboard metrics are fetched from the backend.
// The statistics endpoint does not return funding, meeting, workshop
// or programme counts, so those are not shown as fabricated values.
// ======================================================
// ======================================================
// RECENT ADVISORY REQUESTS
// ======================================================
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
  {
    id: "chat",
    label: "Messages & Support",
    icon: MessageSquareText,
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
// ======================================================
// DASHBOARD CONTENT
// ======================================================
function DashboardContent({ displayName }) {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [statsRefreshing, setStatsRefreshing] = useState(false);

  const loadStatistics = useCallback(async (refresh = false) => {
    try {
      if (refresh) setStatsRefreshing(true);
      else setStatsLoading(true);
      setStatsError("");
      const response = await api.get("/dashboard/statistics");
      if (response.data?.success !== true || !response.data?.data) {
        throw new Error(response.data?.message || "Unable to retrieve dashboard statistics");
      }
      setStats(response.data.data);
    } catch (error) {
      setStatsError(error.response?.data?.message || error.message || "Failed to load dashboard statistics");
    } finally {
      setStatsLoading(false);
      setStatsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const numberOrDash = (value) =>
    value == null ? "—" : Number(value).toLocaleString("en-ZA");

  const dashboardData = {
    teamName: "Enterprise Development Team",
    registeredSuppliers: numberOrDash(stats?.total_registered_suppliers),
    opportunitiesCreated: stats
      ? numberOrDash(Number(stats.total_rfqs || 0) + Number(stats.total_tenders || 0))
      : "—",
    fundingOpportunitiesCreated: "—",
    advisoryRequests: numberOrDash(stats?.total_business_advisory),
    meetingsCreated: "—",
    workshopsCreated: "—",
    programmesCreated: "—",
    genderDistribution: {
      male: Number(stats?.total_male_suppliers || 0),
      female: Number(stats?.total_female_suppliers || 0),
      other: Number(stats?.total_other_suppliers || 0),
    },
  };

  const totalGender =
    dashboardData.genderDistribution.male +
    dashboardData.genderDistribution.female +
    dashboardData.genderDistribution.other;
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-neutral-500">
          {statsLoading && !stats ? "Loading dashboard statistics..." : stats ? "Dashboard statistics from API" : "Statistics unavailable"}
        </div>
        <button
          type="button"
          onClick={() => loadStatistics(true)}
          disabled={statsRefreshing || statsLoading}
          className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-[#201E64] disabled:opacity-50"
        >
          {statsRefreshing ? "Refreshing..." : "Refresh Statistics"}
        </button>
      </div>
      {statsError && (
        <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {statsError}
        </div>
      )}

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
            {dashboardData.teamName}
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
          <p className="mt-2 text-sm font-semibold text-[#201E64]">Welcome, {displayName}!</p>
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
            dashboardData.registeredSuppliers
          }
          description="Total suppliers registered on the portal"
          icon={Users}
        />
        <StatCard
          title="Business Opportunities"
          value={
            dashboardData.opportunitiesCreated
          }
          description="Total tender and RFQ opportunities created"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="RFQs"
          value={numberOrDash(stats?.total_rfqs)}
          description="Total RFQ opportunities created"
          icon={CircleDollarSign}
        />
        <StatCard
          title="Business Advisory Requests"
          value={
            dashboardData.advisoryRequests
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
          title="Tenders"
          value={numberOrDash(stats?.total_tenders)}
          description="Total tender opportunities created"
          icon={CalendarDays}
        />
        <StatCard
          title="ESD Activities"
          value={numberOrDash(stats?.total_esd_activities)}
          description="Total ESD activities"
          icon={TrendingUp}
        />
      </div>
      {/* ==================================================
          GENDER DISTRIBUTION
      ================================================== */}
      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-1
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
            xl:col-span-1
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
                dashboardData
                  .genderDistribution.male
              }
              total={totalGender}
            />
            <GenderRow
              label="Female"
              value={
                dashboardData
                  .genderDistribution.female
              }
              total={totalGender}
            />
            <GenderRow
              label="Other / Not specified"
              value={
                dashboardData
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "ED Team Member";
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  };
  const [activeScreen, setActiveScreen] =
    useState("dashboard");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatOpenError, setChatOpenError] = useState("");
  const [openingSupplierChat, setOpeningSupplierChat] = useState(false);
  const handleOpenSupplierChat = async (supplierId) => {
    if (!Number.isSafeInteger(Number(supplierId)) || Number(supplierId) <= 0) {
      setChatOpenError("Supplier user ID is missing from this advisory request.");
      return;
    }
    try {
      setOpeningSupplierChat(true);
      setChatOpenError("");
      const result = await openSupplierConversation(Number(supplierId));
      const id = Number(result?.data?.conversation_id);
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Chat API did not return a valid conversation ID.");
      }
      setSelectedChatId(id);
      setActiveScreen("chat");
      setMobileMenuOpen(false);
    } catch (err) {
      setChatOpenError(err?.response?.data?.message || err.message || "Unable to open supplier chat.");
    } finally {
      setOpeningSupplierChat(false);
    }
  };
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);
  // ======================================================
  // NAVIGATION
  // ======================================================
  const handleNavigation = (id) => {
    setActiveScreen(id);
    if (id === "chat") setSelectedChatId(null);
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
      return <BusinessRequestsScreen onMessageSupplier={handleOpenSupplierChat} />;
      case "meetings":
  return <MeetingsWorkshopsScreen />;
      case "opportunities":
  return <OpportunitiesScreen />;
      case "chat":
        return <ChatScreen initialConversationId={selectedChatId} />;
      default:
        return <DashboardContent displayName={displayName} />;
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
              {displayName}
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
              onClick={handleLogout}
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
              {displayName}
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
              onClick={handleLogout}
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
                Signed in as
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                {displayName}
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
            {chatOpenError && activeScreen === "requests" && (
                <div role="alert" className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {chatOpenError}
                  <button type="button" onClick={() => setChatOpenError("")} className="ml-3 font-semibold underline">Dismiss</button>
                </div>
              )}
              {openingSupplierChat && activeScreen === "requests" && (
                <p role="status" className="mb-3 text-sm text-[#201E64]">Opening supplier conversation...</p>
              )}
              {renderScreen()}
          </main>
        </div>
      </div>
    </div>
  );
}
