import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Section, Container } from '@/Components/layout/Section';
import BackgroundTexture from '@/Components/shared/BackgroundTexture';

export default function CtaCms({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { headline, body, button_text, button_link } = data ?? {};

  return (
    <Section background="stone-dark" className="relative overflow-hidden" ref={ref}>
      <BackgroundTexture variant="rune" opacity={0.03} />
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 border border-fog/20 bg-stone-deeper">
                <Sparkles className="w-10 h-10 text-pale-gold" />
              </div>
            </motion.div>
            {headline && (
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl font-display"
              >
                {headline}
              </motion.h2>
            )}
            {body && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-stone-grey max-w-2xl"
              >
                {body}
              </motion.p>
            )}
            {button_text && button_link && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={button_link} className="btn-primary">
                  {button_text}
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
