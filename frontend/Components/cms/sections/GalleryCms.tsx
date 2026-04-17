import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import OrnamentalDivider from "../../ornaments/OrnamentalDivider";
import BackgroundTexture from "../../shared/BackgroundTexture";
import type { GetPageBySlugMediaGallerySection } from "../../../lib/strapi-cms/strapiApi";
import {
  getStrapiMediaUrl,
  buildStrapiSrcSet,
} from "../../../lib/strapi-cms/strapiApi";
import { logger } from "../../../lib/logger";
import { MediaFile } from "strapi-typed-client";

interface GalleryCmsProps {
  data: Exclude<GetPageBySlugMediaGallerySection, "Images"> & {
    Images: NonNullable<GetPageBySlugMediaGallerySection["Images"]>;
  };
  className?: string;
}

export default function GalleryCms(props: GalleryCmsProps) {
  const { data, className } = props;
  const {
    pagination_count,
    pagination_filter: _not_implemented,
    title,
    use_pagination,
    Images,
  } = data;

  logger.warn({
    message: "pagination_filter feature is not implemented.",
  });

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);

  // Using state to augment if use_pagination is true, varied by pagination_count or pagination_filter
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [imageData, setImageData] = useState(Images);

  // Set state based on pagination count
  const usePaginationCount = use_pagination && pagination_count;
  useEffect(() => {
    if (usePaginationCount) {
      const paginatedImages = paginateImages(Images, pagination_count);

      setTotalPages(paginateImages.length);
      setImageData(paginatedImages[currentPage]);
    }
  }, [currentPage]);

  return (
    <section
      ref={ref}
      className={`section bg-stone-dark relative ${className ?? ""}`}
    >
      <BackgroundTexture variant="gallery" opacity={0.04} />
      <div className="absolute inset-0 bg-linear-to-b from-void/40 via-transparent to-void/40" />

      <div className="section-container relative z-10">
        <div className="flex flex-col gap-12">
          {/* Section header */}
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl">{title}</h2>
            </motion.div>
          )}

          <OrnamentalDivider />

          <div className="columns-2 md:columns-3 gap-4">
            {imageData.map((item, index) => (
              <GalleryImageTile
                key={item.id ?? index}
                image={item}
                index={index}
                isInView={isInView}
                onOpenLightbox={() => setSelectedImage(item)}
              />
            ))}
          </div>

          {use_pagination && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-6"
            >
              <button
                onClick={() => {
                  // use requestAnimationFrame to trigger the scroll on the very next frame after setCurrentPage causes React to re-render.
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  });

                  return setCurrentPage((p) => Math.max(0, p - 1));
                }}
                disabled={currentPage === 0}
                className="font-mono text-xs uppercase tracking-wider px-5 py-2 border border-fog/20 text-stone-grey hover:text-silver-white hover:border-pale-gold/40 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
              >
                ← Previous
              </button>
              <span className="font-mono text-xs text-stone-grey uppercase tracking-wider">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => {
                  // use requestAnimationFrame to trigger the scroll on the very next frame after setCurrentPage causes React to re-render.
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  });

                  return setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
                }}
                disabled={currentPage === totalPages - 1}
                className="font-mono text-xs uppercase tracking-wider px-5 py-2 border border-fog/20 text-stone-grey hover:text-silver-white hover:border-pale-gold/40 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next →
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <GalleryLightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function paginateImages(
  array: GalleryCmsProps["data"]["Images"],
  size: number,
) {
  const matrix = [];
  for (let i = 0; i < array.length; i += size) {
    matrix.push(array.slice(i, i + size));
  }
  return matrix;
}
// ─── Sub-components ────────────────────────────────────────────────────────────

function GalleryImageTile({
  image,
  index,
  isInView,
  onOpenLightbox,
}: {
  image: MediaFile;
  index: number;
  isInView: boolean;
  onOpenLightbox: () => void;
}) {
  const src = getStrapiMediaUrl(image.url);
  const srcSet = buildStrapiSrcSet(image);
  const [loaded, setLoaded] = useState(false);

  // Derive aspect ratio from Strapi metadata to prevent layout shifts
  const aspectRatio =
    image.width && image.height ? image.width / image.height : null;

  const tileClassName =
    "group relative cursor-pointer overflow-hidden border border-fog/20 heavy-shadow transition-all duration-700 hover:border-pale-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-pale-gold break-inside-avoid mb-4 block";

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: {
      duration: 0.7,
      delay: index * 0.08,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  const innerContent = (
    <>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700 z-10" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700 z-10" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700 z-10" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-pale-gold/20 group-hover:border-pale-gold/60 transition-colors duration-700 z-10" />

      {src ? (
        <div
          className="relative w-full overflow-hidden"
          style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
        >
          {/* Skeleton — visible until image loads */}
          {!loaded && (
            <div className="absolute inset-0 z-5">
              <div className="w-full h-full bg-stone-deeper animate-pulse" />
              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-linear-to-r from-transparent via-pale-gold/5 to-transparent" />
              {/* Subtle inner border echo */}
              <div className="absolute inset-3 border border-fog/10" />
            </div>
          )}
          <img
            src={src}
            srcSet={srcSet ?? undefined}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
            alt={image.alternativeText || ""}
            onLoad={() => setLoaded(true)}
            className={`w-full h-auto block transition-all duration-700 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        </div>
      ) : null}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-pale-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Alt text caption on hover */}
      {image.alternativeText && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-void/80 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
          <p className="font-mono text-[10px] text-silver-white uppercase tracking-wide line-clamp-2">
            {image.alternativeText}
          </p>
        </div>
      )}
    </>
  );

  return (
    <motion.button
      {...motionProps}
      onClick={onOpenLightbox}
      className={tileClassName}
      aria-label={`View ${image.alternativeText || `image ${index + 1}`}`}
    >
      {innerContent}
    </motion.button>
  );
}

function GalleryLightbox({
  image,
  onClose,
}: {
  image: MediaFile;
  onClose: () => void;
}) {
  const src = getStrapiMediaUrl(image.url);
  const srcSet = buildStrapiSrcSet(image);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-void/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[95vw] max-h-[95vh] w-full flex flex-col"
      >
        <div className="bg-stone-dark border-2 border-fog/20 heavy-shadow relative flex flex-col max-h-[95vh]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-stone-grey hover:text-silver-white transition-colors duration-500 border border-fog/20 bg-stone-deeper z-20"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-pale-gold/40 z-10" />
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-pale-gold/40 z-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-pale-gold/40 z-10" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pale-gold/40 z-10" />

          {src ? (
            <div className="min-h-0 flex-1 overflow-hidden">
              <img
                src={src}
                srcSet={srcSet ?? undefined}
                sizes="(max-width: 1280px) 90vw, 1024px"
                alt={image.alternativeText || ""}
                className="w-full h-full object-contain max-h-[calc(95vh-4rem)]"
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center">
              <p className="text-fog italic text-sm">Image unavailable</p>
            </div>
          )}

          {image.alternativeText && (
            <div className="border-t border-fog/20 px-8 py-5 bg-stone-deeper/50">
              <p className="font-mono text-sm text-silver-white uppercase tracking-wide">
                {image.alternativeText}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
