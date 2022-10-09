import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-teal-300">
      <Head>
        <title>Bröderna Duhlins VM-tips</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis&family=Nunito&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
