
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/LandingComponents/Navbar";
import Hero from "./components/LandingComponents/Hero";
import HowItWorks from "./components/LandingComponents/HowItWorks";
import Footer from "./components/LandingComponents/Footer";

import GrowerTypeSelector from "./components/UserSelection/GrowerTypeSelector";
import SMMERegistration from "./components/RegisterSMME/SMMEregistration";
import FarmerRegistration from "./components/RegisterFarmer/FarmerRegistation";

import Login from "./components/Login/Login";
import CreateAccount from "./components/RegisterSMME/CreateAccount";
import VerifyOtp from "./components/RegisterSMME/VerifyOtp";

import BissnessOpportunities from "./components/LandingComponents/BissnessOpportunities";
import Fundingopportunities from "./components/LandingComponents/Fundingopportunities";

import Smmedashboard from "./components/SMMEDashboard/Smmedashboard";
import EDTeamDashboard from "./components/EDTeam/EDTeamDashboard";

import DashboardLayout from "./components/FarmerDashBoard/Dashboardlayout";
import Overview from "./components/FarmerDashBoard/Overview";
import Chemicalrequests from "./components/FarmerDashBoard/Chemicalrequests";
import Meetingsworkshops from "./components/FarmerDashBoard/Meetingsworkshops";
import Tonnagesubmission from "./components/FarmerDashBoard/Tonnagesubmission";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

// ==============================================
// USER ROLES
// ==============================================

// Replace these IDs with the actual values
// from your backend role table.
const ROLES = {
  SMME: 1,
  ED_TEAM: 2,
};

// ==============================================
// LANDING PAGE
// ==============================================

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <BissnessOpportunities />
        <Fundingopportunities />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

// ==============================================
// COMING SOON
// ==============================================

function ComingSoon({ title }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">
        {title}
      </h1>

      <p className="mt-2 text-sm text-neutral-500">
        This section is coming soon.
      </p>
    </div>
  );
}

// ==============================================
// UNAUTHORIZED PAGE
// ==============================================

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-extrabold text-[#201E64]">
        Access Denied
      </h1>

      <p className="mt-3 max-w-md text-sm text-neutral-600">
        You do not have permission to access this page.
      </p>

      <a
        href="/"
        className="mt-6 bg-[#201E64] px-6 py-3 text-sm font-semibold text-white"
      >
        Return Home
      </a>
    </div>
  );
}

// ==============================================
// APP ROUTES
// ==============================================

export default function App() {
  return (
    <Routes>

      {/* ======================================
          PUBLIC ROUTES
      ====================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/select-user-type"
        element={<GrowerTypeSelector />}
      />

      <Route
        path="/register/smme"
        element={<SMMERegistration />}
      />

      <Route
        path="/register/farmer"
        element={<FarmerRegistration />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/createaccount"
        element={<CreateAccount />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* ======================================
          SMME PROTECTED ROUTES
      ====================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.SMME]}
          />
        }
      >
        <Route
          path="/Smmedashboard"
          element={<Smmedashboard />}
        />
      </Route>

      {/* ======================================
          ED TEAM PROTECTED ROUTES
      ====================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.ED_TEAM]}
          />
        }
      >
        <Route
          path="/EDTeamDashboard"
          element={<EDTeamDashboard />}
        />
      </Route>

      {/* ======================================
          FARMER PROTECTED ROUTES
      ====================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.FARMER]}
          />
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<Overview />}
          />

          <Route
            path="requests"
            element={
              <Chemicalrequests
                title="Chemical & Fertiliser Requests"
              />
            }
          />

          <Route
            path="opportunities"
            element={
              <ComingSoon
                title="Business Opportunities"
              />
            }
          />

          <Route
            path="meetings"
            element={
              <Meetingsworkshops
                title="Meetings & Workshops"
              />
            }
          />

          <Route
            path="bookings"
            element={
              <ComingSoon title="Bookings" />
            }
          />

          <Route
            path="tonnage"
            element={
              <Tonnagesubmission
                title="Tonnage Submission"
              />
            }
          />

          <Route
            path="reports"
            element={
              <ComingSoon
                title="Monthly Report"
              />
            }
          />

          <Route
            path="profile"
            element={
              <ComingSoon title="Profile" />
            }
          />
        </Route>
      </Route>

      {/* ======================================
          UNKNOWN ROUTES
      ====================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
