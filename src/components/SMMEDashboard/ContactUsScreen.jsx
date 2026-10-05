import React, { useState } from "react";

const NAVY = "#201E64";

const CONTACT = {
  email: "your-email@example.com",
  phone: "+27 XX XXX XXXX",
  hours: "Monday – Friday, 08:00 – 17:00",
};

export default function ContactUsScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    console.log("Contact Request:", formData);

    setSuccess(
      "Your message has been submitted successfully. Our support team will get back to you."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-neutral-50">
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-6
          sm:px-6
          sm:py-10
          lg:px-8
          lg:py-12
        "
      >
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="
              text-2xl
              font-extrabold
              leading-tight
              sm:text-3xl
              lg:text-4xl
            "
            style={{ color: NAVY }}
          >
            Contact Us
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
            Need help with your business profile, documents, ESD
            opportunities, or using the portal? Contact our support
            team and we will assist you.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ========================================= */}
          {/* CONTACT INFORMATION */}
          {/* ========================================= */}

          <div className="space-y-4 lg:col-span-1">
            {/* Email */}
            <div className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    bg-[#201E64]/10
                  "
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: NAVY }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 6h16v12H4V6Z"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Email
                  </h3>

                  <p className="mt-1 break-all text-sm text-neutral-500">
                    {CONTACT.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    bg-[#201E64]/10
                  "
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: NAVY }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M6.5 3.5 9 8l-2 2c1.5 3 3.5 5 6.5 6.5l2-2 4.5 2.5v3c0 .6-.4 1-1 1C10 21 3 14 3 5c0-.6.4-1 1-1h2.5Z"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Phone
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {CONTACT.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    bg-[#201E64]/10
                  "
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: NAVY }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M12 7v5l3 2"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Support Hours
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    {CONTACT.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Information */}
            <div
              className="
                border-l-4
                bg-white
                p-5
                shadow-sm
              "
              style={{ borderLeftColor: NAVY }}
            >
              <h3
                className="text-sm font-bold"
                style={{ color: NAVY }}
              >
                What can we help you with?
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                <li>• Business profile assistance</li>
                <li>• CIPC / CoReg documents</li>
                <li>• Tax PIN assistance</li>
                <li>• B-BBEE documentation</li>
                <li>• ESD opportunities</li>
                <li>• Business advisory support</li>
                <li>• Technical portal support</li>
              </ul>
            </div>
          </div>

          {/* ========================================= */}
          {/* CONTACT FORM */}
          {/* ========================================= */}

          <div
            className="
              min-w-0
              border
              border-neutral-200
              bg-white
              p-4
              shadow-sm
              sm:p-6
              md:p-8
              lg:col-span-2
            "
          >
            <div className="mb-6">
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: NAVY }}
              >
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Complete the form below and provide as much information
                as possible about your enquiry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div className="min-w-0">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="
                      w-full
                      min-w-0
                      border
                      border-neutral-300
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      placeholder:text-neutral-400
                      focus:border-[#201E64]
                      focus:ring-1
                      focus:ring-[#201E64]
                    "
                  />
                </div>

                {/* Email */}
                <div className="min-w-0">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-neutral-700"
                  >
                    Email Address
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="
                      w-full
                      min-w-0
                      border
                      border-neutral-300
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      placeholder:text-neutral-400
                      focus:border-[#201E64]
                      focus:ring-1
                      focus:ring-[#201E64]
                    "
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-neutral-700"
                >
                  Subject
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What do you need help with?"
                  className="
                    w-full
                    border
                    border-neutral-300
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-[#201E64]
                    focus:ring-1
                    focus:ring-[#201E64]
                  "
                />
              </div>

              {/* Message */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-neutral-700"
                  >
                    Message
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <span className="text-xs text-neutral-400">
                    {formData.message.length}/1000
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  maxLength={1000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your question or the assistance you need..."
                  className="
                    min-h-[170px]
                    w-full
                    resize-y
                    border
                    border-neutral-300
                    px-4
                    py-3
                    text-sm
                    leading-6
                    outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-[#201E64]
                    focus:ring-1
                    focus:ring-[#201E64]
                  "
                />
              </div>

              {/* Error */}
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end border-t border-neutral-200 pt-6">
                <button
                  type="submit"
                  className="
                    w-full
                    px-8
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                    sm:w-auto
                  "
                  style={{ backgroundColor: NAVY }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}