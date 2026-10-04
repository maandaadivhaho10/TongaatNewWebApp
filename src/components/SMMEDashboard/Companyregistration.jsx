import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const NAVY = '#201E64';

const FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2';
const BTN = `inline-flex items-center justify-center h-12 px-8 rounded-none bg-[#201E64] hover:bg-[#2B2889] text-white text-sm font-semibold transition-colors ${FOCUS}`;
const BTN_OUTLINE = `inline-flex items-center justify-center h-12 px-8 rounded-none border border-neutral-300 hover:border-[#201E64] text-neutral-800 hover:text-[#201E64] text-sm font-semibold transition-colors ${FOCUS}`;

const inputCls = (err, extra = '') =>
  `w-full rounded-none border bg-white px-4 text-sm text-neutral-900 outline-none transition ${extra} ${
    err
      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15'
  }`;

const STEPS = [
  { title: 'Personal', heading: 'Personal information', text: 'Tell us about the person registering the business.' },
  { title: 'Business', heading: 'Business profile', text: 'Your company details, ownership and supporting documents.' },
  { title: 'Maturity', heading: 'Business maturity', text: 'Help us understand how established your business is.' },
  { title: 'Experience', heading: 'Previous clients', text: 'Give us up to three clients we can contact about your work.' },
  { title: 'Review', heading: 'Review and submit', text: 'Check your details before you submit your registration.' },
];

const SECTORS = [
  { id: 'agri', name: 'Agriculture' },
  { id: 'manu', name: 'Manufacturing' },
  { id: 'constr', name: 'Construction' },
  { id: 'logis', name: 'Transport and logistics' },
  { id: 'facil', name: 'Facilities and cleaning' },
  { id: 'it', name: 'IT and technology' },
  { id: 'prof', name: 'Professional services' },
  { id: 'other', name: 'Other' },
];

const REVENUE = [
  'Less than R100,000',
  'R100,000 – R500,000',
  'R500,000 – R1 million',
  'R1 million – R5 million',
  'R5 million – R10 million',
  'More than R10 million',
];

const BEE_LEVELS = [
  'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5',
  'Level 6', 'Level 7', 'Level 8', 'Non-compliant', 'Exempt micro enterprise',
];

const emptyClient = { name: '', email: '', contactNumber: '', workDone: '' };

const INITIAL = {
  // Personal information
  firstName: '', lastName: '', idNumber: '', gender: '', phone: '', email: '',

  // Business profile
  businessName: '', companyRegistrationNumber: '', businessAddress: '', community: '',
  bwoOwnership: '', boOwnership: '', beeLevel: '',
  coregDocument: null, taxPinDocument: null, beeDocument: null,
  attendedEsd: '', esdCompanyName: '',
  receivedGrant: '', grantCompanyName: '',

  // Business maturity
  sectorId: '', sectorName: '', service: '', annualRevenue: '',
  permanentEmployees: '', contractEmployees: '',
  employeesHaveContracts: '', contractsSigned: '',
  uif: '', coida: '',
  accounting: '', accountingSystemName: '',
  payroll: '', payrollExplanation: '',
  financialStatements: '',

  // Previous clients
  previousClients: [{ ...emptyClient }, { ...emptyClient }, { ...emptyClient }],
  largestContract: '',
};

/* ------------------------------ VALIDATION ------------------------------ */

const has = (v) => String(v ?? '').trim() !== '';

