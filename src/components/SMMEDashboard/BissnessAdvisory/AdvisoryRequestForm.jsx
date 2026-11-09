import React, { useEffect, useRef, useState } from "react";
import { SUPPORT_AREAS } from "./advisoryService";

const NAVY = "#201E64";

export default function AdvisoryRequestForm({ onSubmit, loading, authLoading, error, success, onViewRequests, onEdit }) {
  const [formData, setFormData] = useState({ support_area: "", description: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  const update = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    onEdit();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await onSubmit(formData);
    if (ok) setFormData({ support_area: "", description: "" });
  };

  return (
    <div role="tabpanel" id="panel-new" aria-labelledby="tab-new" className="w-full max-w-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Business Area You Need Support With <span className="text-red-500">*</span></label>
          <div ref={dropdownRef} className="relative w-full">
            <button type="button" disabled={loading || authLoading} aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((previous) => !previous)}
              className="flex w-full items-center justify-between gap-3 border border-neutral-300 bg-white px-3 py-2.5 text-left text-sm outline-none transition focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64] disabled:opacity-60">
              <span className={`min-w-0 flex-1 truncate ${formData.support_area ? "text-neutral-700" : "text-neutral-400"}`}>
                {formData.support_area || "Select a business support area"}
              </span>
              <svg className={`h-4 w-4 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 w-full overflow-hidden border border-neutral-200 bg-white shadow-lg">
                <div className="max-h-52 overflow-y-auto">
                  {SUPPORT_AREAS.map((area) => (
                    <button key={area} type="button" onClick={() => { update("support_area", area); setDropdownOpen(false); }}
                      className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-neutral-50 ${formData.support_area === area ? "bg-[#201E64]/5 font-semibold text-[#201E64]" : "text-neutral-700"}`}>
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">Select the area where your business requires advisory support.</p>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="description" className="text-xs font-semibold text-neutral-700">Describe the Support You Need <span className="text-red-500">*</span></label>
            <span className="shrink-0 text-[11px] text-neutral-400">{formData.description.length}/1000</span>
          </div>
          <textarea id="description" name="description" rows={5} maxLength={1000} required disabled={loading || authLoading}
            value={formData.description} onChange={(event) => update("description", event.target.value)}
            placeholder="Explain the challenge your business is facing and the type of assistance you need..."
            className="min-h-[120px] w-full resize-y border border-neutral-300 px-3 py-2.5 text-sm leading-5 outline-none transition placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64] disabled:opacity-60" />
        </div>
        {error && <div role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}
        {success && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-2 border border-green-200 bg-green-50 px-3 py-2">
            <p className="text-xs text-green-700">{success}</p>
            <button type="button" onClick={onViewRequests} className="text-xs font-semibold text-green-800 underline">View my requests</button>
          </div>
        )}
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-neutral-400">Fields marked with * are required.</p>
          <button type="submit" disabled={loading || authLoading || !formData.support_area || !formData.description.trim()}
            className="w-full px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{ backgroundColor: NAVY }}>
            {loading ? "Submitting..." : authLoading ? "Checking session..." : "Submit Advisory Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
