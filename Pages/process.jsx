import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import { Section, Container } from "@/Components/layout/Section";
import {
  Calendar,
  Gem,
  PenTool,
  Hammer,
  Package,
  ArrowRight,
} from "lucide-react";

/**
 * Process Page - "How It Works: The Complete Journey"
 * Detailed explanation of the commissioning process
 * SEO-focused, drives to consultation form
 */
export default function Process() {
  const steps = [
    {
      icon: Calendar,
      number: "01",
      title: "Book a Consultation",
      subtitle: "The First Meeting",
      duration: "45-60 minutes",
      description:
        "In-person at our Olympia, WA studio or via Zoom nationwide. We discuss your vision, hand preferences (dominant hand wears differently), lifestyle (do you work with your hands?), and symbolism.",
      details: [
        "Bring photos of rings you love (and rings you hate—equally useful)",
        "We photograph your hands if designing for fit",
        "Budget discussion happens first, design happens within it",
        "You walk away with information, whether you book or not",
      ],
      whyItMatters:
        "Good design requires understanding how you'll actually wear the piece. A ring for someone who types eight hours a day needs different proportions than one for someone who works with clay. We ask questions most jewelers skip.",
    },
    {
      icon: Gem,
      number: "02",
      title: "Select Your Stone",
      subtitle: "Seeing Black Spinel",
      duration: "During or after consultation",
      description:
        "Black spinel is not onyx (chalcedony), not black diamond (carbon), not hematite (iron oxide). It's magnesium aluminum oxide with octahedral crystal structure. You'll see it in person or via high-resolution video—inclusions, luster, and all.",
      details: [
        "Sourced from artisanal mines in South Asia",
        "Untreated, unheated, unirradiated—what the earth made",
        "Mohs hardness 7.5-8 (harder than most gemstones, more durable than diamonds for daily wear)",
        "Carat weight, cut, and clarity discussed in plain language",
        "We can ship stones to you for in-person viewing (you return what you don't select)",
      ],
      whyItMatters:
        "Most 'natural' gemstones have been heat-treated at 1800°C, irradiated, or fracture-filled with glass. The FTC allows this. We show you untreated stones so you can see what the earth actually made—inclusions and all.",
    },
    {
      icon: PenTool,
      number: "03",
      title: "Design Together",
      subtitle: "From Vision to Sketch",
      duration: "Second consultation, 60-90 minutes",
      description:
        "Our artisan partner sketches in real-time during a second consultation (video call). You describe; they draw. Adjustments happen live. This is actual co-design, not 'pick from these three pre-made options.'",
      details: [
        "Metal choice: 18kt vs. 14kt gold (purity vs. durability), platinum (heavy, hypoallergenic), palladium (light, naturally white)",
        "Setting type: Bezel (protects stone edges, good for active hands), prong (shows more stone), tension (modern, requires specific stone cuts)",
        "Band width, thickness, and comfort-fit interior",
        "Any engraving (exterior decorative or interior personal)",
        "Technical decisions explained without jargon",
      ],
      whyItMatters:
        "A bezel setting that looks chunky in photos protects stone edges for someone who rock climbs. Prong settings show more stone but snag on sweaters. Tension settings are modern and minimal but only work with specific cuts. Design is engineering wearing aesthetics as a disguise.",
    },
    {
      icon: Hammer,
      number: "04",
      title: "The Workshop",
      subtitle: "Hand-Forging in India & Thailand",
      duration: "4-8 weeks depending on complexity",
      description:
        "Your ring is hand-forged at Royal Karkhana workshops using traditional kundan technique: the stone is set with pure gold foil burnished between gem and metal. No glue, no prongs (unless you requested them). The same method used for Mughal court jewelry.",
      details: [
        "Week 1-2: Initial forging and shaping of the band",
        "Week 3-4: Stone setting using kundan technique (pure 24kt gold foil)",
        "Week 5-6: Detail work (engraving, granulation, finishing)",
        "Week 7: Final polishing and quality inspection",
        "Progress photos sent at key stages: initial metalwork, stone setting, pre-polish, final piece",
      ],
      whyItMatters:
        "The artisan who sets your stone learned by watching his father for fifteen years before touching precious metal unsupervised. His father learned from his father the same way. This apprenticeship system is older than the United States. Mastery takes time—rushing it produces competence, not expertise.",
    },
    {
      icon: Package,
      number: "05",
      title: "Approval & Delivery",
      subtitle: "From Workshop to Your Finger",
      duration: "1 week for approval + shipping",
      description:
        "Before shipping, we send approval photos from every angle—6+ images plus video of the piece rotating under different lighting. You confirm it matches your vision. If anything looks off, we adjust it. No charge, no argument.",
      details: [
        "High-resolution photos: top view, side profile, interior, stone close-up, hand model wearing it",
        "Video: 360° rotation under natural and artificial light",
        "You have 48 hours to review and approve (or request changes)",
        "Once approved: insured international shipping via DHL (tracking provided)",
        "Packaging: handmade wooden box lined with raw silk",
        "Certificate of authenticity: artisan's signature, gemstone details, metal composition, care instructions",
      ],
      whyItMatters:
        "Commissioning jewelry sight-unseen from 8,000 miles away requires trust. We document everything—progress photos, approval images, video walkthroughs—so you know exactly what you're receiving before it leaves the workshop. If the physical piece doesn't match the approved photos (hasn't happened yet), we remake it.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          How It Works: Custom Black Spinel Ring Process | Heritage Jewelry
        </title>
        <meta
          name="description"
          content="Detailed guide to commissioning a custom black spinel engagement ring. Five steps from consultation to delivery: hand-forged by seventh-generational artisans in India & Thailand. 4-8 weeks, fully transparent process."
        />
        <meta
          name="keywords"
          content="custom ring process, bespoke jewelry process, how to commission ring, black spinel engagement ring process, hand-forged jewelry, traditional jewelry making"
        />
        <link rel="canonical" href="https://heritagejewelry.com/process" />
      </Head>

      <div className="min-h-screen bg-void">
        <Header />

        <main>
          {/* Hero */}
          <Section variant="hero" className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/60 opacity-70" />

            <Container className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col items-center gap-space-8">
                  <h1 className="text-5xl md:text-6xl font-light">
                    Vision to Heirloom{" "}
                    <span className="text-metallic-cold">in Five Steps</span>
                  </h1>
                  <p className="text-xl max-w-4xl">
                    From first conversation to finished piece: how a commission
                    moves through sketch, stone selection, metalwork, and
                    setting. The process takes weeks because each step requires
                    decisions that can't be rushed—the hand that wears the ring
                    must shape its making.
                  </p>
                </div>
              </motion.div>
            </Container>
          </Section>

          {/* Process Steps - Detailed */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <Section
                key={index}
                background={isEven ? "void" : "stone-dark"}
                className="relative"
              >
                <Container className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Step Header */}
                    <div className="flex gap-space-8 items-start mb-12">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-24 h-24 bg-stone-deeper border border-fog/20 heavy-shadow flex items-center justify-center">
                            <Icon className="w-10 h-10 text-pale-gold" />
                          </div>
                          <div className="absolute -top-3 -right-3 w-12 h-12 bg-deep-body border-2 border-pale-gold text-silver-white font-mono font-medium shadow-lg text-lg flex items-center justify-center">
                            {step.number}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-space-4 flex-1 pt-2">
                        <h2 className="text-4xl">{step.title}</h2>
                        <p className="text-xl text-pale-gold italic">
                          {step.subtitle}
                        </p>
                        <p className="font-mono text-sm text-fog uppercase tracking-wider">
                          Duration: {step.duration}
                        </p>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col gap-space-8 ml-32">
                      <p className="text-lg">{step.description}</p>

                      {/* Details List */}
                      <div className="bg-stone-deeper border border-fog/20 p-8">
                        <div className="flex flex-col gap-space-6">
                          <h3 className="font-mono text-sm text-pale-gold uppercase tracking-wider">
                            What Happens:
                          </h3>
                          <ul className="flex flex-col gap-space-4">
                            {step.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="flex gap-3 items-baseline"
                              >
                                <ArrowRight className="w-5 h-5 text-pale-gold/60 flex-shrink-0 mt-1" />
                                <span className="text-md">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Context - no "why it matters" label */}
                      <div className="border-l-2 border-pale-gold/30 pl-8">
                        <p className="text-md italic">{step.whyItMatters}</p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <OrnamentalDivider className="mt-16" />
                    )}
                  </motion.div>
                </Container>
              </Section>
            );
          })}

          {/* Final CTA */}
          <Section background="stone-dark" className="relative">
            <Container size="narrow" className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col items-center gap-space-12">
                  <h2 className="text-4xl">Ready to Begin?</h2>
                  <p className="text-lg max-w-2xl">
                    The first step is a consultation. We talk about what you
                    want, what's possible, and whether commissioning from
                    artisans 8,000 miles away makes sense for your specific
                    needs.
                  </p>
                  <Link href="/consultation" className="btn-primary text-lg">
                    Book a Free Consultation
                  </Link>
                </div>
              </motion.div>
            </Container>
          </Section>
        </main>

        <Footer />
      </div>
    </>
  );
}