function validate(step, f) {
  const e = {};
  const need = (k, msg) => { if (!has(f[k])) e[k] = msg; };
  const pct = (k) => {
    const n = Number(f[k]);
    if (!has(f[k]) || Number.isNaN(n) || n < 0 || n > 100) e[k] = 'Enter a percentage from 0 to 100';
  };
  const count = (k) => {
    const n = Number(f[k]);
    if (!has(f[k]) || !Number.isInteger(n) || n < 0) e[k] = 'Enter a whole number';
  };
  const file = (k) => { if (!f[k]) e[k] = 'Upload this document'; };
  const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

  if (step === 0) {
    need('firstName', 'Enter your first name');
    need('lastName', 'Enter your surname');
    if (!/^\d{13}$/.test(f.idNumber.replace(/\s/g, ''))) e.idNumber = 'Enter a valid 13-digit ID number';
    need('gender', 'Select your gender');
    if (!/^\+?\d{9,15}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid phone number';
    if (!emailOk(f.email)) e.email = 'Enter a valid email address';
  }

  if (step === 1) {
    need('businessName', 'Enter your business name');
    need('companyRegistrationNumber', 'Enter your registration number');
    need('businessAddress', 'Enter your business address');
    need('community', 'Enter your community or town');
    pct('bwoOwnership');
    pct('boOwnership');
    need('beeLevel', 'Select your B-BBEE level');
    file('coregDocument');
    file('taxPinDocument');
    file('beeDocument');
    need('attendedEsd', 'Select an option');
    if (f.attendedEsd === 'Yes') need('esdCompanyName', 'Enter the company name');
    need('receivedGrant', 'Select an option');
    if (f.receivedGrant === 'Yes') need('grantCompanyName', 'Enter the company name');
  }

  if (step === 2) {
    need('sectorId', 'Select your sector');
    need('service', 'Describe your product or service');
    need('annualRevenue', 'Select your annual revenue');
    count('permanentEmployees');
    count('contractEmployees');
    need('employeesHaveContracts', 'Select an option');
    if (f.employeesHaveContracts === 'Yes') need('contractsSigned', 'Select an option');
    need('uif', 'Select an option');
    need('coida', 'Select an option');
    need('accounting', 'Select an option');
    if (f.accounting === 'Yes') need('accountingSystemName', 'Enter the system or accountant');
    need('payroll', 'Select an option');
    if (f.payroll === 'No') need('payrollExplanation', 'Explain how you manage payroll');
    need('financialStatements', 'Select an option');
  }

  if (step === 3) {
    f.previousClients.forEach((c, i) => {
      const started = i === 0 || Object.values(c).some(has);
      if (!started) return;
      if (!has(c.name)) e[`client${i}_name`] = 'Enter the client name';
      if (!emailOk(c.email)) e[`client${i}_email`] = 'Enter a valid email address';
      if (!has(c.contactNumber)) e[`client${i}_contactNumber`] = 'Enter a contact number';
      if (!has(c.workDone)) e[`client${i}_workDone`] = 'Describe the work done';
    });
    need('largestContract', 'Describe your largest contract');
  }

  return e;
}

/* ------------------------------ FIELD PARTS ------------------------------ */

function Field({ label, error, hint, className = '', group = false, children }) {
  const Wrapper = group ? 'div' : 'label';
  return (
    <Wrapper className={`block ${className}`} {...(group ? { role: 'group', 'aria-label': label } : {})}>
      <span className="block text-sm font-medium text-neutral-800 mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block mt-1.5 text-xs text-neutral-500">{hint}</span>}
      {error && <span className="block mt-1.5 text-xs text-red-600" role="alert">{error}</span>}
    </Wrapper>
  );
}

function TextInput({ label, error, hint, className, textarea, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {textarea ? (
        <textarea rows={3} aria-invalid={!!error} className={inputCls(error, 'py-3')} {...props} />
      ) : (
        <input aria-invalid={!!error} className={inputCls(error, 'h-12')} {...props} />
      )}
    </Field>
  );
}

function Select({ label, error, className, options, value, onChange, placeholder = 'Select' }) {
  return (
    <Field label={label} error={error} className={className}>
      <select value={value} onChange={onChange} aria-invalid={!!error} className={inputCls(error, 'h-12')}>
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </Field>
  );
}

