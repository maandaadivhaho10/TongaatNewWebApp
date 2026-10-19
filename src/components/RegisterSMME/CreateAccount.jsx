import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../API/axiosInstance";

const INPUT_CLASS = "w-full h-11 sm:h-12 px-3 sm:px-4 border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-[#201E64] focus:ring-1 focus:ring-[#201E64]/10";
const LABEL_CLASS = "block mb-1.5 text-xs sm:text-sm font-semibold text-neutral-800";
const INITIAL_FORM = { title: "", first_name: "", last_name: "", id_number: "", gender: "", phone_number: "", email: "", password: "", confirmPassword: "" };

export default function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (!acceptedTerms) return setError("Please accept the Terms and Conditions.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    const { title, first_name, last_name, id_number, gender, phone_number, email, password } = formData;
    const payload = {
      title: title.trim(), first_name: first_name.trim(), last_name: last_name.trim(),
      id_number: id_number.trim(), gender, phone_number: phone_number.trim(),
      email: email.trim().toLowerCase(), password
    };
    try {
      setLoading(true);
      const response = await api.post("/auth1/register/smme", payload);
      const result = response.data;
      const userId = result?.user_id ?? result?.user?.user_id ?? result?.data?.user_id ?? result?.data?.user?.user_id;
      if (userId == null) {
        setError("Registration completed, but the server did not return a user_id for OTP verification. Please contact support.");
        return;
      }
      sessionStorage.setItem("pending_smme_verification", JSON.stringify({ user_id: userId, email: payload.email }));
      navigate("/verify-otp", { replace: true, state: { user_id: userId, email: payload.email } });
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.error || (err.response?.status === 409 ? "This account is already registered." : "Unable to create account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const input = (name, label, type = "text", placeholder = "", extra = {}) => (
    <div key={name}>
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <input id={name} name={name} type={type} value={formData[name]} onChange={handleChange}
        placeholder={placeholder} required className={INPUT_CLASS} {...extra} />
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] w-full overflow-x-hidden bg-neutral-50 px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl items-center justify-center sm:min-h-[calc(100dvh-3rem)] md:min-h-[calc(100dvh-4rem)]">
        <div className="w-full border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6 md:px-8">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">Create New Account</h1>
            <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500 sm:mt-2 sm:text-sm">Create your account to access opportunities and business support.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 md:px-8">
            <div>
              <label htmlFor="title" className={LABEL_CLASS}>Title</label>
              <div className="relative">
                <select id="title" name="title" value={formData.title} onChange={handleChange} required className={`${INPUT_CLASS} appearance-none pr-10`}>
                  <option value="">Select title</option>
                  {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map((title) => <option key={title} value={title}>{title}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {input("first_name", "First Name", "text", "Enter first name", { autoComplete: "given-name" })}
              {input("last_name", "Last Name", "text", "Enter last name", { autoComplete: "family-name" })}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {input("id_number", "ID Number", "text", "Enter ID number", { inputMode: "numeric", maxLength: 13 })}
              <div>
                <label htmlFor="gender" className={LABEL_CLASS}>Gender</label>
                <div className="relative">
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className={`${INPUT_CLASS} appearance-none pr-10`}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {input("phone_number", "Phone Number", "tel", "Enter phone number", { autoComplete: "tel" })}
              {input("email", "Email Address", "email", "Enter email address", { autoComplete: "email" })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[["password", "Password", showPassword, setShowPassword], ["confirmPassword", "Confirm Password", showConfirmPassword, setShowConfirmPassword]].map(([name, label, visible, setVisible]) => (
                <div key={name}>
                  <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
                  <div className="relative">
                    <input id={name} name={name} type={visible ? "text" : "password"} value={formData[name]} onChange={handleChange}
                      placeholder={name === "password" ? "Create password" : "Confirm password"} autoComplete="new-password" minLength={8} required
                      className={`${INPUT_CLASS} pr-12 ${name === "confirmPassword" && formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500" : ""}`} />
                    <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? `Hide ${label}` : `Show ${label}`}
                      className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-neutral-500 hover:text-[#201E64] sm:h-12 sm:w-12">
                      {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {name === "password" && <p className="mt-1 text-xs text-neutral-500">Minimum 8 characters.</p>}
                  {name === "confirmPassword" && formData.confirmPassword && (
                    <p className={`mt-1 text-xs ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-600"}`}>
                      {formData.password === formData.confirmPassword ? "Passwords match." : "Passwords do not match."}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 pt-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#201E64]" />
                <span className="text-xs leading-5 text-neutral-600 sm:text-sm">I agree to the{" "}
                  <button type="button" onClick={() => navigate("/terms")} className="font-semibold text-[#201E64] hover:underline">Terms and Conditions</button>{" "}
                  and acknowledge the Privacy Policy.
                </span>
              </label>
            </div>
            {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="h-11 w-full bg-[#201E64] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2B2889] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <p className="text-center text-xs text-neutral-500 sm:text-sm">Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="font-semibold text-[#201E64] hover:underline">Sign in</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
