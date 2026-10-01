import React, { useState } from 'react';

const ACCENT_BLUE = '#0A1A74';

function ReviewSubmit({
  values,
  onBack,
  onSubmit,
  isLoading = false,
}) {
  const [error, setError] = useState('');

  const user = {
    firstName: values.firstName,
    lastName: values.lastName,
    idNumber: values.idNumber,
    gender: values.gender,
    phone: values.phone,
    email: values.email,
    province: values.province,
    city: values.city,
    address: values.address,
    postalCode: values.postalCode,
    roleId: 2,
  };

  const business = {
    businessName: values.businessName,
    companyRegistrationNumber: values.companyRegistrationNumber,
    bwoOwnership: values.bwoOwnership,
    boOwnership: values.boOwnership,
    beeLevel: values.beeLevel,
    businessAddress: values.businessAddress,
    community: values.community,
    attendedEsd: values.attendedEsd,
    esdCompanyName: values.esdCompanyName,
    receivedGrant: values.receivedGrant,
    grantCompanyName: values.grantCompanyName,
  };

  const maturity = {
    sectorId: values.sectorId,
    sectorName: values.sectorName,
    service: values.service,
    numberOfEmployees:
      Number(values.permanentEmployees || 0) +
      Number(values.contractEmployees || 0),
    permanentEmployees: values.permanentEmployees,
    contractEmployees: values.contractEmployees,
    employeesHaveContracts: values.employeesHaveContracts,
    contractsSigned: values.contractsSigned,
    annualRevenue: values.annualRevenue,
    uif: values.uif,
    coida: values.coida,
    accounting: values.accounting,
    accountingSystemName: values.accountingSystemName,
    financialStatements: values.financialStatements,
    financialStatementsYears:
      values.financialStatements === 'Yes' ? 2 : 0,
    hasBusinessSystems:
      values.accounting === 'Yes' || values.payroll === 'Yes',
    hasOrganisationStructure: false,
    rolesClearlyDefined: false,
    payroll: values.payroll,
    payrollExplanation: values.payrollExplanation,
    largestContract: values.largestContract,
  };

  const clients = values.previousClients || [];

  const documents = [
    {
      name: 'CIPC Registration Document',
      file: values.coregDocument,
    },
    {
      name: 'Tax PIN Document',
      file: values.taxPinDocument,
    },
    {
      name: 'B-BBEE Certificate / Affidavit',
      file: values.beeDocument,
    },
  ];

  const handleSubmit = async () => {
    setError('');

    try {
      await onSubmit();
    } catch (err) {
      setError(
        err?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: ACCENT_BLUE }}
              >
                Review & Submit
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Review your information before submitting your registration.
              </p>
            </div>

            <div
              className="flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold"
              style={{ backgroundColor: ACCENT_BLUE }}
            >
              4
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2
            className="text-2xl font-bold"
            style={{ color: ACCENT_BLUE }}
          >
            Review Your Information
          </h2>

          <p className="text-gray-500 mt-2">
            Please check that all your information is correct before
            submitting your registration.
          </p>
        </div>

        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <ReviewSectionCard title="Personal Information">

          <ReviewItem
            label="First Name"
            value={user.firstName}
          />

          <ReviewItem
            label="Last Name"
            value={user.lastName}
          />

          <ReviewItem
            label="ID Number"
            value={user.idNumber}
          />

          <ReviewItem
            label="Gender"
            value={user.gender}
          />

          <ReviewItem
            label="Phone Number"
            value={user.phone}
          />

          <ReviewItem
            label="Email"
            value={user.email}
          />

          <ReviewItem
            label="Province"
            value={user.province}
          />

          <ReviewItem
            label="City"
            value={user.city}
          />

          <ReviewItem
            label="Address"
            value={user.address}
          />

          <ReviewItem
            label="Postal Code"
            value={user.postalCode}
          />

          <ReviewItem
            label="Role"
            value="Supplier / SMME"
          />

        </ReviewSectionCard>

        {/* =====================================================
            BUSINESS PROFILE
        ===================================================== */}

        <ReviewSectionCard title="Business Profile">

          <ReviewItem
            label="Business Name"
            value={business.businessName}
          />

          <ReviewItem
            label="Company Registration Number"
            value={business.companyRegistrationNumber}
          />

          <ReviewItem
            label="BWO Ownership"
            value={
              business.bwoOwnership
                ? `${business.bwoOwnership}%`
                : null
            }
          />

          <ReviewItem
            label="BO Ownership"
            value={
              business.boOwnership
                ? `${business.boOwnership}%`
                : null
            }
          />

          <ReviewItem
            label="B-BBEE Level"
            value={business.beeLevel}
          />

          <ReviewItem
            label="Business Address"
            value={business.businessAddress}
          />

          <ReviewItem
            label="Community"
            value={business.community}
          />

          <ReviewItem
            label="Attended ESD Programme"
            value={business.attendedEsd}
          />

          {business.attendedEsd === 'Yes' && (
            <ReviewItem
              label="ESD Institution"
              value={business.esdCompanyName}
            />
          )}

          <ReviewItem
            label="Received Grant / Loan"
            value={business.receivedGrant}
          />

          {business.receivedGrant === 'Yes' && (
            <ReviewItem
              label="Grant / Loan Institution"
              value={business.grantCompanyName}
            />
          )}

        </ReviewSectionCard>

        {/* =====================================================
            BUSINESS MATURITY
        ===================================================== */}

        <ReviewSectionCard title="Business Maturity">

          <ReviewItem
            label="Sector"
            value={
              maturity.sectorName ||
              maturity.sectorId
            }
          />

          <ReviewItem
            label="Services"
            value={maturity.service}
          />

          <ReviewItem
            label="Number of Employees"
            value={maturity.numberOfEmployees}
          />

          <ReviewItem
            label="Permanent Employees"
            value={maturity.permanentEmployees}
          />

          <ReviewItem
            label="Contract Employees"
            value={maturity.contractEmployees}
          />

          <ReviewItem
            label="Employees Have Contracts"
            value={maturity.employeesHaveContracts}
          />

          <ReviewItem
            label="Contracts Signed"
            value={
              maturity.employeesHaveContracts === 'Yes'
                ? maturity.contractsSigned
                : null
            }
          />

          <ReviewItem
            label="Annual Revenue"
            value={maturity.annualRevenue}
          />

          <ReviewItem
            label="Registered With UIF"
            value={maturity.uif}
          />

          <ReviewItem
            label="Registered With COIDA"
            value={maturity.coida}
          />

          <ReviewItem
            label="Business Systems"
            value={maturity.hasBusinessSystems ? 'Yes' : 'No'}
          />

          <ReviewItem
            label="Accounting System"
            value={maturity.accounting}
          />

          {maturity.accounting === 'Yes' && (
            <ReviewItem
              label="Accounting System Name"
              value={maturity.accountingSystemName}
            />
          )}

          <ReviewItem
            label="Can Produce Financial Statements"
            value={maturity.financialStatements}
          />

          {maturity.financialStatements === 'Yes' && (
            <ReviewItem
              label="Financial Statement Years"
              value={maturity.financialStatementsYears}
            />
          )}

          <ReviewItem
            label="Organisation Structure"
            value={
              maturity.hasOrganisationStructure
                ? 'Yes'
                : 'No'
            }
          />

          <ReviewItem
            label="Roles Clearly Defined"
            value={
              maturity.rolesClearlyDefined
                ? 'Yes'
                : 'No'
            }
          />

          <ReviewItem
            label="Payroll"
            value={maturity.payroll}
          />

          {maturity.payroll === 'Yes' && (
            <ReviewItem
              label="Payroll Description"
              value={maturity.payrollExplanation}
            />
          )}

          <ReviewItem
            label="Largest Contract Value"
            value={
              maturity.largestContract
                ? `R ${maturity.largestContract}`
                : null
            }
          />

        </ReviewSectionCard>

        {/* =====================================================
            PREVIOUS CLIENTS
        ===================================================== */}

        <ReviewSectionCard title="Previous Clients">

          {clients.length === 0 ? (

            <p className="text-sm text-gray-500">
              No previous clients added.
            </p>

          ) : (

            <div className="space-y-6">

              {clients.map((client, index) => (

                <div
                  key={client.id || index}
                  className="border border-gray-200 rounded-xl p-5"
                >

                  <h3
                    className="font-semibold mb-4"
                    style={{ color: ACCENT_BLUE }}
                  >
                    Client {index + 1}
                  </h3>

                  <ReviewItem
                    label="Client Name"
                    value={client.name || client.client_name}
                  />

                  <ReviewItem
                    label="Contact Number"
                    value={
                      client.contactNumber ||
                      client.contact_number
                    }
                  />

                  <ReviewItem
                    label="Email"
                    value={client.email}
                  />

                  <ReviewItem
                    label="Work Done"
                    value={client.workDone || client.work_done}
                  />

                </div>

              ))}

            </div>

          )}

        </ReviewSectionCard>

        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        <ReviewSectionCard title="Documents">

          <ReviewItem
            label="Documents Uploaded"
            value={`${documents.filter((doc) => doc.file).length}`}
          />

          <div className="mt-4 space-y-3">

            {documents.map((document, index) => (

              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
              >

                <div>
                  <p className="font-medium text-gray-800">
                    {document.name}
                  </p>

                  {document.file ? (
                    <p className="text-sm text-gray-500 mt-1">
                      {document.file.name}
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 mt-1">
                      Not uploaded
                    </p>
                  )}
                </div>

                <div
                  className={`w-3 h-3 rounded-full ${
                    document.file
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />

              </div>

            ))}

          </div>

        </ReviewSectionCard>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 pb-10">

          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full sm:w-1/2 h-12 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-1/2 h-12 rounded-xl text-white font-semibold transition disabled:opacity-60 flex items-center justify-center gap-3"
            style={{
              backgroundColor: ACCENT_BLUE,
            }}
          >

            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>
                  Submitting...
                </span>
              </>
            ) : (
              'Submit Registration'
            )}

          </button>

        </div>

      </div>
    </div>
  );
}


/* ============================================================
   REVIEW SECTION CARD
============================================================ */

function ReviewSectionCard({
  title,
  children,
}) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

      <h2
        className="text-lg font-bold mb-5"
        style={{ color: ACCENT_BLUE }}
      >
        {title}
      </h2>

      {children}

    </div>
  );
}


/* ============================================================
   REVIEW ITEM
============================================================ */

function ReviewItem({
  label,
  value,
}) {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3 border-b border-gray-100 last:border-0">

      <div className="text-sm font-semibold text-gray-500">
        {label}
      </div>

      <div className="text-sm text-gray-900 break-words">
        {String(value)}
      </div>

    </div>
  );
}


export default ReviewSubmit;