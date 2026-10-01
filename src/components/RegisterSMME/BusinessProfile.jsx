import React from 'react';

const BEE_LEVELS = [
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Level 6',
  'Level 7',
  'Level 8',
  'Non-Compliant',
];

const BusinessProfile = ({ values, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF document only.');
      return;
    }

    handleChange(field, file);
  };

  const inputClass =
    'w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-2 focus:ring-[#0A1A74]/10';

  const labelClass =
    'mb-2 block text-sm font-medium text-neutral-700';

  const sectionClass =
    'border border-neutral-200 bg-white p-6';

  return (
    <div className="space-y-8">

      {/* =========================================================
          BUSINESS INFORMATION
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Provide your business registration and address details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Business Name */}
          <div>
            <label className={labelClass}>
              Business Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={values.businessName || ''}
              onChange={(e) =>
                handleChange('businessName', e.target.value)
              }
              placeholder="Enter business name"
              className={inputClass}
            />
          </div>

          {/* Company Registration Number */}
          <div>
            <label className={labelClass}>
              Company Registration Number{' '}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={values.companyRegistrationNumber || ''}
              onChange={(e) =>
                handleChange(
                  'companyRegistrationNumber',
                  e.target.value
                )
              }
              placeholder="e.g. 2020/123456/07"
              className={inputClass}
            />
          </div>

          {/* Business Address */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Business Address <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={3}
              value={values.businessAddress || ''}
              onChange={(e) =>
                handleChange('businessAddress', e.target.value)
              }
              placeholder="Enter your full business address"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Community */}
          <div>
            <label className={labelClass}>
              Community
            </label>

            <input
              type="text"
              value={values.community || ''}
              onChange={(e) =>
                handleChange('community', e.target.value)
              }
              placeholder="Enter community"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          VERIFICATION DOCUMENTS
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Verification Documents
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Upload the required business verification documents in PDF
            format.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* COREG */}
          <DocumentUpload
            label="COREG Document"
            required
            file={values.coregDocument}
            onChange={(file) =>
              handleFileChange('coregDocument', file)
            }
          />

          {/* Tax PIN */}
          <DocumentUpload
            label="Tax PIN Document"
            required
            file={values.taxPinDocument}
            onChange={(file) =>
              handleFileChange('taxPinDocument', file)
            }
          />

          {/* BEE */}
          <DocumentUpload
            label="BEE Certificate / Affidavit"
            required
            file={values.beeDocument}
            onChange={(file) =>
              handleFileChange('beeDocument', file)
            }
          />
        </div>
      </section>

      {/* =========================================================
          B-BBEE OWNERSHIP
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            B-BBEE Ownership
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Provide the ownership percentages of the business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Black Women Ownership */}
          <div>
            <label className={labelClass}>
              Black Women Ownership (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={values.bwoOwnership || ''}
              onChange={(e) =>
                handleChange('bwoOwnership', e.target.value)
              }
              placeholder="e.g. 50"
              className={inputClass}
            />
          </div>

          {/* Black Ownership */}
          <div>
            <label className={labelClass}>
              Black Ownership (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={values.boOwnership || ''}
              onChange={(e) =>
                handleChange('boOwnership', e.target.value)
              }
              placeholder="e.g. 75"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          BEE LEVEL
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            B-BBEE Level
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Select the current B-BBEE level of your business.
          </p>
        </div>

        <div className="max-w-md">
          <label className={labelClass}>
            B-BBEE Level <span className="text-red-500">*</span>
          </label>

          <select
            value={values.beeLevel || ''}
            onChange={(e) =>
              handleChange('beeLevel', e.target.value)
            }
            className={inputClass}
          >
            <option value="">
              Select B-BBEE level
            </option>

            {BEE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* =========================================================
          ESD PROGRAMME
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            ESD Programme
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Tell us about your previous participation in an Enterprise
            and Supplier Development programme.
          </p>
        </div>

        <div className="space-y-6">

          <div>
            <label className={labelClass}>
              Have you previously attended an ESD programme?
            </label>

            <YesNoButton
              value={values.attendedEsd}
              onChange={(value) =>
                handleChange('attendedEsd', value)
              }
            />
          </div>

          {values.attendedEsd === 'Yes' && (
            <div>
              <label className={labelClass}>
                ESD Company / Institution
              </label>

              <input
                type="text"
                value={values.esdCompanyName || ''}
                onChange={(e) =>
                  handleChange(
                    'esdCompanyName',
                    e.target.value
                  )
                }
                placeholder="Enter company or institution name"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          GRANT / LOAN
      ========================================================= */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Grant / Loan
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Provide information about any previous grants or loans
            received by the business.
          </p>
        </div>

        <div className="space-y-6">

          <div>
            <label className={labelClass}>
              Have you previously received a grant or loan?
            </label>

            <YesNoButton
              value={values.receivedGrant}
              onChange={(value) =>
                handleChange('receivedGrant', value)
              }
            />
          </div>

          {values.receivedGrant === 'Yes' && (
            <div>
              <label className={labelClass}>
                Grant / Loan Institution
              </label>

              <input
                type="text"
                value={values.grantCompanyName || ''}
                onChange={(e) =>
                  handleChange(
                    'grantCompanyName',
                    e.target.value
                  )
                }
                placeholder="Enter institution name"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


/* =============================================================
   DOCUMENT UPLOAD COMPONENT
============================================================= */

const DocumentUpload = ({
  label,
  required = false,
  file,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}{' '}
        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      <div className="border border-neutral-300 bg-white">

        <label
          htmlFor={`upload-${label}`}
          className="flex cursor-pointer flex-col items-center justify-center px-4 py-8 text-center transition-colors hover:bg-neutral-50"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center border border-neutral-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#0A1A74]"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <span className="text-sm font-medium text-neutral-700">
            {file ? 'Change document' : 'Upload PDF'}
          </span>

          <span className="mt-1 text-xs text-neutral-500">
            PDF only
          </span>

          <input
            id={`upload-${label}`}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) =>
              onChange(e.target.files?.[0] || null)
            }
          />
        </label>

        {file && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="truncate text-sm text-neutral-700">
              <span className="font-medium">
                Selected:
              </span>{' '}
              {file.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


/* =============================================================
   YES / NO BUTTON
============================================================= */

const YesNoButton = ({ value, onChange }) => {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange('Yes')}
        className={`rounded-none border px-6 py-3 text-sm font-medium transition-all ${
          value === 'Yes'
            ? 'border-[#0A1A74] bg-[#0A1A74] text-white'
            : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0A1A74]'
        }`}
      >
        Yes
      </button>

      <button
        type="button"
        onClick={() => onChange('No')}
        className={`rounded-none border px-6 py-3 text-sm font-medium transition-all ${
          value === 'No'
            ? 'border-[#0A1A74] bg-[#0A1A74] text-white'
            : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0A1A74]'
        }`}
      >
        No
      </button>
    </div>
  );
};

export default BusinessProfile;