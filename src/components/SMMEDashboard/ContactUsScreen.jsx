import React, { useState } from "react";

const NAVY = "#201E64";

// ======================================================
// CONTACT INFORMATION
// ======================================================

const CONTACT = {
  email: "your-email@example.com",
  phone: "+27 XX XXX XXXX",
  hours: "Monday – Friday, 08:00 – 17:00",
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ContactUsScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ======================================================
  // HANDLE SUBMIT
  // ======================================================

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
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-5">
        <h1
          className="
            text-2xl
            font-extrabold
            leading-tight
            sm:text-3xl
          "
          style={{ color: NAVY }}
        >
          Contact Us
        </h1>

        <p
          className="
            mt-1
            max-w-2xl
            text-sm
            leading-5
            text-neutral-500
          "
        >
          Need help with your business profile, documents,
          ESD opportunities, or using the portal? Contact our
          support team and we will assist you.
        </p>
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-3
        "
      >

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="space-y-3 lg:col-span-1">

          {/* EMAIL */}

          <ContactCard
            title="Email"
            value={CONTACT.email}
            icon={
              <svg
                className="h-4 w-4"
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
            }
          />

          {/* PHONE */}

          <ContactCard
            title="Phone"
            value={CONTACT.phone}
            icon={
              <svg
                className="h-4 w-4"
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
            }
          />

          {/* SUPPORT HOURS */}

          <ContactCard
            title="Support Hours"
            value={CONTACT.hours}
            icon={
              <svg
                className="h-4 w-4"
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
            }
          />

          {/* ==================================================
              HELP INFORMATION
          ================================================== */}

          <div
            className="
              border-l-4
              bg-white
              p-4
              shadow-sm
            "
            style={{
              borderLeftColor: NAVY,
            }}
          >
            <h3
              className="text-xs font-bold"
              style={{ color: NAVY }}
            >
              What can we help you with?
            </h3>

            <ul
              className="
                mt-2
                space-y-1
                text-xs
                leading-5
                text-neutral-500
              "
            >
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

        {/* ==================================================
            CONTACT FORM
        ================================================== */}

        <div
          className="
            min-w-0
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm
            sm:p-5
            lg:col-span-2
          "
        >
          {/* FORM HEADER */}

          <div className="mb-4">
            <h2
              className="
                text-lg
                font-bold
                sm:text-xl
              "
              style={{ color: NAVY }}
            >
              Send Us a Message
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-neutral-500
              "
            >
              Complete the form below and provide as much
              information as possible about your enquiry.
            </p>
          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ==================================================
                NAME + EMAIL
            ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >

              {/* NAME */}

              <FormField
                label="Name"
                required
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={INPUT_CLASS}
                />
              </FormField>

              {/* EMAIL */}

              <FormField
                label="Email Address"
                required
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>

            {/* ==================================================
                SUBJECT
            ================================================== */}

            <FormField
              label="Subject"
              required
            >
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What do you need help with?"
                className={INPUT_CLASS}
              />
            </FormField>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            <div>
              <div
                className="
                  mb-1.5
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <label
                  htmlFor="message"
                  className="
                    text-xs
                    font-semibold
                    text-neutral-700
                  "
                >
                  Message

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <span
                  className="
                    shrink-0
                    text-[11px]
                    text-neutral-400
                  "
                >
                  {formData.message.length}/1000
                </span>
              </div>

              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={1000}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your question or the assistance you need..."
                className="
                  min-h-[120px]
                  w-full
                  resize-y
                  border
                  border-neutral-300
                  px-3
                  py-2.5
                  text-sm
                  leading-5
                  outline-none
                  transition
                  placeholder:text-neutral-400
                  focus:border-[#201E64]
                  focus:ring-1
                  focus:ring-[#201E64]
                "
              />
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2
                "
              >
                <p className="text-xs text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
              <div
                className="
                  border
                  border-green-200
                  bg-green-50
                  px-3
                  py-2
                "
              >
                <p className="text-xs text-green-700">
                  {success}
                </p>
              </div>
            )}

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <div
              className="
                flex
                justify-end
                border-t
                border-neutral-200
                pt-4
              "
            >
              <button
                type="submit"
                className="
                  w-full
                  px-5
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:opacity-90
                  sm:w-auto
                "
                style={{
                  backgroundColor: NAVY,
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// CONTACT CARD
// ======================================================

function ContactCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="flex items-center gap-3">

        {/* ICON */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            bg-[#201E64]/10
          "
        >
          {icon}
        </div>

        {/* INFORMATION */}

        <div className="min-w-0">
          <h3
            className="
              text-xs
              font-bold
            "
            style={{ color: NAVY }}
          >
            {title}
          </h3>

          <p
            className="
              mt-0.5
              break-words
              text-xs
              leading-5
              text-neutral-500
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FORM FIELD
// ======================================================

function FormField({
  label,
  required,
  children,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1.5
          block
          text-xs
          font-semibold
          text-neutral-700
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ======================================================
// INPUT STYLE
// ======================================================

const INPUT_CLASS = `
  w-full
  min-w-0
  border
  border-neutral-300
  px-3
  py-2.5
  text-sm
  outline-none
  transition
  placeholder:text-neutral-400
  focus:border-[#201E64]
  focus:ring-1
  focus:ring-[#201E64]
`;