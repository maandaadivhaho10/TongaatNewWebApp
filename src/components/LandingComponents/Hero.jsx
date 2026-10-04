import React from 'react';
import { ArrowRight } from 'lucide-react';

const NAVY = '#201E64';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-24 bg-white text-neutral-900">

      {/* Background decoration */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
        style={{ backgroundColor: `${NAVY}0D` }}
      />

      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
        style={{ backgroundColor: `${NAVY}0D` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 text-center lg:text-left">

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.08] text-neutral-900">

              Your Business.{' '}

              <span style={{ color: NAVY }}>
                Your Opportunity.
              </span>{' '}

              Your Next Step.

            </h1>

            {/* Description */}
            <p className="mt-7 text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">

              Connect to opportunities, resources and support that can help
              your business grow and become part of sustainable value chains.

            </p>

            {/* CTA */}
            <div className="mt-8 flex justify-center lg:justify-start">

              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-3
                  px-8 py-4
                  rounded-none
                  text-white
                  text-base font-bold
                  shadow-md
                  hover:shadow-lg
                  transition-all duration-200
                  hover:-translate-y-0.5
                  active:translate-y-0
                "
                style={{ backgroundColor: NAVY }}
              >
                <span>Register. Connect. Grow.</span>

                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

          </div>

          {/* RIGHT SIDE - REGISTERED SUPPLIERS */}
          <div className="lg:col-span-5">

            <div
              className="
                relative
                rounded-none
                p-8 sm:p-10
                bg-white
                border
                shadow-xl
              "
              style={{
                borderColor: `${NAVY}25`
              }}
            >

              {/* Registered Suppliers */}
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                Registered Suppliers
              </p>

              {/* Supplier Number */}
              <div
                className="mt-4 text-5xl sm:text-6xl font-extrabold"
                style={{ color: NAVY }}
              >
                1,450+
              </div>

              {/* Supplier Description */}
              <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                Businesses registered on the platform and connected to
                opportunities, resources and enterprise support.
              </p>

            </div>

          </div>

        </div>

        {/* DISCLAIMER */}
        <div className="mt-12 pt-6 border-t border-neutral-200">

          <div
            className="
              max-w-6xl mx-auto
              flex items-start gap-4
              rounded-xl
              border border-amber-200
              bg-amber-50
              px-5 py-4
              shadow-sm
            "
          >

            {/* Attention indicator */}
            <div
              className="
                flex-shrink-0
                flex items-center justify-center
                w-8 h-8
                rounded-full
                bg-amber-100
                text-amber-700
                font-bold
                text-sm
              "
            >
              !
            </div>

            {/* Disclaimer text */}
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">

              <span className="font-bold">
                Please note:
              </span>{' '}

              Registration on the platform does not guarantee procurement
              opportunities, contracts, funding or other forms of support.
              Opportunities and programmes are subject to applicable
              requirements, business needs and available initiatives.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}