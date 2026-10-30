
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  ScrollText,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  UserRound,
  UserPlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ======================================================
// SCREENS
// ======================================================

import SuperAdminDashboard from "./SuperAdminDashboard";
import UserManagement from "./UserManagement";
import CreateUser from "./CreateUser";

// ======================================================
// CONSTANTS
// ======================================================

const NAVY = "#201E64";

const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
  },
  {
    id: "create-user",
    label: "Create User",
    icon: UserPlus,
  },
  {
    id: "admins",
    label: "Admin & ED Team",
    icon: ShieldCheck,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    icon: Building2,
  },
  {
    id: "logs",
    label: "Activity Logs",
    icon: ScrollText,
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
  },
];

// ======================================================
// COMING SOON SCREEN
// ======================================================

function ComingSoonScreen({ title, icon: Icon = Settings }) {
  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">

        <div className="w-16 h-16 bg-[#201E64]/10 rounded-xl flex items-center justify-center mx-auto mb-5">
          <Icon size={30} color={NAVY} />
        </div>

        <h2 className="text-2xl font-bold text-[#201E64]">
          {title}
        </h2>

        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          This Super Admin module will be implemented
          in the next development steps.
        </p>

        <span className="inline-flex items-center mt-6 px-4 py-2 bg-[#201E64]/10 text-[#201E64] text-xs font-semibold rounded-lg">
          Coming Soon
        </span>

      </div>
    </div>
  );
}

// ======================================================
// SUPER ADMIN LAYOUT
// ======================================================

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);
  const [creationNotice, setCreationNotice] = useState("");

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleNavigation = (page) => {
    setActivePage(page);
    if (page !== "users") setCreationNotice("");
    setSidebarOpen(false);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  // ======================================================
  // ACTIVE PAGE
  // ======================================================

  const activeItem =
    MENU_ITEMS.find((item) => item.id === activePage) ||
    MENU_ITEMS[0];

  // ======================================================
  // RENDER ACTIVE SCREEN
  // ======================================================

  const renderScreen = () => {
    switch (activePage) {
      case "dashboard":
        return <SuperAdminDashboard />;

      case "users":
        return (
          <>
            {creationNotice && (
              <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                {creationNotice}
              </div>
            )}
            <UserManagement key={usersRefreshKey} />
          </>
        );

      case "create-user":
        return (
          <CreateUser
            onCancel={() => handleNavigation("users")}
            onCreated={() => {
              setUsersRefreshKey((key) => key + 1);
              setCreationNotice("User created successfully.");
              setActivePage("users");
            }}
          />
        );

      case "admins":
        return (
          <ComingSoonScreen
            title="Admin & ED Team Management"
            icon={ShieldCheck}
          />
        );

      case "suppliers":
        return (
          <ComingSoonScreen
            title="Supplier Management"
            icon={Building2}
          />
        );

      case "logs":
        return (
          <ComingSoonScreen
            title="Activity Logs"
            icon={ScrollText}
          />
        );

      case "settings":
        return (
          <ComingSoonScreen
            title="System Settings"
            icon={Settings}
          />
        );

      default:
        return <SuperAdminDashboard />;
    }
  };

  // ======================================================
  // USER DISPLAY NAME
  // ======================================================

  const displayName =
    [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(" ") || "Super Admin";

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F7F8FC] lg:flex">

      {/* ============================================= */}
      {/* MOBILE HEADER */}
      {/* ============================================= */}

      <header className="sticky top-0 z-30 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-4 lg:hidden">

        <div>
          <h1 className="text-lg font-bold text-[#201E64]">
            Tongaat Hulett
          </h1>

          <p className="text-xs text-gray-500">
            Super Admin Portal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 rounded-lg text-[#201E64] hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

      </header>

      {/* ============================================= */}
      {/* MOBILE OVERLAY */}
      {/* ============================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ============================================= */}
      {/* SIDEBAR */}
      {/* ============================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 max-w-[85vw]
          bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:shrink-0
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* SIDEBAR BRAND */}

        <div className="flex items-center justify-between gap-3 px-5 py-6 border-b border-gray-100">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-11 h-11 rounded-xl bg-[#201E64] flex items-center justify-center shrink-0">
              <ShieldCheck
                size={23}
                className="text-white"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#201E64] truncate">
                Tongaat Hulett
              </h2>

              <p className="text-xs text-gray-500">
                Super Admin Portal
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={21} />
          </button>

        </div>

        {/* ============================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ============================================= */}

        <nav
          aria-label="Super Admin navigation"
          className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5"
        >

          <p className="px-3 mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-current={selected ? "page" : undefined}
                className={`
                  group w-full flex items-center
                  justify-between gap-3
                  px-4 py-3.5 rounded-lg
                  text-sm font-semibold
                  transition-all duration-200
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#201E64]
                  focus-visible:ring-offset-2
                  ${
                    selected
                      ? "bg-[#201E64] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#201E64]/5 hover:text-[#201E64]"
                  }
                `}
              >

                <span className="flex items-center gap-3 min-w-0">

                  <Icon
                    size={19}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.label}
                  </span>

                </span>

                {selected && (
                  <ChevronRight
                    size={16}
                    className="shrink-0"
                  />
                )}

              </button>
            );
          })}

        </nav>

        {/* ============================================= */}
        {/* SIDEBAR FOOTER */}
        {/* ============================================= */}

        <div className="border-t border-gray-200 p-4">

          <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-gray-50 rounded-lg">

            <div className="w-10 h-10 bg-[#201E64]/10 rounded-full flex items-center justify-center shrink-0">
              <UserRound
                size={20}
                color={NAVY}
              />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-gray-800 truncate">
                {displayName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Super Administrator"}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut size={19} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

        </div>

      </aside>

      {/* ============================================= */}
      {/* MAIN CONTENT */}
      {/* ============================================= */}

      <main className="flex-1 min-w-0">

        {/* DESKTOP TOP HEADER */}

        <div className="hidden lg:flex items-center justify-between gap-4 bg-white border-b border-gray-200 px-6 xl:px-8 py-5">

          <div>
            <h1 className="text-xl font-bold text-[#201E64]">
              {activeItem.label}
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Tongaat Hulett Enterprise Development Platform
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {displayName}
              </p>

              <p className="text-xs text-gray-500">
                Super Administrator
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#201E64]/10 flex items-center justify-center">
              <UserRound
                size={20}
                color={NAVY}
              />
            </div>

          </div>

        </div>

        {/* MOBILE PAGE TITLE */}

        <div className="lg:hidden px-4 sm:px-6 pt-5">

          <h2 className="text-xl font-bold text-[#201E64]">
            {activeItem.label}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Enterprise Development Platform
          </p>

        </div>

        {/* ============================================= */}
        {/* ACTIVE SCREEN CONTENT */}
        {/* ============================================= */}

        <div className="p-4 sm:p-6 lg:p-8">
          {renderScreen()}
        </div>

      </main>

    </div>
  );
}
