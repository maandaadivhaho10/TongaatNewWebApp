import React, { useState } from "react";
import { Eye, EyeOff, UserPlus, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import api from "../../API/axiosInstance";

const NAVY = "#201E64";
const INITIAL = {
  role_id: "1", title: "", first_name: "", last_name: "",
  id_number: "", gender: "", phone_number: "", email: "",
  password: "", confirm_password: "",
};

const ROLES = [
  { value: "1", label: "Supplier (SMME)" },
  { value: "2", label: "ED Team" },
  { value: "3", label: "Admin" },
];

const inputClass = "w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/10";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

export default function CreateUser({ onCreated, onCancel }) {
  const [form, setForm] = useState(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const errors = {};
    for (const key of ["title", "first_name", "last_name", "id_number", "email", "password"]) {
      if (!String(form[key]).trim()) errors[key] = "This field is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (form.password.length < 8) errors.password = "Use at least 8 characters.";
    if (form.password !== form.confirm_password) {
      errors.confirm_password = "Passwords do not match.";
    }
    if (!["1", "2", "3"].includes(form.role_id)) errors.role_id = "Select a valid role.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      role_id: Number(form.role_id),
      title: form.title.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      id_number: form.id_number.trim(),
      gender: form.gender || null,
      phone_number: form.phone_number.trim() || null,
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    try {
      // axiosInstance should attach the JWT from tongaat_auth automatically.
      const response = await api.post("/super-admin/users", payload);
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not create user.");
      }
      const created = response.data?.data;
      setSuccess(`${ROLES.find((r) => r.value === form.role_id)?.label || "User"} account created successfully.`);
      setForm(INITIAL);
      setFieldErrors({});
      onCreated?.(created);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      setError(message || (status === 401 ? "Your session has expired. Please log in again." : status === 403 ? "Only a Super Admin can create users." : "Unable to create user. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label, name, placeholder, type = "text", options = null) => (
    <div className="min-w-0">
      <label htmlFor={`create-${name}`} className={labelClass}>{label}</label>
      {options ? (
        <select id={`create-${name}`} name={name} value={form[name]} onChange={update} className={inputClass}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input id={`create-${name}`} name={name} type={type} value={form[name]} onChange={update} placeholder={placeholder} className={inputClass} autoComplete="off" />
      )}
      {fieldErrors[name] && <p className="mt-1 text-xs text-red-600">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#201E64] sm:text-2xl">
            <UserPlus className="h-6 w-6" /> Create User
          </h2>
          <p className="mt-1 text-sm text-gray-500">Register a Supplier, ED Team member, or Admin.</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </button>
        )}
      </div>

      {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {success && <div role="status" className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{success}</div>}

      <form onSubmit={submit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div>
          <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#201E64]">Account Role</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ROLES.map((role) => (
              <label key={role.value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-semibold transition ${form.role_id === role.value ? "border-[#201E64] bg-[#201E64]/5 text-[#201E64]" : "border-gray-200 text-gray-700 hover:border-[#201E64]/40"}`}>
                <input type="radio" name="role_id" value={role.value} checked={form.role_id === role.value} onChange={update} className="accent-[#201E64]" />
                {role.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#201E64]">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {field("Title *", "title", "", "text", [{ value: "Mr", label: "Mr" }, { value: "Ms", label: "Ms" }, { value: "Mrs", label: "Mrs" }, { value: "Dr", label: "Dr" }])}
            {field("First Name *", "first_name", "Enter first name")}
            {field("Last Name *", "last_name", "Enter last name")}
            {field("ID Number *", "id_number", "Enter ID number")}
            {field("Gender", "gender", "", "text", [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }, { value: "Prefer not to say", label: "Prefer not to say" }])}
            {field("Phone Number", "phone_number", "e.g. 0821234567", "tel")}
          </div>
        </div>

        <div>
          <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#201E64]">Login Credentials</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{field("Email Address *", "email", "name@example.com", "email")}</div>
            {[["password", "Password *", showPassword, setShowPassword], ["confirm_password", "Confirm Password *", showConfirmPassword, setShowConfirmPassword]].map(([name, label, visible, setVisible]) => (
              <div key={name}>
                <label htmlFor={`create-${name}`} className={labelClass}>{label}</label>
                <div className="relative">
                  <input id={`create-${name}`} name={name} type={visible ? "text" : "password"} value={form[name]} onChange={update} autoComplete="new-password" placeholder={name === "password" ? "At least 8 characters" : "Re-enter password"} className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#201E64]">
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors[name] && <p className="mt-1 text-xs text-red-600">{fieldErrors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
          {onCancel && <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>}
          <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#201E64] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#302D85] disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {submitting ? "Creating User..." : "Create User"}
          </button>
        </div>
      </form>
    </section>
  );
}
