import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../../Components/ui/textarea";
import { Label } from "../../Components/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Textarea input — styled to match the Input component.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Describe your vision..." },
  render: (args) => (
    <div className="w-80 flex flex-col gap-2">
      <Label htmlFor="vision">Your Vision</Label>
      <Textarea id="vision" {...args} />
    </div>
  ),
};

export const WithCharacterCount: Story = {
  name: "With Character Count",
  render: () => {
    // Using a wrapper component to manage state
    return (
      <div className="w-96 flex flex-col gap-2">
        <Label htmlFor="vision2">Tell Us Your Vision</Label>
        <Textarea
          id="vision2"
          placeholder="Describe your dream ring... What style speaks to you? Any specific details or inspirations?"
          rows={5}
          maxLength={500}
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">0 / 500 characters</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This field is disabled.",
    disabled: true,
  },
  render: (args) => (
    <div className="w-80 flex flex-col gap-2">
      <Label htmlFor="disabled-ta">Disabled</Label>
      <Textarea id="disabled-ta" {...args} />
    </div>
  ),
};
