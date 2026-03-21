import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/*
          Theme CSS — generated at build time by scripts/generate-theme.js.
          Contains :root { } overrides for all CSS custom properties defined in
          the active Strapi theme. Loads after globals.css so it takes precedence
          over the @theme fallback values. Empty file if Strapi is unreachable.
        */}
        <link rel="stylesheet" href="/theme.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
