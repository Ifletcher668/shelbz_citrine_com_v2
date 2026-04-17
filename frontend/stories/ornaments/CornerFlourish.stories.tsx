import type { Meta, StoryObj } from "@storybook/react";
import CornerFlourish, {
  FourCornerFlourish,
  GothicCorner,
} from "../../Components/ornaments/CornerFlourish";

const meta: Meta = {
  title: "Ornaments/CornerFlourish",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Decorative corner SVG ornaments. Positioned absolutely — the parent must have `position: relative`. All use `--color-pale-gold`.",
      },
    },
  },
};

export default meta;

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-64 h-48 flex items-center justify-center"
      style={{
        background: "var(--color-bg-raised)",
        border: "1px solid var(--color-accent)",
      }}
    >
      {children}
    </div>
  );
}

export const AllPositions: StoryObj = {
  name: "All Positions",
  render: () => (
    <div
      className="flex flex-wrap gap-8 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (position) => (
          <div key={position} className="flex flex-col items-center gap-2">
            <Panel>
              <CornerFlourish position={position} />
              <span
                className="text-xs font-mono"
                style={{ color: "var(--color-text-muted)" }}
              >
                {position}
              </span>
            </Panel>
          </div>
        )
      )}
    </div>
  ),
};

export const FourCorners: StoryObj = {
  name: "Four Corners",
  render: () => (
    <div className="p-8" style={{ background: "var(--color-bg-base)" }}>
      <Panel>
        <FourCornerFlourish />
        <span
          className="text-xs font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          FourCornerFlourish
        </span>
      </Panel>
    </div>
  ),
};

export const GothicStyle: StoryObj = {
  name: "Gothic Corners",
  render: () => (
    <div
      className="flex flex-wrap gap-8 p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (position) => (
          <Panel key={position}>
            <GothicCorner position={position} />
            <span
              className="text-xs font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              Gothic {position}
            </span>
          </Panel>
        )
      )}
    </div>
  ),
};
