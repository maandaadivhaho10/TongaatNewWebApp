import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import Profile from './Companyregistration'

const NAVY = '#201E64';

const FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2';
const CARD = 'bg-white rounded-none border border-neutral-200 shadow-sm';
const INPUT =
  'w-full rounded-none border border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15 bg-white px-4 text-sm outline-none transition';
const BTN = `inline-flex items-center justify-center px-5 py-2.5 rounded-none bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold transition-colors ${FOCUS}`;
const BTN_OUTLINE = `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-none border border-[#201E64]/30 text-[#201E64] text-sm font-semibold hover:bg-[#201E64]/5 transition-colors ${FOCUS}`;

// Replace with the logged-in user from your auth state or API
const DEFAULT_USER = {
  name: 'Thabo',
  surname: 'Mokoena',
  industry: 'Agriculture',
  company: 'Mokoena Farming Supplies',
  regNo: '2019/123456/07',
  province: 'KwaZulu-Natal',
  email: 'thabo@mokoenafarming.co.za',
  phone: '+27 82 000 0000',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'profile', label: 'Company Profile' },
  { id: 'opportunities', label: 'Business Opportunities' },
  { id: 'funding', label: 'Funding Opportunities' },
  { id: 'advisory', label: 'Request Business Advisory' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact Us' },
];

// Replace with data from your API
const OPPORTUNITIES = [
  { id: 1, title: 'Packaging Materials Supply Contract', description: 'Supply corrugated boxes and packaging film to our food production sites. Open to black-owned SMMEs with at least one year of trading history.', location: 'KwaZulu-Natal', closing: '2026-10-15', value: 'R500k – R1.2m per year' },
  { id: 2, title: 'Small-Scale Grower Support Programme', description: 'Funding, mentorship and equipment access for emerging growers who want to scale up and join our agricultural value chain.', location: 'Mpumalanga', closing: '2026-11-20', value: 'Up to R250k grant funding' },
  { id: 3, title: 'Site Cleaning and Facilities Services', description: 'Three-year facilities services contract covering cleaning, waste handling and grounds maintenance across regional offices.', location: 'Gauteng', closing: '2026-10-30', value: 'R300k – R800k per year' },
  { id: 4, title: 'Business Skills and Compliance Accelerator', description: 'Six months of training on bookkeeping, tax compliance and tendering, with one-on-one coaching from industry mentors.', location: 'Nationwide', closing: '2026-12-05', value: 'Fully sponsored' },
  { id: 5, title: 'Transport and Logistics Partners', description: 'Join our approved transporter list for local deliveries. Vehicles must be roadworthy and insured, and drivers must hold valid permits.', location: 'KwaZulu-Natal', closing: '2026-11-14', value: 'Rate-based, per load' },
  { id: 6, title: 'Equipment Finance for Young Entrepreneurs', description: 'Access to subsidised equipment finance for businesses owned by entrepreneurs aged 35 and under.', location: 'Nationwide', closing: '2027-01-31', value: 'Up to R400k asset finance' },
];

const FUNDING = [
  { id: 1, title: 'Emerging Grower Grant', description: 'Grant funding for small-scale growers to buy seed, fertiliser and irrigation equipment.', funder: 'Tongaat Hulett Development Fund', eligibility: 'Black-owned growers farming 50 hectares or less', closing: '2026-10-20', amount: 'Up to R250k' },
  { id: 2, title: 'SMME Working Capital Facility', description: 'Short-term working capital to help suppliers fulfil purchase orders while waiting for payment.', funder: 'Supplier Development Programme', eligibility: 'Registered suppliers with an active purchase order', closing: '2026-11-30', amount: 'R100k – R750k' },
  { id: 3, title: 'Equipment and Machinery Finance', description: 'Subsidised asset finance for machinery, vehicles or tools needed to meet supply requirements.', funder: 'Enterprise Development Partner Bank', eligibility: 'Businesses trading for at least 12 months', closing: '2026-12-15', amount: 'Up to R1m' },
  { id: 4, title: 'Compliance and Certification Support', description: 'Covers the cost of certifications, audits and safety compliance needed to qualify for contracts.', funder: 'Supplier Development Programme', eligibility: 'Registered suppliers on the platform', closing: '2026-11-18', amount: 'Up to R80k' },
];

const PROFILE_DOCS = [
  { name: 'CIPC registration', done: true },
  { name: 'Tax compliance PIN', done: true },
  { name: 'B-BBEE certificate or sworn affidavit', done: true },
  { name: 'Business capability profile', done: false },
  { name: 'Bank confirmation letter', done: false },
];

