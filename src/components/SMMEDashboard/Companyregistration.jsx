import React, { useEffect, useRef, useState } from "react";
import api from "../../API/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Check, Plus, Trash2 } from "lucide-react";
const NAVY = "#201E64";
// Routes are mounted at the server root, while the login Axios baseURL may end in /api.
const API_ORIGIN = new URL(api.defaults.baseURL || "http://localhost:5000/", window.location.origin).origin;
// Sector IDs must match the eight rows in your database sector table.
const SECTOR_DATABASE_IDS = {
  sector_1: 1,
  sector_2: 2,
  sector_3: 3,
  sector_4: 4,
  sector_5: 5,
  sector_6: 6,
  sector_7: 7,
  sector_8: 8,
};

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
];
// ======================================================
// INDUSTRIES
// ======================================================
// Eight sectors and their corresponding sub-categories in the requested order.
const SECTORS = [
  {
    "id": "sector_1",
    "name": "LOGISTICS",
    "description": "LOGISTICS-ROAD (OTHER), WAREHOUSING, LOGISTICS-SUGAR CANE",
    "subcategories": [
      "LOGISTICS-ROAD (OTHER)",
      "WAREHOUSING",
      "LOGISTICS-SUGAR CANE"
    ]
  },
  {
    "id": "sector_2",
    "name": "ENERGY & Utilities",
    "description": "LIQUID FUELS, LUBRICANTS, GASES",
    "subcategories": [
      "LIQUID FUELS",
      "LUBRICANTS",
      "GASES"
    ]
  },
  {
    "id": "sector_3",
    "name": "AGRIC EQUIPMENT & SERVICES",
    "description": "AGRIC SERVICES, AGRIC EQUIPMENT AND SPARES, AGRIC CONSULTING",
    "subcategories": [
      "AGRIC SERVICES",
      "AGRIC EQUIPMENT AND SPARES",
      "AGRIC CONSULTING"
    ]
  },
  {
    "id": "sector_4",
    "name": "CHEMICALS",
    "description": "INDUSTRIAL CHEMICALS, LIME",
    "subcategories": [
      "INDUSTRIAL CHEMICALS",
      "LIME"
    ]
  },
  {
    "id": "sector_5",
    "name": "INDIRECTS",
    "description": "CATERING & VENDING, CLEANING & HYGIENE SERVICES, OFFICE SUPPLIES, MARKETING & COMMUNICATION",
    "subcategories": [
      "CATERING & VENDING",
      "CLEANING & HYGIENE SERVICES",
      "OFFICE SUPPLIES",
      "MARKETING & COMMUNICATION"
    ]
  },
  {
    "id": "sector_6",
    "name": "MRO",
    "description": "PAINTING, ENGINEERING SPARES, LIFTING EQUIPMENT, BUILDING MAINTENANCE, ELECTRICAL SPARES, PIPING, AUTOMOTIVE",
    "subcategories": [
      "PAINTING",
      "ENGINEERING SPARES",
      "LIFTING EQUIPMENT",
      "BUILDING MAINTENANCE",
      "ELECTRICAL SPARES",
      "PIPING",
      "AUTOMOTIVE"
    ]
  },
  {
    "id": "sector_7",
    "name": "PACKAGING",
    "description": "PALLETS, PACKING MATERIALS, LABELS, FLEXIBLE PLASTICS, PAPER",
    "subcategories": [
      "PALLETS",
      "PACKING MATERIALS",
      "LABELS",
      "FLEXIBLE PLASTICS",
      "PAPER"
    ]
  },
  {
    "id": "sector_8",
    "name": "SHERQ",
    "description": "FIRE PROTECTION SERVICES, ENVIRONMENTAL SERVICES, SECURITY SERVICES, PROFESSIONAL SERVICES, PEST CONTROL",
    "subcategories": [
      "FIRE PROTECTION SERVICES",
      "ENVIRONMENTAL SERVICES",
      "SECURITY SERVICES",
      "PROFESSIONAL SERVICES",
      "PEST CONTROL"
    ]
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
    if (form.financialStatements === "Yes" && !form.revenueProofDocument) {
      errors.revenueProofDocument = "Upload your financial statement PDF";
    }
    if (form.revenueProofDocument && (form.revenueProofDocument.type !== "application/pdf" || !/\.pdf$/i.test(form.revenueProofDocument.name))) {
      errors.revenueProofDocument = "Financial statement must be a PDF";
    }
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
// MAIN COMPONENT
// ======================================================
export default function CompanyRegistration() {
  const { user, token, isAuthenticated } = useAuth();
  const [profileSaved, setProfileSaved] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [maturitySaved, setMaturitySaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmSection, setConfirmSection] = useState(null);
  const [profileId, setProfileId] = useState(null);
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
  // Populate read-only personal fields from the authenticated user.
  // Never erase an existing value when a partial auth response omits it.
  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      firstName: user.first_name ?? current.firstName,
      lastName: user.last_name ?? current.lastName,
      idNumber: user.id_number ?? current.idNumber,
      gender: user.gender ?? current.gender,
      phone: user.phone_number ?? current.phone,
      email: user.email ?? current.email,
    }));
  }, [user]);

  // Refresh the full user profile: login/refresh responses sometimes omit gender.
  // Requires GET /api/auth/me to return the user's gender from the database.
  useEffect(() => {
    if (!token || !user?.user_id) return;
    let cancelled = false;

    const loadPersonalDetails = async () => {
      try {
        const { data } = await api.get("/auth/me");
        const profile = data?.data?.user ?? data?.user ?? data?.data ?? null;
        if (!profile || cancelled) return;
        if (profile.user_id != null && String(profile.user_id) !== String(user.user_id)) return;

        setForm((current) => ({
          ...current,
          firstName: profile.first_name ?? current.firstName,
          lastName: profile.last_name ?? current.lastName,
          idNumber: profile.id_number ?? current.idNumber,
          gender: profile.gender ?? current.gender,
          phone: profile.phone_number ?? current.phone,
          email: profile.email ?? current.email,
        }));
        if (profile.gender == null) {
          console.warn("GET /auth/me did not include gender. Include gender in the backend SELECT and response.");
        }
      } catch (error) {
        if (!cancelled) console.error("Unable to load personal details:", error.response?.data?.message || error.message);
      }
    };

    loadPersonalDetails();
    return () => { cancelled = true; };
  }, [token, user?.user_id]);

  // The server is the source of truth, including after page refresh or login.
  const loadRegistrationStatus = async () => {
    if (!token || !user) {
      setStatusError("Please log in to continue registration.");
      setCheckingStatus(false);
      return null;
    }
    setCheckingStatus(true);
    setStatusError("");
    try {
      const { data } = await api.get(`${API_ORIGIN}/registration/status`);
      if (data?.success !== true || !data?.data) {
        throw new Error(data?.message || "Invalid registration status response");
      }
      const status = data.data;
      setRegistrationStatus(status);
      setProfileSaved(Boolean(status.profile_registered));
      setMaturitySaved(Boolean(status.maturity_registered));
      setProfileId(status.business_id ?? null);
      if (status.profile_registered && status.maturity_registered) {
        setDone(true);
      } else {
        setDone(false);
        setStep(status.profile_registered ? 2 : 0);
      }
      return status;
    } catch (error) {
      setStatusError(error.response?.data?.message || error.message || "Could not check registration status. Retry before continuing.");
      setRegistrationStatus(null);
      return null;
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Status must be loaded before the form is usable.
    loadRegistrationStatus();
  }, [token, user?.user_id]);

  // IMPORTANT: Match these keys and multipart file names to your Express
  // controllers/multer.fields definitions if they use different names.
  const yesNo = (value) => value === "Yes";

  const saveBusinessProfile = async () => {
    if (profileSaved) return;
    const payload = {
      business_name: form.businessName,
      company_registration_number: form.companyRegistrationNumber,
      business_address: form.businessAddress,
      community: form.community,
      bwo_ownership_percentage: Number(form.bwoOwnership),
      bo_ownership_percentage: Number(form.boOwnership),
      bee_level: form.beeLevel,
      tax_compliance_pin: form.taxCompliancePin,
      has_vat_registration: yesNo(form.hasVatRegistration),
      vat_registration_number: yesNo(form.hasVatRegistration) ? form.vatRegistrationNumber : null,
      has_bee_certificate: yesNo(form.hasBeeCertificate),
      attended_esd_program: yesNo(form.attendedEsd),
      esd_institution: yesNo(form.attendedEsd) ? form.esdCompanyName : null,
      received_grant_or_loan: yesNo(form.receivedGrant),
      grant_loan_institution: yesNo(form.receivedGrant) ? form.grantCompanyName : null,
    };
    const body = new FormData();
    body.append("business_profile", JSON.stringify(payload));
    if (form.coregDocument) body.append("company_registration_document", form.coregDocument);
    if (form.beeDocument) body.append("bee_document", form.beeDocument);
    const { data } = await api.post(`${API_ORIGIN}/business-profile/register`, body);
    if (data?.success !== true) throw new Error(data?.message || "Business profile could not be saved");
    setProfileId(data?.data?.business_id ?? data?.business_id ?? null);
    setProfileSaved(true);
  };

  const saveBusinessMaturity = async () => {
    if (maturitySaved) return;
    const numericSectorId = SECTOR_DATABASE_IDS[form.sectorId];
    if (!Number.isInteger(numericSectorId) || numericSectorId <= 0) {
      throw new Error(`Configure the database sector_id for "${form.sectorName}" in SECTOR_DATABASE_IDS.`);
    }
    const payload = {
      sector_id: numericSectorId,
      industry_sector: form.sectorName,
      services: form.service,
      annual_revenue: null,
      annual_revenue_range: form.annualRevenue,
      permanent_employees: Number(form.permanentEmployees),
      contract_employees: Number(form.contractEmployees),
      number_of_employees: Number(form.permanentEmployees) + Number(form.contractEmployees),
      employees_have_contracts: yesNo(form.employeesHaveContracts),
      contracts_signed: yesNo(form.employeesHaveContracts) ? yesNo(form.contractsSigned) : false,
      registered_with_uif: yesNo(form.uif),
      registered_with_coida: yesNo(form.coida),
      coida_certificate_number: yesNo(form.coida) ? form.coidaCertificateNumber : null,
      has_accounting_system: yesNo(form.accounting),
      accounting_system_name: yesNo(form.accounting) ? form.accountingSystemName : null,
      has_payroll: yesNo(form.payroll),
      payroll_management_description: !yesNo(form.payroll) ? form.payrollExplanation : null,
      can_produce_financial_statements: yesNo(form.financialStatements),
      // The current field is descriptive text, not a numeric contract value.
      // Add a separate numeric input if you want to populate largest_contract_value.
      largest_contract_value: null,
    };
    const clients = form.previousClients.map((client) => ({
      client_name: client.name,
      contact_number: client.contactNumber,
      email: client.email,
      work_done: client.workDone,
    }));
    const body = new FormData();
    // Controller reads client_references from inside business_maturity.
    payload.client_references = clients;
    body.append("business_maturity", JSON.stringify(payload));
    if (form.revenueProofDocument) {
      body.append("financial_statement", form.revenueProofDocument);
    }
    const { data } = await api.post(`${API_ORIGIN}/business-maturity/register`, body);
    if (data?.success !== true) throw new Error(data?.message || "Business maturity could not be saved");
    setMaturitySaved(true);
  };

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
  const next = async () => {
    if (saving || checkingStatus || !registrationStatus) return;
    if (step === 1 && profileSaved) {
      setStep(2);
      top();
      return;
    }
    if ((step === 2 || step === 3) && maturitySaved) {
      setDone(true);
      top();
      return;
    }
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length) { top(); return; }
    if (!token || !user) {
      setSubmitError("Your session has expired. Please log in again.");
      return;
    }
    setSubmitError("");
    if (step === 1 || step === 3) {
      setConfirmSection(step === 1 ? "profile" : "maturity");
      return;
    }
    setStep(current => current + 1);
    top();
  };

  const confirmAndSave = async () => {
    if (!confirmSection || saving) return;
    const section = confirmSection;
    setConfirmSection(null);
    setSaving(true);
    try {
      if (section === "profile") await saveBusinessProfile();
      if (section === "maturity") await saveBusinessMaturity();
      if (section === "maturity") {
        setDone(true);
      } else {
        setStep(2);
      }
      top();
    } catch (error) {
      if (error.response?.status === 409) {
        // Recover from duplicate requests or a prior successful submission.
        const status = await loadRegistrationStatus();
        if (status) {
          setSubmitError("This section was already registered. Your progress has been restored.");
        }
      } else {
        setSubmitError(error.response?.data?.message || error.message || "Unable to save. Please try again.");
      }
      top();
    } finally {
      setSaving(false);
    }
  };
  const back = () => {
    setErrors({});
    // Previously saved profile must not be submitted again.
    setStep(current => Math.max(profileSaved ? 2 : 0, current - 1));
    top();
  };

  const grid =
    "grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0";
  // ====================================================
  // UI
  // ====================================================
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-5">
        {checkingStatus ? (
          <div role="status" className="bg-white border p-8 text-center text-sm">Checking registration status…</div>
        ) : statusError || !registrationStatus ? (
          <div className="bg-white border p-8 text-center">
            <p role="alert" className="mb-4 text-sm text-red-600">{statusError || "Registration status is unavailable."}</p>
            <button type="button" className={BTN} onClick={loadRegistrationStatus}>Retry</button>
          </div>
        ) : done ? (
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                  <TextInput
                    readOnly
                    label="Gender"
                    value={f.gender}
                    onChange={set(
                      "gender"
                    )}
                    error={
                      errors.gender
                    }
                  />
                  <TextInput
                    readOnly
                    label="Phone number"
                    type="tel"
                    value={f.phone}
                    onChange={set("phone")}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                  <TextInput
                    readOnly
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
                    hint="Automatically populated with the selected sector’s sub-categories. You can edit this to describe the services your business provides."
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
                        If you indicate that you have financial statements, upload a PDF before continuing.
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
                    disabled={saving || (profileSaved && step <= 2)}
                    className={`${BTN_OUTLINE} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {(
                  <button
                    type="button"
                    onClick={next}
                    disabled={saving || checkingStatus}
                    className={`${BTN} disabled:opacity-60 disabled:cursor-wait`}
                  >
                    {saving ? "Saving…" : step === 3 ? "Submit business maturity" : step === 1 ? "Submit business profile" : "Continue"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      {confirmSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl">
            <h2 id="confirm-title" className="text-lg font-bold text-[#201E64]">Are you sure you want to submit these details?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {confirmSection === "profile"
                ? "Your business profile and supporting documents will be registered. You cannot register this section again."
                : "Your business maturity details and client references will be registered. You cannot register this section again."}
              {" "}Please check that all information is correct before confirming.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" className={BTN_OUTLINE} onClick={() => setConfirmSection(null)}>Cancel and edit</button>
              <button type="button" className={BTN} disabled={saving} onClick={confirmAndSave}>Yes, submit details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