function YesNo({ label, error, value, onChange, className }) {
  return (
    <Field label={label} error={error} className={className} group>
      <div className="grid grid-cols-2">
        {['Yes', 'No'].map((opt, i) => {
          const on = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={on}
              className={`h-12 rounded-none border text-sm font-semibold transition-colors ${FOCUS} ${i === 1 ? '-ml-px' : ''} ${
                on
                  ? 'bg-[#201E64] border-[#201E64] text-white relative z-10'
                  : `bg-white text-neutral-700 hover:bg-neutral-50 ${error ? 'border-red-500' : 'border-neutral-300'}`
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function FileField({ label, error, file, onChange }) {
  return (
    <div>
      <span className="block text-sm font-medium text-neutral-800 mb-1.5">{label}</span>
      <label
        className={`flex items-center justify-between gap-3 h-12 px-4 rounded-none border cursor-pointer bg-white hover:bg-neutral-50 transition-colors focus-within:ring-2 focus-within:ring-[#201E64] ${
          error ? 'border-red-500' : file ? 'border-[#201E64]' : 'border-dashed border-neutral-400'
        }`}
      >
        <span className={`text-sm truncate ${file ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {file ? file.name : 'No file chosen'}
        </span>
        <span className="text-sm font-semibold shrink-0" style={{ color: NAVY }}>
          {file ? 'Replace' : 'Upload'}
        </span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onChange} className="sr-only" />
      </label>
      {error && <span className="block mt-1.5 text-xs text-red-600" role="alert">{error}</span>}
    </div>
  );
}

function SubHead({ children }) {
  return (
    <h3
      className="sm:col-span-2 pt-2 pb-2 text-sm font-bold border-b border-neutral-200"
      style={{ color: NAVY }}
    >
      {children}
    </h3>
  );
}

/* ------------------------------ STEPPER ------------------------------ */

function Stepper({ current }) {
  return (
    <ol className="flex items-start" aria-label="Registration progress">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.title} className="flex-1 flex flex-col items-center relative" aria-current={active ? 'step' : undefined}>
            {i > 0 && (
              <span
                className={`absolute top-5 right-1/2 w-full h-px ${i <= current ? 'bg-[#201E64]' : 'bg-neutral-300'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-none border text-sm font-bold ${
                done || active ? 'bg-[#201E64] border-[#201E64] text-white' : 'bg-white border-neutral-300 text-neutral-500'
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : i + 1}
            </span>
            <span className={`mt-2 hidden sm:block text-xs font-semibold ${active ? 'text-[#201E64]' : 'text-neutral-500'}`}>
              {s.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------ REVIEW ------------------------------ */

function ReviewCard({ title, rows, onEdit }) {
  return (
    <section className="border border-neutral-200 rounded-none bg-white">
      <div className="flex items-center justify-between px-5 py-3 bg-neutral-50 border-b border-neutral-200">
        <h3 className="text-sm font-bold" style={{ color: NAVY }}>{title}</h3>
        <button type="button" onClick={onEdit} className={`text-xs font-semibold text-[#201E64] hover:underline ${FOCUS}`}>
          Edit
        </button>
      </div>
      <dl className="divide-y divide-neutral-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-6 px-5 py-2.5">
            <dt className="text-neutral-500">{k}</dt>
            <dd className="text-neutral-900 font-medium sm:text-right break-words">{v || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------ MAIN ------------------------------ */

export default function CompanyRegistration({ onSubmit }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const clear = (key) => setErrors((e) => ({ ...e, [key]: undefined }));
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); clear(k); };
  const setVal = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); clear(k); };
  const setFile = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.files[0] || null })); clear(k); };
  const setSector = (e) => {
    const s = SECTORS.find((x) => x.id === e.target.value);
    setForm((f) => ({ ...f, sectorId: s ? s.id : '', sectorName: s ? s.name : '' }));
    clear('sectorId');
  };
  const setClient = (i, k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      previousClients: f.previousClients.map((c, idx) => (idx === i ? { ...c, [k]: value } : c)),
    }));
    clear(`client${i}_${k}`);
  };

  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const next = () => {
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length) { top(); return; }
    setStep((s) => s + 1);
    top();
  };

  const back = () => { setErrors({}); setStep((s) => s - 1); top(); };

  const submit = () => {
    // Drop answers that no longer apply
    const payload = {
      ...form,
      esdCompanyName: form.attendedEsd === 'Yes' ? form.esdCompanyName : '',
      grantCompanyName: form.receivedGrant === 'Yes' ? form.grantCompanyName : '',
      contractsSigned: form.employeesHaveContracts === 'Yes' ? form.contractsSigned : '',
      accountingSystemName: form.accounting === 'Yes' ? form.accountingSystemName : '',
      payrollExplanation: form.payroll === 'No' ? form.payrollExplanation : '',
      previousClients: form.previousClients.filter((c) => Object.values(c).some(has)),
    };
    // Send files with FormData when you connect your API
    if (onSubmit) onSubmit(payload);
    else console.log('Registration:', payload);
    setDone(true);
    top();
  };

  const grid = 'grid grid-cols-1 sm:grid-cols-2 gap-5';
  const f = form;

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {done ? (
          <div className="bg-white border border-neutral-200 rounded-none shadow-sm p-8 sm:p-12 text-center">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-none bg-[#201E64] text-white">
              <Check className="w-7 h-7" />
            </div>
            <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: NAVY }}>
              Registration submitted
            </h1>
            <p className="mt-3 text-neutral-600 max-w-md mx-auto leading-relaxed">
              Thank you, {f.firstName}. We have received the registration for {f.businessName} and will be in touch once it has been reviewed.
            </p>
            <button type="button" onClick={() => navigate('/login')} className={`${BTN} mt-8`}>
              Go to log in
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white border border-neutral-200 rounded-none shadow-sm px-4 sm:px-8 pt-6 pb-4">
              <Stepper current={step} />
              <p className="mt-3 text-center text-xs text-neutral-500 sm:hidden">
                Step {step + 1} of {STEPS.length}: {STEPS[step].title}
              </p>
            </div>

            <div className="mt-6 bg-white border border-neutral-200 rounded-none shadow-sm p-6 sm:p-10">

              <div className="mb-8 pb-6 border-b border-neutral-200">
                <p className="text-xs font-semibold text-neutral-500">Step {step + 1} of {STEPS.length}</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: NAVY }}>
                  {STEPS[step].heading}
                </h1>
                <p className="mt-2 text-sm text-neutral-600">{STEPS[step].text}</p>
              </div>

              {Object.values(errors).some(Boolean) && (
                <div className="mb-6 border border-red-200 bg-red-50 rounded-none px-4 py-3 text-sm text-red-700" role="alert">
                  Please fix the highlighted fields to continue.
                </div>
              )}

              {/* STEP 1: PERSONAL */}
              {step === 0 && (
                <div className={grid}>
                  <TextInput label="First name" value={f.firstName} onChange={set('firstName')} error={errors.firstName} autoComplete="given-name" />
                  <TextInput label="Surname" value={f.lastName} onChange={set('lastName')} error={errors.lastName} autoComplete="family-name" />
                  <TextInput label="ID number" value={f.idNumber} onChange={set('idNumber')} error={errors.idNumber} inputMode="numeric" maxLength={13} hint="13-digit South African ID number" />
                  <Select label="Gender" value={f.gender} onChange={set('gender')} error={errors.gender} options={['Female', 'Male', 'Other', 'Prefer not to say']} />
                  <TextInput label="Phone number" type="tel" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                  <TextInput label="Email address" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                </div>
              )}

              {/* STEP 2: BUSINESS PROFILE */}
              {step === 1 && (
                <div className={grid}>
                  <TextInput label="Business name" value={f.businessName} onChange={set('businessName')} error={errors.businessName} />
                  <TextInput label="Company registration number" value={f.companyRegistrationNumber} onChange={set('companyRegistrationNumber')} error={errors.companyRegistrationNumber} placeholder="e.g. 2019/123456/07" />
                  <TextInput label="Business address" className="sm:col-span-2" value={f.businessAddress} onChange={set('businessAddress')} error={errors.businessAddress} />
                  <TextInput label="Community or town" className="sm:col-span-2" value={f.community} onChange={set('community')} error={errors.community} />

                  <SubHead>Ownership and B-BBEE</SubHead>
                  <TextInput label="Black women ownership (%)" type="number" min="0" max="100" value={f.bwoOwnership} onChange={set('bwoOwnership')} error={errors.bwoOwnership} />
                  <TextInput label="Black ownership (%)" type="number" min="0" max="100" value={f.boOwnership} onChange={set('boOwnership')} error={errors.boOwnership} />
                  <Select label="B-BBEE level" className="sm:col-span-2" value={f.beeLevel} onChange={set('beeLevel')} error={errors.beeLevel} options={BEE_LEVELS} />

                  <SubHead>Supporting documents (PDF, JPG or PNG)</SubHead>
                  <FileField label="Company registration (CoReg) document" file={f.coregDocument} onChange={setFile('coregDocument')} error={errors.coregDocument} />
                  <FileField label="Tax compliance PIN" file={f.taxPinDocument} onChange={setFile('taxPinDocument')} error={errors.taxPinDocument} />
                  <FileField label="B-BBEE certificate or affidavit" file={f.beeDocument} onChange={setFile('beeDocument')} error={errors.beeDocument} />

                  <SubHead>Previous support</SubHead>
                  <YesNo label="Have you attended an ESD programme before?" value={f.attendedEsd} onChange={setVal('attendedEsd')} error={errors.attendedEsd} />
                  {f.attendedEsd === 'Yes' && (
                    <TextInput label="Which company ran the programme?" value={f.esdCompanyName} onChange={set('esdCompanyName')} error={errors.esdCompanyName} />
                  )}
                  <YesNo label="Have you received a grant before?" value={f.receivedGrant} onChange={setVal('receivedGrant')} error={errors.receivedGrant} />
                  {f.receivedGrant === 'Yes' && (
                    <TextInput label="Which company gave the grant?" value={f.grantCompanyName} onChange={set('grantCompanyName')} error={errors.grantCompanyName} />
                  )}
                </div>
              )}

              {/* STEP 3: MATURITY */}
              {step === 2 && (
                <div className={grid}>
                  <Select label="Sector" value={f.sectorId} onChange={setSector} error={errors.sectorId} options={SECTORS.map((s) => ({ value: s.id, label: s.name }))} />
                  <TextInput label="Main product or service" value={f.service} onChange={set('service')} error={errors.service} />
                  <Select label="Annual revenue" className="sm:col-span-2" value={f.annualRevenue} onChange={set('annualRevenue')} error={errors.annualRevenue} options={REVENUE} />

                  <SubHead>Employees</SubHead>
                  <TextInput label="Permanent employees" type="number" min="0" value={f.permanentEmployees} onChange={set('permanentEmployees')} error={errors.permanentEmployees} />
                  <TextInput label="Contract employees" type="number" min="0" value={f.contractEmployees} onChange={set('contractEmployees')} error={errors.contractEmployees} />
                  <YesNo label="Do your employees have employment contracts?" value={f.employeesHaveContracts} onChange={setVal('employeesHaveContracts')} error={errors.employeesHaveContracts} />
                  {f.employeesHaveContracts === 'Yes' && (
                    <YesNo label="Are all the contracts signed?" value={f.contractsSigned} onChange={setVal('contractsSigned')} error={errors.contractsSigned} />
                  )}
                  <YesNo label="Are you registered with UIF?" value={f.uif} onChange={setVal('uif')} error={errors.uif} />
                  <YesNo label="Are you registered with COIDA?" value={f.coida} onChange={setVal('coida')} error={errors.coida} />

                  <SubHead>Finance and administration</SubHead>
                  <YesNo label="Do you use an accounting system or accountant?" value={f.accounting} onChange={setVal('accounting')} error={errors.accounting} />
                  {f.accounting === 'Yes' && (
                    <TextInput label="Which system or accountant?" value={f.accountingSystemName} onChange={set('accountingSystemName')} error={errors.accountingSystemName} />
                  )}
                  <YesNo label="Do you run a formal payroll?" value={f.payroll} onChange={setVal('payroll')} error={errors.payroll} />
                  {f.payroll === 'No' && (
                    <TextInput textarea label="How do you manage payroll?" className="sm:col-span-2" value={f.payrollExplanation} onChange={set('payrollExplanation')} error={errors.payrollExplanation} />
                  )}
                  <YesNo label="Do you have up-to-date financial statements?" value={f.financialStatements} onChange={setVal('financialStatements')} error={errors.financialStatements} />
                </div>
              )}

              {/* STEP 4: CLIENTS */}
              {step === 3 && (
                <div className="space-y-6">
                  {f.previousClients.map((c, i) => (
                    <section key={i} className="border border-neutral-200 rounded-none">
                      <h3 className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-sm font-bold" style={{ color: NAVY }}>
                        Client {i + 1} {i > 0 && <span className="font-normal text-neutral-500">(optional)</span>}
                      </h3>
                      <div className={`${grid} p-5`}>
                        <TextInput label="Client name" value={c.name} onChange={setClient(i, 'name')} error={errors[`client${i}_name`]} />
                        <TextInput label="Contact number" type="tel" value={c.contactNumber} onChange={setClient(i, 'contactNumber')} error={errors[`client${i}_contactNumber`]} />
                        <TextInput label="Email address" type="email" className="sm:col-span-2" value={c.email} onChange={setClient(i, 'email')} error={errors[`client${i}_email`]} />
                        <TextInput textarea label="Work done for this client" className="sm:col-span-2" value={c.workDone} onChange={setClient(i, 'workDone')} error={errors[`client${i}_workDone`]} />
                      </div>
                    </section>
                  ))}
                  <TextInput label="Largest contract completed" value={f.largestContract} onChange={set('largestContract')} error={errors.largestContract} hint="Include the value and a short description, e.g. R250,000 packaging supply" />
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {step === 4 && (
                <div className="space-y-5">
                  <ReviewCard title="Personal information" onEdit={() => setStep(0)} rows={[
                    ['Name', `${f.firstName} ${f.lastName}`], ['ID number', f.idNumber], ['Gender', f.gender], ['Phone', f.phone], ['Email', f.email],
                  ]} />
                  <ReviewCard title="Business profile" onEdit={() => setStep(1)} rows={[
                    ['Business name', f.businessName], ['Registration number', f.companyRegistrationNumber], ['Address', f.businessAddress], ['Community', f.community],
                    ['Black women ownership', `${f.bwoOwnership}%`], ['Black ownership', `${f.boOwnership}%`], ['B-BBEE level', f.beeLevel],
                    ['CoReg document', f.coregDocument?.name], ['Tax compliance PIN', f.taxPinDocument?.name], ['B-BBEE document', f.beeDocument?.name],
                    ['Attended ESD programme', f.attendedEsd === 'Yes' ? `Yes, ${f.esdCompanyName}` : f.attendedEsd],
                    ['Received a grant', f.receivedGrant === 'Yes' ? `Yes, ${f.grantCompanyName}` : f.receivedGrant],
                  ]} />
                  <ReviewCard title="Business maturity" onEdit={() => setStep(2)} rows={[
                    ['Sector', f.sectorName], ['Product or service', f.service], ['Annual revenue', f.annualRevenue],
                    ['Permanent employees', f.permanentEmployees], ['Contract employees', f.contractEmployees],
                    ['Employment contracts', f.employeesHaveContracts === 'Yes' ? `Yes, signed: ${f.contractsSigned}` : f.employeesHaveContracts],
                    ['UIF registered', f.uif], ['COIDA registered', f.coida],
                    ['Accounting', f.accounting === 'Yes' ? `Yes, ${f.accountingSystemName}` : f.accounting],
                    ['Formal payroll', f.payroll === 'No' ? `No, ${f.payrollExplanation}` : f.payroll],
                    ['Financial statements', f.financialStatements],
                  ]} />
                  <ReviewCard title="Previous clients" onEdit={() => setStep(3)} rows={[
                    ...f.previousClients.filter((c) => has(c.name)).map((c, i) => [`Client ${i + 1}`, `${c.name}, ${c.contactNumber}`]),
                    ['Largest contract', f.largestContract],
                  ]} />
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    By submitting, you confirm that the information and documents you have provided are true and correct.
                    Registration does not guarantee procurement opportunities, contracts or funding.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 pt-6 border-t border-neutral-200 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button type="button" onClick={back} className={BTN_OUTLINE}>Back</button>
                ) : (
                  <span />
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={next} className={BTN}>Continue</button>
                ) : (
                  <button type="button" onClick={submit} className={BTN}>Submit registration</button>
                )}
              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}