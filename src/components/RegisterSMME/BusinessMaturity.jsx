import React, { useMemo, useState } from 'react';

const SECTOR_OPTIONS = [
  {
    sector_id: 1,
    sector_name: 'Agriculture & Farming',
  },
  {
    sector_id: 2,
    sector_name: 'Retail & Trade',
  },
  {
    sector_id: 3,
    sector_name: 'Manufacturing',
  },
  {
    sector_id: 4,
    sector_name: 'Construction',
  },
  {
    sector_id: 5,
    sector_name: 'Transport & Logistics',
  },
  {
    sector_id: 6,
    sector_name: 'Hospitality & Tourism',
  },
  {
    sector_id: 7,
    sector_name: 'Professional Services',
  },
  {
    sector_id: 8,
    sector_name: 'Technology & ICT',
  },
  {
    sector_id: 9,
    sector_name: 'Health & Wellness',
  },
  {
    sector_id: 10,
    sector_name: 'Other',
  },
];

const SERVICES_BY_INDUSTRY = {
  'Agriculture & Farming': [
    'Crop Production',
    'Livestock Farming',
    'Agro-processing',
    'Farm Equipment Supply',
    'Other',
  ],

  'Retail & Trade': [
    'General Dealer',
    'Wholesale',
    'E-commerce',
    'Import / Export',
    'Other',
  ],

  Manufacturing: [
    'Food & Beverage Production',
    'Textiles & Clothing',
    'Furniture Manufacturing',
    'Metal Fabrication',
    'Other',
  ],

  Construction: [
    'Residential Building',
    'Commercial Building',
    'Civil Engineering',
    'Renovations',
    'Other',
  ],

  'Transport & Logistics': [
    'Freight & Trucking',
    'Courier Services',
    'Warehousing',
    'Fleet Management',
    'Other',
  ],

  'Hospitality & Tourism': [
    'Accommodation',
    'Catering & Events',
    'Tour Operations',
    'Restaurants',
    'Other',
  ],

  'Professional Services': [
    'Accounting & Bookkeeping',
    'Legal Services',
    'Consulting',
    'Marketing & Design',
    'Other',
  ],

  'Technology & ICT': [
    'Software Development',
    'IT Support',
    'Web & App Design',
    'Networking',
    'Other',
  ],

  'Health & Wellness': [
    'Healthcare Services',
    'Fitness & Wellness',
    'Beauty & Personal Care',
    'Pharmacy',
    'Other',
  ],

  Other: [
    'Other',
  ],
};

const ANNUAL_REVENUE_RANGES = [
  'R1k – R50k',
  'R60k – R250k',
  'R260k – R500k',
  'R500k – R1M',
  'R1M – R5M',
  'R5M – R10M',
];

