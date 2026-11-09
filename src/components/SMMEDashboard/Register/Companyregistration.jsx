import React, { useEffect, useState } from "react";
import api from "../../../API/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { Check } from "lucide-react";
import { API_ORIGIN, NAVY, SECTOR_DATABASE_IDS, BTN, BTN_OUTLINE, STEPS, SECTORS, INITIAL, emptyClient, validate } from "./registrationConfig";
import { Stepper } from "./RegistrationFields";
import RegistrationSteps from "./RegistrationSteps";

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
    const hasVat = yesNo(form.hasVatRegistration);
    const payload = {
      business_name: form.businessName,
      company_registration_number: form.companyRegistrationNumber,
      business_address: form.businessAddress,
      community: form.community,
      bwo_ownership_percentage: Number(form.bwoOwnership),
      bo_ownership_percentage: Number(form.boOwnership),
      bee_level: form.beeLevel,
      tax_compliance_pin: form.taxCompliancePin,
      has_vat_registration: hasVat,
      // vat_registration_number removed: the backend now stores a VAT document instead
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
    // Backend rejects a VAT document unless the business is VAT registered
    if (hasVat && form.vatDocument) body.append("vat_document", form.vatDocument);
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
      largest_contract_value:
        String(form.largestContract).trim() === "" ? null : Number(form.largestContract),
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
    // Both documents are optional
    if (form.revenueProofDocument) {
      body.append("financial_statement", form.revenueProofDocument);
    }
    if (form.contractDocument) {
      body.append("contract_document", form.contractDocument);
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
              <RegistrationSteps step={step} f={f} errors={errors} set={set} setVal={setVal} setFile={setFile} setSector={setSector} setForm={setForm} clear={clear} setClient={setClient} addClient={addClient} removeClient={removeClient} grid={grid} />
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