/**
 * PageLayout — Page shell with Header, main content area, and Footer.
 *
 * WHEN TO USE:
 *   - Every standard page in the site
 *
 * WHEN NOT TO USE:
 *   - Pages with fully custom layouts (e.g., full-screen modals, embedded iframes)
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > InnerSection > content
 *
 * @example
 * <PageLayout>
 *   <Section background="stone-dark">
 *     <Container>...</Container>
 *   </Section>
 * </PageLayout>
 */
import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";

export default function PageLayout({ children, className }) {
  return (
    <div className="min-h-screen bg-void">
      <Header />
      <main className={className}>{children}</main>
      <Footer />
    </div>
  );
}
