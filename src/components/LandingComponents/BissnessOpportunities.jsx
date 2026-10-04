import React from 'react';

const NAVY = '#201E64';

// Replace with data from your API
const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Packaging Materials Supply Contract',
    description:
      'Supply corrugated boxes and packaging film to our food production sites. Open to black-owned SMMEs with at least one year of trading history.',
    location: 'KwaZulu-Natal',
    closing: '2026-10-15',
    value: 'R500k – R1.2m per year',
  },
  {
    id: 2,
    title: 'Small-Scale Grower Support Programme',
    description:
      'Funding, mentorship and equipment access for emerging growers who want to scale up and join our agricultural value chain.',
    location: 'Mpumalanga',
    closing: '2026-11-20',
    value: 'Up to R250k grant funding',
  },
  {
    id: 3,
    title: 'Site Cleaning and Facilities Services',
    description:
      'Three-year facilities services contract covering cleaning, waste handling and grounds maintenance across regional offices.',
    location: 'Gauteng',
    closing: '2026-10-30',
    value: 'R300k – R800k per year',
  },
  {
    id: 4,
    title: 'Business Skills and Compliance Accelerator',
    description:
      'Six months of training on bookkeeping, tax compliance and tendering, with one-on-one coaching from industry mentors.',
    location: 'Nationwide',
    closing: '2026-12-05',
    value: 'Fully sponsored',
  },
  {
    id: 5,
    title: 'Transport and Logistics Partners',
    description:
      'Join our approved transporter list for local deliveries. Vehicles must be roadworthy and insured, and drivers must hold valid permits.',
    location: 'KwaZulu-Natal',
    closing: '2026-11-14',
    value: 'Rate-based, per load',
  },
  {
    id: 6,
    title: 'Equipment Finance for Young Entrepreneurs',
    description:
      'Access to subsidised equipment finance for businesses owned by entrepreneurs aged 35 and under.',
    location: 'Nationwide',
    closing: '2027-01-31',
    value: 'Up to R400k asset finance',
  },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(iso) {
  return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

function OpportunityCard({ item }) {
  const daysLeft = daysUntil(item.closing);
  const closingSoon = daysLeft >= 0 && daysLeft <= 14;

  return (
    <article className="flex flex-col bg-white rounded-none border border-neutral-200 shadow-sm p-6">
      {closingSoon && (
        <span className="self-start mb-3 text-xs font-semibold px-2.5 py-1 rounded-none bg-amber-100 text-amber-800">
          Closes in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
        </span>
      )}

      <h3 className="text-lg font-bold leading-snug" style={{ color: NAVY }}>
        {item.title}
      </h3>

      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
        {item.description}
      </p>

      <dl className="mt-5 space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="text-neutral-500">Location:</dt>
          <dd className="text-neutral-800">{item.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-neutral-500">Closes:</dt>
          <dd className="text-neutral-800">{formatDate(item.closing)}</dd>
        </div>
      </dl>

      <p className="mt-5 pt-5 border-t border-neutral-100 text-sm font-semibold text-neutral-900 mt-auto">
        {item.value}
      </p>
    </article>
  );
}

export default function Opportunities({ opportunities = OPPORTUNITIES }) {
  return (
    <section
      id="opportunities"
      className="py-16 lg:py-20 bg-[#F5F6FA] text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: NAVY }}
          >
            business opportunities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Current business opportunities open to registered suppliers.
          </p>
        </div>

        {/* List */}
        {opportunities.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((item) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-10 bg-white border border-neutral-200 rounded-none p-10 text-center">
            <p className="font-semibold text-neutral-900">
              There are no opportunities open right now
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Check back soon for new opportunities.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}