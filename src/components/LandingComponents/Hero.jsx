import React from 'react';
import {
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const NAVY = '#201E64';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-white text-neutral-900">

      {/* Subtle background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#201E64]/5" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#201E64]/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.12] text-neutral-900">

              Creating Opportunities.{' '}

              <span className="text-[#201E64]">
                Growing Businesses.
              </span>

            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto lg:mx-0">

              Connect with verified procurement opportunities, structured
              business support, and supplier development programmes
              designed to accelerate enterprise growth, build operational
              capacity, and forge sustainable corporate partnerships.

            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">

              {/* Primary */}
              <button
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center gap-2
                  px-7 py-3.5
                  rounded-full
                  bg-[#201E64]
                  hover:bg-[#2B2889]
                  text-white
                  text-sm font-semibold
                  transition-all duration-200
                  shadow-sm
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                <span>Get Started</span>

                <ArrowRight className="w-4 h-4" />

              </button>

              {/* Secondary */}
              <a
                href="#how-it-works"
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center gap-2
                  px-6 py-3.5
                  rounded-full
                  bg-white
                  hover:bg-[#201E64]/5
                  text-[#201E64]
                  text-sm font-semibold
                  border border-[#201E64]/20
                  hover:border-[#201E64]/40
                  transition-all duration-200
                "
              >

                <span>How It Works</span>

                <ChevronDown className="w-4 h-4" />

              </a>

            </div>

            {/* IMPACT STATS */}
            <div className="pt-8 border-t border-neutral-200">

              <div className="grid grid-cols-3 gap-4 sm:gap-6 text-left">

                {/* Stat 1 */}
                <div>

                  <div className="text-2xl sm:text-3xl font-extrabold text-[#201E64]">
                    1,450+
                  </div>

                  <div className="text-xs text-neutral-500 font-medium mt-1">
                    Verified Suppliers
                  </div>

                </div>

                {/* Stat 2 */}
                <div className="border-l border-neutral-200 pl-4 sm:pl-6">

                  <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                    R120M+
                  </div>

                  <div className="text-xs text-neutral-500 font-medium mt-1">
                    Value Facilitated
                  </div>

                </div>

                {/* Stat 3 */}
                <div className="border-l border-neutral-200 pl-4 sm:pl-6">

                  <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                    94%
                  </div>

                  <div className="text-xs text-neutral-500 font-medium mt-1">
                    Retention Rate
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN - IMAGE */}
          <div className="lg:col-span-6">

            <div className="relative mx-auto max-w-lg lg:max-w-none">

              {/* Navy decorative background */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-[#201E64]/10" />

              {/* Image container */}
              <div
                className="
                  relative
                  rounded-3xl
                  overflow-hidden
                  border border-[#201E64]/15
                  bg-neutral-100
                  shadow-xl
                  transition-all duration-300
                  hover:shadow-2xl
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85"
                  alt="Entrepreneurs and enterprise leaders collaborating on business growth"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-center block"
                  loading="eager"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#201E64]/35 via-transparent to-transparent pointer-events-none" />

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}