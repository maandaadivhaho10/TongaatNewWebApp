import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonalInformation from './FarmerPersonaInfor';
import FarmDetails from './FarmDetails';
import BusinessProfile from './FarmerBissnessProfile';

const STEPS = [
  {
    title: 'Personal information',
    subtitle: 'Tell us about yourself.',
  },
  {
    title: 'Farm Details & Location',
    subtitle: 'Tell us about your farm and its location.',
  },
  {
    title: 'Business Profile',
    subtitle: 'Tell us about your farming business.',
  },
];

export default function FarmerRegistration() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =====================================================
  // FARMER REGISTRATION DATA
  // =====================================================

  const [values, setValues] = useState({

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    firstName: '',
    lastName: '',
    idNumber: '',
    gender: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',

    // =====================================================
    // FARM DETAILS
    // =====================================================

    farmName: '',
    farmSize: '',
    farmLocation: '',
    closestMill: '',

    // =====================================================
    // BUSINESS PROFILE
    // =====================================================

    businessName: '',
    companyRegistrationNumber: '',
    businessAddress: '',
    community: '',

    bwoOwnership: '',
    boOwnership: '',
    beeLevel: '',

    coregDocument: null,
    taxPinDocument: null,
    beeDocument: null,

    attendedEsd: '',
    esdCompanyName: '',

    receivedGrant: '',
    grantCompanyName: '',
  });

  // =====================================================
  // UPDATE VALUES
  // =====================================================

  const updateValues = (data) => {
    setValues((previous) => ({
      ...previous,
      ...data,
    }));
  };

  // =====================================================
  // NEXT STEP
  // =====================================================

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep((previous) => previous + 1);
    }
  };

  // =====================================================
  // PREVIOUS STEP
  // =====================================================

  const previousStep = () => {
    if (step > 0) {
      setStep((previous) => previous - 1);
    } else {
      navigate('/select-user-type');
    }
  };

  // =====================================================
  // USER DATA
  // =====================================================

  const getUserData = () => {
    return {
      first_name: values.firstName,
      last_name: values.lastName,
      id_number: values.idNumber,
      gender: values.gender,
      phone_number: values.phone,
      email: values.email,
      province: values.province,
      city: values.city,
      address: values.address,
      postal_code: values.postalCode,

      // Farmer role
      role_id: 1,
    };
  };

  // =====================================================
  // FARM DATA
  // =====================================================

  const getFarmData = () => {
    return {
      farm_name: values.farmName,

      farm_size: values.farmSize
        ? Number(values.farmSize)
        : null,

      farm_size_unit: 'hectares',

      location:
        values.farmLocation || null,

      closest_milling:
        values.closestMill || null,
    };
  };

  // =====================================================
  // BUSINESS PROFILE DATA
  // =====================================================

  const getBusinessProfileData = () => {
    return {
      business_name:
        values.businessName || null,

      company_registration_number:
        values.companyRegistrationNumber || null,

      bwo_ownership_percentage:
        Number(values.bwoOwnership) || null,

      bo_ownership_percentage:
        Number(values.boOwnership) || null,

      bee_level:
        values.beeLevel || null,

      business_address:
        values.businessAddress || null,

      community:
        values.community || null,

      attended_esd_program:
        values.attendedEsd === 'Yes',

      esd_institution:
        values.attendedEsd === 'Yes'
          ? values.esdCompanyName || null
          : null,

      received_grant_or_loan:
        values.receivedGrant === 'Yes',

      grant_loan_institution:
        values.receivedGrant === 'Yes'
          ? values.grantCompanyName || null
          : null,
    };
  };

  // =====================================================
  // SUBMIT FARMER REGISTRATION
  // =====================================================

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const userData = getUserData();
      const farmData = getFarmData();
      const businessProfileData =
        getBusinessProfileData();

      console.log(
        '===================================='
      );

      console.log(
        'FARMER REGISTRATION DATA'
      );

      console.log(
        '===================================='
      );

      console.log(
        'User:',
        userData
      );

      console.log(
        'Farm:',
        farmData
      );

      console.log(
        'Business Profile:',
        businessProfileData
      );

      console.log(
        'Documents:',
        {
          coregDocument:
            values.coregDocument,

          taxPinDocument:
            values.taxPinDocument,

          beeDocument:
            values.beeDocument,
        }
      );

      console.log(
        '===================================='
      );

      // =====================================================
      // FORM DATA
      // =====================================================

      const formData = new FormData();

      formData.append(
        'user',
        JSON.stringify(userData)
      );

      formData.append(
        'farm',
        JSON.stringify(farmData)
      );

      formData.append(
        'businessProfile',
        JSON.stringify(
          businessProfileData
        )
      );

      // =====================================================
      // DOCUMENTS
      // =====================================================

      if (values.coregDocument) {
        formData.append(
          'documents',
          values.coregDocument
        );
      }

      if (values.taxPinDocument) {
        formData.append(
          'documents',
          values.taxPinDocument
        );
      }

      if (values.beeDocument) {
        formData.append(
          'documents',
          values.beeDocument
        );
      }

      // =====================================================
      // API
      // =====================================================

      /*
      const response = await fetch(
        'http://localhost:5000/api/farmer/register',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Farmer registration failed.'
        );
      }

      console.log(
        'Registration response:',
        result
      );

      navigate(
        `/otp-verification/${result.user_id}`
      );
      */

      // =====================================================
      // TEMPORARY
      // =====================================================

      console.log(
        'Farmer FormData prepared successfully.'
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1000)
      );

      alert(
        'Farmer registration data is ready to be submitted.'
      );

    } catch (error) {

      console.error(
        'Farmer registration error:',
        error
      );

      alert(
        error.message ||
        'Farmer registration failed.'
      );

    } finally {

      setIsSubmitting(false);

    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-neutral-50 text-neutral-900">

      <div className="flex h-full items-center justify-center px-4 py-4 sm:px-6">

        <div className="flex h-[calc(100vh-2rem)] max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="shrink-0 border-b border-neutral-200 px-5 py-4 sm:px-8">

            <div className="flex items-center justify-between">

              <button
                type="button"
                onClick={previousStep}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                ← Back
              </button>

              <span className="text-sm font-medium text-neutral-500">
                Step {step + 1} of {STEPS.length}
              </span>

            </div>

            {/* =================================================
                PROGRESS
            ================================================== */}

            <div className="mt-4 flex gap-2">

              {STEPS.map((_, index) => (

                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= step
                      ? 'bg-[#0A1A74]'
                      : 'bg-neutral-200'
                  }`}
                />

              ))}

            </div>

            {/* =================================================
                TITLE
            ================================================== */}

            <div className="mt-4">

              <h1 className="text-xl font-semibold text-neutral-900">
                {STEPS[step].title}
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                {STEPS[step].subtitle}
              </p>

            </div>

          </div>

          {/* =================================================
              BODY
          ================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">

            {/* PERSONAL INFORMATION */}

            {step === 0 && (
              <PersonalInformation
                values={values}
                onChange={updateValues}
              />
            )}

            {/* FARM DETAILS */}

            {step === 1 && (
              <FarmDetails
                values={values}
                onChange={updateValues}
              />
            )}

            {/* BUSINESS PROFILE */}

            {step === 2 && (
              <BusinessProfile
                values={values}
                onChange={updateValues}
              />
            )}

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="flex shrink-0 items-center justify-between border-t border-neutral-200 px-5 py-4 sm:px-8">

            {/* BACK */}

            <button
              type="button"
              onClick={previousStep}
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Back
            </button>

            {/* NEXT / SUBMIT */}

            {step < STEPS.length - 1 ? (

              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-[#0A1A74] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#08155f]"
              >
                Next
              </button>

            ) : (

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#0A1A74] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#08155f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit Registration'}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}