import React from "react";
import { AlertCircle, Loader2, X } from "lucide-react";

export default function FundingConfirmModal({ opportunity, submitting, error, onClose, onConfirm }) {
  if (!opportunity) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget && !submitting) onClose();
  }}>
    <div role="dialog" aria-modal="true" aria-labelledby="funding-confirm-title" className="w-full max-w-lg border border-neutral-200 bg-white p-5 shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 id="funding-confirm-title" className="text-lg font-bold text-[#201E64]">Confirm Funding Application</h2>
        <button type="button" disabled={submitting} onClick={onClose} aria-label="Close confirmation" className="text-neutral-500 hover:text-neutral-900 disabled:opacity-50"><X size={20} /></button>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600">Apply for <strong>{opportunity.title}</strong> offered by <strong>{opportunity.institution_funder}</strong>?</p>
      <p className="mt-3 text-xs leading-5 text-neutral-500">Your registered business information will be associated with this application. You can submit only once per opportunity.</p>
      {error && <div role="alert" className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" disabled={submitting} onClick={onClose} className="border border-neutral-300 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50">Cancel</button>
        <button type="button" disabled={submitting} onClick={onConfirm} className="inline-flex items-center justify-center gap-2 bg-[#201E64] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#302C85] disabled:opacity-50">
          {submitting && <Loader2 size={17} className="animate-spin" />}{submitting ? "Submitting..." : "Confirm Application"}
        </button>
      </div>
    </div>
  </div>;
}
