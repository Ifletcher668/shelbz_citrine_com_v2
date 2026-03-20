import Image from "next/image";
import { Section, Container } from "@/Components/layout/Section";
import { getStrapiMediaUrl } from "@/lib/strapi";

export default function ImageCms({ data }) {
  const { media, alt_text, anchor_id } = data ?? {};

  if (!media) return null;

  return (
    <Section id={anchor_id}>
      <Container>
        <div className="relative w-full">
          <Image
            src={getStrapiMediaUrl(media.url)}
            alt={alt_text || media.alternativeText || media.name || ""}
            width={media.width || 1200}
            height={media.height || 800}
            className="w-full h-auto"
            unoptimized
          />
        </div>
      </Container>
    </Section>
  );
}
