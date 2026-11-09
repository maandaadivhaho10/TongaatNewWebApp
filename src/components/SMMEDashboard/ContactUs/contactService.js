import api from "../../../API/axiosInstance";

export const CONTACT = {
  email: "adivhaho@mentecfoundationsa.org",
  phone: "0761411712",
  hours: "Monday – Friday, 08:00 – 17:00",
};

export const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export function validateContactForm(form) {
  const data = Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, String(value ?? "").trim()])
  );
  if (!data.name || !data.email || !data.subject || !data.message) {
    throw new Error("Please complete all required fields.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (data.name.length > 100 || data.email.length > 254 ||
      data.subject.length > 200 || data.message.length > 1000) {
    throw new Error("One or more fields exceed the allowed length.");
  }
  return data;
}

export async function submitContactMessage(form) {
  const payload = validateContactForm(form);
  const { data } = await api.post("/contact", payload);
  if (!data?.success) {
    throw new Error(data?.message || "Unable to send your message. Please try again.");
  }
  return data.message || "Your message has been sent successfully. Our support team will get back to you.";
}
