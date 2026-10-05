import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Building2,
  BriefcaseBusiness,
  HandCoins,
  MessagesSquare,
  CircleHelp,
  Headphones,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";

// ======================================================
// SCREENS
// ======================================================

import DashboardScreen from "./DashboardScreen";
import CompanyProfileScreen from "./Companyregistration";
import BusinessOpportunitiesScreen from "./BissnessOpportunities";
import FundingOpportunitiesScreen from "./FundingOpportunitiesScreen";
import BusinessAdvisoryScreen from "./BusinessAdvisoryScreen";
import MeetingsScreen from "./Meetings";
import FAQScreen from "./FAQScreen";
import ContactUsScreen from "./ContactUsScreen";

// ======================================================
// STYLES
// ======================================================

const NAVY = "#201E64";

const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2";

const BTN_OUTLINE = `
  inline-flex items-center justify-center gap-2
  px-4 py-2
  rounded-none
  border border-[#201E64]/30
  text-[#201E64]
  text-sm
  font-semibold
  hover:bg-[#201E64]/5
  transition-colors
  ${FOCUS}
`;

// ======================================================
// NAVIGATION
// ======================================================

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Company Registration",
    icon: Building2,
  },
  {
    id: "opportunities",
    label: "Business Opportunities",
    icon: BriefcaseBusiness,
  },
  {
    id: "funding",
    label: "Funding Opportunities",
    icon: HandCoins,
  },

  // ====================================================
  // MEETINGS & WORKSHOPS
  // ====================================================

  {
    id: "meetings",
    label: "Meetings & Workshops",
    icon: CalendarDays,
  },

  {
    id: "advisory",
    label: "Request Business Advisory",
    icon: MessagesSquare,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: CircleHelp,
  },
  {
    id: "contact",
    label: "Contact Us",
    icon: Headphones,
  },
];

// ======================================================
// DASHBOARD
// ======================================================

export default function SmmeDashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);

  // ====================================================
  // CHANGE SCREEN
  // ====================================================

  const go = (id) => {
    setActive(id);
    setNavOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    // Later:
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-neutral-200
          bg-white
          shadow-sm
        "
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              className={`
                p-2
                text-[#201E64]
                hover:bg-[#201E64]/5
                lg:hidden
                ${FOCUS}
              `}
              aria-label="Toggle menu"
            >
              {navOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* LOGO */}

            <img
              src="/Tongaat-Huletts-Logo.png"
              alt="Tongaat Hulett"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right leading-tight sm:block">
              <p
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                SMME Portal
              </p>

              <p className="text-xs text-neutral-500">
                Supplier Dashboard
              </p>
            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className={BTN_OUTLINE}
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Log out
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="lg:flex">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`
            ${navOpen ? "block" : "hidden"}

            shrink-0
            bg-white
            border-r
            border-neutral-200

            lg:block
            lg:sticky
            lg:top-[65px]
            lg:h-[calc(100vh-65px)]
            lg:w-64
            lg:self-start
            lg:overflow-y-auto
          `}
        >
          <nav
            className="space-y-1 p-3"
            aria-label="Dashboard navigation"
          >
            {NAV.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold
                    transition-colors

                    ${FOCUS}

                    ${
                      isActive
                        ? "bg-[#201E64] text-white"
                        : "text-neutral-700 hover:bg-[#201E64]/5 hover:text-[#201E64]"
                    }
                  `}
                >
                  <Icon
                    className="
                      h-[18px]
                      w-[18px]
                      shrink-0
                    "
                    strokeWidth={1.8}
                  />

                  <span className="min-w-0">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main
          className="
            min-w-0
            flex-1
            px-4
            py-8
            sm:px-6
            lg:px-10
          "
        >
          <div className="mx-auto max-w-6xl">

            {/* DASHBOARD */}

            {active === "dashboard" && (
              <DashboardScreen />
            )}

            {/* COMPANY REGISTRATION */}

            {active === "profile" && (
              <CompanyProfileScreen />
            )}

            {/* BUSINESS OPPORTUNITIES */}

            {active === "opportunities" && (
              <BusinessOpportunitiesScreen />
            )}

            {/* FUNDING OPPORTUNITIES */}

            {active === "funding" && (
              <FundingOpportunitiesScreen />
            )}

            {/* =================================================
                MEETINGS & WORKSHOPS
            ================================================= */}

            {active === "meetings" && (
              <MeetingsScreen />
            )}

            {/* BUSINESS ADVISORY */}

            {active === "advisory" && (
              <BusinessAdvisoryScreen />
            )}

            {/* FAQ */}

            {active === "faq" && (
              <FAQScreen />
            )}

            {/* CONTACT */}

            {active === "contact" && (
              <ContactUsScreen />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}