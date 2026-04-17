import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../Components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Available", variant: "default" },
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-3 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  name: "Status Examples",
  render: () => (
    <div className="flex flex-wrap gap-3 p-8" style={{ background: "var(--color-bg-base)" }}>
      <Badge variant="default">Available</Badge>
      <Badge variant="secondary">Commission Open</Badge>
      <Badge variant="outline">Heirloom Grade</Badge>
      <Badge variant="destructive">Sold</Badge>
    </div>
  ),
};
