import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/Components/layout/Header';
import Footer from '@/Components/layout/Footer';
import OrnamentalDivider from '@/Components/ornaments/OrnamentalDivider';
import { Shield, Users, Leaf, BookOpen, ExternalLink } from 'lucide-react';

/**
 * About Page - "The Manifesto"
 * Our mission, values, and partnership
 */
export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Ethical Sourcing',
      description: 'Direct partnerships with ethical gem mines. No conflict stones, no exploitation.',
    },
    {
      icon: Users,
      title: 'Multigenerational Craft',
      description: 'Seventh-generation artisans preserving ancient techniques passed down through families.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'No mass production. No waste. Each piece made to order with minimal environmental impact.',
    },
    {
      icon: BookOpen,
      title: 'Education',
      description: 'We teach the difference between real craft and factory-made garbage marketed as "handmade".',
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | Heritage Jewelry</title>
        <meta
          name="description"
          content="Heritage Jewelry bridges ethical Indian craftsmanship with US clients. Bespoke jewelry from seventh-generation artisans at Royal Karkhana."
        />
        <link rel="canonical" href="https://heritagejewelry.com/about" />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main className="pt-32">
          {/* Hero */}
          <section className="section bg-parchment-dark relative">
            <div className="absolute inset-0 bg-vignette opacity-70" />

            <div className="section-narrow relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h1 className="font-cinzel text-5xl md:text-6xl text-bone-white leading-tight mb-space-6">
                  We Bridge the Gap
                </h1>
                <div className="font-crimson text-xl text-ash-grey leading-relaxed space-y-space-4 max-w-3xl mx-auto">
                  <p className="drop-cap">
                    Between American demand for high-quality, natural, ethical goods and the lack of accessible supply.
                    In a world drowning in cheap plastic garbage marketed as "premium," we educate people on what is <em className="text-aged-gold font-medium">REAL</em>.
                  </p>
                  <p>
                    We connect discerning clients directly to multigenerational artisans who create heirloom pieces
                    using traditional methods—the same techniques their families have perfected over seven generations.
                  </p>
                </div>
              </motion.div>

              <OrnamentalDivider />
            </div>
          </section>

          {/* Royal Karkhana Partnership */}
          <section className="section bg-ink-black relative">
            <div className="absolute inset-0 bg-gradient-to-b from-parchment-dark/40 via-transparent to-parchment-dark/40" />

            <div className="section-container relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-cinzel text-4xl md:text-5xl text-bone-white text-center mb-space-6">
                  Crafted in Partnership with
                  <br />
                  <span className="text-metallic-gold">Royal Karkhana</span>
                </h2>

                <div className="max-w-3xl mx-auto">
                  <div className="bg-vellum metallic-border heavy-shadow p-space-8 relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-aged-gold/30" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-aged-gold/30" />

                    <div className="font-crimson text-lg text-ash-grey leading-relaxed space-y-space-4">
                      <p>
                        <strong className="text-bone-white">Royal Karkhana</strong> is a workshop in Jaipur, India, where seventh-generation
                        artisans practice the ancient craft of jewelry-making exactly as their ancestors did.
                      </p>
                      <p>
                        No casting machines. No assembly lines. Every piece is hand-forged, hand-set, and hand-finished
                        by master craftspeople who learned their trade from their parents, who learned from theirs.
                      </p>
                      <p>
                        This is <em className="text-aged-gold">actual handmade</em>—not the Etsy definition.
                      </p>
                    </div>

                    <div className="mt-space-6 text-center">
                      <a
                        href="https://royalkarkhana.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-space-2 font-spectral text-sm text-aged-gold hover:text-amber-glow uppercase tracking-wider transition-colors duration-500"
                      >
                        Visit Royal Karkhana
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values */}
          <section className="section bg-parchment-dark relative">
            <div className="absolute inset-0 bg-vignette opacity-60" />

            <div className="section-container relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-cinzel text-4xl md:text-5xl text-bone-white text-center mb-space-10"
              >
                Our Values
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-space-6 max-w-5xl mx-auto">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-vellum tension-border heavy-shadow p-space-6 relative group"
                    >
                      <div className="flex items-start gap-space-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-obsidian border border-aged-gold/30 flex items-center justify-center group-hover:border-aged-gold transition-colors duration-700">
                          <Icon className="w-7 h-7 text-aged-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-spectral text-lg text-bone-white uppercase tracking-wide mb-space-2">
                            {value.title}
                          </h3>
                          <p className="font-crimson text-base text-ash-grey leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section bg-ink-black relative">
            <div className="absolute inset-0 bg-vignette" />

            <div className="section-narrow relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-cinzel text-4xl text-bone-white mb-space-5">
                  Let's Create Together
                </h2>
                <p className="font-crimson text-lg text-ash-grey mb-space-6 max-w-2xl mx-auto">
                  Ready to work with artisans who still remember how to make things that last?
                </p>
                <Link href="/consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
