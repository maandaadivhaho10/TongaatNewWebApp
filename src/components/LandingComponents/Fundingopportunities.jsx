import React from 'react';

const NAVY = '#201E64';

// Replace with data from your API
const FUNDING = [
  {
    id: 1,
    title: 'Emerging Grower Grant',
    description:
      'Grant funding for small-scale growers to buy seed, fertiliser and irrigation equipment and increase their yields.',
    funder: 'Tongaat Hulett Development Fund',
    amount: 'Up to R250k',
    eligibility: 'Black-owned growers farming 50 hectares or less',
    closing: '2026-10-20',
  },
  {
    id: 2,
    title: 'SMME Working Capital Facility',
    description:
      'Short-term working capital to help suppliers fulfil purchase orders and cover costs while waiting for payment.',
    funder: 'Supplier Development Programme',
    amount: 'R100k – R750k',
    eligibility: 'Registered suppliers with an active purchase order',
    closing: '2026-11-30',
  },
  {
    id: 3,
    title: 'Equipment and Machinery Finance',
    description:
      'Subsidised asset finance for businesses that need machinery, vehicles or tools to meet supply requirements.',
    funder: 'Enterprise Development Partner Bank',
    amount: 'Up to R1m',
    eligibility: 'Businesses trading for at least 12 months',
    closing: '2026-12-15',
  },
  {
    id: 4,
    title: 'Youth Enterprise Start-Up Fund',
    description:
      'Seed funding and mentorship for young entrepreneurs starting a business that serves our value chain.',
    funder: 'Youth Development Initiative',
    amount: 'Up to R150k',
    eligibility: 'Entrepreneurs aged 18 to 35',
    closing: '2026-10-12',
  },
  {
    id: 5,
    title: 'Women-Owned Business Growth Grant',
    description:
      'Funding for women-owned businesses to expand operations, hire staff and meet quality and compliance standards.',
    funder: 'Tongaat Hulett Development Fund',
    amount: 'Up to R300k',
    eligibility: 'At least 51% women-owned and registered',
    closing: '2027-01-31',
  },
  {
    id: 6,
    title: 'Compliance and Certification Support',
    description:
      'Covers the cost of certifications, audits and safety compliance that suppliers need to qualify for contracts.',
    funder: 'Supplier Development Programme',
    amount: 'Up to R80k',
    eligibility: 'Registered suppliers on the platform',
    closing: '2026-11-18',
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

function FundingCard({ item }) {
  const daysLeft = daysUntil(item.closing);
  const closingSoon = daysLeft >= 0 && daysLeft <= 14;

  return (
    <article className="flex flex-col bg-white rounded-none border border-neutral-200 border-t-4 border-t-[#201E64] shadow-sm p-6">
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
          <dt className="text-neutral-500 shrink-0">Funder:</dt>
          <dd className="text-neutral-800">{item.funder}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-neutral-500 shrink-0">Who can apply:</dt>
          <dd className="text-neutral-800">{item.eligibility}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-neutral-500 shrink-0">Closes:</dt>
          <dd className="text-neutral-800">{formatDate(item.closing)}</dd>
        </div>
      </dl>

      <p
        className="mt-5 pt-5 border-t border-neutral-100 text-base font-bold mt-auto"
        style={{ color: NAVY }}
      >
        {item.amount}
      </p>
    </article>
  );
}

export default function FundingOpportunities({ funding = FUNDING }) {
  return (
    <section
      id="funding"
      className="py-16 lg:py-20 bg-white text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: NAVY }}
          >
            Funding opportunities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Grants and finance available to help registered businesses grow.
          </p>
        </div>

        {/* List */}
        {funding.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funding.map((item) => (
              <FundingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-10 bg-[#F5F6FA] border border-neutral-200 rounded-none p-10 text-center">
            <p className="font-semibold text-neutral-900">
              There is no funding open right now
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Check back soon for new funding opportunities.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}