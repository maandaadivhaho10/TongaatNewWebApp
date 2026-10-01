import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonalInformation from './PersonalInformation';
import BusinessProfile from './BusinessProfile';
import BusinessMaturity from './BusinessMaturity';
import ReviewSubmit from './SMMEReviewSubmit';

const STEPS = [
  {
    title: 'Personal information',
    subtitle: 'Tell us about yourself.',
  },
  {
    title: 'Business & BEE Profile',
    subtitle: 'Tell us about your business.',
  },
  {
    title: 'Business Maturity Assessment',
    subtitle: 'Tell us about your business capacity.',
  },
  {
    title: 'Review & Submit',
    subtitle: 'Review your information before submitting.',
  },
];

const createInitialClient = () => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  contactNumber: '',
  workDone: '',
});

export default function SMMEregistration() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // =====================================================
    // BUSINESS MATURITY
    // =====================================================

    sectorId: '',
    sectorName: '',
    service: '',
    annualRevenue: '',

    permanentEmployees: '',
    contractEmployees: '',

    employeesHaveContracts: '',
    contractsSigned: '',

    uif: '',
    coida: '',

    accounting: '',
    accountingSystemName: '',

    payroll: '',
    payrollExplanation: '',

    financialStatements: '',

    previousClients: [
      createInitialClient(),
    ],

    largestContract: '',
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
  // ANNUAL REVENUE
  // =====================================================

  const getAnnualRevenueValue = () => {
    const revenueMap = {
      'R1k – R50k': 25000,
      'R60k – R250k': 155000,
      'R260k – R500k': 380000,
      'R500k – R1M': 750000,
      'R1M – R5M': 3000000,
      'R5M – R10M': 7500000,
    };

    return revenueMap[values.annualRevenue] || null;
  };

  // =====================================================
  // LARGEST CONTRACT
  // =====================================================

  const getLargestContractValue = () => {
    if (!values.largestContract) {
      return null;
    }

    const cleaned = values.largestContract
      .toString()
      .replace(/[^0-9.]/g, '');

    return Number(cleaned) || null;
  };

  // =====================================================
  // TOTAL EMPLOYEES
  // =====================================================

  const getTotalEmployees = () => {
    const permanent =
      Number(values.permanentEmployees) || 0;

    const contract =
      Number(values.contractEmployees) || 0;

    return permanent + contract;
  };

  // =====================================================
  // BUSINESS MATURITY DATA
  // =====================================================

  const getMaturityData = () => {
    return {
      sector_id: values.sectorId
        ? Number(values.sectorId)
        : null,

      services:
        values.service || null,

      number_of_employees:
        getTotalEmployees(),

      permanent_employees:
        Number(values.permanentEmployees) || 0,

      contract_employees:
        Number(values.contractEmployees) || 0,

      employees_have_contracts:
        values.employeesHaveContracts === 'Yes',

      contracts_signed:
        values.contractsSigned === 'Yes',

      annual_revenue:
        getAnnualRevenueValue(),

      registered_with_uif:
        values.uif === 'Yes',

      registered_with_coida:
        values.coida === 'Yes',

      has_business_systems:
        values.accounting === 'Yes' ||
        values.payroll === 'Yes',

      has_accounting_system:
        values.accounting === 'Yes',

      accounting_system_name:
        values.accountingSystemName || null,

      can_produce_financial_statements:
        values.financialStatements === 'Yes',

      financial_statements_years:
        values.financialStatements === 'Yes'
          ? 2
          : 0,

      has_organisation_structure:
        false,

      roles_clearly_defined:
        false,

      has_payroll:
        values.payroll === 'Yes',

      payroll_management_description:
        values.payrollExplanation || null,

      largest_contract_value:
        getLargestContractValue(),
    };
  };

  // =====================================================
  // CLIENT REFERENCES
  // =====================================================

  const getClientReferences = () => {
    return values.previousClients
      .filter(
        (client) =>
          client.name?.trim() &&
          client.email?.trim() &&
          client.contactNumber?.trim() &&
          client.workDone?.trim()
      )
      .map((client) => ({
        client_name: client.name,
        contact_number:
          client.contactNumber || null,
        email:
          client.email || null,
        work_done:
          client.workDone || null,
      }));
  };

  // =====================================================
  // USER DATA
  // =====================================================

  const getUserData = () => {
    return {
      first_name:
        values.firstName,

      last_name:
        values.lastName,

      id_number:
        values.idNumber,

      gender:
        values.gender,

      phone_number:
        values.phone,

      email:
        values.email,

      province:
        values.province,

      city:
        values.city,

      address:
        values.address,

      postal_code:
        values.postalCode,

      role_id: 2,
    };
  };

  // =====================================================
  // BUSINESS PROFILE DATA
  // =====================================================

  const getBusinessProfileData = () => {
    return {
      business_name:
        values.businessName,

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
  // SUBMIT REGISTRATION
  // =====================================================

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const userData = getUserData();

      const businessProfileData =
        getBusinessProfileData();

      const maturityData =
        getMaturityData();

      const clientReferences =
        getClientReferences();

      console.log(
        '===================================='
      );

      console.log(
        'SMME REGISTRATION DATA'
      );

      console.log(
        '===================================='
      );

      console.log(
        'User:',
        userData
      );

      console.log(
        'Business Profile:',
        businessProfileData
      );

      console.log(
        'Business Maturity:',
        maturityData
      );

      console.log(
        'Client References:',
        clientReferences
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
        'businessProfile',
        JSON.stringify(
          businessProfileData
        )
      );

      formData.append(
        'businessMaturity',
        JSON.stringify(
          maturityData
        )
      );

      formData.append(
        'clientReferences',
        JSON.stringify(
          clientReferences
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
        'http://localhost:5000/api/smme/register',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Registration failed.'
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
        'FormData prepared successfully.'
      );

      // Remove this when API is connected.
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1000)
      );

      alert(
        'Registration data is ready to be submitted.'
      );

    } catch (error) {

      console.error(
        'Registration error:',
        error
      );

      alert(
        error.message ||
        'Registration failed.'
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

            {step === 0 && (
              <PersonalInformation
                values={values}
                onChange={updateValues}
              />
            )}

            {step === 1 && (
              <BusinessProfile
                values={values}
                onChange={updateValues}
              />
            )}

            {step === 2 && (
              <BusinessMaturity
                values={values}
                onChange={updateValues}
              />
            )}

            {step === 3 && (
              <ReviewSubmit
                values={values}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            )}

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          {step !== 3 && (
            <div className="flex shrink-0 items-center justify-between border-t border-neutral-200 px-5 py-4 sm:px-8">

              <button
                type="button"
                onClick={previousStep}
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-[#0A1A74] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#08155f]"
              >
                Next
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}