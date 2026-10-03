import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/LandingComponents/Navbar';
import Hero from './components/LandingComponents/Hero';
import ValueSection from './components/LandingComponents/ValueSection';
import HowItWorks from './components/LandingComponents/HowItWorks';
import Footer from './components/LandingComponents/Footer';
import GrowerTypeSelector from './components/UserSelection/GrowerTypeSelector';
import SMMERegistration from './components/RegisterSMME/SMMEregistration';
import FarmerRegistration from './components/RegisterFarmer/FarmerRegistation';
import Login from './components/Login/Login';
import DashboardLayout from './components/FarmerDashBoard/Dashboardlayout';
import Overview from './components/FarmerDashBoard/Overview';
import Chemicalrequests from './components/FarmerDashBoard/Chemicalrequests'
import Meetingsworkshops from './components/FarmerDashBoard/Meetingsworkshops'
import Tonnagesubmission from './components/FarmerDashBoard/Tonnagesubmission'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-black selection:text-white">

      {/* 1. Header / Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">

        {/* 2. Hero Section */}
        <Hero />

        {/* 4. Platform Capabilities */}
        <ValueSection />

        {/* 5. How It Works (3 Steps) */}
        <HowItWorks />

      </main>

      {/* 6. Professional Footer */}
      <Footer />

    </div>
  );
}

// Temporary page for dashboard sections you haven't built yet
function ComingSoon({ title }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">This section is coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-user-type" element={<GrowerTypeSelector />} />
      <Route path="/register/smme" element={<SMMERegistration />} />
      <Route path="/register/farmer" element={<FarmerRegistration />} />
      <Route path="/login" element={<Login />} />

      {/* Farmer dashboard: the sidebar and header stay while the page changes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="requests" element={<Chemicalrequests title="Chemical & Fertiliser Requests" />} />
        <Route path="opportunities" element={<ComingSoon title="Business Opportunities" />} />
        <Route path="meetings" element={<Meetingsworkshops title="Meetings & Workshops" />} />
        <Route path="bookings" element={<ComingSoon title="Bookings" />} />
        <Route path="tonnage" element={<Tonnagesubmission title="Tonnage Submission" />} />
        <Route path="reports" element={<ComingSoon title="Monthly Report" />} />
        <Route path="profile" element={<ComingSoon title="Profile" />} />
      </Route>

      {/* Unknown URLs go back to the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}