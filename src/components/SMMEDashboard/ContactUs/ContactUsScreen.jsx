import React, { useRef, useState } from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import { INITIAL_FORM, submitContactMessage } from "./contactService";

export default function ContactUsScreen() {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const message = await submitContactMessage(formData);
      setSuccess(message);
      setFormData({ ...INITIAL_FORM });
    } catch (err) {
      console.error("Contact submission error:", err);
      setError(err?.response?.data?.message || err.message || "Unable to send your message. Please check your connection and try again.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold leading-tight text-[#201E64] sm:text-3xl">Contact Us</h1>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500">Need help with your business profile, documents, ESD opportunities, or using the portal? Contact our support team and we will assist you.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ContactInfo />
        <ContactForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} success={success} />
      </div>
    </div>
  );
}
