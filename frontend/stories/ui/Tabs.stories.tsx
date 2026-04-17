import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";

const meta: Meta = {
  title: "UI/Tabs",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Radix UI Tabs — accessible tab navigation with panel content.",
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs defaultValue="rings">
      <TabsList>
        <TabsTrigger value="rings">Rings</TabsTrigger>
        <TabsTrigger value="pendants">Pendants</TabsTrigger>
        <TabsTrigger value="earrings">Earrings</TabsTrigger>
      </TabsList>
      <TabsContent value="rings" className="mt-4">
        <p style={{ color: "var(--color-text-body)" }}>
          Heavy sterling silver and 14k gold rings featuring top-tier black
          spinel. Commission pieces starting at $385.
        </p>
      </TabsContent>
      <TabsContent value="pendants" className="mt-4">
        <p style={{ color: "var(--color-text-body)" }}>
          Pendants and necklaces in the Adventurer and Heirloom collections.
        </p>
      </TabsContent>
      <TabsContent value="earrings" className="mt-4">
        <p style={{ color: "var(--color-text-body)" }}>
          Drop earrings, studs, and chandelier styles with paired black spinel.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithThemeOverride: StoryObj = {
  name: "With Theme Override",
  render: () => (
    <div
      style={
        {
          "--color-accent": "#d4a020",
          "--color-bg-base": "#1a0f05",
          "--color-text-heading": "#f0e8d0",
        } as React.CSSProperties
      }
    >
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="provenance">Provenance</TabsTrigger>
          <TabsTrigger value="care">Care</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <p style={{ color: "var(--color-text-body)" }}>
            Hand-forged in Jaipur by a seventh-generation artisan lineage.
          </p>
        </TabsContent>
        <TabsContent value="provenance" className="mt-4">
          <p style={{ color: "var(--color-text-body)" }}>
            Black spinel sourced from artisanal mines in South Asia.
          </p>
        </TabsContent>
        <TabsContent value="care" className="mt-4">
          <p style={{ color: "var(--color-text-body)" }}>
            Clean with warm water and a soft brush. Avoid ultrasonic cleaners.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
