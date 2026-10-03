import React, { useState, useMemo } from 'react';
import {
  Users,
  Presentation,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  MapPin,
  Target,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Brand navy (same as the rest of the web app): #201E64

// ---------- Config ----------
const EVENT_TYPES = {
  MEETING: { label: 'Meetings', single: 'Meeting', icon: Users, accent: '#201E64', soft: '#ECEBF7' },
  WORKSHOP: { label: 'Workshops', single: 'Workshop', icon: Presentation, accent: '#B45309', soft: '#FCF1DE' },
};

const FILTERS = [
  { key: 'ALL', label: 'All', icon: CalendarDays, accent: '#201E64' },
  { key: 'MEETING', label: 'Meetings', icon: Users, accent: EVENT_TYPES.MEETING.accent },
  { key: 'WORKSHOP', label: 'Workshops', icon: Presentation, accent: EVENT_TYPES.WORKSHOP.accent },
];

const RSVP = {
  ACCEPT: { label: 'Accept', badge: 'Going', icon: Check, accent: '#0F9D6B', soft: '#E4F7EF' },
  DECLINE: { label: 'Decline', badge: 'Declined', icon: X, accent: '#DC2626', soft: '#FCEAEA' },
};

// ---------- Helpers ----------
const at = (dayOffset, h, m, durationMin) => {
  const start = new Date();
  start.setDate(start.getDate() + dayOffset);
  start.setHours(h, m, 0, 0);
  return { start, end: new Date(start.getTime() + durationMin * 60000) };
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysFromToday = (d) => Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000);
const dateKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const timeFmt = (d) => d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false });

const dayLabel = (d) => {
  const base = d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  const n = daysFromToday(d);
  if (n === 0) return `Today · ${base}`;
  if (n === 1) return `Tomorrow · ${base}`;
  return base;
};

