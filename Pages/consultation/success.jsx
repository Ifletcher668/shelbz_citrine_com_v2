import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import { Check, Sparkles } from "lucide-react";

/**
 * Consultation Success Page
 * Confirmation after form submission
 */
export default function ConsultationSuccess() {
  return (
    <>
      <Head>
        <title>Consultation Booked | Heritage Jewelry</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main className="pt-32 pb-space-10">
          <div className="section-narrow">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-parchment-dark metallic-border heavy-shadow p-space-10 text-center relative"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-aged-gold/40" />
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-aged-gold/40" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-aged-gold/40" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-aged-gold/40" />

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3,
                  ease: [0.68, -0.55, 0.27, 1.55],
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-emerald-deep/30 border-2 border-aged-gold mb-space-6"
              >
                <Check className="w-12 h-12 text-aged-gold" />
              </motion.div>

              <h1 className="font-cinzel text-4xl md:text-5xl text-bone-white mb-space-4">
                Request Received
              </h1>

              <div className="max-w-xl mx-auto space-y-space-4 font-crimson text-lg text-ash-grey mb-space-8">
                <p>
                  Thank you for your consultation request. We'll review your
                  information and contact you within{" "}
                  <strong className="text-bone-white">24 hours</strong> to
                  schedule your session.
                </p>
                <p className="text-base text-charcoal-mist">
                  Check your email (including spam folder) for a confirmation
                  message.
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-space-4 mb-space-8">
                <div className="w-16 h-px bg-aged-gold/30" />
                <Sparkles className="w-5 h-5 text-aged-gold/50" />
                <div className="w-16 h-px bg-aged-gold/30" />
              </div>

              <div className="space-y-space-4">
                <Link href="/" className="btn-primary">
                  Return Home
                </Link>
                <div>
                  <Link
                    href="/blog"
                    className="font-spectral text-sm text-charcoal-mist hover:text-aged-gold uppercase tracking-wide transition-colors duration-500"
                  >
                    Read Our Blog While You Wait
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
