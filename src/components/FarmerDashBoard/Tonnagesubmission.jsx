import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Truck,
  Plus,
  X,
  Check,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronDown,
  Loader2,
  Scale,
  CalendarClock,
} from 'lucide-react';

// Brand navy (same as the rest of the web app): #201E64, hover #2B2889

// ---------- Helpers ----------
const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (iso) =>
  parseISO(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtTonnes = (n) => String(Number(Number(n).toFixed(2)));

// TODO: remove once you load tonnage from your API
const sampleTonnage = () => [
  { tonnage_id: 6, submission_date: daysAgo(1), tonnage: 18.4, status: null },
  { tonnage_id: 5, submission_date: daysAgo(4), tonnage: 12.5, status: 'Submitted' },
  { tonnage_id: 4, submission_date: daysAgo(9), tonnage: 20.1, status: 'Submitted' },
  { tonnage_id: 3, submission_date: daysAgo(15), tonnage: 9.8, status: 'Submitted' },
  { tonnage_id: 2, submission_date: daysAgo(22), tonnage: 14.2, status: 'Submitted' },
  { tonnage_id: 1, submission_date: daysAgo(31), tonnage: 16, status: 'Submitted' },
];

const SORTS = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  largest: 'Largest first',
};

const inputClass =
  'w-full h-11 rounded-xl border border-neutral-300 bg-white text-base sm:text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15 disabled:bg-neutral-100 disabled:text-neutral-400';

// ---------- Small pieces ----------
function SubmittedChip({ status }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F7EA] text-[#1C7C40] text-[11px] font-semibold">
      <CheckCircle2 className="w-3.5 h-3.5" />
      {status || 'Submitted'}
    </span>
  );
}

