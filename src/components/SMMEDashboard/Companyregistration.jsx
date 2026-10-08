import React, { useRef, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
const NAVY = "#201E64";
const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2";
const BTN = `
  inline-flex items-center justify-center
  h-10 px-5
  rounded-none
  bg-[#201E64]
  hover:bg-[#2B2889]
  text-white
  text-xs
  font-semibold
  transition-colors
  ${FOCUS}
`;
const BTN_OUTLINE = `
  inline-flex items-center justify-center
  h-10 px-5
  rounded-none
  border border-neutral-300
  hover:border-[#201E64]
  text-neutral-800
  hover:text-[#201E64]
  text-xs
  font-semibold
  transition-colors
  ${FOCUS}
`;
const inputCls = (err, extra = "") =>
  `w-full rounded-none border bg-white px-3 text-sm text-neutral-900 outline-none transition ${extra} ${
    err
      ? "border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/15"
  }`;
// ======================================================
// STEPS
// ======================================================
const STEPS = [
  {
    title: "Personal",
    heading: "Personal information",
    text: "Tell us about the person registering the business.",
  },
  {
    title: "Business",
    heading: "Business profile",
    text: "Your company details, ownership and supporting documents.",
  },
  {
    title: "Maturity",
    heading: "Business maturity",
    text: "Help us understand how established your business is.",
  },
  {
    title: "Experience",
    heading: "Previous clients",
    text: "Add previous clients who can confirm your work.",
  },
  {
    title: "Review",
    heading: "Review and submit",
    text: "Check your details before you submit your registration.",
  },
];
// ======================================================
// INDUSTRIES
// ======================================================
const SECTORS = [
  {
    "id": "mining",
    "name": "Mining",
    "description": "Platinum, chromium, and manganese; major gold and iron ore production."
  },
  {
    "id": "agriculture",
    "name": "Agriculture",
    "description": "Produces maize, wheat, sugarcane, and citrus fruits for domestic and export markets."
  },
  {
    "id": "forestry",
    "name": "Forestry",
    "description": "The science, art, and practice of planting, managing, conserving, and repairing forests and woodlands sustainably for human and environmental benefits."
  },
  {
    "id": "fishing",
    "name": "Fishing",
    "description": "The combined practice of farming the land and raising or harvesting aquatic life like fish and shellfish."
  },
  {
    "id": "livestock",
    "name": "Livestock farming",
    "description": "Domesticated animals raised in an agricultural setting to produce commodities such as food, fibre, and labour."
  },
  {
    "id": "automotive",
    "name": "Automotive assembly",
    "description": "Major manufacturing plants."
  },
  {
    "id": "agro_processing",
    "name": "Agro-processing",
    "description": "Food canning, beverage production, and dairy processing."
  },
  {
    "id": "heavy_industry",
    "name": "Heavy industry",
    "description": "Chemicals, metal fabrication, steel production, and construction."
  },
  {
    "id": "financial_services",
    "name": "Financial services",
    "description": "Banking, insurance, and real estate."
  },
  {
    "id": "wholesale_retail",
    "name": "Wholesale & retail",
    "description": "Widespread commercial trade and distribution networks."
  },
  {
    "id": "tourism_hospitality",
    "name": "Tourism & hospitality",
    "description": "Eco-tourism, hotels, and transport services."
  },
  {
    "id": "ict",
    "name": "Information and Communications Technology (ICT)",
    "description": "An umbrella term that combines traditional Information Technology (IT) with telecommunications to create, process, store, retrieve, and transmit information in digital or analog form."
  },
  {
    "id": "rd_consulting",
    "name": "R&D and Consulting",
    "description": "Scientific research, technical IT consulting, and financial analysis."
  }
];
const REVENUE = [
  "Less than R100,000",
  "R100,000 – R500,000",
  "R500,000 – R1 million",
  "R1 million – R5 million",
  "R5 million – R10 million",
  "More than R10 million",
];
const BEE_LEVELS = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level 6",
  "Level 7",
  "Level 8",
  "Non-compliant",
  "Exempt micro enterprise",
];
const emptyClient = {
  name: "",
  email: "",
  contactNumber: "",
  workDone: "",
};
const INITIAL = {
  // Personal
  firstName: "",
  lastName: "",
  idNumber: "",
  gender: "",
  phone: "",
  email: "",
  // Business
  businessName: "",
  companyRegistrationNumber: "",
  businessAddress: "",
  community: "",
  bwoOwnership: "",
  boOwnership: "",
  beeLevel: "",
  coregDocument: null,
  taxCompliancePin: "",
  hasVatRegistration: "",
  vatRegistrationNumber: "",
  hasBeeCertificate: "",
  beeDocument: null,
  attendedEsd: "",
  esdCompanyName: "",
  receivedGrant: "",
  grantCompanyName: "",
  // Maturity
  sectorId: "",
  sectorName: "",
  service: "",
  annualRevenue: "",
  revenueProofDocument: null,
  permanentEmployees: "",
  contractEmployees: "",
  employeesHaveContracts: "",
  contractsSigned: "",
  uif: "",
  coida: "",
  coidaCertificateNumber: "",
  accounting: "",
  accountingSystemName: "",
  payroll: "",
  payrollExplanation: "",
  financialStatements: "",
  // Clients
  previousClients: [{ ...emptyClient }],
  largestContract: "",
};
// ======================================================
// VALIDATION
// ======================================================
const has = (value) =>
  String(value ?? "").trim() !== "";
