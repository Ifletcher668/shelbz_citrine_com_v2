import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import { BookOpen, Clock } from "lucide-react";
import { Section, Container } from "@/Components/layout/Section";

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

      <div className="min-h-screen bg-void">
        <Header />

        <main>
          {/* Hero */}
          <Section variant="hero">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="flex flex-col items-center gap-space-4">
                <h1 className="text-5xl md:text-6xl text-silver-white">Blog</h1>
                <p className="text-xl text-stone-grey max-w-2xl mx-auto">
                  Gemstone education, craft philosophy, and the truth about what
                  makes jewelry <em className="text-pale-gold">real</em>.
                </p>
              </div>
            </motion.div>
          </Section>

          {/* Posts Grid */}
          <Container>
            <div className="flex flex-col gap-space-8 max-w-4xl mx-auto">
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
                  className="bg-stone-deeper tension-border heavy-shadow p-space-8 hover:border-pale-gold transition-all duration-700 group relative"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-pale-gold/20 group-hover:border-pale-gold/50 transition-colors duration-700" />

                  <div className="flex flex-col gap-space-4">
                    <div className="flex flex-col md:flex-row gap-space-4 items-start">
                      <div className="flex-shrink-0 w-16 h-16 bg-stone-dark border border-fog/20 group-hover:border-pale-gold transition-colors duration-700">
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-7 h-7 text-pale-gold" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-space-3 flex-1">
                        <div className="flex flex-row gap-space-3 items-center">
                          <span className="font-display text-xs uppercase tracking-wider text-pale-gold">
                            {post.category}
                          </span>
                          <span className="text-fog/50">•</span>
                          <div className="flex flex-row gap-space-1 items-center text-sm text-fog">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-2xl md:text-3xl text-silver-white group-hover:text-pale-gold transition-colors duration-500">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-md text-stone-grey">
                          {post.excerpt}
                        </p>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-space-2 font-display text-sm text-pale-gold hover:text-silver-white uppercase tracking-wider transition-colors duration-500"
                        >
                          <div className="flex flex-row gap-space-2 items-center">
                            <span>Read More</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-500">
                              →
                            </span>
                          </div>
                        </Link>
                      </div>
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
              <p className="text-md text-fog italic">More blogs coming soon.</p>
            </motion.div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
