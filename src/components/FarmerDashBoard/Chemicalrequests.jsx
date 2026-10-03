import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  X,
  Check,
  Sprout,
  FlaskConical,
  Calendar,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';

// Brand navy (same as the rest of the web app): #201E64, hover #2B2889

// ---------- Config ----------
const CATEGORIES = {
  FERTILIZER: { label: 'Fertiliser', icon: Sprout, accent: '#15803D', tint: '#EDF9F1' },
  CHEMICAL: { label: 'Chemical', icon: FlaskConical, accent: '#7C3AED', tint: '#F5F0FE' },
};

const TYPE_OPTIONS = {
  FERTILIZER: ['NPK 12:24:12', 'Urea', 'DAP', 'Potash', 'Compost', 'Agricultural lime', 'Other'],
  CHEMICAL: ['Pesticide', 'Herbicide', 'Fungicide', 'Insecticide', 'Other'],
};

const STATUS_COLORS = {
  PENDING: '#B98900',
  APPROVED: '#15803D',
  REJECTED: '#DC2626',
};

// ---------- Helpers ----------
const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
};

// TODO: remove once you load requests from your API
const sampleRequests = () => [
  { input_request_id: 4, request_type: 'CHEMICAL', input_name: 'Fungicide', quantity: '10 L', reason: 'Rust spotted on young cane in block B.', status: 'PENDING', request_date: daysAgo(1) },
  { input_request_id: 3, request_type: 'CHEMICAL', input_name: 'Herbicide', quantity: '20 L', reason: 'Heavy weed pressure in block C before canopy closure.', status: 'PENDING', request_date: daysAgo(3) },
  { input_request_id: 2, request_type: 'FERTILIZER', input_name: 'NPK 12:24:12', quantity: '200 kg', reason: 'Top dressing for ratoon cane, three months after harvest.', status: 'APPROVED', request_date: daysAgo(12) },
  { input_request_id: 1, request_type: 'FERTILIZER', input_name: 'Urea', quantity: '150 kg', reason: '', status: 'REJECTED', request_date: daysAgo(27) },
];

const inputClass =
  'w-full h-11 px-3.5 rounded-xl border border-neutral-300 bg-white text-base sm:text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed';

