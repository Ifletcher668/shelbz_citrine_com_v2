import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../Components/ui/button";
import { Mail, ArrowRight, Trash2, Loader2 } from "lucide-react";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "shadcn/ui Button with CVA variants. All colors are driven by CSS custom properties, so switching themes in the toolbar updates every variant automatically.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Book Consultation", variant: "default" },
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-4 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><Mail /></Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <div className="flex flex-wrap gap-4 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Button><Mail /> Send Inquiry</Button>
      <Button variant="outline">Begin Process <ArrowRight /></Button>
      <Button variant="destructive"><Trash2 /> Remove</Button>
      <Button variant="ghost" size="icon"><Loader2 className="animate-spin" /></Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: "Unavailable", disabled: true },
};

export const WithThemeOverride: Story = {
  name: "With Theme Override",
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-primary": "#d4a020",
            "--color-primary-foreground": "#0a0500",
            "--color-ring": "#d4a020",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex flex-wrap gap-4 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Button variant="default">Warm Gold Override</Button>
      <Button variant="outline">Outline Override</Button>
    </div>
  ),
};
