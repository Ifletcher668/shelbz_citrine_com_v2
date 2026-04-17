import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/*
          Hidden form for Netlify bot crawling.
          All contact forms submit to the "contact-form" name.
          The bot must see this in the static HTML to register the form.
        */}
        <form
          name="contact-form"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          hidden
        >
          <input type="hidden" name="form-name" value="contact-form" />
          <input type="text" name="_placeholder" />
        </form>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
