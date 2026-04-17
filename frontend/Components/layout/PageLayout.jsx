/**
 * PageLayout — Main content area wrapper for a page.
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
import { cn } from "../../lib/utils";

export default function PageLayout({ children, className }) {
  return (
    <main className={cn("min-h-screen bg-void", className)}>{children}</main>
  );
}
