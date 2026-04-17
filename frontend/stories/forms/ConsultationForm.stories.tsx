import type { Meta, StoryObj } from "@storybook/react";
import ConsultationForm from "../../Components/forms/ConsultationForm";

const meta: Meta<typeof ConsultationForm> = {
  title: "Forms/ConsultationForm",
  component: ConsultationForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Three-step multi-page consultation form. Step 1: contact info + consultation type. Step 2: ring details (budget, metal, finger, stone). Step 3: vision + optional photo uploads. Uses Netlify Forms for submission.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConsultationForm>;

export const Step1: Story = {
  name: "Step 1 — Contact Info",
  render: () => (
    <div
      className="max-w-2xl mx-auto p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <ConsultationForm />
    </div>
  ),
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  render: () => (
    <div
      className="max-w-2xl mx-auto p-8"
      style={
        {
          "--color-bg-base": "#1a0f05",
          "--color-accent": "#d4a020",
          "--color-text-heading": "#f0e8d0",
        } as React.CSSProperties
      }
    >
      <ConsultationForm />
    </div>
  ),
};
