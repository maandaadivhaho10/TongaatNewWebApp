import React from 'react';
import {
  Briefcase,
  TrendingUp,
  HelpCircle,
  Layers,
  Check,
  ArrowUpRight,
  Shield
} from 'lucide-react';

const NAVY = '#201E64';

export default function ValueSection() {
  const capabilities = [
    {
      id: 'opportunities',
      title: 'Business Opportunities',
      subtitle: 'Market Access & Contracts',
      description: 'Discover commercial opportunities, supply chain requirements, and programmes specifically matched to your business scale and sector.',
      icon: Briefcase,
      badge: 'Procurement',
      benefits: [
        'Direct corporate buyer listings',
        'Verified private & public opportunities',
        'Capability-based smart matching'
      ]
    },
    {
      id: 'development',
      title: 'Supplier Development',
      subtitle: 'Capacity Building & ESD',
      description: 'Connect enterprises with dedicated corporate supplier development programmes, technical incubation, and operational support.',
      icon: Layers,
      badge: 'Development',
      benefits: [
        'Technical training & incubation',
        'Equipment & capital readiness guidance',
        'B-BBEE compliance alignment'
      ]
    },
    {
      id: 'support',
      title: 'Business Support',
      subtitle: 'Advisory & Mentorship',
      description: 'Access accredited advisory resources, executive mentorship, financial readiness support, and compliance assistance.',
      icon: HelpCircle,
      badge: 'Advisory',
      benefits: [
        'One-on-one business advisory',
        'Financial audit & tax readiness',
        'Standards & compliance assistance'
      ]
    },
    {
      id: 'growth',
      title: 'Grow Your Business',
      subtitle: 'Sustainable Partnerships',
      description: 'Build strategic commercial connections, expand market reach, and access the ecosystem resources needed to develop and scale.',
      icon: TrendingUp,
      badge: 'Expansion',
      benefits: [
        'Long-term corporate supply linkages',
        'Capacity benchmarking & metrics',
        'Sustainable enterprise growth'
      ]
    }
  ];

  return (
    <section
      id="capabilities"
      className="py-24 bg-white border-b border-neutral-200 text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">

          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#201E64]/5 border border-[#201E64]/10 text-[#201E64] text-xs font-semibold uppercase tracking-wider">

            <Shield className="w-3.5 h-3.5 text-[#201E64]" />

            <span>Platform Capabilities</span>

          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Comprehensive Capabilities for Growing Enterprises
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Equipping emerging businesses and suppliers with market connections,
            development programmes, and practical support to build sustainable capacity.
          </p>

        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="
                  group
                  relative
                  bg-[#201E64]/[0.02]
                  hover:bg-white
                  rounded-2xl
                  p-7
                  border border-[#201E64]/10
                  hover:border-[#201E64]/25
                  shadow-sm
                  hover:shadow-lg
                  transition-all duration-300
                  flex flex-col
                  justify-between
                "
              >

                <div>

                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">

                    <div
                      className="
                        w-11 h-11
                        rounded-xl
                        bg-[#201E64]/5
                        border border-[#201E64]/10
                        flex items-center justify-center
                        text-[#201E64]
                        shadow-sm
                        group-hover:bg-[#201E64]
                        group-hover:text-white
                        group-hover:border-[#201E64]
                        transition-colors
                      "
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        px-2
                        py-0.5
                        rounded
                        bg-[#201E64]/5
                        border border-[#201E64]/10
                        text-[#201E64]
                        uppercase
                        tracking-wider
                      "
                    >
                      {item.badge}
                    </span>

                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>

                  <div className="text-xs font-medium text-[#201E64] mt-1 mb-3">
                    {item.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>

                </div>

                {/* Key Checklist Benefits */}
                <div className="pt-4 border-t border-[#201E64]/10 space-y-2.5">

                  {item.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 text-xs text-neutral-700"
                    >
                      <Check className="w-3.5 h-3.5 text-[#201E64] shrink-0 mt-0.5" />

                      <span>{benefit}</span>
                    </div>
                  ))}

                  {/* Navy Action Button */}
                  <div className="pt-5">

                    <button
                      className="
                        w-full
                        inline-flex
                        items-center
                        justify-center
                        space-x-1.5
                        py-2.5
                        px-4
                        rounded-full
                        bg-[#201E64]
                        hover:bg-[#2B2889]
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        shadow-sm
                        hover:shadow-md
                        group/btn
                      "
                    >
                      <span>Explore Capability</span>

                      <ArrowUpRight
                        className="
                          w-3.5
                          h-3.5
                          text-white/70
                          group-hover/btn:text-white
                          transition-transform
                          group-hover/btn:translate-x-0.5
                          group-hover/btn:-translate-y-0.5
                        "
                      />

                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
