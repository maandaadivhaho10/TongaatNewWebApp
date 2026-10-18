import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

  Menu, X, LogOut, LayoutDashboard, Building2, BriefcaseBusiness,

  HandCoins, MessagesSquare, CircleHelp, Headphones, CalendarDays,

  UserRound, CheckCircle2, Circle, RefreshCw, AlertCircle, ArrowRight,

} from "lucide-react";

import api from "../../API/axiosInstance";

import { useAuth } from "../../context/AuthContext";

import CompanyProfileScreen from "./Companyregistration";

import BusinessOpportunitiesScreen from "./BissnessOpportunities";

import FundingOpportunitiesScreen from "./FundingOpportunitiesScreen";

import BusinessAdvisoryScreen from "./BusinessAdvisoryScreen";

import MeetingsScreen from "./Meetings";

import FAQScreen from "./FAQScreen";

import ContactUsScreen from "./ContactUsScreen";

import ChatScreen from "../Chat/ChatScreen";



const NAVY = "#201E64";

const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2";

const BTN_OUTLINE = `inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#201E64]/30 text-[#201E64] text-sm font-semibold hover:bg-[#201E64]/5 transition-colors ${FOCUS}`;

const NAV = [

  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },

  { id: "profile", label: "Company Registration", icon: Building2 },

  { id: "opportunities", label: "Business Opportunities", icon: BriefcaseBusiness },

  { id: "funding", label: "Funding Opportunities", icon: HandCoins },

  { id: "meetings", label: "ESD Activities", icon: CalendarDays },

  { id: "advisory", label: "Request Business Advisory", icon: MessagesSquare },

  { id: "chat", label: "Messages & Support", icon: MessagesSquare },

  { id: "faq", label: "FAQ", icon: CircleHelp },

  { id: "contact", label: "Contact Us", icon: Headphones },

];



// The registration endpoint is mounted at the backend root, while the Axios

// baseURL may end with /api. Use the same convention as Companyregistration.jsx.

const API_ORIGIN = new URL(

  api.defaults.baseURL || "http\://localhost:5000/",

  window.location.origin

).origin;



