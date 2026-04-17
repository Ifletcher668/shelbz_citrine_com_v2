import type { Meta, StoryObj } from "@storybook/react";
import BackgroundTexture from "../../Components/shared/BackgroundTexture";

const meta: Meta<typeof BackgroundTexture> = {
  title: "Ornaments/BackgroundTexture",
  component: BackgroundTexture,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Souls-like texture overlays. Positioned absolutely — the parent must have `position: relative` and `overflow: hidden`. At low opacity (0.003–0.02) these create a subtle grain effect; at high opacity (0.5+) they become dramatic patterns.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["metal", "stone", "rune", "gallery"],
    },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
};

export default meta;
type Story = StoryObj<typeof BackgroundTexture>;

function TextureDemo({
  variant,
  opacity,
  label,
}: {
  variant: string;
  opacity: number;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative w-48 h-32 overflow-hidden"
        style={{ background: "var(--color-bg-raised)" }}
      >
        <BackgroundTexture variant={variant as "metal" | "stone" | "rune" | "gallery"} opacity={opacity} />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <span
            className="text-xs font-mono px-2 py-1"
            style={{
              background: "rgba(0,0,0,0.5)",
              color: "var(--color-text-heading)",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export const AllVariants: StoryObj = {
  name: "All Variants",
  render: () => (
    <div
      className="flex flex-wrap gap-8 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <TextureDemo variant="metal" opacity={0.08} label="metal 0.08" />
      <TextureDemo variant="stone" opacity={0.08} label="stone 0.08" />
      <TextureDemo variant="rune" opacity={0.05} label="rune 0.05" />
      <TextureDemo variant="gallery" opacity={0.05} label="gallery 0.05" />
    </div>
  ),
};

export const OpacityScale: StoryObj = {
  name: "Opacity Scale — Metal",
  render: () => (
    <div
      className="flex flex-wrap gap-6 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      {[0.003, 0.01, 0.03, 0.08, 0.2, 0.5].map((opacity) => (
        <TextureDemo
          key={opacity}
          variant="metal"
          opacity={opacity}
          label={`opacity ${opacity}`}
        />
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { variant: "rune", opacity: 0.05 },
  render: (args) => (
    <div
      className="relative w-full h-64 flex items-center justify-center"
      style={{ background: "var(--color-bg-raised)" }}
    >
      <BackgroundTexture {...args} />
      <p
        className="relative z-10 font-display text-2xl tracking-widest"
        style={{ color: "var(--color-text-heading)" }}
      >
        Forged in the old way
      </p>
    </div>
  ),
};
