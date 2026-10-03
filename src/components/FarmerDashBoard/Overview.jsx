import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Briefcase, Users, FlaskConical, MapPin, Video, ArrowRight, Clock } from 'lucide-react';

// ---- Sample data: replace with your API responses ----
const inDays = (n, h = 9, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h, m, 0, 0);
  return d;
};

const OPPORTUNITIES = [
  { id: 1, title: 'Cane haulage contract', company: 'Maidstone Mill', category: 'Transport', closes: inDays(2) },
  { id: 2, title: 'Drip irrigation supplier programme', company: 'Tongaat Hulett ESD', category: 'Supplier development', closes: inDays(6) },
  { id: 3, title: 'Bulk fertiliser buying group', company: 'Growers Co-op', category: 'Inputs', closes: inDays(9) },
  { id: 4, title: 'Seasonal cane cutting contract', company: 'Felixton Mill', category: 'Labour', closes: inDays(14) },
];

const MEETINGS = [
  { id: 1, title: 'Grower association meeting', type: 'Meeting', mode: 'In person', place: 'Community hall, Maidstone', when: inDays(1, 9, 0) },
  { id: 2, title: 'Safe chemical handling workshop', type: 'Workshop', mode: 'In person', place: 'Tongaat Training Centre', when: inDays(4, 10, 30) },
  { id: 3, title: 'ESD programme onboarding session', type: 'Meeting', mode: 'Online', place: 'Microsoft Teams', when: inDays(8, 14, 0) },
];

const PENDING_REQUESTS = 2;

// ---- Helpers ----
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (d) => Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000);

const closesLabel = (d) => {
  const n = daysBetween(d);
  if (n <= 0) return 'Closes today';
  if (n === 1) return 'Closes tomorrow';
  return `Closes in ${n} days`;
};

const whenLabel = (d) => {
  const n = daysBetween(d);
  const time = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (n === 0) return `Today, ${time}`;
  if (n === 1) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString('en-ZA', { weekday: 'short' })}, ${time}`;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

// ---- Pieces ----
function StatCard({ to, icon: Icon, value, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 hover:border-[#201E64]/30 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
    >
      <span className="w-11 h-11 rounded-xl bg-[#201E64]/[0.07] text-[#201E64] flex items-center justify-center shrink-0 group-hover:bg-[#201E64] group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </span>
      <span>
        <span className="block text-2xl font-extrabold text-[#201E64] leading-none">{value}</span>
        <span className="block mt-1 text-xs sm:text-sm text-neutral-500">{label}</span>
      </span>
    </Link>
  );
}

function Panel({ title, to, children }) {
  return (
    <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h2 className="text-base font-bold text-[#201E64]">{title}</h2>
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#201E64] hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-neutral-100">{children}</ul>
    </section>
  );
}

export default function Overview() {
  const { user } = useOutletContext();
  const firstName = user.name.split(' ')[0];
  const today = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">
          {greeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{today}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard to="/dashboard/opportunities" icon={Briefcase} value={OPPORTUNITIES.length} label="Open opportunities" />
        <StatCard to="/dashboard/meetings" icon={Users} value={MEETINGS.length} label="Upcoming meetings" />
        <StatCard to="/dashboard/requests" icon={FlaskConical} value={PENDING_REQUESTS} label="Pending requests" />
      </div>

      {/* At a glance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Panel title="Business opportunities" to="/dashboard/opportunities">
          {OPPORTUNITIES.map((o) => {
            const urgent = daysBetween(o.closes) <= 3;
            return (
              <li key={o.id}>
                <Link
                  to="/dashboard/opportunities"
                  className="flex items-center gap-3 sm:gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:bg-neutral-50"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#201E64]/[0.07] text-[#201E64] flex items-center justify-center shrink-0">
                    <Briefcase className="w-[18px] h-[18px]" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-neutral-900 truncate">{o.title}</span>
                    <span className="block mt-0.5 text-xs text-neutral-500 truncate">
                      {o.company} · {o.category}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      urgent ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {closesLabel(o.closes)}
                  </span>
                </Link>
              </li>
            );
          })}
        </Panel>

        <Panel title="Meetings & workshops" to="/dashboard/meetings">
          {MEETINGS.map((m) => (
            <li key={m.id}>
              <Link
                to="/dashboard/meetings"
                className="flex items-center gap-3 sm:gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:bg-neutral-50"
              >
                <span className="w-11 h-12 rounded-xl bg-[#201E64] text-white flex flex-col items-center justify-center shrink-0 leading-none">
                  <span className="text-base font-bold">{m.when.getDate()}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-wide text-white/75">
                    {m.when.toLocaleDateString('en-ZA', { month: 'short' }).replace('.', '')}
                  </span>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-neutral-900 truncate">{m.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {whenLabel(m.when)}
                    </span>
                    <span className="inline-flex items-center gap-1 min-w-0">
                      {m.mode === 'Online' ? (
                        <Video className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate">{m.place}</span>
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#201E64]/[0.07] text-[#201E64]">
                  {m.type}
                </span>
              </Link>
            </li>
          ))}
        </Panel>
      </div>
    </div>
  );
}