import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { TextInput, Select, SectorSelect, YesNo, FileField, SubHead } from "./RegistrationFields";
import { BEE_LEVELS, REVENUE, FOCUS, NAVY, PROFILE_FILE_MB, MATURITY_FILE_MB } from "./registrationConfig";

export default function RegistrationSteps({ step, f, errors, set, setVal, setFile, setSector, setForm, clear, setClient, addClient, removeClient, grid }) {
  return (
    <>
      {/* ============================================
          STEP 1 - PERSONAL
      ============================================ */}
      {step === 0 && (
        <div className={grid}>
          <TextInput
            readOnly
            label="First name"
            value={f.firstName}
            onChange={set("firstName")}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <TextInput
            readOnly
            label="Surname"
            value={f.lastName}
            onChange={set("lastName")}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <TextInput
            readOnly
            label="ID number"
            value={f.idNumber}
            onChange={set("idNumber")}
            error={errors.idNumber}
            inputMode="numeric"
            maxLength={13}
            hint="13-digit South African ID number"
          />
          <TextInput
            readOnly
            label="Gender"
            value={f.gender}
            onChange={set("gender")}
            error={errors.gender}
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
            onChange={set("businessName")}
            error={errors.businessName}
          />
          <TextInput
            label="Company registration number"
            value={f.companyRegistrationNumber}
            onChange={set("companyRegistrationNumber")}
            error={errors.companyRegistrationNumber}
            placeholder="e.g. 2019/123456/07"
          />
          <TextInput
            label="Business address"
            className="sm:col-span-2"
            value={f.businessAddress}
            onChange={set("businessAddress")}
            error={errors.businessAddress}
          />
          <TextInput
            label="Community or town"
            className="sm:col-span-2"
            value={f.community}
            onChange={set("community")}
            error={errors.community}
          />
          <SubHead>Ownership and B-BBEE</SubHead>
          <TextInput
            label="Black women ownership (%)"
            type="number"
            min="0"
            max="100"
            value={f.bwoOwnership}
            onChange={set("bwoOwnership")}
            error={errors.bwoOwnership}
          />
          <TextInput
            label="Black ownership (%)"
            type="number"
            min="0"
            max="100"
            value={f.boOwnership}
            onChange={set("boOwnership")}
            error={errors.boOwnership}
          />
          <Select
            label="B-BBEE level"
            className="sm:col-span-2"
            value={f.beeLevel}
            onChange={set("beeLevel")}
            error={errors.beeLevel}
            options={BEE_LEVELS}
          />
          <SubHead>Supporting documents (PDF only)</SubHead>
          <FileField
            label="Company registration (CoReg) document"
            file={f.coregDocument}
            onChange={setFile("coregDocument")}
            error={errors.coregDocument}
            hint={`PDF only, up to ${PROFILE_FILE_MB} MB.`}
          />
          <TextInput
            label="Tax Compliance Status (TCS) PIN"
            value={f.taxCompliancePin}
            onChange={set("taxCompliancePin")}
            error={errors.taxCompliancePin}
            placeholder="Enter your SARS TCS PIN"
          />
          <YesNo
            label="Is your business VAT registered?"
            value={f.hasVatRegistration}
            onChange={(value) => {
              setForm((current) => ({
                ...current,
                hasVatRegistration: value,
                vatDocument: value === "Yes" ? current.vatDocument : null,
              }));
              clear("hasVatRegistration");
              clear("vatDocument");
            }}
            error={errors.hasVatRegistration}
            className="sm:col-span-2"
          />
          {f.hasVatRegistration === "Yes" && (
            <FileField
              label="VAT registration document"
              file={f.vatDocument}
              onChange={setFile("vatDocument")}
              error={errors.vatDocument}
              className="sm:col-span-2"
              hint={`PDF only, up to ${PROFILE_FILE_MB} MB.`}
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
              hint={f.hasBeeCertificate === "Yes" ? `Upload your B-BBEE certificate. PDF only, up to ${PROFILE_FILE_MB} MB.` : `Upload your B-BBEE affidavit. PDF only, up to ${PROFILE_FILE_MB} MB.`}
            />
          )}
          <SubHead>Previous support</SubHead>
          <YesNo
            label="Have you attended an ESD programme before?"
            value={f.attendedEsd}
            onChange={setVal("attendedEsd")}
            error={errors.attendedEsd}
          />
          {f.attendedEsd === "Yes" && (
            <TextInput
              label="Which company ran the programme?"
              value={f.esdCompanyName}
              onChange={set("esdCompanyName")}
              error={errors.esdCompanyName}
            />
          )}
          <YesNo
            label="Have you received a grant before?"
            value={f.receivedGrant}
            onChange={setVal("receivedGrant")}
            error={errors.receivedGrant}
          />
          {f.receivedGrant === "Yes" && (
            <TextInput
              label="Which company gave the grant?"
              value={f.grantCompanyName}
              onChange={set("grantCompanyName")}
              error={errors.grantCompanyName}
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
            onChange={set("service")}
            error={errors.service}
          />
          <Select
            label="Annual revenue"
            className="sm:col-span-2"
            value={f.annualRevenue}
            onChange={set("annualRevenue")}
            error={errors.annualRevenue}
            options={REVENUE}
          />
          {f.annualRevenue && (
            <div className="min-w-0 space-y-3 sm:col-span-2">
              <p className="border border-[#201E64]/20 bg-[#201E64]/5 p-3 text-xs leading-5 text-[#201E64]">
                Uploading proof of last year's annual income is optional, but supporting
                documents help the team assess your business and may improve your chances
                of being selected for suitable opportunities.
              </p>
              <FileField
                label="Proof of last year's annual income (optional)"
                file={f.revenueProofDocument}
                onChange={setFile("revenueProofDocument")}
                error={errors.revenueProofDocument}
                hint={`Financial statements or another document showing last year's revenue. PDF only, up to ${MATURITY_FILE_MB} MB.`}
              />
            </div>
          )}
          <SubHead>Employees</SubHead>
          <TextInput
            label="Permanent employees"
            type="number"
            min="0"
            value={f.permanentEmployees}
            onChange={set("permanentEmployees")}
            error={errors.permanentEmployees}
          />
          <TextInput
            label="Contract employees"
            type="number"
            min="0"
            value={f.contractEmployees}
            onChange={set("contractEmployees")}
            error={errors.contractEmployees}
          />
          <YesNo
            label="Do your employees have employment contracts?"
            value={f.employeesHaveContracts}
            onChange={setVal("employeesHaveContracts")}
            error={errors.employeesHaveContracts}
          />
          {f.employeesHaveContracts === "Yes" && (
            <YesNo
              label="Are all the contracts signed?"
              value={f.contractsSigned}
              onChange={setVal("contractsSigned")}
              error={errors.contractsSigned}
            />
          )}
          <YesNo
            label="Are you registered with UIF?"
            value={f.uif}
            onChange={setVal("uif")}
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
          <SubHead>Finance and administration</SubHead>
          <YesNo
            label="Do you use an accounting system or accountant?"
            value={f.accounting}
            onChange={setVal("accounting")}
            error={errors.accounting}
          />
          {f.accounting === "Yes" && (
            <TextInput
              label="Which system or accountant?"
              value={f.accountingSystemName}
              onChange={set("accountingSystemName")}
              error={errors.accountingSystemName}
            />
          )}
          <YesNo
            label="Do you run a formal payroll?"
            value={f.payroll}
            onChange={setVal("payroll")}
            error={errors.payroll}
          />
          {f.payroll === "No" && (
            <TextInput
              textarea
              label="How do you manage payroll?"
              className="sm:col-span-2"
              value={f.payrollExplanation}
              onChange={set("payrollExplanation")}
              error={errors.payrollExplanation}
            />
          )}
          <YesNo
            label="Do you have up-to-date financial statements?"
            value={f.financialStatements}
            onChange={setVal("financialStatements")}
            error={errors.financialStatements}
          />
        </div>
      )}
      {/* ============================================
          STEP 4 - CLIENTS
      ============================================ */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-bold" style={{ color: NAVY }}>
                Client references
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Add at least one previous client who can confirm your work.
              </p>
            </div>
            <span className="text-[11px] font-medium text-neutral-500">
              {f.previousClients.length} of 3 clients
            </span>
          </div>
          {/* CLIENT CARDS */}
          <div className="space-y-3">
            {f.previousClients.map((client, index) => (
              <section
                key={index}
                className="border border-neutral-200 bg-white"
              >
                <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
                  <div>
                    <h3 className="text-xs font-bold" style={{ color: NAVY }}>
                      Client {index + 1}
                    </h3>
                    {index === 0 && (
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Primary client reference
                      </p>
                    )}
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeClient(index)}
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
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                  <TextInput
                    label="Client name"
                    value={client.name}
                    onChange={setClient(index, "name")}
                    error={errors[`client${index}_name`]}
                    placeholder="Company or client name"
                  />
                  <TextInput
                    label="Contact number"
                    type="tel"
                    value={client.contactNumber}
                    onChange={setClient(index, "contactNumber")}
                    error={errors[`client${index}_contactNumber`]}
                    placeholder="e.g. 082 123 4567"
                  />
                  <TextInput
                    label="Email address"
                    type="email"
                    value={client.email}
                    onChange={setClient(index, "email")}
                    error={errors[`client${index}_email`]}
                    placeholder="client@example.com"
                  />
                  <TextInput
                    label="Work done"
                    value={client.workDone}
                    onChange={setClient(index, "workDone")}
                    error={errors[`client${index}_workDone`]}
                    placeholder="e.g. Website development"
                  />
                </div>
              </section>
            ))}
          </div>
          {/* ADD CLIENT */}
          {f.previousClients.length < 3 && (
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
          {f.previousClients.length === 3 && (
            <div className="border border-neutral-200 bg-neutral-50 px-3 py-2">
              <p className="text-center text-[11px] text-neutral-500">
                Maximum of 3 clients reached.
              </p>
            </div>
          )}
          {/* LARGEST CONTRACT */}
          <div className="border-t border-neutral-200 pt-4">
            <TextInput
              label="Largest contract value (R)"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={f.largestContract}
              onChange={set("largestContract")}
              error={errors.largestContract}
              placeholder="e.g. 250000"
              hint="Enter the value, in rands, of the largest contract you have completed."
            />
            <FileField
              className="mt-4"
              label="Contract document (optional)"
              file={f.contractDocument}
              onChange={setFile("contractDocument")}
              error={errors.contractDocument}
              hint={`Upload a copy of your largest contract. PDF only, up to ${MATURITY_FILE_MB} MB.`}
            />
          </div>
        </div>
      )}
    </>
  );
}