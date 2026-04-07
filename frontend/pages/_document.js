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
        {/*
          Hidden form for Netlify bot crawling.
          All contact forms submit to the "contact-form" name.
          The bot must see this in the static HTML to register the form.
        */}
        <form name="contact-form" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="contact-form" />
          <input type="text" name="_placeholder" />
        </form>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