function IconBadge({ size = 'w-11 h-11', iconSize = 'w-5 h-5' }) {
  return (
    <span className={`${size} rounded-full bg-[#201E64]/[0.07] text-[#201E64] flex items-center justify-center shrink-0`}>
      <Truck className={iconSize} />
    </span>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-center gap-4">
      <span className="w-11 h-11 rounded-xl bg-[#201E64]/[0.07] text-[#201E64] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-neutral-500">{label}</p>
        <p className="mt-0.5 text-xl font-extrabold text-neutral-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function StateMessage({ icon: Icon, title, message, tone = 'neutral', action }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-16 flex flex-col items-center text-center">
      <span
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          tone === 'error' ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-500'
        }`}
      >
        <Icon className="w-7 h-7" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-neutral-900">{title}</h2>
      {message && <p className="mt-1 text-sm text-neutral-500 max-w-sm">{message}</p>}
      {action}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 rounded-2xl bg-[#201E64]/20 sm:col-span-1" />
        <div className="h-24 rounded-2xl bg-white border border-neutral-200" />
        <div className="h-24 rounded-2xl bg-white border border-neutral-200" />
      </div>
      <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="w-11 h-11 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-neutral-200" />
              <div className="h-3 w-1/5 rounded bg-neutral-100" />
            </div>
            <div className="h-5 w-16 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Side panel (used below xl, where the form is not shown inline) ----------
function Drawer({ title, subtitle, onClose, closeDisabled = false, children }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    const onKey = (e) => {
      if (e.key === 'Escape' && !closeDisabled) onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, closeDisabled]);

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
        onMouseDown={() => !closeDisabled && onClose()}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`absolute inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-neutral-100">
          <div className="min-w-0">
            <h2 id="drawer-title" className="text-lg font-bold text-neutral-900">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close"
            className="p-2 -mr-2 -mt-1 rounded-full text-neutral-500 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}

// ---------- Submit form (shared by the inline card and the side panel) ----------
function SubmitForm({ idPrefix, onSubmit, isSubmitting, error, onCancel }) {
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(() => toISODate(new Date()));

  const value = parseFloat(quantity);
  const isValid = Number.isFinite(value) && value > 0 && !!date;

  const handleQuantity = (e) => {
    const input = e.target.value.replace(',', '.'); // accept a comma as the decimal mark
    if (input === '' || /^\d*\.?\d*$/.test(input)) setQuantity(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit({ tonnage: value, submission_date: date });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-qty`} className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Quantity (tonnes)
        </label>
        <div className="relative">
          <Truck className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#201E64]" />
          <input
            id={`${idPrefix}-qty`}
            value={quantity}
            onChange={handleQuantity}
            inputMode="decimal"
            placeholder="0.0"
            disabled={isSubmitting}
            className={inputClass + ' pl-11 pr-10'}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500">
            t
          </span>
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-date`} className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Date
        </label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isSubmitting}
          className={inputClass + ' px-3.5'}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-full border border-neutral-300 text-sm font-semibold text-[#201E64] hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2 disabled:bg-[#201E64]/35 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isSubmitting ? 'Submitting' : 'Submit'}</span>
        </button>
      </div>
    </form>
  );
}

// ---------- List views ----------
function SubmissionsTable({ entries }) {
  return (
    <div className="hidden lg:block bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-left text-xs font-semibold text-neutral-500">
          <tr>
            <th className="px-5 py-3">Reference</th>
            <th className="px-3 py-3">Submitted on</th>
            <th className="px-3 py-3 text-right">Quantity</th>
            <th className="px-5 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {entries.map((t) => (
            <tr key={t.tonnage_id} className="hover:bg-neutral-50">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <IconBadge size="w-9 h-9" iconSize="w-[18px] h-[18px]" />
                  <span className="font-semibold text-neutral-900">TN-{t.tonnage_id}</span>
                </div>
              </td>
              <td className="px-3 py-3.5 text-neutral-500 whitespace-nowrap">{formatDate(t.submission_date)}</td>
              <td className="px-3 py-3.5 text-right font-bold text-[#201E64] whitespace-nowrap">
                {fmtTonnes(t.tonnage)} t
              </td>
              <td className="px-5 py-3.5 text-right">
                <SubmittedChip status={t.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionCards({ entries }) {
  return (
    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
      {entries.map((t) => (
        <article key={t.tonnage_id} className="flex items-center gap-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
          <IconBadge />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-neutral-900">TN-{t.tonnage_id}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(t.submission_date)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-base font-bold text-[#201E64]">{fmtTonnes(t.tonnage)} t</span>
            <SubmittedChip status={t.status} />
          </div>
        </article>
      ))}
    </div>
  );
}

// ---------- Page ----------
export default function TonnageSubmission() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [sort, setSort] = useState('newest');

  const [showDrawer, setShowDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formKey, setFormKey] = useState(0); // changing this resets the inline form
  const [toast, setToast] = useState(null);

  const loadTonnage = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // TODO: replace with your API call, e.g.
      // const res = await fetch('/api/tonnage/mine'); setEntries(await res.json());
      await new Promise((r) => setTimeout(r, 500));
      setEntries(sampleTonnage());
    } catch {
      setLoadError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTonnage();
  }, [loadTonnage]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const handleSubmit = async (form) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // TODO: POST form ({ tonnage, submission_date }) to your API and use the record it returns
      await new Promise((r) => setTimeout(r, 600));
      setEntries((list) => [
        { tonnage_id: Math.max(0, ...list.map((t) => t.tonnage_id)) + 1, status: 'Submitted', ...form },
        ...list,
      ]);
      setShowDrawer(false);
      setFormKey((k) => k + 1);
      setToast('Tonnage submitted.');
    } catch {
      setSubmitError('We could not submit your tonnage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDrawer = () => {
    setSubmitError(null);
    setShowDrawer(true);
  };

  const total = useMemo(() => entries.reduce((sum, t) => sum + Number(t.tonnage), 0), [entries]);
  const lastDate = useMemo(
    () => (entries.length ? entries.map((t) => t.submission_date).sort().at(-1) : null),
    [entries]
  );

  const sorted = useMemo(() => {
    const list = [...entries];
    list.sort((a, b) => {
      if (sort === 'largest') return b.tonnage - a.tonnage;
      const byDate = a.submission_date.localeCompare(b.submission_date) || a.tonnage_id - b.tonnage_id;
      return sort === 'oldest' ? byDate : -byDate;
    });
    return list;
  }, [entries, sort]);

  const submitButton = (
    <button
      type="button"
      onClick={openDrawer}
      className="xl:hidden inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
    >
      <Plus className="w-4 h-4" />
      <span>Submit Tonnage</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">Tonnage Submission</h1>
          <p className="mt-1 text-sm text-neutral-500">Log your deliveries and see what you have submitted.</p>
        </div>
        {submitButton}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Summary and submissions */}
        <div className="space-y-6">
          {isLoading ? (
            <SkeletonList />
          ) : loadError && entries.length === 0 ? (
            <StateMessage
              icon={AlertCircle}
              tone="error"
              title="Unable to load tonnage"
              message={loadError}
              action={
                <button
                  type="button"
                  onClick={loadTonnage}
                  className="mt-5 h-10 px-5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  Try again
                </button>
              }
            />
          ) : entries.length === 0 ? (
            <StateMessage
              icon={Truck}
              title="No tonnage submissions yet"
              message="Your submissions will show up here once you log your first delivery."
              action={<div className="mt-5">{submitButton}</div>}
            />
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-4">
                <div className="bg-[#201E64] text-white rounded-2xl p-5 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/85">Total Tonnage Submitted</p>
                    <p className="mt-1 text-2xl font-extrabold">{total.toFixed(1)} t</p>
                  </div>
                </div>
                <StatCard icon={Scale} label="Submissions" value={entries.length} />
                <StatCard icon={CalendarClock} label="Last submission" value={formatDate(lastDate)} />
              </div>

              {/* List */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-base font-bold text-neutral-900">Recent submissions</h2>
                  <div className="relative w-40">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort submissions"
                      className={inputClass + ' !h-10 !rounded-full appearance-none pl-4 pr-9 text-sm'}
                    >
                      {Object.entries(SORTS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  </div>
                </div>
                <SubmissionsTable entries={sorted} />
                <SubmissionCards entries={sorted} />
              </div>
            </>
          )}
        </div>

        {/* Inline form on wide screens, so there is no need to open anything */}
        <aside className="hidden xl:block xl:sticky xl:top-24 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <IconBadge size="w-10 h-10" iconSize="w-[18px] h-[18px]" />
            <div>
              <h2 className="text-lg font-bold text-[#201E64] leading-tight">Submit Tonnage</h2>
              <p className="text-sm text-neutral-500">Log a new tonnage record for this delivery</p>
            </div>
          </div>
          <SubmitForm
            key={formKey}
            idPrefix="inline"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={!showDrawer ? submitError : null}
          />
        </aside>
      </div>

      {showDrawer && (
        <Drawer
          title="Submit Tonnage"
          subtitle="Log a new tonnage record for this delivery"
          onClose={() => !isSubmitting && setShowDrawer(false)}
          closeDisabled={isSubmitting}
        >
          <SubmitForm
            idPrefix="drawer"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
            onCancel={() => setShowDrawer(false)}
          />
        </Drawer>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[70] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#201E64] text-white text-sm shadow-lg"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}