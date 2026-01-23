import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";
import { Clock, ArrowLeft } from "lucide-react";

/**
 * Blog Post Template
 * Individual article page (placeholder content for now)
 */
export default function BlogPost() {
  // This will be dynamic with Contentful later
  const post = {
    title: "What Is Black Spinel? The Gemstone Everyone Mistakes for Onyx",
    category: "Gemstone Education",
    readTime: "8 min",
    publishedDate: "January 2026",
  };

  return (
    <>
      <Head>
        <title>{post.title} | Heritage Jewelry</title>
        <meta
          name="description"
          content="Harder than diamond, rarer than rubies. Black spinel has been mistaken for onyx for centuries."
        />
        <link
          rel="canonical"
          href={`https://heritagejewelry.com/blog/what-is-black-spinel`}
        />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main className="pb-space-10">
          <article className="section-reading">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-space-2 font-spectral text-sm text-charcoal-mist hover:text-aged-gold uppercase tracking-wide mb-space-8 transition-colors duration-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-space-8"
            >
              <div className="flex flex-wrap items-center gap-space-3 mb-space-4">
                <span className="font-spectral text-xs uppercase tracking-wider text-aged-gold">
                  {post.category}
                </span>
                <span className="text-sepia-shadow">•</span>
                <span className="font-crimson text-sm text-charcoal-mist flex items-center gap-space-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
                <span className="text-sepia-shadow">•</span>
                <span className="font-crimson text-sm text-charcoal-mist">
                  {post.publishedDate}
                </span>
              </div>

              <h1 className="font-cinzel text-4xl md:text-5xl text-bone-white leading-tight">
                {post.title}
              </h1>
            </motion.div>

            <OrnamentalDivider />

            {/* Article Content - Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="prose-heritage"
            >
              <div className="font-crimson text-lg text-ash-grey leading-relaxed space-y-space-5">
                <p className="drop-cap">
                  For centuries, black spinel has lived in the shadow of other
                  gemstones—mistaken for onyx, confused with black diamond,
                  overlooked in favor of more "traditional" engagement ring
                  stones. But those who understand gemology know the truth:
                  black spinel is one of nature's most remarkable creations.
                </p>

                <h2 className="font-cinzel text-3xl text-bone-white mt-space-8 mb-space-4">
                  Harder Than Diamond
                </h2>

                <p>
                  Black spinel ranks 8 on the Mohs hardness scale—harder than
                  emerald, harder than tanzanite, harder than every gemstone
                  except diamond, sapphire, and ruby. This makes it
                  exceptionally durable for daily wear, particularly in
                  engagement rings where the stone faces constant exposure.
                </p>

                <p>
                  Unlike onyx (which is actually dyed chalcedony), black
                  spinel's color is entirely natural. No treatments. No dyes. No
                  heat enhancement. What you see is what the earth created.
                </p>

                <h2 className="font-cinzel text-3xl text-bone-white mt-space-8 mb-space-4">
                  The Evil-Warding Stone
                </h2>

                <p>
                  In ancient Indian tradition, black spinel was believed to ward
                  off evil spirits and protect the wearer from negative energy.
                  Warriors wore it into battle. Nobility embedded it in crowns.
                  It wasn't just decoration—it was spiritual armor.
                </p>

                <p>
                  Today, we don't talk much about evil spirits (though the
                  modern jewelry industry has its own demons). But the symbolism
                  remains: black spinel represents protection, strength, and
                  grounding.
                </p>

                {/* Inline CTA */}
                <div className="my-space-8 p-space-6 bg-vellum metallic-border heavy-shadow text-center">
                  <p className="font-crimson text-base text-ash-grey mb-space-4">
                    Interested in a custom black spinel engagement ring?
                  </p>
                  <Link href="/consultation" className="btn-primary">
                    Book a Consultation
                  </Link>
                </div>

                <h2 className="font-cinzel text-3xl text-bone-white mt-space-8 mb-space-4">
                  Why Jewelers Don't Promote It
                </h2>

                <p>
                  Black spinel doesn't have the marketing budget of De Beers.
                  There's no multi-billion-dollar advertising campaign telling
                  you that "a month's salary" should go toward a black spinel
                  ring. It's not stocked in mall jewelry stores because it can't
                  be mass-produced and marked up 500%.
                </p>

                <p>
                  In other words: it's too good for the mainstream jewelry
                  industry's business model.
                </p>

                <p className="text-charcoal-mist italic">
                  This is placeholder content. Full articles will be added via
                  Contentful once the site is live.
                </p>
              </div>
            </motion.div>

            {/* End CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-space-10 p-space-8 bg-parchment-dark metallic-border heavy-shadow text-center relative"
            >
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-aged-gold/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-aged-gold/30" />

              <h3 className="font-cinzel text-3xl text-bone-white mb-space-4">
                Ready to Create Your Heirloom?
              </h3>
              <p className="font-crimson text-base text-ash-grey mb-space-5 max-w-xl mx-auto">
                Let's talk about your vision for a custom black spinel
                engagement ring.
              </p>
              <Link href="/consultation" className="btn-primary">
                Book Free Consultation
              </Link>
            </motion.div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

// This will be needed for static generation later
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: "what-is-black-spinel" } },
      { params: { slug: "14kt-vs-18kt-gold" } },
      { params: { slug: "how-a-ring-is-made" } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      slug: params.slug,
    },
  };
}