// ---------- Small pieces ----------
function FilterChip({ label, count, selected, color = '#201E64', icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 h-9 pl-3 pr-3.5 rounded-full border text-[13px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2 ${
        selected ? 'text-white border-transparent' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50'
      }`}
      style={selected ? { backgroundColor: color } : undefined}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
      <span className={`text-xs font-medium ${selected ? 'text-white/80' : 'text-neutral-400'}`}>{count}</span>
    </button>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status.toUpperCase()] ?? STATUS_COLORS.PENDING;
  return (
    <span
      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
      style={{ color, backgroundColor: `${color}1F` }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function RequestCard({ request }) {
  const cat = CATEGORIES[request.request_type.toUpperCase()] ?? CATEGORIES.CHEMICAL;
  const Icon = cat.icon;

  return (
    <article className="flex bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <span className="w-1.5 shrink-0" style={{ backgroundColor: cat.accent }} aria-hidden="true" />
      <div className="flex-1 min-w-0 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: cat.tint, color: cat.accent }}
          >
            <Icon className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-neutral-900 truncate">{request.input_name}</h3>
            <p className="text-xs font-semibold" style={{ color: cat.accent }}>
              {cat.label}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="mt-4 space-y-1.5">
          {request.quantity && (
            <p className="text-sm text-neutral-800">
              <span className="text-neutral-500">Quantity: </span>
              <span className="font-medium">{request.quantity}</span>
            </p>
          )}
          {request.reason && <p className="text-sm text-neutral-500 line-clamp-2">{request.reason}</p>}
          <p className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.request_date)}
          </p>
        </div>
      </div>
    </article>
  );
}

function CategoryPickerCard({ category, selected, onClick }) {
  const { label, icon: Icon, accent, tint } = CATEGORIES[category];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
      style={{
        backgroundColor: selected ? tint : '#FFFFFF',
        borderColor: selected ? accent : '#E5E7EB',
        boxShadow: selected ? `0 0 0 1px ${accent}` : undefined,
      }}
    >
      <span
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{ backgroundColor: selected ? accent : `${accent}1F`, color: selected ? '#FFFFFF' : accent }}
      >
        <Icon className="w-6 h-6" />
      </span>
      <span className="text-[15px] font-semibold text-neutral-900">{label}</span>
      {selected && (
        <span
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        >
          <Check className="w-3 h-3" strokeWidth={3.5} />
        </span>
      )}
    </button>
  );
}

function StateMessage({ icon: Icon, title, message, tone = 'neutral', action }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-14 flex flex-col items-center text-center">
      <span
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          tone === 'error' ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-500'
        }`}
      >
        <Icon className="w-7 h-7" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-neutral-900">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{message}</p>
      {action}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-36 rounded-2xl bg-white border border-neutral-200 p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-neutral-200" />
              <div className="h-3 w-1/4 rounded bg-neutral-100" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3 w-1/3 rounded bg-neutral-100" />
            <div className="h-3 w-3/4 rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- New request dialog (bottom sheet on phones, centred dialog on desktop) ----------
function NewRequestModal({ onClose, onSubmit, isSubmitting, error }) {
  const [category, setCategory] = useState(null);
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const canSubmit = !!category && !!type && quantity.trim() !== '' && !isSubmitting;

  // Escape closes, and the page behind stops scrolling while the dialog is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, isSubmitting]);

  const pickCategory = (c) => {
    setCategory(c);
    setType(''); // options depend on the category
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ request_type: category, input_name: type, quantity: quantity.trim(), reason: reason.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-request-title"
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="new-request-title" className="text-lg font-bold text-neutral-900">
                New request
              </h2>
              <p className="mt-0.5 text-sm text-neutral-500">
                Tell us what you need. We will route it to your agronomist.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close"
              className="p-2 -mr-2 -mt-1 rounded-full text-neutral-500 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {Object.keys(CATEGORIES).map((c) => (
              <CategoryPickerCard key={c} category={c} selected={category === c} onClick={() => pickCategory(c)} />
            ))}
          </div>

          {/* Type: options follow the category */}
          <div className="mt-4">
            <label htmlFor="req-type" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {category ? `${CATEGORIES[category].label} type` : 'Choose a category first'}
            </label>
            <div className="relative">
              <select
                id="req-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={!category}
                className={inputClass + ' appearance-none pr-10'}
              >
                <option value="">{category ? 'Select type' : 'Select a category above'}</option>
                {(category ? TYPE_OPTIONS[category] : []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4">
            <label htmlFor="req-qty" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Quantity
            </label>
            <input
              id="req-qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 200 kg"
              className={inputClass}
            />
          </div>

          {/* Reason */}
          <div className="mt-4">
            <label htmlFor="req-reason" className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Reason / growth stage need
            </label>
            <textarea
              id="req-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Explain why you need this input"
              className="w-full px-3.5 py-3 rounded-xl border border-neutral-300 bg-white text-base sm:text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15 resize-none"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 sm:h-11 px-6 rounded-full text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-12 sm:h-11 px-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2 disabled:bg-[#201E64]/35 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isSubmitting ? 'Submitting' : 'Submit request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function ChemicalRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState(null); // null = All
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // TODO: replace with your API call, e.g.
      // const res = await fetch('/api/input-requests/mine'); setRequests(await res.json());
      await new Promise((r) => setTimeout(r, 500));
      setRequests(sampleRequests());
    } catch {
      setLoadError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleSubmit = async (form) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = { ...form, request_date: toISODate(new Date()) };
      // TODO: POST payload to your API and use the saved record it returns
      await new Promise((r) => setTimeout(r, 600));
      setRequests((list) => [{ input_request_id: Date.now(), status: 'PENDING', ...payload }, ...list]);
      setShowModal(false);
    } catch {
      setSubmitError('We could not submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setSubmitError(null);
    setShowModal(true);
  };

  const countOf = (c) => requests.filter((r) => r.request_type.toUpperCase() === c).length;
  const visible = filter ? requests.filter((r) => r.request_type.toUpperCase() === filter) : requests;

  const newRequestButton = (
    <button
      type="button"
      onClick={openModal}
      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
    >
      <Plus className="w-4 h-4" />
      <span>New request</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201E64]">
            Chemical &amp; Fertiliser Requests
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Request inputs and track their approval.</p>
        </div>
        {newRequestButton}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" count={requests.length} selected={filter === null} onClick={() => setFilter(null)} />
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <FilterChip
            key={key}
            label={cat.label}
            count={countOf(key)}
            icon={cat.icon}
            color={cat.accent}
            selected={filter === key}
            onClick={() => setFilter(filter === key ? null : key)}
          />
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <SkeletonCards />
      ) : loadError && requests.length === 0 ? (
        <StateMessage
          icon={AlertCircle}
          tone="error"
          title="Unable to load requests"
          message={loadError}
          action={
            <button
              type="button"
              onClick={loadRequests}
              className="mt-5 h-10 px-5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Try again
            </button>
          }
        />
      ) : visible.length === 0 ? (
        <StateMessage
          icon={FlaskConical}
          title={filter ? 'No requests in this category' : 'No requests yet'}
          message={filter ? 'Try a different filter.' : 'Submit a fertiliser or chemical request.'}
          action={!filter && <div className="mt-5">{newRequestButton}</div>}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {visible.map((r) => (
            <RequestCard key={r.input_request_id} request={r} />
          ))}
        </div>
      )}

      {showModal && (
        <NewRequestModal
          onClose={() => !isSubmitting && setShowModal(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      )}
    </div>
  );
}