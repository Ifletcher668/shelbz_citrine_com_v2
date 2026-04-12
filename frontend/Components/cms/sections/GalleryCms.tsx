import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { Section, Container } from "../../layout/Section";
import OrnamentalDivider from "../../ornaments/OrnamentalDivider";
import BackgroundTexture from "../../shared/BackgroundTexture";
import type { StrapiCms } from "../../../lib/types";
import {
  getStrapiMediaUrl,
  buildStrapiSrcSet,
} from "../../../lib/strapi-cms/strapiApi";

interface GalleryCmsProps {
  data?: StrapiCms.MediaGallery;
  galleries?: StrapiCms.MediaGallery[];
  className?: string;
}

interface GalleryItem {
  image: StrapiCms.MediaFile;
  path: string | null;
}

/**
 * GalleryCms — CMS-driven image gallery with optional tab-based or route-based pagination.
 *
 * Props (two modes):
 *   data       — Single StrapiMediaGallery entry (route-paginated page or solo gallery)
 *   galleries  — Array of StrapiMediaGallery entries (tab mode; grouped by DynamicZone)
 *   className  — Optional positioning class from DynamicZone
 */
export default function GalleryCms({
  data,
  galleries,
  className,
}: GalleryCmsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] =
    useState<StrapiCms.MediaFile | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Normalise to an array so the rest of the component has one path
  const galleryList = galleries?.length ? galleries : data ? [data] : [];
  const activeGallery = galleryList[activeTab] ?? null;
  const hasMultipleTabs = galleryList.length > 1;

  if (!activeGallery) return null;

  const { title, Images } = activeGallery;
  const galleryItems: GalleryItem[] = (Images ?? []).map((image) => ({
    image,
    path: null,
  }));

  return (
    <section
      ref={ref}
      className={`section bg-stone-dark relative ${className ?? ""}`}
    >
      <BackgroundTexture variant="gallery" opacity={0.04} />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />

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

          {/* Tab bar — only shown when multiple galleries are present */}
          {hasMultipleTabs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-wrap justify-center gap-1 border border-fog/20"
              role="tablist"
              aria-label="Gallery years"
            >
              {galleryList.map((gallery, i) => {
                const tabLabel = gallery.title ?? `Group ${i + 1}`;
                return (
                  <button
                    key={gallery.id ?? i}
                    role="tab"
                    aria-selected={i === activeTab}
                    onClick={() => setActiveTab(i)}
                    className={`font-mono text-xs uppercase tracking-wider px-5 py-2 transition-all duration-300 ${
                      i === activeTab
                        ? "bg-pale-gold/15 text-pale-gold border-b border-pale-gold"
                        : "text-stone-grey hover:text-silver-white hover:bg-fog/5"
                    }`}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </motion.div>
          )}

          <OrnamentalDivider />

          {/* Image grid */}
          {galleryItems.length > 0 ? (
            <div className="columns-2 md:columns-3 gap-4">
              {galleryItems.map((item, index) => (
                <GalleryImageTile
                  key={item.image?.id ?? index}
                  item={item}
                  index={index}
                  isInView={isInView}
                  onOpenLightbox={() => setSelectedImage(item.image)}
                />
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center text-fog italic text-sm"
            >
              No images in this gallery yet.
            </motion.p>
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function GalleryImageTile({
  item,
  index,
  isInView,
  onOpenLightbox,
}: {
  item: GalleryItem;
  index: number;
  isInView: boolean;
  onOpenLightbox: () => void;
}) {
  const { image, path } = item;
  const src = getStrapiMediaUrl(image.url);
  const srcSet = buildStrapiSrcSet(image);

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
        <img
          src={src}
          srcSet={srcSet ?? undefined}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
          alt={image.alternativeText || ""}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
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

  if (path) {
    return (
      <motion.div {...motionProps} className={tileClassName}>
        <Link
          href={path}
          aria-label={image.alternativeText || `Go to ${path}`}
        >
          {innerContent}
        </Link>
      </motion.div>
    );
  }

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
  image: StrapiCms.MediaFile;
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
