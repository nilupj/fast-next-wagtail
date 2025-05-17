
import Head from 'next/head';
import Script from 'next/script';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

export default function Layout({ children, title = 'Health Info - Trusted Medical Information & Resources' }) {
  useEffect(() => {
    // Initialize feather icons
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace({
        'stroke-width': 1.5,
        width: 24,
        height: 24
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Trusted source for medical information, health conditions, symptoms, treatments, and wellness advice." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <Script 
        src="https://unpkg.com/feather-icons" 
        strategy="afterInteractive" 
        onLoad={() => {
          if (window.feather) {
            window.feather.replace();
          }
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,ur',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        `}
      </Script>
      <div id="google_translate_element" className="fixed bottom-4 right-4 z-50" />
    </>
  );
}
