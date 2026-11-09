import React from "react";
import { Mail, Phone, Clock } from "lucide-react";
import { CONTACT } from "./contactService";

function ContactCard({ title, value, href, Icon }) {
  return (
    <div className="border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#201E64]/10">
          <Icon size={17} color="#201E64" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-[#201E64]">{title}</h3>
          {href ? (
            <a href={href} className="mt-0.5 block break-words text-xs leading-5 text-neutral-500 hover:underline">{value}</a>
          ) : (
            <p className="mt-0.5 break-words text-xs leading-5 text-neutral-500">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactInfo() {
  return (
    <aside className="space-y-3 lg:col-span-1">
      <ContactCard title="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} Icon={Mail} />
      <ContactCard title="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone}`} Icon={Phone} />
      <ContactCard title="Support Hours" value={CONTACT.hours} Icon={Clock} />
      <div className="border-l-4 border-[#201E64] bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold text-[#201E64]">What can we help you with?</h3>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-neutral-500">
          {["Business profile assistance", "CIPC / CoReg documents", "Tax PIN assistance", "B-BBEE documentation", "ESD opportunities", "Business advisory support", "Technical portal support"].map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
