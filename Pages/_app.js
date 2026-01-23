import "@/styles/globals.css";
import Head from "next/head";
import GlobalSVGDefs from "@/Components/shared/GlobalSVGDefs";

export default function App({ Component, pageProps }) {
  return (
    <>
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

      <Component {...pageProps} />
    </>
  );
}
