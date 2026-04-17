import type {
  GetPageBySlugReturn,
  GetMediaMetadataReturn,
} from "../../../lib/strapi-cms/strapiApi";
import { Section } from "../../layout/Section";
import GalleryCms from "../sections/GalleryCms";
import type { MediaFile } from "strapi-typed-client";

type Props = {
  page: GetPageBySlugReturn;
  mediaMetadata: GetMediaMetadataReturn;
};

export default function GalleryPage({ page, mediaMetadata }: Props) {
  const yearMedia =
    mediaMetadata?.filter((m) => String(m.metadata?.year) === page.title) ?? [];

  const autoImages: MediaFile[] = yearMedia
    .map((m) => m.Media)
    .filter(Boolean) as MediaFile[];

  return (
    <>
      <Section
        className="section-hero pb-20 text-center"
        background="stone-dark"
      >
        <h1>All my works for {page.title}</h1>
      </Section>

      {autoImages.length > 0 && (
        <GalleryCms
          data={{
            __component: "sections.media-gallery",
            id: 0,
            title: page.title,
            Images: autoImages,
            use_pagination: false,
            pagination_filter: null,
            pagination_count: null,
          }}
        />
      )}
    </>
  );
}
