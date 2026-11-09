import React from "react";
import { Loader2 } from "lucide-react";

const INPUT_CLASS = "w-full min-w-0 border border-neutral-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]";

function FormField({ label, htmlFor, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-neutral-700">
        {label}<span className="ml-1 text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}

export default function ContactForm({ formData, onChange, onSubmit, loading, error, success }) {
  return (
    <section className="min-w-0 border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#201E64] sm:text-xl">Send Us a Message</h2>
        <p className="mt-1 text-xs leading-5 text-neutral-500">Complete the form below and provide as much information as possible about your enquiry.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Name" htmlFor="name">
            <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" disabled={loading} value={formData.name} onChange={onChange} placeholder="Enter your name" className={INPUT_CLASS} />
          </FormField>
          <FormField label="Email Address" htmlFor="email">
            <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" disabled={loading} value={formData.email} onChange={onChange} placeholder="Enter your email" className={INPUT_CLASS} />
          </FormField>
        </div>
        <FormField label="Subject" htmlFor="subject">
          <input id="subject" name="subject" type="text" required maxLength={200} disabled={loading} value={formData.subject} onChange={onChange} placeholder="What do you need help with?" className={INPUT_CLASS} />
        </FormField>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="message" className="text-xs font-semibold text-neutral-700">Message<span className="ml-1 text-red-500">*</span></label>
            <span className="shrink-0 text-[11px] text-neutral-400">{formData.message.length}/1000</span>
          </div>
          <textarea id="message" name="message" rows={5} required maxLength={1000} disabled={loading} value={formData.message} onChange={onChange} placeholder="Describe your question or the assistance you need..." className={`${INPUT_CLASS} min-h-[120px] resize-y leading-5`} />
        </div>
        {error && <div role="alert" className="border border-red-200 bg-red-50 px-3 py-2"><p className="text-xs text-red-700">{error}</p></div>}
        {success && <div role="status" className="border border-green-200 bg-green-50 px-3 py-2"><p className="text-xs text-green-700">{success}</p></div>}
        <div className="flex justify-end border-t border-neutral-200 pt-4">
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 bg-[#201E64] px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Sending Message..." : "Send Message"}
          </button>
        </div>
      </form>
    </section>
  );
}