const FAQS = [
  { q: 'How do I apply for a business opportunity?', a: 'Open the Business Opportunities screen, read the requirements and contact the programme team using the details on the opportunity. Make sure your company profile is complete before you apply.' },
  { q: 'Which documents do I need to register?', a: 'You need your CIPC registration, a tax compliance PIN, a B-BBEE certificate or sworn affidavit, and a business capability profile.' },
  { q: 'Does registering guarantee a contract or funding?', a: 'No. Registration does not guarantee procurement opportunities, contracts or funding. Opportunities are subject to the requirements and business needs of each programme.' },
  { q: 'How long does an advisory request take to be answered?', a: 'A business advisor will usually respond within five working days of your request.' },
  { q: 'How do I update my company details?', a: 'Contact us with the changes you need and we will update your profile.' },
];

const APPLICATIONS_SUBMITTED = 2;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(iso) {
  return Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
}

function ClosingBadge({ closing }) {
  const d = daysUntil(closing);
  if (d < 0 || d > 14) return null;
  return (
    <span className="self-start mb-3 text-xs font-semibold px-2.5 py-1 rounded-none bg-amber-100 text-amber-800">
      Closes in {d} {d === 1 ? 'day' : 'days'}
    </span>
  );
}

function OpportunityCard({ item }) {
  return (
    <article className={`flex flex-col ${CARD} p-6`}>
      <ClosingBadge closing={item.closing} />
      <h3 className="text-lg font-bold leading-snug" style={{ color: NAVY }}>{item.title}</h3>
      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{item.description}</p>
      <dl className="mt-5 space-y-1.5 text-sm">
        <div className="flex gap-2"><dt className="text-neutral-500">Location:</dt><dd className="text-neutral-800">{item.location}</dd></div>
        <div className="flex gap-2"><dt className="text-neutral-500">Closes:</dt><dd className="text-neutral-800">{formatDate(item.closing)}</dd></div>
      </dl>
      <p className="mt-5 pt-5 border-t border-neutral-100 text-sm font-semibold text-neutral-900 mt-auto">{item.value}</p>
    </article>
  );
}

function FundingCard({ item }) {
  return (
    <article className={`flex flex-col ${CARD} p-6`}>
      <ClosingBadge closing={item.closing} />
      <h3 className="text-lg font-bold leading-snug" style={{ color: NAVY }}>{item.title}</h3>
      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{item.description}</p>
      <dl className="mt-5 space-y-1.5 text-sm">
        <div className="flex gap-2"><dt className="text-neutral-500 shrink-0">Funder:</dt><dd className="text-neutral-800">{item.funder}</dd></div>
        <div className="flex gap-2"><dt className="text-neutral-500 shrink-0">Who can apply:</dt><dd className="text-neutral-800">{item.eligibility}</dd></div>
        <div className="flex gap-2"><dt className="text-neutral-500 shrink-0">Closes:</dt><dd className="text-neutral-800">{formatDate(item.closing)}</dd></div>
      </dl>
      <p className="mt-5 pt-5 border-t border-neutral-100 text-base font-bold mt-auto" style={{ color: NAVY }}>{item.amount}</p>
    </article>
  );
}

