import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../../Components/layout/Header";
import Footer from "../../Components/layout/Footer";
import { Container } from "../../Components/layout/Section";
import OrnamentalDivider from "../../Components/ornaments/OrnamentalDivider";
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
        <title>{post.title} | Shelbz Citrine</title>
        <meta
          name="description"
          content="Harder than diamond, rarer than rubies. Black spinel has been mistaken for onyx for centuries."
        />
        <link
          rel="canonical"
          href={`https://heritagejewelry.com/blog/what-is-black-spinel`}
        />
      </Head>

      <div className="min-h-screen bg-void">
        <Header />

        <main>
          <Container size="reading" className="py-space-6">
            {/* Back Link */}
            <div className="mb-space-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-4 font-display text-sm text-fog hover:text-pale-gold uppercase tracking-wide transition-colors duration-500"
              >
                <div className="flex flex-row gap-4 items-center">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </div>
              </Link>
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-space-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-5 items-center flex-wrap">
                  <span className="font-display text-xs uppercase tracking-wider text-pale-gold">
                    {post.category}
                  </span>
                  <span className="text-fog/50">•</span>
                  <div className="flex flex-row gap-5 items-center text-sm text-fog">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="text-fog/50">•</span>
                  <span className="text-sm text-fog">{post.publishedDate}</span>
                </div>

                <h1 className="text-4xl md:text-5xl text-silver-white">
                  {post.title}
                </h1>
              </div>
            </motion.div>

            <OrnamentalDivider />

            {/* Article Content - Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="prose-heritage"
            >
              <div className="flex flex-col gap-5 text-lg text-stone-grey">
                <p className="drop-cap">
                  For centuries, black spinel has lived in the shadow of other
                  gemstones—mistaken for onyx, confused with black diamond,
                  overlooked in favor of more "traditional" engagement ring
                  stones. But those who understand gemology know the truth:
                  black spinel is one of nature's most remarkable creations.
                </p>

                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl text-silver-white mt-space-8">
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
                    spinel's color is entirely natural. No treatments. No dyes.
                    No heat enhancement. What you see is what the earth created.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl text-silver-white mt-space-8">
                    The Evil-Warding Stone
                  </h2>

                  <p>
                    In ancient Indian tradition, black spinel was believed to
                    ward off evil spirits and protect the wearer from negative
                    energy. Warriors wore it into battle. Nobility embedded it
                    in crowns. It wasn't just decoration—it was spiritual armor.
                  </p>

                  <p>
                    Today, we don't talk much about evil spirits (though the
                    modern jewelry industry has its own demons). But the
                    symbolism remains: black spinel represents protection,
                    strength, and grounding.
                  </p>
                </div>

                {/* Inline CTA */}
                <div className="my-space-8 p-space-6 bg-stone-dark border border-fog/20 heavy-shadow text-center">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-md text-stone-grey">
                      Interested in a custom black spinel engagement ring?
                    </p>
                    <Link href="/consultation" className="btn-primary">
                      Book a Consultation
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl text-silver-white mt-space-8">
                    Why Jewelers Don't Promote It
                  </h2>

                  <p>
                    Black spinel doesn't have the marketing budget of De Beers.
                    There's no multi-billion-dollar advertising campaign telling
                    you that "a month's salary" should go toward a black spinel
                    ring. It's not stocked in mall jewelry stores because it
                    can't be mass-produced and marked up 500%.
                  </p>

                  <p>
                    In other words: it's too good for the mainstream jewelry
                    industry's business model.
                  </p>

                  <p className="text-fog italic">
                    This is placeholder content. Full articles will be added via
                    Contentful once the site is live.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* End CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-space-10 p-space-8 bg-stone-deeper border border-fog/20 heavy-shadow text-center relative"
            >
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-pale-gold/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pale-gold/30" />

              <div className="flex flex-col items-center gap-5">
                <h3 className="text-3xl text-silver-white">
                  Ready to Create Your Heirloom?
                </h3>
                <p className="text-md text-stone-grey max-w-xl mx-auto">
                  Let's talk about your vision for a custom black spinel
                  engagement ring.
                </p>
                <Link href="/consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
              </div>
            </motion.div>
          </Container>
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
