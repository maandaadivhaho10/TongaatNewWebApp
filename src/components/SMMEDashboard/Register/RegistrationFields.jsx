import React, { useRef } from "react";
import { Check } from "lucide-react";
import { NAVY, FOCUS, inputCls, STEPS, SECTORS } from "./registrationConfig";

function Field({
  label,
  error,
  hint,
  className = "",
  group = false,
  children,
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper
      className={`block min-w-0 ${className}`}
      {...(group
        ? {
            role: "group",
            "aria-label": label,
          }
        : {})}
    >
      <span className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-[11px] text-neutral-500">
          {hint}
        </span>
      )}
      {error && (
        <span
          className="mt-1 block text-[11px] text-red-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </Wrapper>
  );
}
// ======================================================
// TEXT INPUT
// ======================================================
export function TextInput({
  label,
  error,
  hint,
  className,
  textarea,
  ...props
}) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      className={className}
    >
      {textarea ? (
        <textarea
          rows={3}
          aria-invalid={!!error}
          className={inputCls(
            error,
            "min-h-[90px] py-2 resize-y"
          )}
          {...props}
        />
      ) : (
        <input
          aria-invalid={!!error}
          className={inputCls(error, "h-10")}
          {...props}
        />
      )}
    </Field>
  );
}
// ======================================================
// SELECT
// ======================================================
export function Select({
  label,
  error,
  className,
  options,
  value,
  onChange,
  placeholder = "Select",
}) {
  return (
    <Field
      label={label}
      error={error}
      className={className}
    >
      <select
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        className={inputCls(error, "h-10")}
      >
        <option value="">
          {placeholder}
        </option>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;
          return (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}
// ======================================================
// SECTOR SELECT
// ======================================================
// Scrollable industry dropdown. Native details and buttons support keyboard navigation.
export function SectorSelect({ value, onChange, error, className = "" }) {
  const dropdown = useRef(null);
  const selected = SECTORS.find((sector) => sector.id === value);
  return (
    <Field label="Industry / sector" error={error} className={className} group>
      <details ref={dropdown} className="relative min-w-0" onKeyDown={(event) => {
        if (event.key === "Escape") {
          dropdown.current.open = false;
          dropdown.current.querySelector("summary").focus();
        }
      }}>
        <summary className={`${inputCls(error)} flex min-h-10 cursor-pointer items-center justify-between gap-2 py-2 ${FOCUS}`}>
          <span className="min-w-0 break-words">{selected?.name || "Select your industry"}</span>
        </summary>
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto overscroll-contain border border-neutral-300 bg-white p-1 shadow-lg" aria-label="Industries">
          {SECTORS.map((sector) => (
            <button key={sector.id} type="button" aria-pressed={value === sector.id}
              className={`block w-full px-3 py-2.5 text-left text-sm break-words ${FOCUS} ${value === sector.id ? "bg-[#201E64] text-white" : "text-neutral-800 hover:bg-neutral-100"}`}
              onClick={() => {
                onChange({ target: { value: sector.id } });
                dropdown.current.open = false;
                dropdown.current.querySelector("summary").focus();
              }}>
              {sector.name}
            </button>
          ))}
        </div>
      </details>
    </Field>
  );
}
// ======================================================
// YES / NO
// ======================================================
export function YesNo({
  label,
  error,
  value,
  onChange,
  className,
}) {
  return (
    <Field
      label={label}
      error={error}
      className={className}
      group
    >
      <div className="grid grid-cols-2">
        {["Yes", "No"].map(
          (option, index) => {
            const selected =
              value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange(option)
                }
                aria-pressed={selected}
                className={`
                  h-10
                  rounded-none
                  border
                  text-xs
                  font-semibold
                  transition-colors
                  ${FOCUS}
                  ${
                    index === 1
                      ? "-ml-px"
                      : ""
                  }
                  ${
                    selected
                      ? "relative z-10 border-[#201E64] bg-[#201E64] text-white"
                      : `bg-white text-neutral-700 hover:bg-neutral-50 ${
                          error
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`
                  }
                `}
              >
                {option}
              </button>
            );
          }
        )}
      </div>
    </Field>
  );
}
// ======================================================
// FILE FIELD
// ======================================================
export function FileField({
  label,
  error,
  file,
  onChange,
  className = "",
  hint,
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-neutral-700">
        {label}
      </span>
      <label
        className={`
          flex
          h-10
          cursor-pointer
          items-center
          justify-between
          gap-3
          rounded-none
          border
          bg-white
          px-3
          transition-colors
          hover:bg-neutral-50
          focus-within:ring-1
          focus-within:ring-[#201E64]
          ${
            error
              ? "border-red-500"
              : file
              ? "border-[#201E64]"
              : "border-dashed border-neutral-400"
          }
        `}
      >
        <span
          className={`
            min-w-0
            truncate
            text-xs
            ${
              file
                ? "text-neutral-900"
                : "text-neutral-500"
            }
          `}
        >
          {file
            ? file.name
            : "No file chosen"}
        </span>
        <span
          className="shrink-0 text-xs font-semibold"
          style={{ color: NAVY }}
        >
          {file ? "Replace" : "Upload"}
        </span>
        <input
          type="file"
          aria-label={label}
          aria-invalid={!!error}
          accept=".pdf,application/pdf"
          onChange={onChange}
          className="sr-only"
        />
      </label>
      {hint && <p className="mt-1 text-[11px] text-neutral-500">{hint}</p>}
      {error && (
        <span
          className="mt-1 block text-[11px] text-red-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
// ======================================================
// SUB HEADING
// ======================================================
export function SubHead({ children }) {
  return (
    <h3
      className="pt-1 pb-2 text-xs font-bold border-b border-neutral-200 sm:col-span-2"
      style={{ color: NAVY }}
    >
      {children}
    </h3>
  );
}
// ======================================================
// STEPPER
// ======================================================
export function Stepper({ current }) {
  return (
    <ol
      className="flex items-start"
      aria-label="Registration progress"
    >
      {STEPS.map((step, index) => {
        const done = index < current;
        const active =
          index === current;
        return (
          <li
            key={step.title}
            className="relative flex flex-1 flex-col items-center"
            aria-current={
              active ? "step" : undefined
            }
          >
            {index > 0 && (
              <span
                className={`
                  absolute
                  top-4
                  right-1/2
                  h-px
                  w-full
                  ${
                    index <= current
                      ? "bg-[#201E64]"
                      : "bg-neutral-300"
                  }
                `}
                aria-hidden="true"
              />
            )}
            <span
              className={`
                relative
                z-10
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-none
                border
                text-xs
                font-bold
                ${
                  done || active
                    ? "border-[#201E64] bg-[#201E64] text-white"
                    : "border-neutral-300 bg-white text-neutral-500"
                }
              `}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`
                mt-1.5
                hidden
                text-[11px]
                font-semibold
                sm:block
                ${
                  active
                    ? "text-[#201E64]"
                    : "text-neutral-500"
                }
              `}
            >
              {step.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}