const initialsOf = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// Builds an .ics file so the event can be added to Google, Outlook or Apple Calendar
const downloadICS = (event) => {
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const esc = (s) => s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tongaat Hulett//Farmer Portal//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@farmer-portal`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${esc(`${EVENT_TYPES[event.type].single} with ${event.company}`)}`,
    `LOCATION:${esc(event.place)}`,
    `DESCRIPTION:${esc(event.objective)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.type.toLowerCase()}-${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// TODO: replace with events from your API
const SAMPLE_EVENTS = [
  { id: 'e1', type: 'MEETING', company: 'Tongaat Hulett', ...at(0, 9, 30, 45), place: 'HQ · Boardroom 4B', objective: 'Review Q3 term sheet and align on closing timeline.' },
  { id: 'e2', type: 'WORKSHOP', company: 'Tongaat Hulett', ...at(0, 13, 0, 120), place: 'Studio Loft, Floor 2', objective: 'Hands-on session on safe chemical handling and storage.' },
  { id: 'e3', type: 'MEETING', company: 'Tongaat Hulett', ...at(1, 11, 0, 30), place: 'Zoom · Room 3021', objective: 'Vendor onboarding check-in and contract clarifications.' },
  { id: 'e4', type: 'WORKSHOP', company: 'Beacon Analytics', ...at(2, 10, 0, 150), place: 'Innovation Lab, Floor 6', objective: 'Train the team on the new forecasting dashboard.' },
  { id: 'e5', type: 'MEETING', company: 'Solace Health', ...at(2, 15, 45, 30), place: 'HQ · Meeting Room 12', objective: 'Discuss renewal terms for the wellness partnership.' },
  { id: 'e6', type: 'WORKSHOP', company: 'Tongaat Hulett', ...at(4, 14, 0, 120), place: 'HQ · Training Hall', objective: 'Safety-response tabletop exercise for the on-call team.' },
  { id: 'e7', type: 'MEETING', company: 'Tongaat Hulett', ...at(9, 9, 0, 60), place: 'Community hall, Maidstone', objective: 'Grower association monthly meeting and mill allocation update.' },
];

// ---------- Filter bar ----------
function SegmentedFilter({ selected, counts, onSelect }) {
  return (
    <div role="tablist" aria-label="Event type" className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#EAEBF3] w-full lg:w-[440px]">
      {FILTERS.map(({ key, label, icon: Icon, accent }) => {
        const active = selected === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(key)}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] ${
              active ? 'bg-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
            style={active ? { color: accent } : undefined}
          >
            <Icon className="w-4 h-4 hidden sm:block" />
            <span>{label}</span>
            <span className={`text-xs font-medium ${active ? 'opacity-60' : 'text-neutral-400'}`}>{counts[key]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Event card ----------
function InfoRow({ icon: Icon, children, clamp }) {
  return (
    <p className="flex items-start gap-2 text-sm text-neutral-500 leading-snug">
      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-neutral-400" />
      <span className={clamp ? 'line-clamp-3' : 'truncate'}>{children}</span>
    </p>
  );
}

function RsvpButtons({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(RSVP).map(([key, r]) => {
        const selected = value === key;
        const Icon = r.icon;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={selected}
            className={`inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] ${
              selected ? '' : 'bg-white border-[#E6E7F0] text-neutral-500 hover:bg-neutral-50'
            }`}
            style={selected ? { backgroundColor: r.soft, borderColor: r.accent, color: r.accent } : undefined}
          >
            <Icon className="w-4 h-4" />
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function EventCard({ event, rsvp, onRsvp }) {
  const t = EVENT_TYPES[event.type];
  const response = rsvp ? RSVP[rsvp] : null;
  return (
    <article
      className="flex bg-white rounded-[18px] border border-[#EEEEF4] overflow-hidden"
      style={{ boxShadow: `0 10px 24px -14px ${t.accent}66` }}
    >
      <span className="w-1.5 shrink-0" style={{ backgroundColor: t.accent }} aria-hidden="true" />
      <div className="flex-1 min-w-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
            style={{ backgroundColor: t.soft, color: t.accent }}
            aria-hidden="true"
          >
            {initialsOf(event.company)}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-neutral-900 truncate">{event.company}</h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <span
                className="inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold tracking-wide"
                style={{ backgroundColor: t.soft, color: t.accent }}
              >
                {t.single}
              </span>
              {response && (
                <span
                  className="inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold tracking-wide"
                  style={{ backgroundColor: response.soft, color: response.accent }}
                >
                  {response.badge}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold" style={{ color: t.accent }}>
              {timeFmt(event.start)}
            </p>
            <p className="text-xs text-neutral-400">to {timeFmt(event.end)}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <InfoRow icon={MapPin}>{event.place}</InfoRow>
          <InfoRow icon={Target} clamp>
            {event.objective}
          </InfoRow>
        </div>

        <div className="mt-4 pt-4 border-t border-[#EEEEF4]">
          <RsvpButtons value={rsvp} onChange={onRsvp} />
          <button
            type="button"
            onClick={() => downloadICS(event)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#201E64] hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to calendar
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------- Sidebar widgets (wide screens) ----------
function MiniCalendar({ eventDays, onPickDay }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = month.getFullYear();
  const m = month.getMonth();
  const offset = (new Date(year, m, 1).getDay() + 6) % 7; // weeks start on Monday
  const total = new Date(year, m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => new Date(year, m, i + 1))];
  const todayKey = dateKey(new Date());

  const shift = (n) => setMonth(new Date(year, m + n, 1));

  return (
    <section className="bg-white rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#201E64]">
          {month.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-neutral-400 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((d, i) => {
          if (!d) return <span key={`b${i}`} />;
          const key = dateKey(d);
          const has = eventDays.has(key);
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={!has}
              onClick={() => onPickDay(key)}
              aria-label={has ? `${d.toDateString()}, has events` : d.toDateString()}
              className={`relative mx-auto w-9 h-9 rounded-full text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] ${
                isToday ? 'bg-[#201E64] text-white font-bold' : has ? 'font-semibold text-neutral-900 hover:bg-[#201E64]/10' : 'text-neutral-400 cursor-default'
              }`}
            >
              {d.getDate()}
              {has && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-[#201E64]'}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function NextUp({ event }) {
  return (
    <section className="bg-[#201E64] text-white rounded-2xl p-4">
      <h2 className="text-xs font-semibold text-white/60">Next up</h2>
      {event ? (
        <>
          <p className="mt-2 text-base font-bold leading-snug">
            {EVENT_TYPES[event.type].single} with {event.company}
          </p>
          <p className="mt-1 text-sm text-white/80">
            {dayLabel(event.start)} · {timeFmt(event.start)}
          </p>
          <p className="mt-0.5 text-sm text-white/60 truncate">{event.place}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-white/80">Nothing coming up.</p>
      )}
    </section>
  );
}

function RsvpSummary({ events, rsvps }) {
  const going = events.filter((e) => rsvps[e.id] === 'ACCEPT').length;
  const declined = events.filter((e) => rsvps[e.id] === 'DECLINE').length;
  const awaiting = events.length - going - declined;
  const rows = [
    ['Going', going, RSVP.ACCEPT.accent],
    ['Declined', declined, RSVP.DECLINE.accent],
    ['Awaiting reply', awaiting, '#9CA3AF'],
  ];
  return (
    <section className="bg-white rounded-2xl border border-neutral-200 p-4">
      <h2 className="text-sm font-bold text-[#201E64]">Your replies</h2>
      <ul className="mt-3 space-y-2.5">
        {rows.map(([label, n, color]) => (
          <li key={label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-neutral-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
              {label}
            </span>
            <span className="font-bold text-neutral-900">{n}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- Page ----------
export default function MeetingsWorkshops() {
  const [events] = useState(SAMPLE_EVENTS); // TODO: load from your API
  const [type, setType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [rsvps, setRsvps] = useState({}); // { [eventId]: 'ACCEPT' | 'DECLINE' }

  const counts = useMemo(
    () => ({
      ALL: events.length,
      MEETING: events.filter((e) => e.type === 'MEETING').length,
      WORKSHOP: events.filter((e) => e.type === 'WORKSHOP').length,
    }),
    [events]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => type === 'ALL' || e.type === type)
      .filter((e) => !q || `${e.company} ${e.place} ${e.objective}`.toLowerCase().includes(q))
      .sort((a, b) => a.start - b.start);
  }, [events, type, search]);

  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      const key = dateKey(e.start);
      if (!map.has(key)) map.set(key, { key, date: e.start, items: [] });
      map.get(key).items.push(e);
    });
    return [...map.values()];
  }, [filtered]);

  const eventDays = useMemo(() => new Set(filtered.map((e) => dateKey(e.start))), [filtered]);
  const nextEvent = useMemo(() => [...events].sort((a, b) => a.start - b.start).find((e) => e.end >= new Date()), [events]);

  const toggleRsvp = (id, status) => {
    // TODO: save the RSVP with your API
    setRsvps((prev) => {
      const next = { ...prev };
      if (next[id] === status) delete next[id]; // pressing again clears the choice
      else next[id] = status;
      return next;
    });
  };

  const pickDay = (key) => {
    document.getElementById(`day-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">Meetings &amp; Workshops</h1>
        <p className="mt-1 text-sm text-neutral-500">See what is coming up and let us know if you can attend.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <SegmentedFilter selected={type} counts={counts} onSelect={setType} />
        <div className="relative lg:ml-auto lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events"
            aria-label="Search events"
            className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-300 bg-white text-base sm:text-sm outline-none placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* Agenda */}
        <div>
          {groups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-16 flex flex-col items-center text-center">
              <span className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                <CalendarX className="w-7 h-7" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-neutral-900">
                {search.trim() ? 'No matching events' : 'Nothing scheduled'}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {search.trim() ? 'Try a different search.' : 'New events will show up here as they are added.'}
              </p>
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.key} id={`day-${g.key}`} className="scroll-mt-20">
                {/* The day header sticks under the dashboard header while its cards scroll */}
                <div className="sticky top-16 z-20 flex items-center gap-3 bg-[#F5F6FA] py-3">
                  <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">{dayLabel(g.date)}</h2>
                  <span className="flex-1 h-px bg-[#E4E5EE]" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4 pb-3">
                  {g.items.map((e) => (
                    <EventCard key={e.id} event={e} rsvp={rsvps[e.id]} onRsvp={(s) => toggleRsvp(e.id, s)} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Sidebar: wide screens only */}
        <aside className="hidden xl:block xl:sticky xl:top-24 space-y-4">
          <NextUp event={nextEvent} />
          <MiniCalendar eventDays={eventDays} onPickDay={pickDay} />
          <RsvpSummary events={events} rsvps={rsvps} />
        </aside>
      </div>
    </div>
  );
}