function validate(step, form) {
  const errors = {};
  const need = (key, message) => {
    if (!has(form[key])) {
      errors[key] = message;
    }
  };
  const percentage = (key) => {
    const number = Number(form[key]);
    if (
      !has(form[key]) ||
      Number.isNaN(number) ||
      number < 0 ||
      number > 100
    ) {
      errors[key] = "Enter a percentage from 0 to 100";
    }
  };
  const count = (key) => {
    const number = Number(form[key]);
    if (
      !has(form[key]) ||
      !Number.isInteger(number) ||
      number < 0
    ) {
      errors[key] = "Enter a whole number";
    }
  };
  const file = (key) => {
    if (!form[key]) {
      errors[key] = "Upload this document";
    } else if (!/\.(pdf|jpe?g|png)$/i.test(form[key].name)) {
      errors[key] = "Choose a PDF, JPG, JPEG or PNG file";
    }
  };
  const emailOk = (value) =>
    /^\S+@\S+\.\S+$/.test(value);
  // PERSONAL
  if (step === 0) {
    need("firstName", "Enter your first name");
    need("lastName", "Enter your surname");
    if (
      !/^\d{13}$/.test(
        form.idNumber.replace(/\s/g, "")
      )
    ) {
      errors.idNumber =
        "Enter a valid 13-digit ID number";
    }
    need("gender", "Select your gender");
    if (
      !/^\+?\d{9,15}$/.test(
        form.phone.replace(/[\s-]/g, "")
      )
    ) {
      errors.phone = "Enter a valid phone number";
    }
    if (!emailOk(form.email)) {
      errors.email =
        "Enter a valid email address";
    }
  }
  // BUSINESS
  if (step === 1) {
    need("businessName", "Enter your business name");
    need(
      "companyRegistrationNumber",
      "Enter your registration number"
    );
    need(
      "businessAddress",
      "Enter your business address"
    );
    need(
      "community",
      "Enter your community or town"
    );
    percentage("bwoOwnership");
    percentage("boOwnership");
    need(
      "beeLevel",
      "Select your B-BBEE level"
    );
    file("coregDocument");
    need("taxCompliancePin", "Enter your Tax Compliance Status (TCS) PIN");
    need("hasVatRegistration", "Select Yes or No");
    if (form.hasVatRegistration === "Yes") {
      need("vatRegistrationNumber", "Enter your VAT registration number");
    }
    need("hasBeeCertificate", "Select Yes or No");
    file("beeDocument");
    need(
      "attendedEsd",
      "Select an option"
    );
    if (form.attendedEsd === "Yes") {
      need(
        "esdCompanyName",
        "Enter the company name"
      );
    }
    need(
      "receivedGrant",
      "Select an option"
    );
    if (form.receivedGrant === "Yes") {
      need(
        "grantCompanyName",
        "Enter the company name"
      );
    }
  }
  // MATURITY
  if (step === 2) {
    need("sectorId", "Select your sector");
    need(
      "service",
      "Describe your product or service"
    );
    need(
      "annualRevenue",
      "Select your annual revenue"
    );
    if (form.revenueProofDocument) file("revenueProofDocument");
    count("permanentEmployees");
    count("contractEmployees");
    need(
      "employeesHaveContracts",
      "Select an option"
    );
    if (
      form.employeesHaveContracts === "Yes"
    ) {
      need(
        "contractsSigned",
        "Select an option"
      );
    }
    need("uif", "Select an option");
    need("coida", "Select an option");
    if (form.coida === "Yes") {
      need("coidaCertificateNumber", "Enter your COIDA certificate number");
    }
    need(
      "accounting",
      "Select an option"
    );
    if (form.accounting === "Yes") {
      need(
        "accountingSystemName",
        "Enter the system or accountant"
      );
    }
    need("payroll", "Select an option");
    if (form.payroll === "No") {
      need(
        "payrollExplanation",
        "Explain how you manage payroll"
      );
    }
    need(
      "financialStatements",
      "Select an option"
    );
  }
  // CLIENTS
  if (step === 3) {
    form.previousClients.forEach(
      (client, index) => {
        if (!has(client.name)) {
          errors[`client${index}_name`] =
            "Enter the client name";
        }
        if (!emailOk(client.email)) {
          errors[`client${index}_email`] =
            "Enter a valid email address";
        }
        if (!has(client.contactNumber)) {
          errors[
            `client${index}_contactNumber`
          ] = "Enter a contact number";
        }
        if (!has(client.workDone)) {
          errors[`client${index}_workDone`] =
            "Describe the work done";
        }
      }
    );
    need(
      "largestContract",
      "Describe your largest contract"
    );
  }
  return errors;
}
// ======================================================
// FIELD
// ======================================================
function Field({
  label,
  error,
  hint,
  className = "",
  group = false,
  children,
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper
      className={`block min-w-0 ${className}`}
      {...(group
        ? {
            role: "group",
            "aria-label": label,
          }
        : {})}
    >
      <span className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-[11px] text-neutral-500">
          {hint}
        </span>
      )}
      {error && (
        <span
          className="mt-1 block text-[11px] text-red-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </Wrapper>
  );
}
// ======================================================
// TEXT INPUT
// ======================================================
function TextInput({
  label,
  error,
  hint,
  className,
  textarea,
  ...props
}) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      className={className}
    >
      {textarea ? (
        <textarea
          rows={3}
          aria-invalid={!!error}
          className={inputCls(
            error,
            "min-h-[90px] py-2 resize-y"
          )}
          {...props}
        />
      ) : (
        <input
          aria-invalid={!!error}
          className={inputCls(error, "h-10")}
          {...props}
        />
      )}
    </Field>
  );
}
// ======================================================
// SELECT
// ======================================================
function Select({
  label,
  error,
  className,
  options,
  value,
  onChange,
  placeholder = "Select",
}) {
  return (
    <Field
      label={label}
      error={error}
      className={className}
    >
      <select
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        className={inputCls(error, "h-10")}
      >
        <option value="">
          {placeholder}
        </option>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;
          return (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}
// ======================================================
// YES / NO
// ======================================================
// Scrollable industry dropdown. Native details and buttons support keyboard navigation.
function SectorSelect({ value, onChange, error, className = "" }) {
  const dropdown = useRef(null);
  const selected = SECTORS.find((sector) => sector.id === value);
  return (
    <Field label="Industry / sector" error={error} className={className} group>
      <details ref={dropdown} className="relative min-w-0" onKeyDown={(event) => {
        if (event.key === "Escape") {
          dropdown.current.open = false;
          dropdown.current.querySelector("summary").focus();
        }
      }}>
        <summary className={`${inputCls(error)} flex min-h-10 cursor-pointer items-center justify-between gap-2 py-2 ${FOCUS}`}>
          <span className="min-w-0 break-words">{selected?.name || "Select your industry"}</span>
        </summary>
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto overscroll-contain border border-neutral-300 bg-white p-1 shadow-lg" aria-label="Industries">
          {SECTORS.map((sector) => (
            <button key={sector.id} type="button" aria-pressed={value === sector.id}
              className={`block w-full px-3 py-2.5 text-left text-sm break-words ${FOCUS} ${value === sector.id ? "bg-[#201E64] text-white" : "text-neutral-800 hover:bg-neutral-100"}`}
              onClick={() => {
                onChange({ target: { value: sector.id } });
                dropdown.current.open = false;
                dropdown.current.querySelector("summary").focus();
              }}>
              {sector.name}
            </button>
          ))}
        </div>
      </details>
    </Field>
  );
}

function YesNo({
  label,
  error,
  value,
  onChange,
  className,
}) {
  return (
    <Field
      label={label}
      error={error}
      className={className}
      group
    >
      <div className="grid grid-cols-2">
        {["Yes", "No"].map(
          (option, index) => {
            const selected =
              value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange(option)
                }
                aria-pressed={selected}
                className={`
                  h-10
                  rounded-none
                  border
                  text-xs
                  font-semibold
                  transition-colors
                  ${FOCUS}
                  ${
                    index === 1
                      ? "-ml-px"
                      : ""
                  }
                  ${
                    selected
                      ? "relative z-10 border-[#201E64] bg-[#201E64] text-white"
                      : `bg-white text-neutral-700 hover:bg-neutral-50 ${
                          error
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`
                  }
                `}
              >
                {option}
              </button>
            );
          }
        )}
      </div>
    </Field>
  );
}
// ======================================================
// FILE FIELD
// ======================================================
function FileField({
  label,
  error,
  file,
  onChange,
  className = "",
  hint,
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}
      </span>
      <label
        className={`
          flex
          h-10
          cursor-pointer
          items-center
          justify-between
          gap-3
          rounded-none
          border
          bg-white
          px-3
          transition-colors
          hover:bg-neutral-50
          focus-within:ring-1
          focus-within:ring-[#201E64]
          ${
            error
              ? "border-red-500"
              : file
              ? "border-[#201E64]"
              : "border-dashed border-neutral-400"
          }
        `}
      >
        <span
          className={`
            min-w-0
            truncate
            text-xs
            ${
              file
                ? "text-neutral-900"
                : "text-neutral-500"
            }
          `}
        >
          {file
            ? file.name
            : "No file chosen"}
        </span>
        <span
          className="shrink-0 text-xs font-semibold"
          style={{ color: NAVY }}
        >
          {file ? "Replace" : "Upload"}
        </span>
        <input
          type="file"
          aria-label={label}
          aria-invalid={!!error}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onChange}
          className="sr-only"
        />
      </label>
      {hint && <p className="mt-1 text-[11px] text-neutral-500">{hint}</p>}
      {error && (
        <span
          className="mt-1 block text-[11px] text-red-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
// ======================================================
// SUB HEADING
// ======================================================
function SubHead({ children }) {
  return (
    <h3
      className="pt-1 pb-2 text-xs font-bold border-b border-neutral-200 sm:col-span-2"
      style={{ color: NAVY }}
    >
      {children}
    </h3>
  );
}
// ======================================================
// STEPPER
// ======================================================
function Stepper({ current }) {
  return (
    <ol
      className="flex items-start"
      aria-label="Registration progress"
    >
      {STEPS.map((step, index) => {
        const done = index < current;
        const active =
          index === current;
        return (
          <li
            key={step.title}
            className="relative flex flex-1 flex-col items-center"
            aria-current={
              active ? "step" : undefined
            }
          >
            {index > 0 && (
              <span
                className={`
                  absolute
                  top-4
                  right-1/2
                  h-px
                  w-full
                  ${
                    index <= current
                      ? "bg-[#201E64]"
                      : "bg-neutral-300"
                  }
                `}
                aria-hidden="true"
              />
            )}
            <span
              className={`
                relative
                z-10
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-none
                border
                text-xs
                font-bold
                ${
                  done || active
                    ? "border-[#201E64] bg-[#201E64] text-white"
                    : "border-neutral-300 bg-white text-neutral-500"
                }
              `}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`
                mt-1.5
                hidden
                text-[11px]
                font-semibold
                sm:block
                ${
                  active
                    ? "text-[#201E64]"
                    : "text-neutral-500"
                }
              `}
            >
              {step.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
// ======================================================
// REVIEW CARD
// ======================================================
function ReviewCard({
  title,
  rows,
  onEdit,
}) {
  return (
    <section className="border border-neutral-200 bg-white">
      <div
        className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2.5"
      >
        <h3
          className="text-xs font-bold"
          style={{ color: NAVY }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className={`
            text-xs
            font-semibold
            text-[#201E64]
            hover:underline
            ${FOCUS}
          `}
        >
          Edit
        </button>
      </div>
      <dl className="divide-y divide-neutral-100 text-xs">
        {rows.map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:justify-between sm:gap-5"
          >
            <dt className="text-neutral-500">
              {key}
            </dt>
            <dd
              className="break-words font-medium text-neutral-900 sm:text-right"
            >
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
// ======================================================
// MAIN COMPONENT
// ======================================================
export default function CompanyRegistration({
  onSubmit,
}) {
  const [step, setStep] =
    useState(0);
  const [form, setForm] =
    useState(INITIAL);
  const [errors, setErrors] =
    useState({});
  const [done, setDone] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const f = form;
  const clear = (key) => {
    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };
  const set = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));
    clear(key);
  };
  const setVal = (key) => (value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    clear(key);
  };
  const setFile = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]:
        event.target.files[0] || null,
    }));
    clear(key);
  };
  const setSector = (event) => {
    const sector = SECTORS.find(
      (item) =>
        item.id === event.target.value
    );
    setForm((current) => ({
      ...current,
      sectorId: sector
        ? sector.id
        : "",
      sectorName: sector ? sector.name : "",
      service: sector ? sector.description : "",
    }));
    clear("sectorId");
    clear("service");
  };
  // ====================================================
  // CLIENTS
  // ====================================================
  const setClient =
    (index, key) => (event) => {
      const value = event.target.value;
      setForm((current) => ({
        ...current,
        previousClients:
          current.previousClients.map(
            (client, clientIndex) =>
              clientIndex === index
                ? {
                    ...client,
                    [key]: value,
                  }
                : client
          ),
      }));
      clear(`client${index}_${key}`);
    };
  const addClient = () => {
    if (
      form.previousClients.length >= 3
    ) {
      return;
    }
    setForm((current) => ({
      ...current,
      previousClients: [
        ...current.previousClients,
        { ...emptyClient },
      ],
    }));
  };
  const removeClient = (index) => {
    if (index === 0) {
      return;
    }
    setForm((current) => ({
      ...current,
      previousClients:
        current.previousClients.filter(
          (_, clientIndex) =>
            clientIndex !== index
        ),
    }));
    setErrors((current) => {
      const cleaned = {};
      Object.entries(current).forEach(
        ([key, value]) => {
          if (
            !key.startsWith("client")
          ) {
            cleaned[key] = value;
          }
        }
      );
      return cleaned;
    });
  };
  // ====================================================
  // NAVIGATION
  // ====================================================
  const top = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  const next = () => {
    const found = validate(
      step,
      form
    );
    setErrors(found);
    if (
      Object.keys(found).length
    ) {
      top();
      return;
    }
    setStep(
      (current) => current + 1
    );
    top();
  };
  const back = () => {
    setErrors({});
    setStep(
      (current) => current - 1
    );
    top();
  };
  // ====================================================
  // SUBMIT
  // ====================================================
  const submit = async () => {
    if (submitting) return;
    for (let index = 0; index < 4; index += 1) {
      const found = validate(index, form);
      if (Object.keys(found).length) {
        setErrors(found);
        setStep(index);
        top();
        return;
      }
    }
    setSubmitError("");
    setSubmitting(true);
    const payload = {
      ...form,
      vatRegistrationNumber: form.hasVatRegistration === "Yes" ? form.vatRegistrationNumber.trim() : "",
      coidaCertificateNumber: form.coida === "Yes" ? form.coidaCertificateNumber.trim() : "",
      beeDocumentType: form.hasBeeCertificate === "Yes" ? "B-BBEE certificate" : "Affidavit",
      esdCompanyName:
        form.attendedEsd === "Yes"
          ? form.esdCompanyName
          : "",
      grantCompanyName:
        form.receivedGrant === "Yes"
          ? form.grantCompanyName
          : "",
      contractsSigned:
        form.employeesHaveContracts ===
        "Yes"
          ? form.contractsSigned
          : "",
      accountingSystemName:
        form.accounting === "Yes"
          ? form.accountingSystemName
          : "",
      payrollExplanation:
        form.payroll === "No"
          ? form.payrollExplanation
          : "",
      previousClients:
        form.previousClients.filter(
          (client) =>
            Object.values(client).some(
              has
            )
        ),
    };
    try {
      if (!onSubmit) {
        throw new Error("Registration is not connected yet. Pass an onSubmit handler to save this form.");
      }
      await onSubmit(payload);
      setDone(true);
      top();
    } catch (error) {
      setSubmitError(error.message || "Unable to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const grid =
    "grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0";
  // ====================================================
  // UI
  // ====================================================
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-5">
        {done ? (
          // ==================================================
          // SUCCESS
          // ==================================================
          <div
            className="border border-neutral-200 bg-white p-6 text-center shadow-sm sm:p-8"
          >
            <div
              className="mx-auto flex h-11 w-11 items-center justify-center bg-[#201E64] text-white"
            >
              <Check className="h-5 w-5" />
            </div>
            <h1
              className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl"
              style={{ color: NAVY }}
            >
              Registration submitted
            </h1>
            <p
              className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600"
            >
              Thank you, {f.firstName}. We
              have received the registration
              for{" "}
              <span className="font-semibold text-neutral-800">
                {f.businessName}
              </span>
              . Your information has been
              submitted successfully and will
              be reviewed.
            </p>
          </div>
        ) : (
          <>
            {/* ==============================================
                STEPPER
            ============================================== */}
            <div
              className="border border-neutral-200 bg-white px-4 pt-4 pb-3 shadow-sm sm:px-6"
            >
              <Stepper current={step} />
              <p
                className="mt-2 text-center text-[11px] text-neutral-500 sm:hidden"
              >
                Step {step + 1} of{" "}
                {STEPS.length}:{" "}
                {STEPS[step].title}
              </p>
            </div>
            {/* ==============================================
                FORM
            ============================================== */}
            <div
              className="mt-4 border border-neutral-200 bg-white p-4 shadow-sm sm:p-6"
            >
              {/* FORM HEADER */}
              <div
                className="mb-5 border-b border-neutral-200 pb-4"
              >
                <p className="text-[11px] font-semibold text-neutral-500">
                  Step {step + 1} of{" "}
                  {STEPS.length}
                </p>
                <h1
                  className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl"
                  style={{ color: NAVY }}
                >
                  {STEPS[step].heading}
                </h1>
                <p
                  className="mt-1 text-xs leading-5 text-neutral-500"
                >
                  {STEPS[step].text}
                </p>
              </div>
              {/* ERRORS */}
              {Object.values(
                errors
              ).some(Boolean) && (
                <div
                  className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                  role="alert"
                >
                  Please fix the highlighted
                  fields to continue.
                </div>
              )}
              {/* ============================================
                  STEP 1 - PERSONAL
              ============================================ */}
              {step === 0 && (
                <div className={grid}>
                  <TextInput
                    label="First name"
                    value={f.firstName}
                    onChange={set(
                      "firstName"
                    )}
                    error={
                      errors.firstName
                    }
                    autoComplete="given-name"
                  />
                  <TextInput
                    label="Surname"
                    value={f.lastName}
                    onChange={set(
                      "lastName"
                    )}
                    error={
                      errors.lastName
                    }
                    autoComplete="family-name"
                  />
                  <TextInput
                    label="ID number"
                    value={f.idNumber}
                    onChange={set(
                      "idNumber"
                    )}
                    error={
                      errors.idNumber
                    }
                    inputMode="numeric"
                    maxLength={13}
                    hint="13-digit South African ID number"
                  />
                  <Select
                    label="Gender"
                    value={f.gender}
                    onChange={set(
                      "gender"
                    )}
                    error={
                      errors.gender
                    }
                    options={[
                      "Female",
                      "Male",
                      "Other",
                      "Prefer not to say",
                    ]}
                  />
                  <TextInput
                    label="Phone number"
                    type="tel"
                    value={f.phone}
                    onChange={set("phone")}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                  <TextInput
                    label="Email address"
                    type="email"
                    value={f.email}
                    onChange={set("email")}
                    error={errors.email}
                    autoComplete="email"
                  />
                </div>
              )}
              {/* ============================================
                  STEP 2 - BUSINESS
              ============================================ */}
              {step === 1 && (
                <div className={grid}>
                  <TextInput
                    label="Business name"
                    value={f.businessName}
                    onChange={set(
                      "businessName"
                    )}
                    error={
                      errors.businessName
                    }
                  />
                  <TextInput
                    label="Company registration number"
                    value={
                      f.companyRegistrationNumber
                    }
                    onChange={set(
                      "companyRegistrationNumber"
                    )}
                    error={
                      errors.companyRegistrationNumber
                    }
                    placeholder="e.g. 2019/123456/07"
                  />
                  <TextInput
                    label="Business address"
                    className="sm:col-span-2"
                    value={
                      f.businessAddress
                    }
                    onChange={set(
                      "businessAddress"
                    )}
                    error={
                      errors.businessAddress
                    }
                  />
                  <TextInput
                    label="Community or town"
                    className="sm:col-span-2"
                    value={f.community}
                    onChange={set(
                      "community"
                    )}
                    error={
                      errors.community
                    }
                  />
                  <SubHead>
                    Ownership and B-BBEE
                  </SubHead>
                  <TextInput
                    label="Black women ownership (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      f.bwoOwnership
                    }
                    onChange={set(
                      "bwoOwnership"
                    )}
                    error={
                      errors.bwoOwnership
                    }
                  />
                  <TextInput
                    label="Black ownership (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={f.boOwnership}
                    onChange={set(
                      "boOwnership"
                    )}
                    error={
                      errors.boOwnership
                    }
                  />
                  <Select
                    label="B-BBEE level"
                    className="sm:col-span-2"
                    value={f.beeLevel}
                    onChange={set(
                      "beeLevel"
                    )}
                    error={
                      errors.beeLevel
                    }
                    options={BEE_LEVELS}
                  />
                  <SubHead>
                    Supporting documents
                    (PDF, JPG or PNG)
                  </SubHead>
                  <FileField
                    label="Company registration (CoReg) document"
                    file={
                      f.coregDocument
                    }
                    onChange={setFile(
                      "coregDocument"
                    )}
                    error={
                      errors.coregDocument
                    }
                  />
                  <TextInput
                    label="Tax Compliance Status (TCS) PIN"
                    value={f.taxCompliancePin}
                    onChange={set("taxCompliancePin")}
                    error={errors.taxCompliancePin}
                    placeholder="Enter your SARS TCS PIN"
                  />
                  <YesNo
                    label="Do you have a VAT registration number?"
                    value={f.hasVatRegistration}
                    onChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        hasVatRegistration: value,
                        vatRegistrationNumber: value === "Yes" ? current.vatRegistrationNumber : "",
                      }));
                      clear("hasVatRegistration");
                      clear("vatRegistrationNumber");
                    }}
                    error={errors.hasVatRegistration}
                  />
                  {f.hasVatRegistration === "Yes" && (
                    <TextInput
                      label="VAT registration number"
                      value={f.vatRegistrationNumber}
                      onChange={set("vatRegistrationNumber")}
                      error={errors.vatRegistrationNumber}
                      placeholder="Enter your VAT registration number"
                    />
                  )}
                  <YesNo
                    label="Do you have a B-BBEE certificate?"
                    value={f.hasBeeCertificate}
                    onChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        hasBeeCertificate: value,
                        beeDocument: current.hasBeeCertificate === value ? current.beeDocument : null,
                      }));
                      clear("beeDocument");
                      clear("hasBeeCertificate");
                    }}
                    error={errors.hasBeeCertificate}
                    className="sm:col-span-2"
                  />
                  {f.hasBeeCertificate !== "" && (
                    <FileField
                      key={f.hasBeeCertificate}
                      label={f.hasBeeCertificate === "Yes" ? "Upload B-BBEE certificate" : "Upload affidavit"}
                      file={f.beeDocument}
                      onChange={setFile("beeDocument")}
                      error={errors.beeDocument}
                      className="sm:col-span-2"
                      hint={f.hasBeeCertificate === "Yes" ? "Upload your B-BBEE certificate. PDF, JPG, JPEG or PNG." : "Upload your B-BBEE affidavit. PDF, JPG, JPEG or PNG."}
                    />
                  )}
                  <SubHead>
                    Previous support
                  </SubHead>
                  <YesNo
                    label="Have you attended an ESD programme before?"
                    value={
                      f.attendedEsd
                    }
                    onChange={setVal(
                      "attendedEsd"
                    )}
                    error={
                      errors.attendedEsd
                    }
                  />
                  {f.attendedEsd ===
                    "Yes" && (
                    <TextInput
                      label="Which company ran the programme?"
                      value={
                        f.esdCompanyName
                      }
                      onChange={set(
                        "esdCompanyName"
                      )}
                      error={
                        errors.esdCompanyName
                      }
                    />
                  )}
                  <YesNo
                    label="Have you received a grant before?"
                    value={
                      f.receivedGrant
                    }
                    onChange={setVal(
                      "receivedGrant"
                    )}
                    error={
                      errors.receivedGrant
                    }
                  />
                  {f.receivedGrant ===
                    "Yes" && (
                    <TextInput
                      label="Which company gave the grant?"
                      value={
                        f.grantCompanyName
                      }
                      onChange={set(
                        "grantCompanyName"
                      )}
                      error={
                        errors.grantCompanyName
                      }
                    />
                  )}
                </div>
              )}
              {/* ============================================
                  STEP 3 - MATURITY
              ============================================ */}
              {step === 2 && (
                <div className={grid}>
                  <SectorSelect
                    value={f.sectorId}
                    onChange={setSector}
                    error={errors.sectorId}
                    className="sm:col-span-2"
                  />
                  <TextInput
                    label="Main product or service"
                    textarea
                    className="sm:col-span-2"
                    hint="Filled automatically from your industry. You can edit it to describe your business."
                    value={f.service}
                    onChange={set(
                      "service"
                    )}
                    error={
                      errors.service
                    }
                  />
                  <Select
                    label="Annual revenue"
                    className="sm:col-span-2"
                    value={
                      f.annualRevenue
                    }
                    onChange={set(
                      "annualRevenue"
                    )}
                    error={
                      errors.annualRevenue
                    }
                    options={REVENUE}
                  />
                  {f.annualRevenue && (
                    <div className="min-w-0 space-y-3 sm:col-span-2">
                      <p className="border border-[#201E64]/20 bg-[#201E64]/5 p-3 text-xs leading-5 text-[#201E64]">
                        We encourage suppliers to upload proof of last year's annual income.
                        Supporting documents help the team assess your business and may
                        improve your chances of being selected for suitable opportunities.
                        You can continue without uploading this document.
                      </p>
                      <FileField
                        label="Proof of last year's annual income"
                        file={f.revenueProofDocument}
                        onChange={setFile("revenueProofDocument")}
                        error={errors.revenueProofDocument}
                        hint="Upload financial statements or another document showing last year's revenue. PDF, JPG, JPEG or PNG."
                      />
                    </div>
                  )}
                  <SubHead>
                    Employees
                  </SubHead>
                  <TextInput
                    label="Permanent employees"
                    type="number"
                    min="0"
                    value={
                      f.permanentEmployees
                    }
                    onChange={set(
                      "permanentEmployees"
                    )}
                    error={
                      errors.permanentEmployees
                    }
                  />
                  <TextInput
                    label="Contract employees"
                    type="number"
                    min="0"
                    value={
                      f.contractEmployees
                    }
                    onChange={set(
                      "contractEmployees"
                    )}
                    error={
                      errors.contractEmployees
                    }
                  />
                  <YesNo
                    label="Do your employees have employment contracts?"
                    value={
                      f.employeesHaveContracts
                    }
                    onChange={setVal(
                      "employeesHaveContracts"
                    )}
                    error={
                      errors.employeesHaveContracts
                    }
                  />
                  {f.employeesHaveContracts ===
                    "Yes" && (
                    <YesNo
                      label="Are all the contracts signed?"
                      value={
                        f.contractsSigned
                      }
                      onChange={setVal(
                        "contractsSigned"
                      )}
                      error={
                        errors.contractsSigned
                      }
                    />
                  )}
                  <YesNo
                    label="Are you registered with UIF?"
                    value={f.uif}
                    onChange={setVal(
                      "uif"
                    )}
                    error={errors.uif}
                  />
                  <YesNo
                    label="Are you registered with COIDA?"
                    value={f.coida}
                    onChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        coida: value,
                        coidaCertificateNumber: value === "Yes" ? current.coidaCertificateNumber : "",
                      }));
                      clear("coida");
                      clear("coidaCertificateNumber");
                    }}
                    error={errors.coida}
                  />
                  {f.coida === "Yes" && (
                    <TextInput
                      label="COIDA certificate number"
                      value={f.coidaCertificateNumber}
                      onChange={set("coidaCertificateNumber")}
                      error={errors.coidaCertificateNumber}
                      placeholder="Enter your COIDA certificate number"
                      className="sm:col-span-2"
                    />
                  )}
                  <SubHead>
                    Finance and administration
                  </SubHead>
                  <YesNo
                    label="Do you use an accounting system or accountant?"
                    value={
                      f.accounting
                    }
                    onChange={setVal(
                      "accounting"
                    )}
                    error={
                      errors.accounting
                    }
                  />
                  {f.accounting ===
                    "Yes" && (
                    <TextInput
                      label="Which system or accountant?"
                      value={
                        f.accountingSystemName
                      }
                      onChange={set(
                        "accountingSystemName"
                      )}
                      error={
                        errors.accountingSystemName
                      }
                    />
                  )}
                  <YesNo
                    label="Do you run a formal payroll?"
                    value={f.payroll}
                    onChange={setVal(
                      "payroll"
                    )}
                    error={
                      errors.payroll
                    }
                  />
                  {f.payroll === "No" && (
                    <TextInput
                      textarea
                      label="How do you manage payroll?"
                      className="sm:col-span-2"
                      value={
                        f.payrollExplanation
                      }
                      onChange={set(
                        "payrollExplanation"
                      )}
                      error={
                        errors.payrollExplanation
                      }
                    />
                  )}
                  <YesNo
                    label="Do you have up-to-date financial statements?"
                    value={
                      f.financialStatements
                    }
                    onChange={setVal(
                      "financialStatements"
                    )}
                    error={
                      errors.financialStatements
                    }
                  />
                </div>
              )}
              {/* ============================================
                  STEP 4 - CLIENTS
              ============================================ */}
              {step === 3 && (
                <div className="space-y-4">
                  <div
                    className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
                  >
                    <div>
                      <h3
                        className="text-sm font-bold"
                        style={{
                          color: NAVY,
                        }}
                      >
                        Client references
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        Add at least one
                        previous client who can
                        confirm your work.
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500">
                      {
                        f.previousClients
                          .length
                      }{" "}
                      of 3 clients
                    </span>
                  </div>
                  {/* CLIENT CARDS */}
                  <div className="space-y-3">
                    {f.previousClients.map(
                      (client, index) => (
                        <section
                          key={index}
                          className="border border-neutral-200 bg-white"
                        >
                          <div
                            className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5"
                          >
                            <div>
                              <h3
                                className="text-xs font-bold"
                                style={{
                                  color:
                                    NAVY,
                                }}
                              >
                                Client{" "}
                                {index + 1}
                              </h3>
                              {index ===
                                0 && (
                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                  Primary
                                  client
                                  reference
                                </p>
                              )}
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeClient(
                                    index
                                  )
                                }
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1
                                  text-xs
                                  font-semibold
                                  text-red-600
                                  hover:text-red-700
                                  ${FOCUS}
                                `}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            )}
                          </div>
                          <div
                            className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2"
                          >
                            <TextInput
                              label="Client name"
                              value={
                                client.name
                              }
                              onChange={setClient(
                                index,
                                "name"
                              )}
                              error={
                                errors[
                                  `client${index}_name`
                                ]
                              }
                              placeholder="Company or client name"
                            />
                            <TextInput
                              label="Contact number"
                              type="tel"
                              value={
                                client.contactNumber
                              }
                              onChange={setClient(
                                index,
                                "contactNumber"
                              )}
                              error={
                                errors[
                                  `client${index}_contactNumber`
                                ]
                              }
                              placeholder="e.g. 082 123 4567"
                            />
                            <TextInput
                              label="Email address"
                              type="email"
                              value={
                                client.email
                              }
                              onChange={setClient(
                                index,
                                "email"
                              )}
                              error={
                                errors[
                                  `client${index}_email`
                                ]
                              }
                              placeholder="client@example.com"
                            />
                            <TextInput
                              label="Work done"
                              value={
                                client.workDone
                              }
                              onChange={setClient(
                                index,
                                "workDone"
                              )}
                              error={
                                errors[
                                  `client${index}_workDone`
                                ]
                              }
                              placeholder="e.g. Website development"
                            />
                          </div>
                        </section>
                      )
                    )}
                  </div>
                  {/* ADD CLIENT */}
                  {f.previousClients.length <
                    3 && (
                    <button
                      type="button"
                      onClick={addClient}
                      className={`
                        flex
                        h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        border
                        border-dashed
                        border-[#201E64]
                        bg-[#201E64]/5
                        text-xs
                        font-semibold
                        text-[#201E64]
                        transition-colors
                        hover:bg-[#201E64]/10
                        ${FOCUS}
                      `}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add client
                    </button>
                  )}
                  {f.previousClients.length ===
                    3 && (
                    <div
                      className="border border-neutral-200 bg-neutral-50 px-3 py-2"
                    >
                      <p className="text-center text-[11px] text-neutral-500">
                        Maximum of 3 clients
                        reached.
                      </p>
                    </div>
                  )}
                  {/* LARGEST CONTRACT */}
                  <div
                    className="border-t border-neutral-200 pt-4"
                  >
                    <TextInput
                      label="Largest contract completed"
                      value={
                        f.largestContract
                      }
                      onChange={set(
                        "largestContract"
                      )}
                      error={
                        errors.largestContract
                      }
                      placeholder="e.g. R250,000 packaging supply"
                      hint="Include the value and a short description."
                    />
                  </div>
                </div>
              )}
              {/* ============================================
                  STEP 5 - REVIEW
              ============================================ */}
              {step === 4 && (
                <div className="space-y-4">
                  <ReviewCard
                    title="Personal information"
                    onEdit={() =>
                      setStep(0)
                    }
                    rows={[
                      [
                        "Name",
                        `${f.firstName} ${f.lastName}`,
                      ],
                      [
                        "ID number",
                        f.idNumber,
                      ],
                      [
                        "Gender",
                        f.gender,
                      ],
                      [
                        "Phone",
                        f.phone,
                      ],
                      [
                        "Email",
                        f.email,
                      ],
                    ]}
                  />
                  <ReviewCard
                    title="Business profile"
                    onEdit={() =>
                      setStep(1)
                    }
                    rows={[
                      [
                        "Business name",
                        f.businessName,
                      ],
                      [
                        "Registration number",
                        f.companyRegistrationNumber,
                      ],
                      [
                        "Address",
                        f.businessAddress,
                      ],
                      [
                        "Community",
                        f.community,
                      ],
                      [
                        "Black women ownership",
                        f.bwoOwnership
                          ? `${f.bwoOwnership}%`
                          : "",
                      ],
                      [
                        "Black ownership",
                        f.boOwnership
                          ? `${f.boOwnership}%`
                          : "",
                      ],
                      [
                        "B-BBEE level",
                        f.beeLevel,
                      ],
                      [
                        "CoReg document",
                        f.coregDocument
                          ?.name,
                      ],
                      [
                        "Tax Compliance Status (TCS) PIN",
                        f.taxCompliancePin,
                      ],
                      [
                        "VAT registered", f.hasVatRegistration,
                      ],
                      ...(f.hasVatRegistration === "Yes" ? [["VAT registration number", f.vatRegistrationNumber]] : []),
                      ["Has a B-BBEE certificate", f.hasBeeCertificate],
                      [
                        f.hasBeeCertificate === "Yes" ? "B-BBEE certificate" : "Affidavit",
                        f.beeDocument
                          ?.name,
                      ],
                      [
                        "Attended ESD programme",
                        f.attendedEsd ===
                        "Yes"
                          ? `Yes, ${f.esdCompanyName}`
                          : f.attendedEsd,
                      ],
                      [
                        "Received a grant",
                        f.receivedGrant ===
                        "Yes"
                          ? `Yes, ${f.grantCompanyName}`
                          : f.receivedGrant,
                      ],
                    ]}
                  />
                  <ReviewCard
                    title="Business maturity"
                    onEdit={() =>
                      setStep(2)
                    }
                    rows={[
                      [
                        "Sector",
                        f.sectorName,
                      ],
                      [
                        "Product or service",
                        f.service,
                      ],
                      [
                        "Annual revenue",
                        f.annualRevenue,
                      ],
                      [
                        "Last year’s annual income proof", f.revenueProofDocument?.name || "Not uploaded",
                      ],
                      [
                        "Permanent employees",
                        f.permanentEmployees,
                      ],
                      [
                        "Contract employees",
                        f.contractEmployees,
                      ],
                      [
                        "Employment contracts",
                        f.employeesHaveContracts ===
                        "Yes"
                          ? `Yes, signed: ${f.contractsSigned}`
                          : f.employeesHaveContracts,
                      ],
                      [
                        "UIF registered",
                        f.uif,
                      ],
                      [
                        "COIDA registered",
                        f.coida,
                      ],
                      ...(f.coida === "Yes" ? [["COIDA certificate number", f.coidaCertificateNumber]] : []),
                      [
                        "Accounting",
                        f.accounting ===
                        "Yes"
                          ? `Yes, ${f.accountingSystemName}`
                          : f.accounting,
                      ],
                      [
                        "Formal payroll",
                        f.payroll === "No"
                          ? `No, ${f.payrollExplanation}`
                          : f.payroll,
                      ],
                      [
                        "Financial statements",
                        f.financialStatements,
                      ],
                    ]}
                  />
                  <ReviewCard
                    title="Previous clients"
                    onEdit={() =>
                      setStep(3)
                    }
                    rows={[
                      ...f.previousClients.map(
                        (
                          client,
                          index
                        ) => [
                          `Client ${
                            index + 1
                          }`,
                          `${client.name}, ${client.contactNumber}`,
                        ]
                      ),
                      [
                        "Largest contract",
                        f.largestContract,
                      ],
                    ]}
                  />
                  <p
                    className="text-[11px] leading-5 text-neutral-500"
                  >
                    By submitting, you
                    confirm that the
                    information and documents
                    you have provided are true
                    and correct. Registration
                    does not guarantee
                    procurement opportunities,
                    contracts or funding.
                  </p>
                </div>
              )}
              {/* ============================================
                  NAVIGATION
              ============================================ */}
              {submitError && <p role="alert" className="mt-4 text-sm text-red-600">{submitError}</p>}
              <div
                className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4"
              >
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className={
                      BTN_OUTLINE
                    }
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {step <
                STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className={BTN}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className={`${BTN} disabled:opacity-60 disabled:cursor-wait`}
                  >
                    {submitting ? "Submitting…" : "Submit registration"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
