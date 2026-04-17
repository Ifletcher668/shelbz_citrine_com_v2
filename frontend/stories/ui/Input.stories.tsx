import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import React from "react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Text input using `--color-input`, `--color-ring`, and `--color-muted-foreground` tokens for border, focus ring, and placeholder respectively.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Your name", type: "text" },
  render: (args) => (
    <div className="w-72 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Input {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  name: "All States",
  render: () => (
    <div
      className="flex flex-col gap-6 w-80 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <Input placeholder="stone@shelbzcitrine.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>With value</Label>
        <Input defaultValue="Isiah Fletcher" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <Input placeholder="Not available" disabled />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Error state</Label>
        <Input
          placeholder="Required"
          className="border-destructive focus-visible:ring-destructive"
          aria-invalid="true"
        />
        <p className="text-xs" style={{ color: "var(--color-danger)" }}>
          This field is required.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Email</Label>
        <Input type="email" placeholder="hello@shelbzcitrine.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Tel</Label>
        <Input type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  ),
};
