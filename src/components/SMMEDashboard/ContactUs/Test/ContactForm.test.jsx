import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ContactForm from "../ContactForm";

const emptyForm = { name: "", email: "", subject: "", message: "" };

function setup(props = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn((e) => e.preventDefault());
  const utils = render(
    <ContactForm
      formData={emptyForm}
      onChange={onChange}
      onSubmit={onSubmit}
      loading={false}
      error=""
      success=""
      {...props}
    />
  );
  return { onChange, onSubmit, ...utils };
}

afterEach(cleanup);

describe("ContactForm", () => {
  it("renders heading and all fields", () => {
    setup();
    expect(screen.getByRole("heading", { name: "Send Us a Message" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Subject/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message/)).toBeInTheDocument();
  });

  it("marks every field as required with sensible attributes", () => {
    setup();
    const name = screen.getByLabelText(/^Name/);
    const email = screen.getByLabelText(/Email Address/);
    const subject = screen.getByLabelText(/^Subject/);
    const message = screen.getByLabelText(/^Message/);

    [name, email, subject, message].forEach((el) => expect(el).toBeRequired());
    expect(email).toHaveAttribute("type", "email");
    expect(name).toHaveAttribute("maxlength", "100");
    expect(email).toHaveAttribute("maxlength", "254");
    expect(subject).toHaveAttribute("maxlength", "200");
    expect(message).toHaveAttribute("maxlength", "1000");
  });

  it("displays controlled values", () => {
    setup({
      formData: { name: "Jane", email: "j@x.com", subject: "Hi", message: "Hello there" },
    });
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Jane");
    expect(screen.getByLabelText(/Email Address/)).toHaveValue("j@x.com");
    expect(screen.getByLabelText(/^Subject/)).toHaveValue("Hi");
    expect(screen.getByLabelText(/^Message/)).toHaveValue("Hello there");
  });

  it("shows the message character counter", () => {
    setup({ formData: { ...emptyForm, message: "Hello" } });
    expect(screen.getByText("5/1000")).toBeInTheDocument();
  });

  it("calls onChange when a field changes", () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { name: "name", value: "Jane" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when the form is submitted", () => {
    const { onSubmit } = setup({
      formData: { name: "Jane", email: "j@x.com", subject: "Hi", message: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables inputs and the button while loading", () => {
    setup({ loading: true });
    expect(screen.getByLabelText(/^Name/)).toBeDisabled();
    expect(screen.getByLabelText(/Email Address/)).toBeDisabled();
    expect(screen.getByLabelText(/^Subject/)).toBeDisabled();
    expect(screen.getByLabelText(/^Message/)).toBeDisabled();

    const button = screen.getByRole("button", { name: /Sending Message/ });
    expect(button).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Send Message" })).not.toBeInTheDocument();
  });

  it("enables inputs and the button when not loading", () => {
    setup({ loading: false });
    expect(screen.getByLabelText(/^Name/)).toBeEnabled();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled();
  });

  it("shows an error alert only when error is set", () => {
    const { rerender, onChange, onSubmit } = setup();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <ContactForm
        formData={emptyForm}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={false}
        error="Something went wrong"
        success=""
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("shows a success status only when success is set", () => {
    const { rerender, onChange, onSubmit } = setup();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(
      <ContactForm
        formData={emptyForm}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={false}
        error=""
        success="Message sent"
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Message sent");
  });
});