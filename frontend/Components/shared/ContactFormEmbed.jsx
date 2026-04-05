import { useState } from "react";

export default function ContactFormEmbed({ config }) {
  const { action, submitLabel, successMessage, fields } = config;
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const body = new URLSearchParams({
        "form-name": "contact-form",
        action,
        ...values,
      }).toString();
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <div className="md-form-success">{successMessage}</div>;
  }

  return (
    <form
      aria-label="contact-form"
      className="md-contact-form-inner"
      name="contact-form"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact-form" />
      <input type="hidden" name="action" value={action} />
      <p className="md-form-honeypot">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>

      {fields.map((field) => (
        <div key={field.name} className="md-form-field">
          <label htmlFor={`cf-${field.name}`} className="md-form-label">
            {field.label}
            {field.required && <span className="md-form-required" aria-hidden="true">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={`cf-${field.name}`}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.name]}
              onChange={handleChange}
              className="md-form-input md-form-textarea"
              rows={5}
            />
          ) : (
            <input
              id={`cf-${field.name}`}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={values[field.name]}
              onChange={handleChange}
              className="md-form-input"
            />
          )}
          {field.helpText && <p className="md-form-help">{field.helpText}</p>}
        </div>
      ))}

      {status === "error" && (
        <p className="md-form-error">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary md-form-submit"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
