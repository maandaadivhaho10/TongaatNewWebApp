
import React from 'react';
import {
  UserPlus,
  Search,
  Rocket,
  Check,
  ArrowRight
} from 'lucide-react';

const NAVY = '#201E64';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      tag: 'Step 1: Onboarding',
      description:
        'Register your business and provide your company information, compliance documentation, and enterprise capacity.',
      icon: UserPlus,
      actionTitle: 'Information needed:',
      bullets: [
        'CIPC registration & tax compliance PIN',
        'B-BBEE certificate or sworn affidavit',
        'Business capability profile'
      ]
    },
    {
      step: '02',
      title: 'Discover Opportunities',
      tag: 'Step 2: Exploration',
      description:
        'Browse opportunities, ESD programmes, corporate procurement requirements, and development support available to your business.',
      icon: Search,
      actionTitle: 'What you access:',
      bullets: [
        'Corporate supply chain opportunities',
        'Supplier development programmes',
        'Targeted enterprise advisory'
      ]
    },
    {
      step: '03',
      title: 'Apply & Grow',
      tag: 'Step 3: Partnership',
      description:
        'Submit applications and connect directly with organisations and corporate partners that can support your business development.',
      icon: Rocket,
      actionTitle: 'Outcomes achieved:',
      bullets: [
        'Direct corporate buyer linkages',
        'Technical capacity development',
        'Sustainable, scalable growth'
      ]
    }
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-white border-b border-neutral-200 text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">

          <span
            className="
              inline-flex items-center
              px-4 py-2
              rounded-full
              bg-[#201E64]/5
              border border-[#201E64]/10
              text-[#201E64]
              text-xs
              font-semibold
              uppercase
              tracking-wider
            "
          >
            Simple 3-Step Process
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How the ESD Platform Works
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
            A clear and structured pathway connecting emerging businesses to
            enterprise support and sustainable commercial opportunities.
          </p>

        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {steps.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="
                  group
                  relative
                  bg-white
                  rounded-2xl
                  p-8
                  border border-[#201E64]/10
                  hover:border-[#201E64]/25
                  shadow-sm
                  hover:shadow-xl
                  transition-all duration-300
                  flex flex-col
                  justify-between
                "
              >

                <div>

                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">

                    <span
                      className="
                        text-3xl
                        font-extrabold
                        text-[#201E64]/20
                        group-hover:text-[#201E64]/40
                        transition-colors
                      "
                    >
                      {item.step}
                    </span>

                    <div
                      className="
                        w-11 h-11
                        rounded-xl
                        bg-[#201E64]/5
                        border border-[#201E64]/10
                        flex items-center justify-center
                        text-[#201E64]
                        group-hover:bg-[#201E64]
                        group-hover:text-white
                        group-hover:border-[#201E64]
                        transition-colors
                      "
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                  </div>

                  {/* Title & Tag */}
                  <span
                    className="
                      text-[11px]
                      font-semibold
                      text-[#201E64]
                      uppercase
                      tracking-wider
                      block
                      mb-1
                    "
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                </div>

                {/* Bullets */}
                <div className="pt-5 border-t border-neutral-200">

                  <div
                    className="
                      text-xs
                      font-semibold
                      text-[#201E64]
                      uppercase
                      tracking-wide
                      mb-3
                    "
                  >
                    {item.actionTitle}
                  </div>

                  <ul className="space-y-2.5">

                    {item.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="
                          flex
                          items-start
                          space-x-2
                          text-xs
                          text-neutral-700
                        "
                      >
                        <Check
                          className="
                            w-3.5
                            h-3.5
                            text-[#201E64]
                            shrink-0
                            mt-0.5
                          "
                        />

                        <span>{bullet}</span>
                      </li>
                    ))}

                  </ul>

                </div>

              </div>
            );
          })}

        </div>

        {/* Executive Action Banner */}
        <div
          className="
            mt-14
            max-w-4xl
            mx-auto
            p-7
            bg-white
            border border-[#201E64]/10
            rounded-2xl
            text-neutral-900
            shadow-sm
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-6
          "
        >

          <div className="space-y-1 text-center sm:text-left">

            <h4 className="text-lg font-bold text-neutral-900">
              Ready to create your business profile?
            </h4>

            <p className="text-sm text-neutral-600">
              Registration takes only a few minutes. Access programmes and
              enterprise support.
            </p>

          </div>

          <button
            className="
              shrink-0
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              bg-[#201E64]
              hover:bg-[#2B2889]
              text-white
              font-semibold
              text-xs
              shadow-sm
              hover:shadow-md
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            <span>Register Business</span>

            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>

        </div>

      </div>
    </section>
  );
}