function RegistrationProgress({ status, loading, error, refresh, onRegister }) {

  if (loading && !status) {

    return <section className="mb-6 border border-neutral-200 bg-white p-5 text-sm text-neutral-500" role="status">Checking your registration progress…</section>;

  }

  if (!status) {

    return (

      <section className="mb-6 border border-red-200 bg-white p-5" role="alert">

        <div className="flex items-start gap-2 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" />{error || "Registration progress is unavailable."}</div>

        <button type="button" onClick={refresh} className={`mt-3 ${BTN_OUTLINE}`}>Retry</button>

      </section>

    );

  }



  const profileDone = Boolean(status.profile_registered);

  const maturityDone = profileDone && Boolean(status.maturity_registered);

  const percent = maturityDone ? 100 : profileDone ? 65 : 25;

  const steps = [

    { title: "Account created", description: "Your account is registered and you can log in.", done: true },

    { title: "Business profile", description: "Company information, ownership, B-BBEE document, company registration document and tax details.", done: profileDone },

    { title: "Business maturity", description: "Sector, services, employees, revenue, business systems, client references and financial statement where applicable.", done: maturityDone },

  ];

  const remaining = steps.filter((step) => !step.done);



  return (

    <section className="mb-6 border border-neutral-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Registration progress">

      <div className="flex flex-wrap items-start justify-between gap-3">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Your registration progress</p>

          <h2 className="mt-1 text-lg font-bold text-[#201E64]">{maturityDone ? "Registration complete" : "Complete your business registration"}</h2>

          <p className="mt-1 text-sm text-neutral-500">Progress is based on information saved to your account.</p>

        </div>

        <div className="flex items-center gap-3">

          <span className="text-3xl font-extrabold text-[#201E64]" aria-label={`${percent} percent complete`}>{percent}%</span>

          <button type="button" onClick={refresh} disabled={loading} title="Refresh progress" aria-label="Refresh registration progress" className={`p-2 text-[#201E64] hover:bg-neutral-100 disabled:opacity-50 ${FOCUS}`}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>

        </div>

      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-neutral-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Registration completion">

        <div className="h-full rounded-full bg-[#201E64] transition-all duration-300" style={{ width: `${percent}%` }} />

      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">

        {steps.map((step) => (

          <div key={step.title} className={`border p-3 ${step.done ? "border-[#201E64]/20 bg-[#201E64]/5" : "border-neutral-200"}`}>

            <div className="flex items-center gap-2">

              {step.done ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[#201E64]" /> : <Circle className="h-5 w-5 shrink-0 text-neutral-400" />}

              <h3 className="text-sm font-semibold text-neutral-800">{step.title}</h3>

            </div>

            <p className="mt-2 text-xs leading-5 text-neutral-600">{step.description}</p>

            <p className={`mt-2 text-xs font-semibold ${step.done ? "text-[#201E64]" : "text-amber-700"}`}>{step.done ? "Completed" : "Not yet submitted"}</p>

          </div>

        ))}

      </div>

      {maturityDone ? (

        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#201E64]"><CheckCircle2 className="h-4 w-4" />Your business profile and maturity assessment have both been submitted.</p>

      ) : (

        <div className="mt-5 border-t border-neutral-200 pt-4">

          <h3 className="text-sm font-bold text-neutral-800">What is left to complete?</h3>

          <ul className="mt-2 space-y-2">

            {remaining.map((step) => <li key={step.title} className="flex items-start gap-2 text-sm text-neutral-600"><Circle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span><strong>{step.title}:</strong> {step.description}</span></li>)}

          </ul>

          <p className="mt-3 text-xs text-neutral-500">Individual document uploads cannot be verified from the current registration status response. Open Company Registration to see the required fields and documents. A financial statement is requested if you indicate that your business can produce one.</p>

          <button type="button" onClick={onRegister} className={`mt-4 inline-flex items-center gap-2 bg-[#201E64] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2B2889] ${FOCUS}`}>Continue registration <ArrowRight className="h-4 w-4" /></button>

        </div>

      )}

      {error && <p className="mt-3 text-xs text-amber-700" role="status">Unable to refresh progress: {error}. Showing the last confirmed result.</p>}

    </section>

  );

}



export default function SmmeDashboard() {

  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const [active, setActive] = useState("dashboard");

  const [navOpen, setNavOpen] = useState(false);

  const [registrationStatus, setRegistrationStatus] = useState(null);

  const [progressLoading, setProgressLoading] = useState(true);

  const [progressError, setProgressError] = useState("");

  const displayName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Supplier";



  const refreshProgress = useCallback(async () => {

    if (!token || !user?.user_id) {

      setRegistrationStatus(null);

      setProgressLoading(false);

      setProgressError("Please log in to view your progress.");

      return;

    }

    setProgressLoading(true);

    setProgressError("");

    try {

      const { data } = await api.get(`${API_ORIGIN}/registration/status`);

      if (data?.success !== true || !data?.data) throw new Error(data?.message || "Invalid registration status response");

      setRegistrationStatus(data.data);

    } catch (err) {

      setProgressError(err.response?.data?.message || err.message || "Could not load registration status");

    } finally {

      setProgressLoading(false);

    }

  }, [token, user?.user_id]);



  // Load on login and refresh when returning to the dashboard or browser tab.

  useEffect(() => {

    if (active === "dashboard") refreshProgress();

  }, [active, refreshProgress]);

  useEffect(() => {

    const onFocus = () => { if (document.visibilityState === "visible" && active === "dashboard") refreshProgress(); };

    document.addEventListener("visibilitychange", onFocus);

    return () => document.removeEventListener("visibilitychange", onFocus);

  }, [active, refreshProgress]);



  const go = (id) => {

    setActive(id);

    setNavOpen(false);

    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  const handleLogout = () => {

    logout();

    setRegistrationStatus(null);

    setNavOpen(false);

    navigate("/login", { replace: true });

  };

  const renderScreen = () => {

    switch (active) {

      case "profile": return <CompanyProfileScreen />;

      case "opportunities": return <BusinessOpportunitiesScreen />;

      case "funding": return <FundingOpportunitiesScreen />;

      case "meetings": return <MeetingsScreen />;

      case "advisory": return <BusinessAdvisoryScreen />;

      case "chat": return <ChatScreen />;

      case "faq": return <FAQScreen />;

      case "contact": return <ContactUsScreen />;

      default: return null; // Progress checklist is the dashboard overview.

    }

  };



  return (

    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">

      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">

        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">

          <div className="flex items-center gap-3">

            <button type="button" onClick={() => setNavOpen((open) => !open)} className={`p-2 text-[#201E64] hover:bg-[#201E64]/5 lg:hidden ${FOCUS}`} aria-label={navOpen ? "Close menu" : "Open menu"} aria-expanded={navOpen}>

              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}

            </button>

            <img src="/Tongaat-Huletts-Logo.png" alt="Tongaat Hulett" className="h-9 w-auto object-contain" />

          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right leading-tight sm:block"><p className="text-sm font-bold text-[#201E64]">{displayName}</p><p className="text-xs text-neutral-500">Supplier Dashboard</p></div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#201E64]/10 sm:flex"><UserRound className="h-5 w-5 text-[#201E64]" /></div>

            <button type="button" onClick={handleLogout} className={BTN_OUTLINE} aria-label="Log out"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Log out</span></button>

          </div>

        </div>

      </header>

      <div className="lg:flex">

        <aside className={`${navOpen ? "block" : "hidden"} shrink-0 border-r border-neutral-200 bg-white lg:sticky lg:top-[65px] lg:block lg:h-[calc(100vh-65px)] lg:w-64 lg:self-start lg:overflow-y-auto`}>

          <div className="border-b border-neutral-200 px-4 py-4 lg:hidden"><p className="text-xs text-neutral-500">Logged in as</p><p className="mt-1 text-sm font-bold text-[#201E64]">{displayName}</p></div>

          <div className="hidden border-b border-neutral-200 px-4 py-5 lg:block"><p className="text-xs text-neutral-500">Logged in as</p><p className="mt-1 text-sm font-bold text-[#201E64]">{displayName}</p></div>

          <nav className="space-y-1 p-3" aria-label="Dashboard navigation">

            {NAV.map(({ id, label, icon: Icon }) => (

              <button key={id} type="button" onClick={() => go(id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors ${FOCUS} ${active === id ? "bg-[#201E64] text-white" : "text-neutral-700 hover:bg-[#201E64]/5 hover:text-[#201E64]"}`}>

                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} /><span className="min-w-0">{label}</span>

              </button>

            ))}

          </nav>

        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">

          <div className="mx-auto max-w-6xl">

            {active === "dashboard" && (

              <>

                <RegistrationProgress status={registrationStatus} loading={progressLoading} error={progressError} refresh={refreshProgress} onRegister={() => go("profile")} />

              </>

            )}

            {renderScreen()}

          </div>

        </main>

      </div>

    </div>

  );

}
