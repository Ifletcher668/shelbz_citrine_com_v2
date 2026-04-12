import "../styles/globals.css";
import { useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import GlobalSVGDefs from "../Components/shared/GlobalSVGDefs";
import Header from "../Components/layout/Header";
import Footer from "../Components/layout/Footer";
import { NavigationContext } from "../lib/NavigationContext";
import { FooterDataContext } from "../lib/FooterDataContext";
import { getHeader, getFooter } from "../lib/strapi-cms/strapiApi";
import { initActionButtons } from "../lib/actions";

export default function MyApp({ Component, pageProps }) {
  const { navigationData, footerData, ...restPageProps } = pageProps;
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
        </Head>

        {/* Global SVG Pattern Definitions */}
        <GlobalSVGDefs />

        {/* Header and Footer are mounted here so they persist across page
            transitions — they do not remount or re-animate on navigation. */}
        <div className="min-h-screen bg-void flex flex-col">
          <Header />
          <Component {...restPageProps} />
          <Footer />
        </div>
      </FooterDataContext.Provider>
    </NavigationContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const [navigationData, footerData] = await Promise.all([
    getHeader().catch((err) => {
      console.error("[_app] getHeader failed:", err.message);
      return null;
    }),
    getFooter().catch((err) => {
      console.error("[_app] getFooter failed:", err.message);
      return null;
    }),
  ]);

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, navigationData, footerData },
  };
};
