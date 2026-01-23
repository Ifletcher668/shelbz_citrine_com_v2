import Head from "next/head";
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";
import HeroSection from "@/Components/sections/HeroSection";
import ProblemSolutionSection from "@/Components/sections/ProblemSolutionSection";
import ProcessSection from "@/Components/sections/ProcessSection";
import GallerySection from "@/Components/sections/GallerySection";
import FAQSection from "@/Components/sections/FAQSection";
import CTASection from "@/Components/sections/CTASection";

/**
 * Landing Page - "Digital Grimoire"
 *
 * High-conversion page optimized for consultation bookings
 * with dark academia / fantasy RPG aesthetic.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Custom Black Spinel Engagement Rings | Heritage Jewelry</title>
        <meta
          name="description"
          content="Bespoke black spinel engagement rings handcrafted by seventh-generation Indian artisans. Ethical sourcing, free consultation. Olympia, WA & nationwide via Zoom."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Custom Black Spinel Engagement Rings | Heritage Jewelry"
        />
        <meta
          property="og:description"
          content="Bespoke black spinel rings handcrafted by Indian artisans. Ethical sourcing, multigenerational craft."
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://heritagejewelry.com" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Custom Black Spinel Engagement Rings | Heritage Jewelry"
        />
        <meta
          name="twitter:description"
          content="Bespoke black spinel rings by seventh-generation Indian artisans."
        />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://heritagejewelry.com" />
      </Head>

      <div className="min-h-screen bg-ink-black">
        <Header />

        <main>
          <HeroSection />
          <ProblemSolutionSection />
          <ProcessSection />
          <GallerySection />
          <FAQSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
}
