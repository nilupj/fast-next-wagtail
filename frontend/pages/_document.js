import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* External stylesheets should be included in _document.js, not in page components */}
        <link 
          href="https://unpkg.com/feather-icons/dist/feather.min.css" 
          rel="stylesheet" 
        />
        {/* Import fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap" 
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