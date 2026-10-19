import api from "../../API/axiosInstance";
import { RefreshCw } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const NAVY = "#201E64";
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
// DASHBOARD CONTENT
// ======================================================
function DashboardContent({ displayName }) {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const fetchStatistics = React.useCallback(async (signal, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const response = await api.get("/dashboard/statistics", { signal });
      if (response.data?.success !== true || !response.data?.data) {
        throw new Error(response.data?.message || "Invalid dashboard statistics response");
      }
      setStats(response.data.data);
    } catch (err) {
      if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
      setError(err.response?.data?.message || err.message || "Unable to load dashboard statistics");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);
  React.useEffect(() => {
    const controller = new AbortController();
    fetchStatistics(controller.signal);
    return () => controller.abort();
  }, [fetchStatistics]);
  const count = (key) => stats ? Number(stats[key] ?? 0).toLocaleString("en-ZA") : "—";
  const gender = {
    male: Number(stats?.total_male_suppliers || 0),
    female: Number(stats?.total_female_suppliers || 0),
    other: Number(stats?.total_other_suppliers || 0),
  };
  const genderTotal = gender.male + gender.female + gender.other;
  const totalOpportunities = stats
    ? Number(stats.total_rfqs || 0) + Number(stats.total_tenders || 0)
    : null;
  const cards = [
    { title: "Registered Suppliers", value: count("total_registered_suppliers"), description: "Completed supplier registrations", icon: Users },
    { title: "Business Opportunities", value: totalOpportunities === null ? "—" : totalOpportunities.toLocaleString("en-ZA"), description: "RFQs and tenders combined", icon: BriefcaseBusiness },
    { title: "Business Advisory Requests", value: count("total_business_advisory"), description: "All advisory requests received", icon: MessageSquareText },
    { title: "ESD Activities", value: count("total_esd_activities"), description: "Total ESD activities created", icon: CalendarDays },
    { title: "RFQs", value: count("total_rfqs"), description: "Request for quotation opportunities", icon: ClipboardList },
    { title: "Tenders", value: count("total_tenders"), description: "Tender opportunities published", icon: BriefcaseBusiness },
  ];
  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#201E64]">Enterprise Development Team</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">ED Team Dashboard</h1>
          <p className="mt-2 text-sm font-semibold text-[#201E64]">Welcome, {displayName}!</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Overview of registered suppliers, business opportunities, advisory requests and development activities.</p>
        </div>
        <button
          type="button"
          disabled={loading || refreshing}
          onClick={() => fetchStatistics(undefined, true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#201E64] shadow-sm transition hover:border-[#201E64]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Statistics"}
        </button>
      </div>
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}{stats ? " Showing previously loaded statistics." : ""}</span>
          <button type="button" onClick={() => fetchStatistics(undefined, true)} className="font-bold underline">Try again</button>
        </div>
      )}
      <section aria-label="Dashboard statistics">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#201E64] sm:text-lg">Overview</h2>
          <span className="text-xs text-slate-400">{loading ? "Loading statistics..." : stats ? "Live portal statistics" : "Statistics unavailable"}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {cards.map(({ title, value, description, icon: Icon }) => (
            <div key={title} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">{title}</p>
                  <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#201E64]">{loading && !stats ? "…" : value}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#201E64]/10 text-[#201E64]"><Icon size={20} /></div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-label="Supplier gender distribution">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#201E64] sm:text-lg">Gender Distribution</h2>
            <p className="mt-1 text-xs text-slate-500">Registered supplier representatives with completed business registrations</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#201E64]/10 text-[#201E64]"><UserRound size={20} /></div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.4fr)] lg:items-center">
          <div className="space-y-5">
            <GenderRow label="Male" value={gender.male} total={genderTotal} />
            <GenderRow label="Female" value={gender.female} total={genderTotal} />
            <GenderRow label="Other / Not specified" value={gender.other} total={genderTotal} />
          </div>
          <div className="rounded-xl bg-[#F5F6FA] p-5 text-center">
            <p className="text-xs font-semibold text-slate-500">Total Representatives</p>
            <p className="mt-2 text-4xl font-extrabold text-[#201E64]">{loading && !stats ? "…" : genderTotal.toLocaleString("en-ZA")}</p>
            <p className="mt-2 text-xs text-slate-500">Across reported gender categories</p>
          </div>
        </div>
      </section>
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
      case "chat":
        return <ChatScreen />;
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
            {renderScreen()}
          </main>
        </div>
      </div>
    </div>
  );
}
