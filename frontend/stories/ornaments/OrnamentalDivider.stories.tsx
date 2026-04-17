import type { Meta, StoryObj } from "@storybook/react";
import OrnamentalDivider, {
  SimpleDivider,
  DividerLine,
  TripleDivider,
} from "../../Components/ornaments/OrnamentalDivider";

const meta: Meta = {
  title: "Ornaments/OrnamentalDivider",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Decorative dividers for section breaks. All variants use `--color-pale-gold` and `--color-aged-gold` tokens.",
      },
    },
  },
};

export default meta;

export const AllVariants: StoryObj = {
  name: "All Variants",
  render: () => (
    <div
      className="flex flex-col gap-12 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          OrnamentalDivider size=&quot;full&quot;
        </p>
        <OrnamentalDivider size="full" />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          OrnamentalDivider size=&quot;lg&quot;
        </p>
        <OrnamentalDivider size="lg" />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          OrnamentalDivider size=&quot;md&quot; (default)
        </p>
        <OrnamentalDivider size="md" />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          OrnamentalDivider size=&quot;sm&quot;
        </p>
        <OrnamentalDivider size="sm" />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          SimpleDivider
        </p>
        <SimpleDivider />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          DividerLine
        </p>
        <DividerLine />
      </div>
      <div>
        <p
          className="text-xs font-mono mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          TripleDivider
        </p>
        <TripleDivider />
      </div>
    </div>
  ),
};

export const InContext: StoryObj = {
  name: "In Context",
  render: () => (
    <div
      className="max-w-2xl mx-auto p-8 flex flex-col gap-6"
      style={{ background: "var(--color-bg-base)" }}
    >
      <p
        className="text-center font-display tracking-wider text-2xl"
        style={{ color: "var(--color-text-heading)" }}
      >
        Multigenerational Craft
      </p>
      <OrnamentalDivider size="md" />
      <p
        className="text-center"
        style={{ color: "var(--color-text-body)" }}
      >
        For seven generations, artisans have forged pieces that outlast their
        wearers.
      </p>
      <SimpleDivider />
      <p
        className="text-center text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        — Shelbz Citrine, est. 1847
      </p>
    </div>
  ),
};
