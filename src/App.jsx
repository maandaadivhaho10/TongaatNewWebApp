import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/LandingComponents/Navbar';
import Hero from './components/LandingComponents/Hero';
import ValueSection from './components/LandingComponents/ValueSection';
import HowItWorks from './components/LandingComponents/HowItWorks';
import Footer from './components/LandingComponents/Footer';
import GrowerTypeSelector from './components/UserSelection/GrowerTypeSelector'; // adjust to where you saved it
import SMMERegistration from './components/RegisterSMME/SMMEregistration';
import FarmerRegistration from "./components/RegisterFarmer/FarmerRegistation"
import Login from "./components/Login/Login"


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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-user-type" element={<GrowerTypeSelector />} />
      <Route path="/register/smme" element={<SMMERegistration />} />
      <Route path="/register/Farmer" element={<FarmerRegistration />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}