import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Content container using `--color-card` and `--color-card-foreground` tokens. Border radius is zero (brutalist) per the layout token defaults.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <div className="p-8" style={{ background: "var(--color-bg-base)" }}>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Black Spinel Signet</CardTitle>
          <CardDescription>Commission — estimated 4–6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
            Black spinel cleaves along octahedral planes, ranking 8 on the Mohs
            scale. More durable than sapphire for daily wear.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Begin Commission</Button>
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithBadge: Story = {
  name: "With Badge",
  render: () => (
    <div className="p-8" style={{ background: "var(--color-bg-base)" }}>
      <Card className="max-w-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Crimson Garnet Ring</CardTitle>
            <Badge variant="secondary">Available</Badge>
          </div>
          <CardDescription>18kt gold, bezel-set garnet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
            The same bezel-setting method that secured Mughal court jewels now
            cradles this 2.5ct stone.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const Grid: Story = {
  name: "Card Grid",
  render: () => (
    <div
      className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      style={{ background: "var(--color-bg-base)" }}
    >
      {[
        { title: "Black Spinel Signet", desc: "Bezel-set, 18kt gold" },
        { title: "Crimson Garnet Cuff", desc: "Hammered brass, cold-forged" },
        { title: "Moonstone Pendant", desc: "Sterling silver, cab-cut" },
      ].map(({ title, desc }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: "var(--color-text-body)" }}>
              Forged in the old way. The stone remembers darkness.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
