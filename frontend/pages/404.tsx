import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import PageLayout from "../Components/layout/PageLayout";
import { Section, Container } from "../Components/layout/Section";
import OrnamentalDivider from "../Components/ornaments/OrnamentalDivider";
import { getNotFoundPageNavigationData } from "../lib/strapi-cms/strapiApi";
import { resolveNavLinks, type NavLinkItem } from "../lib/resolveNavLink";
import { logger } from "../lib/logger";
import type { InferGetStaticPropsType } from "next";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function NotFound({ links }: Props) {
  return (
    <>
      <Head>
        <title>Page Not Found | Shelbz Citrine</title>
        <meta name="robots" content="noindex" />
      </Head>

      <PageLayout className="">
        <Section
          background="stone-dark"
          className="relative section-hero section-last"
        >
          {/* TODO: make this gradient a componet/add it to container's props/hook up to Strapi */}
          <div className="absolute inset-0 bg-linear-to-b from-void/60 via-transparent to-void/60 opacity-70" />
          <Container size="reading">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-6 text-center">
                <p className="font-mono text-pale-gold/60 text-sm uppercase tracking-widest">
                  Error 404
                </p>
                <h1>Get lost in the mines?</h1>
                <p className="text-lg text-fog max-w-prose mx-auto">
                  The page you're looking for has either moved or never existed
                  — much like an uncut gemstone before the miners dig it up.
                </p>
              </div>

              <OrnamentalDivider />

              {links.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {links.map((link, idx) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className={idx === 0 ? "btn-primary" : "btn-secondary"}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </Container>
        </Section>
      </PageLayout>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const links = await resolveNavLinks(getNotFoundPageNavigationData());
    return { props: { links } };
  } catch (error) {
    logger.error("404Page:getStaticProps", error);
    return { props: { links: [] as NavLinkItem[] } };
  }
};
