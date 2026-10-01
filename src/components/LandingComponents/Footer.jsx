import React from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck
} from 'lucide-react';

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterXIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 12 5 12 5s6.255 0 7.812.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
  </svg>
);

export default function Footer({ onOpenAuth }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="about"
      className="bg-white text-neutral-600 border-t border-[#201E64]/10"
    >

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-5">

            <div className="flex items-center space-x-3">

              <div className="w-9 h-9 rounded-xl bg-[#201E64] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>

              <div>

                <span className="text-lg font-bold tracking-tight text-neutral-900">
                  AgriData{' '}
                  <span className="text-[#201E64] font-medium">
                    ESD
                  </span>
                </span>

                <span className="block text-[11px] font-medium text-neutral-500">
                  Enterprise & Supplier Development Platform
                </span>

              </div>

            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm font-normal">
              Empowering emerging enterprises, suppliers, and entrepreneurs to access opportunities,
              corporate supply chain programmes, and technical capacity-building support.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">

              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block mb-3">
                Connect With Us
              </span>

              <div className="flex items-center space-x-2.5">

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="
                    w-8 h-8
                    rounded-lg
                    bg-[#201E64]/5
                    hover:bg-[#201E64]
                    text-[#201E64]
                    hover:text-white
                    flex items-center justify-center
                    border border-[#201E64]/10
                    transition-colors
                  "
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="
                    w-8 h-8
                    rounded-lg
                    bg-[#201E64]/5
                    hover:bg-[#201E64]
                    text-[#201E64]
                    hover:text-white
                    flex items-center justify-center
                    border border-[#201E64]/10
                    transition-colors
                  "
                >
                  <TwitterXIcon className="w-3 h-3" />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="
                    w-8 h-8
                    rounded-lg
                    bg-[#201E64]/5
                    hover:bg-[#201E64]
                    text-[#201E64]
                    hover:text-white
                    flex items-center justify-center
                    border border-[#201E64]/10
                    transition-colors
                  "
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="
                    w-8 h-8
                    rounded-lg
                    bg-[#201E64]/5
                    hover:bg-[#201E64]
                    text-[#201E64]
                    hover:text-white
                    flex items-center justify-center
                    border border-[#201E64]/10
                    transition-colors
                  "
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>

              </div>

            </div>

          </div>

          {/* Column 1: Capabilities & Platform */}
          <div className="space-y-4">

            <h3 className="text-xs font-bold text-[#201E64] uppercase tracking-wider">
              Platform
            </h3>

            <ul className="space-y-2.5 text-xs">

              <li>
                <a
                  href="#capabilities"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  Business Opportunities
                </a>
              </li>

              <li>
                <a
                  href="#capabilities"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  Supplier Development
                </a>
              </li>

              <li>
                <a
                  href="#capabilities"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  Business Support
                </a>
              </li>

              <li>
                <a
                  href="#capabilities"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  Enterprise Growth
                </a>
              </li>

              <li>
                <a
                  href="#trust-network"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  Corporate Network
                </a>
              </li>

            </ul>

          </div>

          {/* Column 2: Navigation & About */}
          <div className="space-y-4">

            <h3 className="text-xs font-bold text-[#201E64] uppercase tracking-wider">
              About & Process
            </h3>

            <ul className="space-y-2.5 text-xs">

              <li>
                <a
                  href="#about"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  About AgriData ESD
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-neutral-600 hover:text-[#201E64] transition-colors"
                >
                  How It Works
                </a>
              </li>

              <li>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="text-neutral-600 hover:text-[#201E64] transition-colors text-left"
                >
                  Register Business
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="text-neutral-600 hover:text-[#201E64] transition-colors text-left"
                >
                  Supplier Portal Sign In
                </button>
              </li>

            </ul>

          </div>

          {/* Column 3: Contact & Desk */}
          <div id="contact" className="space-y-4">

            <h3 className="text-xs font-bold text-[#201E64] uppercase tracking-wider">
              Contact & Desk
            </h3>

            <ul className="space-y-3 text-xs text-neutral-600">

              <li className="flex items-start space-x-2.5">

                <MapPin className="w-3.5 h-3.5 text-[#201E64] shrink-0 mt-0.5" />

                <span>
                  Enterprise Hub, Sandton & Pretoria, South Africa
                </span>

              </li>

              <li className="flex items-center space-x-2.5">

                <Mail className="w-3.5 h-3.5 text-[#201E64] shrink-0" />

                <a
                  href="mailto:support@agridata-esd.co.za"
                  className="hover:text-[#201E64] transition-colors"
                >
                  support@agridata-esd.co.za
                </a>

              </li>

              <li className="flex items-center space-x-2.5">

                <Phone className="w-3.5 h-3.5 text-[#201E64] shrink-0" />

                <span>
                  +27 (0) 11 892 4500
                </span>

              </li>

              <li className="pt-2">

                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#201E64]/5 border border-[#201E64]/10 text-[11px] text-[#201E64]">

                  <ShieldCheck className="w-3 h-3 text-[#201E64]" />

                  <span>POPIA & CIPC Compliant</span>

                </div>

              </li>

            </ul>

          </div>

        </div>

        {/* Legal & Copyright Sub-Footer */}
        <div className="mt-14 pt-8 border-t border-[#201E64]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">

          <div>
            © {currentYear} AgriData Enterprise & Supplier Development (Pty) Ltd. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">

            <a
              href="#privacy"
              className="hover:text-[#201E64] transition-colors"
            >
              Privacy Policy
            </a>

            <span className="text-[#201E64]/30">•</span>

            <a
              href="#terms"
              className="hover:text-[#201E64] transition-colors"
            >
              Terms & Conditions
            </a>

            <span className="text-[#201E64]/30">•</span>

            <a
              href="#popia"
              className="hover:text-[#201E64] transition-colors"
            >
              POPIA Compliance
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