export default function BusinessMaturity({
  values,
  onChange,
}) {
  const [expandedClientId, setExpandedClientId] =
    useState(
      values.previousClients?.[0]?.id || null
    );

  const selectedSector = useMemo(
    () =>
      SECTOR_OPTIONS.find(
        (sector) =>
          String(sector.sector_id) ===
          String(values.sectorId)
      ),
    [values.sectorId]
  );

  const serviceOptions = useMemo(() => {
    if (!selectedSector) {
      return [];
    }

    return (
      SERVICES_BY_INDUSTRY[
        selectedSector.sector_name
      ] || []
    );
  }, [selectedSector]);

  const clients =
    values.previousClients || [];

  const updateField = (
    field,
    value
  ) => {
    onChange({
      [field]: value,
    });
  };

  const handleSectorChange = (
    sectorId
  ) => {
    onChange({
      sectorId,
      service: '',
    });
  };

  const addClient = () => {
    if (clients.length >= 3) {
      return;
    }

    const newClient = {
      id: crypto.randomUUID(),
      name: '',
      email: '',
      contactNumber: '',
      workDone: '',
    };

    onChange({
      previousClients: [
        ...clients,
        newClient,
      ],
    });

    setExpandedClientId(
      newClient.id
    );
  };

  const removeClient = (
    clientId
  ) => {
    if (clients.length <= 1) {
      return;
    }

    const updatedClients =
      clients.filter(
        (client) =>
          client.id !== clientId
      );

    onChange({
      previousClients:
        updatedClients,
    });

    if (
      expandedClientId ===
      clientId
    ) {
      setExpandedClientId(
        updatedClients[0]?.id ||
          null
      );
    }
  };

  const updateClient = (
    clientId,
    field,
    value
  ) => {
    const updatedClients =
      clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              [field]: value,
            }
          : client
      );

    onChange({
      previousClients:
        updatedClients,
    });
  };

  const isClientComplete = (
    client
  ) => {
    return (
      client.name?.trim() &&
      client.email?.trim() &&
      client.contactNumber?.trim() &&
      client.workDone?.trim()
    );
  };

  const completedClients =
    clients.filter(
      isClientComplete
    ).length;

  /*
   * Shared input style.
   *
   * rounded-none = completely square corners
   */
  const inputClass =
    'w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-1 focus:ring-[#0A1A74]';

  return (
    <div className="space-y-6">

      {/* =====================================================
          SECTOR
      ====================================================== */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Industry / Sector
        </label>

        <select
          value={values.sectorId || ''}
          onChange={(e) =>
            handleSectorChange(
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select your industry
          </option>

          {SECTOR_OPTIONS.map(
            (sector) => (
              <option
                key={sector.sector_id}
                value={
                  sector.sector_id
                }
              >
                {sector.sector_name}
              </option>
            )
          )}
        </select>
      </div>

      {/* =====================================================
          SERVICE
      ====================================================== */}

      {selectedSector && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Primary Service
          </label>

          <select
            value={
              values.service || ''
            }
            onChange={(e) =>
              updateField(
                'service',
                e.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select a service
            </option>

            {serviceOptions.map(
              (service) => (
                <option
                  key={service}
                  value={service}
                >
                  {service}
                </option>
              )
            )}
          </select>
        </div>
      )}

      {/* =====================================================
          ANNUAL REVENUE
      ====================================================== */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Annual Revenue
        </label>

        <select
          value={
            values.annualRevenue ||
            ''
          }
          onChange={(e) =>
            updateField(
              'annualRevenue',
              e.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Select a revenue range
          </option>

          {ANNUAL_REVENUE_RANGES.map(
            (range) => (
              <option
                key={range}
                value={range}
              >
                {range}
              </option>
            )
          )}
        </select>
      </div>

      {/* =====================================================
          EMPLOYEES
      ====================================================== */}

      <div>
        <h3 className="text-sm font-semibold text-neutral-800">
          Number of Employees
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Permanent
            </label>

            <input
              type="number"
              min="0"
              value={
                values.permanentEmployees ||
                ''
              }
              onChange={(e) =>
                updateField(
                  'permanentEmployees',
                  e.target.value
                )
              }
              placeholder="Number of employees"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Contract
            </label>

            <input
              type="number"
              min="0"
              value={
                values.contractEmployees ||
                ''
              }
              onChange={(e) =>
                updateField(
                  'contractEmployees',
                  e.target.value
                )
              }
              placeholder="Number of employees"
              className={inputClass}
            />
          </div>

        </div>
      </div>

      {/* =====================================================
          EMPLOYEE CONTRACTS
      ====================================================== */}

      <YesNoQuestion
        title="Do employees have contracts?"
        selected={
          values.employeesHaveContracts
        }
        onSelected={(value) =>
          onChange({
            employeesHaveContracts:
              value,

            ...(value === 'No'
              ? {
                  contractsSigned: '',
                }
              : {}),
          })
        }
      />

      {values.employeesHaveContracts ===
        'Yes' && (
        <div className="ml-4 border-l-2 border-neutral-200 pl-4">

          <YesNoQuestion
            title="Are the contracts signed?"
            selected={
              values.contractsSigned
            }
            onSelected={(value) =>
              updateField(
                'contractsSigned',
                value
              )
            }
          />

        </div>
      )}

      {/* =====================================================
          UIF
      ====================================================== */}

      <YesNoQuestion
        title="Registered with UIF?"
        selected={values.uif}
        onSelected={(value) =>
          updateField(
            'uif',
            value
          )
        }
      />

      {/* =====================================================
          COIDA
      ====================================================== */}

      <YesNoQuestion
        title="Registered with COIDA?"
        selected={values.coida}
        onSelected={(value) =>
          updateField(
            'coida',
            value
          )
        }
      />

      {/* =====================================================
          ACCOUNTING
      ====================================================== */}

      <div>
        <YesNoQuestion
          title="Does the business have an accounting system?"
          selected={
            values.accounting
          }
          onSelected={(value) =>
            onChange({
              accounting: value,

              ...(value === 'No'
                ? {
                    accountingSystemName:
                      '',
                  }
                : {}),
            })
          }
        />

        {values.accounting ===
          'Yes' && (
          <div className="mt-3">

            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Name of accounting system
            </label>

            <input
              type="text"
              value={
                values.accountingSystemName ||
                ''
              }
              onChange={(e) =>
                updateField(
                  'accountingSystemName',
                  e.target.value
                )
              }
              placeholder="e.g. Sage, Xero, QuickBooks"
              className={inputClass}
            />

          </div>
        )}
      </div>

      {/* =====================================================
          PAYROLL
      ====================================================== */}

      <div>
        <YesNoQuestion
          title="Does the business have payroll?"
          selected={
            values.payroll
          }
          onSelected={(value) =>
            onChange({
              payroll: value,

              ...(value === 'No'
                ? {
                    payrollExplanation:
                      '',
                  }
                : {}),
            })
          }
        />

        {values.payroll ===
          'Yes' && (
          <div className="mt-3">

            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Briefly explain how payroll is managed
            </label>

            <textarea
              value={
                values.payrollExplanation ||
                ''
              }
              onChange={(e) =>
                updateField(
                  'payrollExplanation',
                  e.target.value
                )
              }
              placeholder="e.g. In-house via Sage Payroll, outsourced to a bureau, etc."
              rows={3}
              className={`${inputClass} resize-none`}
            />

          </div>
        )}
      </div>

      {/* =====================================================
          FINANCIAL STATEMENTS
      ====================================================== */}

      <YesNoQuestion
        title="Can you produce 2 years of financial statements?"
        selected={
          values.financialStatements
        }
        onSelected={(value) =>
          updateField(
            'financialStatements',
            value
          )
        }
      />

      {/* =====================================================
          PREVIOUS CLIENTS
      ====================================================== */}

      <div className="border-t border-neutral-200 pt-6">

        <div className="flex items-center justify-between gap-4">

          <div>
            <h3 className="text-sm font-semibold text-neutral-800">
              3 Previous Clients
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              {completedClients} of{' '}
              {clients.length}{' '}
              completed
            </p>
          </div>

          {clients.length < 3 && (
            <button
              type="button"
              onClick={addClient}
              className="rounded-none border border-[#0A1A74] px-3 py-2 text-sm font-medium text-[#0A1A74] transition hover:bg-[#0A1A74] hover:text-white"
            >
              + Add client
            </button>
          )}

        </div>

        <div className="mt-4 space-y-3">

          {clients.map(
            (client, index) => (
              <PreviousClientCard
                key={client.id}
                clientNumber={
                  index + 1
                }
                client={client}
                isComplete={
                  isClientComplete(
                    client
                  )
                }
                isExpanded={
                  expandedClientId ===
                  client.id
                }
                canRemove={
                  clients.length > 1
                }
                onToggle={() =>
                  setExpandedClientId(
                    expandedClientId ===
                      client.id
                      ? null
                      : client.id
                  )
                }
                onChange={(
                  field,
                  value
                ) =>
                  updateClient(
                    client.id,
                    field,
                    value
                  )
                }
                onRemove={() =>
                  removeClient(
                    client.id
                  )
                }
              />
            )
          )}

        </div>
      </div>

      {/* =====================================================
          LARGEST CONTRACT
      ====================================================== */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Largest contract value
        </label>

        <input
          type="text"
          value={
            values.largestContract ||
            ''
          }
          onChange={(e) =>
            updateField(
              'largestContract',
              e.target.value
            )
          }
          placeholder="e.g. R250,000"
          className={inputClass}
        />
      </div>

    </div>
  );
}

/* =========================================================
   PREVIOUS CLIENT CARD
========================================================= */

function PreviousClientCard({
  clientNumber,
  client,
  isComplete,
  isExpanded,
  canRemove,
  onToggle,
  onChange,
  onRemove,
}) {
  return (
    <div className="overflow-hidden rounded-none border border-neutral-200 bg-[#F8F9FC]">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">

        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-none ${
              isComplete
                ? 'bg-[#0A1A74]'
                : 'bg-[#E1E4EC]'
            }`}
          >
            {isComplete ? (
              <span className="text-sm font-bold text-white">
                ✓
              </span>
            ) : (
              <span className="text-sm font-semibold text-[#5A5F73]">
                {clientNumber}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-neutral-800">
              {client.name?.trim()
                ? client.name
                : `Client ${clientNumber}`}
            </p>

            {!isComplete && (
              <p className="mt-0.5 text-xs text-neutral-500">
                Tap to add details
              </p>
            )}

          </div>

          <span
            className={`text-lg text-neutral-400 transition-transform ${
              isExpanded
                ? 'rotate-180'
                : ''
            }`}
          >
            ⌄
          </span>

        </button>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-transparent text-lg text-neutral-400 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-700"
          >
            ×
          </button>
        )}

      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 border-t border-neutral-200 p-4">

          {/* Client Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Client name
            </label>

            <input
              type="text"
              value={
                client.name || ''
              }
              onChange={(e) =>
                onChange(
                  'name',
                  e.target.value
                )
              }
              placeholder="e.g. Acme Farms (Pty) Ltd"
              className="w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-all hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-1 focus:ring-[#0A1A74]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Email address
            </label>

            <input
              type="email"
              value={
                client.email || ''
              }
              onChange={(e) =>
                onChange(
                  'email',
                  e.target.value
                )
              }
              placeholder="name@example.com"
              className="w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-all hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-1 focus:ring-[#0A1A74]"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Contact number
            </label>

            <input
              type="tel"
              value={
                client.contactNumber ||
                ''
              }
              onChange={(e) =>
                onChange(
                  'contactNumber',
                  e.target.value
                )
              }
              placeholder="e.g. 082 123 4567"
              className="w-full rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-all hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-1 focus:ring-[#0A1A74]"
            />
          </div>

          {/* Work Done */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Work done
            </label>

            <textarea
              value={
                client.workDone || ''
              }
              onChange={(e) =>
                onChange(
                  'workDone',
                  e.target.value
                )
              }
              placeholder="Briefly describe the work carried out for this client"
              rows={3}
              className="w-full resize-none rounded-none border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-all hover:border-neutral-400 focus:border-[#0A1A74] focus:ring-1 focus:ring-[#0A1A74]"
            />
          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   YES / NO
========================================================= */

function YesNoQuestion({
  title,
  selected,
  onSelected,
}) {
  return (
    <div>

      <p className="text-sm font-semibold text-neutral-800">
        {title}
      </p>

      <div className="mt-3 flex gap-3">

        <button
          type="button"
          onClick={() =>
            onSelected('Yes')
          }
          className={`rounded-none border px-5 py-2.5 text-sm font-medium transition ${
            selected === 'Yes'
              ? 'border-[#0A1A74] bg-[#0A1A74] text-white'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0A1A74] hover:bg-neutral-50'
          }`}
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() =>
            onSelected('No')
          }
          className={`rounded-none border px-5 py-2.5 text-sm font-medium transition ${
            selected === 'No'
              ? 'border-[#0A1A74] bg-[#0A1A74] text-white'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0A1A74] hover:bg-neutral-50'
          }`}
        >
          No
        </button>

      </div>

    </div>
  );
}