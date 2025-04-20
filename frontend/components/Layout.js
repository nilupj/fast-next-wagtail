import Head from 'next/head';
import Script from 'next/script';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

export default function Layout({ children, title = 'Health Info - Trusted Medical Information & Resources' }) {
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
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      {/* Using Next.js Script component for proper handling of external scripts */}
      <Script 
        src="https://unpkg.com/feather-icons" 
        strategy="afterInteractive" 
        onLoad={() => {
          if (window.feather) {
            window.feather.replace();
          }
        }}
      />
    </>
  );
}