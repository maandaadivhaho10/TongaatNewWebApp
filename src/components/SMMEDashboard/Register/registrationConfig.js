import api from "../../../API/axiosInstance";

export const NAVY = "#201E64";
// Routes are mounted at the server root, while the login Axios baseURL may end in /api.
export const API_ORIGIN = new URL(api.defaults.baseURL || "http://localhost:5000/", window.location.origin).origin;
// Sector IDs must match the eight rows in your database sector table.
export const SECTOR_DATABASE_IDS = {
  sector_1: 1,
  sector_2: 2,
  sector_3: 3,
  sector_4: 4,
  sector_5: 5,
  sector_6: 6,
  sector_7: 7,
  sector_8: 8,
};

// Must match the multer limits in the backend routes.
// business-profile route: 5 MB, business-maturity route: 10 MB. PDF only on both.
export const PROFILE_FILE_MB = 5;
export const MATURITY_FILE_MB = 10;

export const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2";
export const BTN = `
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
export const BTN_OUTLINE = `
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
export const inputCls = (err, extra = "") =>
  `w-full rounded-none border bg-white px-3 text-sm text-neutral-900 outline-none transition ${extra} ${
    err
      ? "border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/15"
  }`;
// ======================================================
// STEPS
// ======================================================
export const STEPS = [
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
export const SECTORS = [
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
export const REVENUE = [
  "Less than R100,000",
  "R100,000 – R500,000",
  "R500,000 – R1 million",
  "R1 million – R5 million",
  "R5 million – R10 million",
  "More than R10 million",
];
export const BEE_LEVELS = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
  "Level 6",
  "Level 7",
  "Level 8"
];
export const emptyClient = {
  name: "",
  email: "",
  contactNumber: "",
  workDone: "",
};
export const INITIAL = {
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
  vatDocument: null,
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
  revenueProofDocument: null, // optional
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
  // Numeric rand value (backend stores largest_contract_value as a number)
  largestContract: "",
  contractDocument: null, // optional
};
// ======================================================
// VALIDATION
// ======================================================
const has = (value) =>
  String(value ?? "").trim() !== "";
export function validate(step, form) {
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
  // The backend (multer) only accepts PDF files, so the frontend does too.
  // Pass required = false for optional documents: they are only checked if chosen.
  const file = (key, maxMb = PROFILE_FILE_MB, required = true) => {
    const selected = form[key];
    if (!selected) {
      if (required) errors[key] = "Upload this document";
      return;
    }
    if (selected.type !== "application/pdf" || !/\.pdf$/i.test(selected.name)) {
      errors[key] = "File must be a PDF";
      return;
    }
    if (selected.size > maxMb * 1024 * 1024) {
      errors[key] = `File must be ${maxMb} MB or smaller`;
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
      file("vatDocument");
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
    // Optional: only checked if the user uploaded one
    file("revenueProofDocument", MATURITY_FILE_MB, false);
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
    const contractValue = Number(form.largestContract);
    if (
      !has(form.largestContract) ||
      !Number.isFinite(contractValue) ||
      contractValue < 0
    ) {
      errors.largestContract =
        "Enter the contract value in rands (numbers only)";
    }
    // Optional: only checked if the user uploaded one
    file("contractDocument", MATURITY_FILE_MB, false);
  }
  return errors;
}