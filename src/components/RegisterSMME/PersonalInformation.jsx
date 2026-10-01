import React from 'react';
import {
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Building2,
  Hash,
} from 'lucide-react';

const GENDERS = [
  'Male',
  'Female',
  'Other',
];

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const inputClass =
  'peer w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder-transparent hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-2 focus:ring-[#0A1A74]/10';

const selectClass =
  'w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-2 focus:ring-[#0A1A74]/10';

function FieldIcon({ children }) {
  return (
    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors peer-focus:text-[#0A1A74]">
      {children}
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  icon,
}) {
  return (
    <div className="relative">
      {icon && <FieldIcon>{icon}</FieldIcon>}

      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || label}
        maxLength={maxLength}
        className={`${inputClass} ${icon ? 'pl-11' : ''}`}
      />

      <label
        className={`pointer-events-none absolute ${
          icon ? 'left-11' : 'left-4'
        } top-1/2 -translate-y-1/2 bg-transparent px-1 text-sm text-neutral-500 transition-all duration-200
        peer-placeholder-shown:top-1/2
        peer-placeholder-shown:-translate-y-1/2
        peer-placeholder-shown:text-sm
        peer-focus:top-0
        peer-focus:-translate-y-1/2
        peer-focus:bg-white
        peer-focus:text-xs
        peer-focus:font-medium
        peer-focus:text-[#0A1A74]
        ${
          value
            ? 'top-0 -translate-y-1/2 bg-white text-xs font-medium text-neutral-600'
            : ''
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export default function PersonalInformation({
  values,
  onChange,
}) {
  const updateField = (field, value) => {
    onChange({
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0A1A74]/10">
          <User className="h-5 w-5 text-[#0A1A74]" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          About You
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Tell us about yourself so we can create your business profile.
        </p>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-900">
            Personal Information
          </h3>

          <p className="mt-1 text-xs text-neutral-500">
            Enter your personal details exactly as they appear on your ID.
          </p>
        </div>

        {/* NAME */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <FloatingInput
            label="First Name"
            value={values.firstName}
            onChange={(e) =>
              updateField('firstName', e.target.value)
            }
            placeholder="Enter first name"
            icon={<User className="h-4 w-4" />}
          />

          <FloatingInput
            label="Last Name"
            value={values.lastName}
            onChange={(e) =>
              updateField('lastName', e.target.value)
            }
            placeholder="Enter last name"
            icon={<User className="h-4 w-4" />}
          />

        </div>

        {/* ID + GENDER */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

          <FloatingInput
            label="ID Number"
            value={values.idNumber}
            onChange={(e) =>
              updateField('idNumber', e.target.value)
            }
            placeholder="Enter ID number"
            maxLength={13}
            icon={<CreditCard className="h-4 w-4" />}
          />

          <div className="relative">

            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-400">
              <User className="h-4 w-4" />
            </div>

            <select
              value={values.gender || ''}
              onChange={(e) =>
                updateField('gender', e.target.value)
              }
              className={`${selectClass} pl-11`}
            >
              <option value="">Select gender</option>

              {GENDERS.map((gender) => (
                <option
                  key={gender}
                  value={gender}
                >
                  {gender}
                </option>
              ))}
            </select>

            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-neutral-600">
              Gender
            </label>

          </div>

        </div>

        {/* CONTACT */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

          <FloatingInput
            label="Phone Number"
            value={values.phone}
            onChange={(e) =>
              updateField('phone', e.target.value)
            }
            placeholder="082 123 4567"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
          />

          <FloatingInput
            label="Email Address"
            value={values.email}
            onChange={(e) =>
              updateField('email', e.target.value)
            }
            placeholder="name@example.com"
            type="email"
            icon={<Mail className="h-4 w-4" />}
          />

        </div>

      </div>

      {/* LOCATION */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6 flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A1A74]/10">
            <MapPin className="h-5 w-5 text-[#0A1A74]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Location
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              Provide the location where your business operates.
            </p>
          </div>

        </div>

        {/* PROVINCE + CITY */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div className="relative">

            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-400">
              <MapPin className="h-4 w-4" />
            </div>

            <select
              value={values.province || ''}
              onChange={(e) =>
                updateField('province', e.target.value)
              }
              className={`${selectClass} pl-11`}
            >
              <option value="">Select province</option>

              {PROVINCES.map((province) => (
                <option
                  key={province}
                  value={province}
                >
                  {province}
                </option>
              ))}
            </select>

            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-neutral-600">
              Province
            </label>

          </div>

          <FloatingInput
            label="City"
            value={values.city}
            onChange={(e) =>
              updateField('city', e.target.value)
            }
            placeholder="Enter city"
            icon={<Building2 className="h-4 w-4" />}
          />

        </div>

        {/* ADDRESS */}
        <div className="relative mt-5">

          <textarea
            value={values.address || ''}
            onChange={(e) =>
              updateField('address', e.target.value)
            }
            placeholder="Enter your address"
            rows={3}
            className={`${inputClass} resize-none pt-4`}
          />

          <label
            className={`pointer-events-none absolute left-4 top-4 bg-transparent px-1 text-sm text-neutral-500 transition-all duration-200
            peer-focus:top-0
            peer-focus:bg-white
            peer-focus:text-xs
            peer-focus:font-medium
            peer-focus:text-[#0A1A74]
            ${
              values.address
                ? 'top-0 bg-white text-xs font-medium text-neutral-600'
                : ''
            }`}
          >
            Address
          </label>

        </div>

        {/* POSTAL CODE */}
        <div className="mt-5 sm:w-1/2">

          <FloatingInput
            label="Postal Code"
            value={values.postalCode}
            onChange={(e) =>
              updateField('postalCode', e.target.value)
            }
            placeholder="Enter postal code"
            icon={<Hash className="h-4 w-4" />}
          />

        </div>

      </div>

      {/* INFORMATION NOTICE */}
      <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">

        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#0A1A74]" />

        <p className="text-xs leading-5 text-neutral-500">
          Please make sure your information is accurate. This information
          will be used to create and verify your business profile.
        </p>

      </div>

    </div>
  );
}