import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import { BookOpen, Clock } from "lucide-react";

/**
 * Blog Index - "Blog"
 * Listing of all blog posts (dummy data for now)
 */
export default function Blog() {
  // Dummy blog data - will be replaced with Contentful later
  const posts = [
    {
      slug: "what-is-black-spinel",
      title: "What Is Black Spinel? The Gemstone Everyone Mistakes for Onyx",
      excerpt:
        "Harder than diamond, rarer than rubies. Black spinel has been mistaken for onyx for centuries. Here is why it is the superior choice for engagement rings.",
      readTime: "8 min",
      category: "Gemstone Education",
    },
    {
      slug: "14kt-vs-18kt-gold",
      title:
        "14kt vs. 18kt Gold: What Jewelers Will Not Tell You About Nickel Fillers",
      excerpt:
        "Not all gold is created equal. Learn the truth about metal purity, nickel allergies, and why most gold jewelry is garbage.",
      readTime: "6 min",
      category: "Metal Education",
    },
    {
      slug: "how-a-ring-is-made",
      title: "How a Ring Is Made: From Jaipur Workshop to Your Finger",
      excerpt:
        "Follow the journey of a custom black spinel ring from initial consultation to final delivery. Behind the scenes with Royal Karkhana artisans.",
      readTime: "12 min",
      category: "The Process",
    },
  ];

  return (
    <>
      <Head>
        <title>Blog | Heritage Jewelry Blog</title>
        <meta
          name="description"
          content="Learn about gemstones, ethical sourcing, traditional jewelry-making techniques, and the difference between real craft and mass production."
        />
        <link rel="canonical" href="https://heritagejewelry.com/blog" />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main className="pb-space-10">
          {/* Hero */}
          <section className="section">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1 className="font-cinzel text-5xl md:text-6xl text-bone-white mb-space-4">
                Blog
              </h1>
              <p className="font-crimson text-xl text-ash-grey max-w-2xl mx-auto leading-relaxed">
                Gemstone education, craft philosophy, and the truth about what
                makes jewelry <em className="text-aged-gold">real</em>.
              </p>
            </motion.div>
          </section>

          {/* Posts Grid */}
          <section className="section-container">
            <div className="grid gap-space-8 max-w-4xl mx-auto">
              {posts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-parchment-dark tension-border heavy-shadow p-space-8 hover:border-aged-gold transition-all duration-700 group relative"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-aged-gold/20 group-hover:border-aged-gold/50 transition-colors duration-700" />

                  <div className="flex flex-col md:flex-row md:items-start gap-space-4 mb-space-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-vellum border border-obsidian flex items-center justify-center group-hover:border-aged-gold transition-colors duration-700">
                      <BookOpen className="w-7 h-7 text-aged-gold" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-space-3 mb-space-2">
                        <span className="font-spectral text-xs uppercase tracking-wider text-aged-gold">
                          {post.category}
                        </span>
                        <span className="text-sepia-shadow">•</span>
                        <span className="font-crimson text-sm text-charcoal-mist flex items-center gap-space-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-cinzel text-2xl md:text-3xl text-bone-white group-hover:text-aged-gold mb-space-3 leading-tight transition-colors duration-500">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="font-crimson text-base text-ash-grey leading-relaxed mb-space-4">
                        {post.excerpt}
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-space-2 font-spectral text-sm text-aged-gold hover:text-amber-glow uppercase tracking-wider transition-colors duration-500"
                      >
                        Read More
                        <span className="group-hover:translate-x-1 transition-transform duration-500">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center mt-space-10"
            >
              <p className="font-crimson text-base text-charcoal-mist italic">
                More blogs coming soon.
              </p>
            </motion.div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
