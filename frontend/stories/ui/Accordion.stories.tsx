import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../Components/ui/accordion";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const FAQ_ITEMS = [
  {
    value: "q1",
    question: "How long does a commission take?",
    answer:
      "Most commissions require 4–6 weeks from stone selection to finished piece. Complex settings or custom alloy work may extend this to 8–10 weeks. We will confirm a timeline during your consultation.",
  },
  {
    value: "q2",
    question: "What metals do you work with?",
    answer:
      "We forge in 18kt and 22kt yellow gold, argentium silver, and hand-alloyed bronze. We do not work with plated metals — every piece is solid.",
  },
  {
    value: "q3",
    question: "Can I supply my own stones?",
    answer:
      "Yes. We accept client-supplied stones with provenance documentation. We reserve the right to decline stones that show fractures or inclusions that compromise the setting.",
  },
];

export const Default: Story = {
  render: () => (
    <div
      className="max-w-2xl p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <Accordion type="single" collapsible>
        {FAQ_ITEMS.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger
              style={{ color: "var(--color-text-heading)" }}
            >
              {question}
            </AccordionTrigger>
            <AccordionContent style={{ color: "var(--color-text-body)" }}>
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const MultipleOpen: Story = {
  name: "Multiple Open",
  render: () => (
    <div
      className="max-w-2xl p-8"
      style={{ background: "var(--color-bg-base)" }}
    >
      <Accordion type="multiple" defaultValue={["q1", "q2"]}>
        {FAQ_ITEMS.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger
              style={{ color: "var(--color-text-heading)" }}
            >
              {question}
            </AccordionTrigger>
            <AccordionContent style={{ color: "var(--color-text-body)" }}>
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
