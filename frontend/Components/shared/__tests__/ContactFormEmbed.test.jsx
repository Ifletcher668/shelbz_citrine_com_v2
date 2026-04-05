import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactFormEmbed from "@/Components/shared/ContactFormEmbed";

const config = {
  action: "contact",
  submitLabel: "Send Message",
  successMessage: "Thank you!",
  fields: [
    { name: "name", type: "text", label: "Name", placeholder: "Your name", required: true, helpText: "" },
    { name: "email", type: "email", label: "Email", placeholder: "you@example.com", required: true, helpText: "" },
    { name: "message", type: "textarea", label: "Message", placeholder: "", required: false, helpText: "Optional" },
  ],
};

describe("ContactFormEmbed", () => {
  it("renders all configured fields", () => {
    render(<ContactFormEmbed config={config} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders textarea for textarea type fields", () => {
    render(<ContactFormEmbed config={config} />);
    expect(screen.getByLabelText(/message/i).tagName).toBe("TEXTAREA");
  });

  it("renders submit button with configured label", () => {
    render(<ContactFormEmbed config={config} />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    render(<ContactFormEmbed config={config} />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(screen.getByText("Thank you!")).toBeInTheDocument();
    });
  });

  it("shows error message when submission fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    render(<ContactFormEmbed config={config} />);
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
