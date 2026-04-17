import type { Meta, StoryObj } from "@storybook/react";
import SectionHeader from "../../Components/layout/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Layout/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Centered heading + optional subtitle. First child of InnerSection to title a content block. Supports OrnamentalDivider below via `divider` prop.",
      },
    },
  },
  argTypes: {
    headingAs: { control: "select", options: ["h1", "h2", "h3", "h4"] },
    width: { control: "select", options: ["full", "reading", "narrow"] },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    heading: "Multigenerational Craft",
    subtitle:
      "For seven generations, artisans in India and Thailand have been passing down the knowledge of jewelcrafting.",
    divider: false,
    headingAs: "h2",
    width: "narrow",
  },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <SectionHeader {...args} />
    </div>
  ),
};

export const WithDivider: Story = {
  args: {
    heading: "The Process",
    subtitle: "Five steps from consultation to delivery.",
    divider: true,
    headingAs: "h2",
  },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <SectionHeader {...args} />
    </div>
  ),
};

export const HeadingOnly: Story = {
  name: "Heading Only",
  args: { heading: "Frequently Asked Questions" },
  render: (args) => (
    <div style={{ background: "var(--color-bg-base)", padding: "2rem" }}>
      <SectionHeader {...args} />
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Heading Sizes",
  render: () => (
    <div
      className="flex flex-col gap-8"
      style={{ background: "var(--color-bg-base)", padding: "2rem" }}
    >
      {(["h1", "h2", "h3", "h4"] as const).map((tag) => (
        <SectionHeader
          key={tag}
          heading={`${tag.toUpperCase()} — Heirloom Craft`}
          subtitle="Seventh-generational artisans."
          headingAs={tag}
          headingSize={
            tag === "h1"
              ? "text-5xl md:text-6xl"
              : tag === "h2"
              ? "text-4xl md:text-5xl"
              : tag === "h3"
              ? "text-3xl"
              : "text-2xl"
          }
        />
      ))}
    </div>
  ),
};
