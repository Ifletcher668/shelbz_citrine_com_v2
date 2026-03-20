import Link from "next/link";
import { Section, Container } from "@/Components/layout/Section";

const ALIGN_CLASSES = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function ButtonCms({ data }) {
  const { text, link, variant = "primary", alignment = "center", anchor_id } = data ?? {};

  if (!text || !link) return null;

  return (
    <Section id={anchor_id}>
      <Container>
        <div className={`flex ${ALIGN_CLASSES[alignment] ?? ALIGN_CLASSES.center}`}>
          <Link href={link} className={variant === "secondary" ? "btn-secondary" : "btn-primary"}>
            {text}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
