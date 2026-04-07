import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import PageLayout from "@/Components/layout/PageLayout";
import { Section, Container } from "@/Components/layout/Section";
import OrnamentalDivider from "@/Components/ornaments/OrnamentalDivider";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Shelbz Citrine</title>
        <meta name="robots" content="noindex" />
      </Head>

      <PageLayout>
        <Section background="stone-dark" variant="hero" className="relative">
          <div className="absolute inset-0 bg-linear-to-b from-void/60 via-transparent to-void/60 opacity-70" />

          <Container size="narrow" className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-12"
            >
              <div className="flex flex-col gap-6">
                <p className="font-mono text-pale-gold/60 text-sm uppercase tracking-widest">
                  Error 404
                </p>
                <h1>Lost in the Stone</h1>
                <p className="text-lg text-fog max-w-prose mx-auto">
                  The page you're looking for has either moved or never existed —
                  much like an uncut gemstone before the miners find it.
                </p>
              </div>

              <OrnamentalDivider />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/" className="btn-primary">
                  Return Home
                </Link>
                <Link
                  href="/consultation"
                  className="font-mono text-sm text-pale-gold hover:text-silver-white uppercase tracking-wider transition-colors duration-500"
                >
                  Book a Consultation
                </Link>
              </div>
            </motion.div>
          </Container>
        </Section>
      </PageLayout>
    </>
  );
}
