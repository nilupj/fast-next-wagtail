import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = 'Health Info - Trusted Medical Information & Resources' }) {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const changeLanguage = (e) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };

  useEffect(() => {
    // Load feather icons if it exists
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace();
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
        <div className="fixed top-4 right-4 z-50">
          <select 
            onChange={changeLanguage} 
            defaultValue={locale}
            className="bg-white border border-gray-300 rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
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