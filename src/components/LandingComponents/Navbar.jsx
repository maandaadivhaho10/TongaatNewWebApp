import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

// Brand navy, same as the login screen: #201E64 (hover: #2B2889)

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform Capabilities', href: '#capabilities' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ];

  const goToSelection = () => {
    setIsMobileMenuOpen(false);
    navigate('/select-user-type');
  };

  const goToLogin = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3.5 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-neutral-100 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <a
            href="#"
            className="flex items-center group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            <img
              src="/Ngabadi-Foods-logo.png"
              alt="Tongaat Hulett"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-600 hover:text-[#201E64] transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={goToLogin}
              className="text-sm font-semibold text-[#201E64] hover:bg-[#201E64]/5 transition-colors px-4 py-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
            >
              Sign In
            </button>

            <button
              onClick={goToSelection}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={goToSelection}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#201E64] hover:bg-[#2B2889] text-white rounded-full shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
            >
              Get Started
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#201E64] hover:bg-[#201E64]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-[#201E64] hover:bg-[#201E64]/5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2.5">
            <button
              onClick={goToLogin}
              className="w-full py-3 text-center text-sm font-semibold text-[#201E64] bg-[#201E64]/5 hover:bg-[#201E64]/10 border border-[#201E64]/20 rounded-full transition-colors"
            >
              Sign In to Portal
            </button>

            <button
              onClick={goToSelection}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-[#201E64] hover:bg-[#2B2889] rounded-full shadow-sm transition-colors"
            >
              Create Business Account
            </button>
          </div>

        </div>
      )}
    </header>
  );
}