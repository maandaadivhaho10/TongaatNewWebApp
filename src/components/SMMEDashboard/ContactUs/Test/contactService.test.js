import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import api from "../../../../API/axiosInstance";
import {
  CONTACT,
  INITIAL_FORM,
  validateContactForm,
  submitContactMessage,
} from "../contactService";

vi.mock("../../../../API/axiosInstance", () => ({
  __esModule: true,
  default: { post: vi.fn() },
}));

const validForm = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Tax PIN help",
  message: "I need help with my Tax PIN.",
};

describe("constants", () => {
  it("exposes contact details", () => {
    expect(CONTACT).toEqual({
      email: expect.stringContaining("@"),
      phone: expect.any(String),
      hours: expect.any(String),
    });
  });

  it("INITIAL_FORM has four empty fields", () => {
    expect(INITIAL_FORM).toEqual({ name: "", email: "", subject: "", message: "" });
  });
});

describe("validateContactForm", () => {
  it("returns trimmed data for a valid form", () => {
    const result = validateContactForm({
      name: "  Jane Doe  ",
      email: "  jane@example.com ",
      subject: " Hello ",
      message: "  Message body  ",
    });
    expect(result).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Hello",
      message: "Message body",
    });
  });

  it.each(["name", "email", "subject", "message"])(
    "throws when %s is empty",
    (field) => {
      expect(() => validateContactForm({ ...validForm, [field]: "" })).toThrow(
        "Please complete all required fields."
      );
    }
  );

  it("treats whitespace-only values as empty", () => {
    expect(() => validateContactForm({ ...validForm, name: "   " })).toThrow(
      "Please complete all required fields."
    );
  });

  it("treats null/undefined values as empty", () => {
    expect(() => validateContactForm({ ...validForm, subject: null })).toThrow(
      "Please complete all required fields."
    );
    expect(() => validateContactForm({ ...validForm, message: undefined })).toThrow(
      "Please complete all required fields."
    );
  });

  it.each(["plainaddress", "missing@tld", "@no-local.com", "spaces in@x.com"])(
    "rejects invalid email %s",
    (email) => {
      expect(() => validateContactForm({ ...validForm, email })).toThrow(
        "Please enter a valid email address."
      );
    }
  );

  it("rejects over-length fields", () => {
    const tooLong = "One or more fields exceed the allowed length.";
    expect(() => validateContactForm({ ...validForm, name: "a".repeat(101) })).toThrow(tooLong);
    expect(() =>
      validateContactForm({ ...validForm, email: "a".repeat(250) + "@b.co" })
    ).toThrow(tooLong);
    expect(() => validateContactForm({ ...validForm, subject: "a".repeat(201) })).toThrow(tooLong);
    expect(() => validateContactForm({ ...validForm, message: "a".repeat(1001) })).toThrow(tooLong);
  });

  it("accepts values exactly at the limits", () => {
    expect(() =>
      validateContactForm({
        name: "a".repeat(100),
        email: validForm.email,
        subject: "a".repeat(200),
        message: "a".repeat(1000),
      })
    ).not.toThrow();
  });
});

describe("submitContactMessage", () => {
  beforeEach(() => {
    api.post.mockReset();
  });

  it("posts the trimmed payload to /contact and returns the server message", async () => {
    api.post.mockResolvedValue({ data: { success: true, message: "Thanks!" } });

    const result = await submitContactMessage({ ...validForm, name: "  Jane Doe  " });

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith("/contact", validForm);
    expect(result).toBe("Thanks!");
  });

  it("falls back to a default success message", async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    await expect(submitContactMessage(validForm)).resolves.toMatch(/sent successfully/i);
  });

  it("throws the server message when success is false", async () => {
    api.post.mockResolvedValue({ data: { success: false, message: "Rate limited" } });
    await expect(submitContactMessage(validForm)).rejects.toThrow("Rate limited");
  });

  it("throws a default message when success is false with no message", async () => {
    api.post.mockResolvedValue({ data: { success: false } });
    await expect(submitContactMessage(validForm)).rejects.toThrow(
      "Unable to send your message. Please try again."
    );
  });

  it("throws when the response has no data", async () => {
    api.post.mockResolvedValue({});
    await expect(submitContactMessage(validForm)).rejects.toThrow(
      "Unable to send your message. Please try again."
    );
  });

  it("does not call the API when validation fails", async () => {
    await expect(submitContactMessage({ ...validForm, email: "bad" })).rejects.toThrow(
      "Please enter a valid email address."
    );
    expect(api.post).not.toHaveBeenCalled();
  });

  it("propagates network errors", async () => {
    const networkError = new Error("Network Error");
    api.post.mockRejectedValue(networkError);
    await expect(submitContactMessage(validForm)).rejects.toBe(networkError);
  });
});