function PageHeading({ title, text }) {
  return (
    <div className="mb-8 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: NAVY }}>{title}</h1>
      {text && <p className="mt-2 text-neutral-600 leading-relaxed">{text}</p>}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div
      className="h-2 bg-neutral-200 rounded-none"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-[#201E64]" style={{ width: `${value}%` }} />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SuccessNote({ children }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-none p-4 text-sm text-green-800" role="status">
      {children}
    </div>
  );
}

/* ---------------------------- SCREENS ---------------------------- */

function Overview({ user, completion, go, bannerImage }) {
  const stats = [
    { label: 'Open business opportunities', value: OPPORTUNITIES.length },
    { label: 'Funding opportunities', value: FUNDING.length },
    { label: 'Applications submitted', value: APPLICATIONS_SUBMITTED },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome banner with a slightly transparent picture */}
      <div className="relative overflow-hidden bg-[#201E64] text-white rounded-none p-8 sm:p-10">
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="relative">
          <p className="text-sm text-white/70">{user.company}</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="mt-3 max-w-xl text-white/80 leading-relaxed">
            See the latest business opportunities, track your profile and ask for business advisory support.
          </p>
        </div>
      </div>

      {/* Quick glance */}
      <section>
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Quick glance</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className={`${CARD} p-5`}>
            <p className="text-sm text-neutral-500">Profile completion</p>
            <p className="mt-1 text-3xl font-extrabold" style={{ color: NAVY }}>{completion}%</p>
            <div className="mt-3"><ProgressBar value={completion} /></div>
          </div>
          {stats.map((s) => (
            <div key={s.label} className={`${CARD} p-5`}>
              <p className="text-sm text-neutral-500">{s.label}</p>
              <p className="mt-1 text-3xl font-extrabold" style={{ color: NAVY }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business opportunities */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Business opportunities</h2>
          <button type="button" onClick={() => go('opportunities')} className={BTN_OUTLINE}>
            View all
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {OPPORTUNITIES.slice(0, 4).map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}


function Advisory() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeading title="Request business advisory" text="Tell us what you need help with and a business advisor will get back to you." />
      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className={`${CARD} p-6 sm:p-8 max-w-2xl space-y-5`}
      >
        <Field label="Area of support">
          <select required defaultValue="" className={`${INPUT} h-11`}>
            <option value="" disabled>Select an area</option>
            <option>Business plan and strategy</option>
            <option>Tax and compliance</option>
            <option>Funding readiness</option>
            <option>Marketing and sales</option>
            <option>Operations and quality</option>
          </select>
        </Field>
        <Field label="Preferred contact method">
          <select required defaultValue="Email" className={`${INPUT} h-11`}>
            <option>Email</option>
            <option>Phone call</option>
          </select>
        </Field>
        <Field label="How can we help?">
          <textarea required rows={5} className={`${INPUT} py-3`} placeholder="Describe your business and the support you need" />
        </Field>
        {sent && <SuccessNote>Your request has been sent. A business advisor will contact you soon.</SuccessNote>}
        <button type="submit" className={BTN}>Submit request</button>
      </form>
    </>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHeading title="Frequently asked questions" />
      <div className={`${CARD} max-w-3xl divide-y divide-neutral-200`}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-50 ${FOCUS}`}
              >
                <span>{f.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#201E64] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <p className="px-6 pb-5 text-sm text-neutral-600 leading-relaxed">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const details = [
    ['Email', 'support@example.co.za'],
    ['Phone', '+27 00 000 0000'],
    ['Hours', 'Monday to Friday, 08:00 to 17:00'],
  ];

  return (
    <>
      <PageHeading title="Contact us" text="Have a question? Send us a message and our team will respond." />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`${CARD} p-6 lg:col-span-2 self-start`}>
          <h2 className="text-lg font-bold" style={{ color: NAVY }}>Get in touch</h2>
          <dl className="mt-4 space-y-4 text-sm">
            {details.map(([k, v]) => (
              <div key={k}><dt className="text-neutral-500">{k}</dt><dd className="mt-0.5 font-medium text-neutral-900">{v}</dd></div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className={`${CARD} p-6 lg:col-span-3 space-y-5`}
        >
          <Field label="Subject"><input required type="text" className={`${INPUT} h-11`} /></Field>
          <Field label="Message"><textarea required rows={5} className={`${INPUT} py-3`} /></Field>
          {sent && <SuccessNote>Thank you. Your message has been sent.</SuccessNote>}
          <button type="submit" className={BTN}>Send message</button>
        </form>
      </div>
    </>
  );
}

/* ---------------------------- DASHBOARD ---------------------------- */

export default function SmmeDashboard({
  user = DEFAULT_USER,
  bannerImage = '/dashboard-banner.jpg',
}) {
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [navOpen, setNavOpen] = useState(false);

  const completion = Math.round(
    (PROFILE_DOCS.filter((d) => d.done).length / PROFILE_DOCS.length) * 100
  );

  const go = (id) => {
    setActive(id);
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              className={`lg:hidden p-2 rounded-none text-[#201E64] hover:bg-[#201E64]/5 ${FOCUS}`}
              aria-label="Toggle menu"
              aria-expanded={navOpen}
            >
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <img src="/Tongaat-Huletts-Logo.png" alt="Tongaat Hulett" className="h-9 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-bold text-neutral-900">{user.name} {user.surname}</p>
              <p className="text-xs text-neutral-500">{user.industry}</p>
            </div>
            <button type="button" onClick={() => navigate('/login')} className={BTN_OUTLINE}>
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="lg:flex">

        {/* SIDEBAR */}
        <aside
          className={`${navOpen ? 'block' : 'hidden'} lg:block lg:w-64 shrink-0 bg-white border-r border-b lg:border-b-0 border-neutral-200`}
        >
          <nav className="p-3 space-y-1" aria-label="Dashboard">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-4 py-3 rounded-none text-sm font-semibold transition-colors ${FOCUS} ${
                    isActive ? 'bg-[#201E64] text-white' : 'text-neutral-700 hover:bg-[#201E64]/5 hover:text-[#201E64]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-6xl">
            {active === 'dashboard' && <Overview user={user} completion={completion} go={go} bannerImage={bannerImage} />}
            {active === 'profile' && <Profile user={user} completion={completion} />}
            {active === 'opportunities' && (
              <>
                <PageHeading title="Business opportunities" text="Current business opportunities open to registered suppliers." />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {OPPORTUNITIES.map((item) => <OpportunityCard key={item.id} item={item} />)}
                </div>
              </>
            )}
            {active === 'funding' && (
              <>
                <PageHeading title="Funding opportunities" text="Grants and finance available to help registered businesses grow." />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {FUNDING.map((item) => <FundingCard key={item.id} item={item} />)}
                </div>
              </>
            )}
            {active === 'advisory' && <Advisory />}
            {active === 'faq' && <Faq />}
            {active === 'contact' && <Contact />}
          </div>
        </main>

      </div>
    </div>
  );
}