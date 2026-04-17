import "../styles/globals.css";
import { useEffect } from "react";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import GlobalSVGDefs from "../Components/shared/GlobalSVGDefs";
import Header from "../Components/layout/Header";
import Footer from "../Components/layout/Footer";
import { NavigationContext } from "../lib/NavigationContext";
import { FooterDataContext } from "../lib/FooterDataContext";
import {
  getHeader,
  getFooter,
  getActiveTheme,
} from "../lib/strapi-cms/strapiApi";
import { resolveNavLinks } from "../lib/resolveNavLink";
import { initActionButtons } from "../lib/actions";
import { ErrorBoundary } from "../Components/ErrorBoundary";
import { logger } from "../lib/logger";
import { buildThemeCss, getGoogleFontsUrl } from "../lib/buildThemeCss";

export default function ShelbzCitrineCom({ Component, pageProps }: AppProps) {
  const { navigationData, footerData, activeTheme, ...restPageProps } =
    pageProps;

  const googleFontsUrl = activeTheme ? getGoogleFontsUrl(activeTheme) : null;
  const themeCss = [
    googleFontsUrl ? `@import url("${googleFontsUrl}");` : "",
    activeTheme ? buildThemeCss(activeTheme) : "",
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    initActionButtons();
  }, []);

  return (
    <NavigationContext.Provider value={navigationData ?? null}>
      <FooterDataContext.Provider value={footerData ?? null}>
        <Head>
          {/* Preload critical fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Theme color */}
          <meta name="theme-color" content="#0d0a07" />

          {/* Active theme CSS variable overrides */}
          {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        </Head>

        {/* Global SVG Pattern Definitions */}
        <GlobalSVGDefs />

        {/* Header and Footer are mounted here so they persist across page
            transitions — they do not remount or re-animate on navigation. */}
        <div className="min-h-screen bg-void flex flex-col">
          <Header />
          <ErrorBoundary>
            <Component {...restPageProps} />
          </ErrorBoundary>
          <Footer />
        </div>
      </FooterDataContext.Provider>
    </NavigationContext.Provider>
  );
}

ShelbzCitrineCom.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const t0 = Date.now();
  const [navigationData, footerData, activeTheme] = await Promise.all([
    getHeader().catch((err) => {
      logger.error("_app:getHeader", err);
      return null;
    }),
    getFooter().catch((err) => {
      logger.error("_app:getFooter", err);
      return null;
    }),
    getActiveTheme().catch((err) => {
      logger.error("_app:getFooter", err);
      return null;
    }),
  ]);
  logger.info({ event: "app_init_props", duration: Date.now() - t0 });

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      navigationData: navigationData
        ? {
            ...navigationData,
            navLinks: resolveNavLinks(navigationData.navigation ?? null),
          }
        : null,
      footerData: footerData
        ? {
            ...footerData,
            navLinks: resolveNavLinks(footerData.navigation ?? null),
          }
        : null,
      activeTheme,
    },
  };
};
