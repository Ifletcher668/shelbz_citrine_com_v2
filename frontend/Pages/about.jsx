import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import PageLayout from "@/Components/layout/PageLayout";
import { Section, Container } from "@/Components/layout/Section";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import {
  Shield,
  Users,
  Leaf,
  BookOpen,
  ExternalLink,
  Gem,
  Globe,
  Award,
} from "lucide-react";

/**
 * About Page - "The Manifesto"
 * Our mission, values, and partnership
 * Literary voice: Popova-cited + Robbins-playful + Rothfuss-romantic
 */
export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Untreated, Documented Gemstones",
      description:
        "Every black spinel we source comes from artisanal mining cooperatives in India and Thailand. Untreated (no heat, no irradiation, no fracture-filling). Unenhanced (what you see is what the earth made). Our in-house gemmologist has been visiting these sites for 30+ years—this isn't a supplier relationship, it's a partnership with people whose names we know.",
    },
    {
      icon: Users,
      title: "Seventh-Generational Artisans",
      description:
        "The workshops in India and Thailand that forge your rings have been operated by multigenerational artisan families for over a century. They learned kundan setting, granulation, and repoussé from their parents, who learned from theirs, seven generations back. This is documented lineage, not marketing folklore. The apprenticeship period is 10-15 years before an artisan touches precious metal unsupervised.",
    },
    {
      icon: Leaf,
      title: "Zero Waste, Made-to-Order Only",
      description:
        "We don't keep inventory. We don't mass-produce. Every ring is commissioned individually—forged only after you approve the design. Scrap gold is recycled back into the next commission. Offcuts are melted down. Gemstone dust from cutting is collected and sold to paint manufacturers (yes, really—traditional Indian miniature painting uses ground gemstones). Nothing is wasted because nothing is made speculatively.",
    },
    {
      icon: BookOpen,
      title: "Education Over Sales",
      description:
        "We teach you the difference between cast and forged metal, between heat-treated and untreated gemstones, between kundan and prong settings. We cite our sources (Pliny's *Natural History*, the Shilpa Shastras, Ananda Coomaraswamy's writings on craft). If you walk away from our consultation knowing more about jewelry but decide to go elsewhere, we've succeeded. An informed client is better than a trusting one.",
    },
  ];

  const expertise = [
    {
      icon: Gem,
      title: "In-House Gemmology",
      stat: "30+ Years",
      detail:
        "Sourcing directly from artisanal miners in South Asia. Can distinguish natural from synthetic, treated from untreated, by eye and under microscope.",
    },
    {
      icon: Globe,
      title: "Supply Chain Transparency",
      stat: "2 Countries",
      detail:
        "India and Thailand. We can name the mining cooperatives. We visit annually. This is documentation, not marketing.",
    },
    {
      icon: Award,
      title: "Traditional Techniques",
      stat: "5 Centuries",
      detail:
        "Kundan setting (pure gold foil burnishing), granulation (microscopic gold sphere application), repoussé (metal shaping from reverse side)—methods documented in 5th century CE treatises, still practiced today.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          About Heritage Jewelry | Multigenerational Craft & Ethical Sourcing
        </title>
        <meta
          name="description"
          content="Heritage Jewelry bridges ethical Indian craftsmanship with discerning clients. Bespoke black spinel rings from seventh-generational artisans at Royal Karkhana. Olympia, WA & nationwide."
        />
        <link rel="canonical" href="https://heritagejewelry.com/about" />
      </Head>

      <PageLayout>
          {/* Hero - The Mission */}
          <Section background="stone-dark" className="relative" variant="hero">
            <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/60 opacity-70" />

            <Container className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="flex flex-col gap-12">
                  <h1>We Bridge the Gap</h1>
                  <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                    <p>
                      Between American demand for ethically sourced, naturally
                      beautiful goods and the lack of accessible supply. There
                      are artisans in India and Thailand who still practice
                      kundan setting—the same technique that secured gemstones
                      in Mughal court jewelry. Their workshops don't have
                      websites. They don't ship to Amazon. They work through
                      partnerships with people who understand what they do and
                      can explain it to clients 8,000 miles away.
                    </p>
                    <p>
                      A seventh-generational metalworker in Jaipur learned his
                      craft by watching his father shape gold for fifteen years
                      before he was allowed to work unsupervised. His father
                      learned the same way. The apprenticeship system that
                      trained him is older than the United States. When he sets
                      a black spinel using pure 24kt gold foil and a burnisher,
                      he's using the same method described in 5th-century CE
                      treatises on craft.
                    </p>
                    <p className="text-pale-gold italic">
                      Ananda Coomaraswamy wrote in *The Transformation of Nature
                      in Art* (1934): "The artist is not a special kind of man,
                      but every man is a special kind of artist." In Jaipur and
                      Bangkok, grandsons still watch their grandfathers shape
                      metal the way their grandfathers watched theirs.
                    </p>
                  </div>
                </div>
              </motion.div>

              <OrnamentalDivider />
            </Container>
          </Section>

          {/* The Problem We're Solving */}
          <Section className="relative">
            <Container className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex flex-col gap-12">
                  <h2 className="text-center">
                    The Industry Problem:
                    <br />
                    <span className="text-pale-gold italic">
                      Words That Lost Their Meaning
                    </span>
                  </h2>

                  <div className="flex flex-col gap-8">
                    <p>
                      <strong className="text-silver-white">"Handmade"</strong>{" "}
                      used to mean forged by hand—hammer, anvil, fire. Now it
                      means "we touched it at some point during the
                      mass-production process." Cast rings poured from molds by
                      the thousand qualify as "handmade" if someone filed the
                      edges afterward.
                    </p>
                    <p>
                      <strong className="text-silver-white">
                        "Natural gemstones"
                      </strong>{" "}
                      used to mean unaltered by humans beyond cutting and
                      polishing. Now it means "originally came from the ground"
                      (even if it was heat-treated at 1800°C, irradiated with
                      gamma rays, and fracture-filled with glass). The FTC
                      allows this. Consumers don't know to ask.
                    </p>
                    <p>
                      <strong className="text-silver-white">
                        "Ethical sourcing"
                      </strong>{" "}
                      used to mean direct relationships with miners who are
                      fairly compensated and work safely. Now it means "we
                      bought from a supplier who filled out the right
                      paperwork." The chain of custody is whatever you want it
                      to be if you're willing to pay for the right
                      certifications.
                    </p>
                    <p>
                      <strong className="text-silver-white">"Bespoke"</strong>{" "}
                      derives from 16th-century tailoring: fabric that has been
                      "spoken for"—claimed by a specific client before shears
                      ever touched wool. A Savile Row tailor would take
                      measurements, sketch the pattern, cut the cloth, and shape
                      it to the client's body through multiple fittings. The
                      word meant collaboration from the first conversation to
                      the final stitch. Now it means picking from three
                      pre-designed options and getting your name engraved on the
                      inside.
                    </p>
                  </div>
                </div>
              </motion.div>
            </Container>
          </Section>

          {/* Royal Karkhana Partnership */}
          <Section background="stone-dark" className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/40" />

            <Container className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col gap-12">
                  <h2 className="text-4xl md:text-5xl text-center">
                    Crafted in Partnership with
                    <br />
                    <span className="text-pale-gold">Royal Karkhana</span>
                  </h2>

                  <div className="max-w-4xl mx-auto">
                    <div className="bg-stone-deeper border border-fog/20 heavy-shadow p-10 relative">
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-pale-gold/30" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pale-gold/30" />

                      <div className="flex flex-col gap-8 text-lg">
                        <p>
                          <strong className="text-silver-white text-xl">
                            Royal Karkhana
                          </strong>{" "}
                          operates jewelry workshops in India and Thailand where
                          seventh-generational artisans practice techniques
                          unchanged since the Mughal court commissioned its
                          regalia. "Karkhana" means royal workshop in Persian—a
                          term that predates the British Raj and still carries
                          weight in traditional craft circles.
                        </p>
                        <p>
                          The artisan families who operate these workshops have
                          been metalworking for over a century. The grandfather
                          of the man who might forge your ring learned his trade
                          in the 1920s. His father learned in the 1950s.
                          Apprenticeship records document seven generations of
                          this. They don't advertise. They don't have
                          consumer-facing websites. A workshop with thirty years
                          of orders from returning clients doesn't need
                          Instagram.
                        </p>
                        <p>
                          <strong className="text-pale-gold">
                            What they do:
                          </strong>{" "}
                          Kundan setting (pure 24kt gold foil burnished between
                          gemstone and metal, creating an invisible, glue-free
                          bond). Granulation (microscopic gold spheres applied
                          individually with tweezers and heat—an ancient
                          Etruscan technique). Repoussé (shaping metal from the
                          reverse side to create relief patterns).
                          Hand-engraving with tools older than the building.
                        </p>
                        <p>
                          <strong className="text-pale-gold">
                            What they don't do:
                          </strong>{" "}
                          Casting. Mass production. Rush orders that compromise
                          quality. Design work that violates material logic (if
                          it can't be made without structural weakness, they'll
                          tell you why and suggest alternatives).
                        </p>
                        <p className="text-fog italic text-sm pt-8 border-t border-fog/20">
                          Kundan setting requires heating pure 24kt gold foil to
                          precisely the temperature where it becomes malleable
                          enough to burnish between stone and metal but not so
                          hot it melts. Too cool and the bond fails. Too hot and
                          you've ruined the setting. This is knowledge learned
                          through years of watching someone who learned by
                          watching someone else. Your ring takes 4-8 weeks
                          because rushing produces structural flaws that appear
                          six months after you start wearing it daily.
                        </p>
                      </div>

                      <div className="flex flex-col gap-12">
                        <div /> {/* Spacer */}
                        <div className="flex items-center justify-center">
                          <a
                            href="https://royalkarkhana.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 font-mono text-sm text-pale-gold hover:text-silver-white uppercase tracking-wider transition-colors duration-500"
                          >
                            Visit Royal Karkhana's Website
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Container>
          </Section>

          {/* Our Values - Expanded */}
          <Section className="relative">
            <Container className="relative z-10">
              <div className="flex flex-col gap-12">
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-5xl text-silver-white text-center"
                >
                  Our Principles
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          delay: index * 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-stone-deeper tension-border heavy-shadow p-8 relative group"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0 w-16 h-16 bg-void border border-pale-gold/30 group-hover:border-pale-gold transition-colors duration-700 flex items-center justify-center">
                            <Icon className="w-8 h-8 text-pale-gold" />
                          </div>
                          <div className="flex flex-col gap-6 flex-1">
                            <h3 className="font-mono text-lg uppercase tracking-wide">
                              {value.title}
                            </h3>
                            <p className="text-md">{value.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Container>
          </Section>

          <Section background="stone-dark" className="relative">
            <Container className="relative z-10">
              <div className="flex flex-col gap-12">
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-5xl text-silver-white text-center"
                >
                  Expertise & Provenance
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {expertise.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          delay: index * 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-void border border-fog/20 heavy-shadow p-8 text-center"
                      >
                        <div className="flex flex-col gap-8">
                          <div className="flex items-center justify-center">
                            <Icon className="w-12 h-12 text-pale-gold" />
                          </div>
                          <div className="flex flex-col gap-6">
                            <h3 className="font-mono text-sm uppercase tracking-wider">
                              {item.title}
                            </h3>
                            <p className="text-3xl text-pale-gold">
                              {item.stat}
                            </p>
                          </div>
                          <p className="text-sm">{item.detail}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Container>
          </Section>

          {/* CTA */}
          <Section className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void to-transparent" />

            <Container size="narrow" className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-8">
                    <h2 className="text-4xl">Let's Create Together</h2>
                    <p className="text-lg max-w-2xl mx-auto">
                      The first consultation is 45-60 minutes. In-person in
                      Olympia, WA or via Zoom. You describe what you want; we
                      figure out if commissioning from artisans in India and
                      Thailand makes sense for what you're trying to do.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link href="/consultation" className="btn-primary">
                      Book a Free Consultation
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Container>
          </Section>
      </PageLayout>
    </>
  );
}
