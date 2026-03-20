"use client";
import { wysiwygMarked } from "@/lib/marked-extensions";
import Reveal from "@/Components/layout/Motion";
import { Section, Container } from "@/Components/layout/Section";
import InnerSection from "@/Components/layout/InnerSection";
import { cn } from "@/lib/utils";

export default function TextBlockCms({ data }) {
  const {
    body,
    container_size = "reading",
    background = "void",
    overlay = "none",
    texture = null,
    texture_opacity = 3,
    corners = "none",
    animation = "fade-up",
    vertical_spacing = "normal",
    anchor_id,
    enable_prose = true,
  } = data ?? {};

  const textureProps =
    texture && texture !== "none"
      ? { variant: texture, opacity: texture_opacity / 100 }
      : false;

  const cornersProps = corners && corners !== "none" ? corners : false;

  const parsed = body ? wysiwygMarked.parse(body) : null;

  const bodyEl = parsed ? (
    <div
      className={cn(enable_prose && "prose-heritage")}
      dangerouslySetInnerHTML={{ __html: parsed }}
    />
  ) : null;

  return (
    <Section
      background={background}
      overlay={overlay}
      texture={textureProps}
      corners={cornersProps}
      id={anchor_id}
    >
      <Container size={container_size}>
        {bodyEl && animation !== "none" ? (
          <Reveal effect={animation}>
            <InnerSection
              gap={vertical_spacing}
              className={cn(enable_prose && "prose-heritage")}
              dangerouslySetInnerHTML={{ __html: parsed }}
            />
          </Reveal>
        ) : (
          <InnerSection
            gap={vertical_spacing}
            className={cn(enable_prose && "prose-heritage")}
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        )}
      </Container>
    </Section>
  );
}
