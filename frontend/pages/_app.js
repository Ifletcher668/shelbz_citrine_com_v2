import "@/styles/globals.css";
import { useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import GlobalSVGDefs from "@/Components/shared/GlobalSVGDefs";
import { HeaderDataContext } from "@/lib/HeaderDataContext";
import { getHeader } from "@/lib/strapi";
import { initActionButtons } from "@/lib/actions";

export default function MyApp({ Component, pageProps }) {
  const { headerData, ...restPageProps } = pageProps;

  useEffect(() => {
    initActionButtons();
  }, []);

  return (
    <HeaderDataContext.Provider value={headerData ?? null}>
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

      <Component {...restPageProps} />
    </HeaderDataContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const headerData = await getHeader().catch(() => null);
  return { ...appProps, pageProps: { ...appProps.pageProps, headerData } };
};
