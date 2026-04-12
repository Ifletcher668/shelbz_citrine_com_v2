import { useState } from "react";

const SUBMIT_FIELD = "_submit";

function FormField({ field, values, onChange }) {
  return (
    <div className="md-form-field">
      <label htmlFor={`cf-${field.name}`} className="md-form-label">
        {field.label}
        {field.required && (
          <span className="md-form-required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={`cf-${field.name}`}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          value={values[field.name]}
          onChange={onChange}
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
          onChange={onChange}
          className="md-form-input"
        />
      )}
      {field.helpText && <p className="md-form-help">{field.helpText}</p>}
    </div>
  );
}

export default function ContactFormEmbed({ config }) {
  const { action, submitLabel, successMessage, fields, layout } = config;
  const [status, setStatus] = useState("idle");
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );

  const fieldMap = Object.fromEntries(fields.map((f) => [f.name, f]));

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

  // Build rows from layout. Layout format: [[{ name, size }, ...], ...]
  // _submit is a special cell that renders the submit button.
  // Falls back to stacking all fields + submit when no layout is stored.
  const rows = layout
    ? layout
        .map((row) => row.map((cell) => ({ cell, size: cell.size ?? 12 })))
        .filter((row) => row.length > 0)
    : [
        ...fields.map((f) => [{ cell: { name: f.name }, size: 12 }]),
        [{ cell: { name: SUBMIT_FIELD }, size: 12 }],
      ];

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

      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="md-form-row">
          {row.map(({ cell, size }) => {
            if (cell.name === SUBMIT_FIELD) {
              return (
                <div
                  key={SUBMIT_FIELD}
                  className="md-form-cell"
                  style={{ "--cell-size": size }}
                >
                  {status === "error" && (
                    <p className="md-form-error">
                      Something went wrong. Please try again.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary md-form-submit"
                  >
                    {status === "submitting" ? "Sending…" : submitLabel}
                  </button>
                </div>
              );
            }
            const field = fieldMap[cell.name];
            if (!field) return null;
            return (
              <div
                key={field.name}
                className="md-form-cell"
                style={{ "--cell-size": size }}
              >
                <FormField
                  field={field}
                  values={values}
                  onChange={handleChange}
                />
              </div>
            );
          })}
        </div>
      ))}
    </form>
  );
}
