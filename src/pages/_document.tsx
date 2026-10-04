import type { DocumentContext } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { parseLocale } from "@/i18n/config";
import { getTranslations } from "@/i18n/messages";
import { layoutMessages } from "@/i18n/messages/layout";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    const locale = parseLocale(this.props.locale);
    const messages = getTranslations(layoutMessages, locale);

    return (
      <Html lang={locale}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Gentium+Book+Plus:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
          <meta charSet="utf-8" />
          <meta
            name="description"
            content={messages.metaDescription}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
