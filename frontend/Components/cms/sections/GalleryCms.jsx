import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Section, Container } from '@/Components/layout/Section';
import OrnamentalDivider from '@/Components/ornaments/OrnamentalDivider';
import { getStrapiMediaUrl } from '@/lib/strapi';

export default function GalleryCms({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { title, images } = data;

  if (!images || images.length === 0) return null;

  return (
    <Section background="stone-dark" className="relative" ref={ref}>
      <Container>
        <div className="flex flex-col gap-12">
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-display">{title}</h2>
            </motion.div>
          )}
          <OrnamentalDivider />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.documentId || image.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative aspect-square bg-stone-deeper border border-fog/20 overflow-hidden"
              >
                <Image
                  src={getStrapiMediaUrl(image.url)}
                  alt={image.alternativeText || image.name || ''}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  unoptimized
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
