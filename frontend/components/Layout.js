import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = 'Health Info - Trusted Medical Information & Resources' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Trusted source for medical information, health conditions, symptoms, treatments, and wellness advice." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/feather-icons/dist/feather.min.css" rel="stylesheet" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <script src="https://unpkg.com/feather-icons"></script>
      <script>
        {`
          document.addEventListener('DOMContentLoaded', function() {
            feather.replace();
          });
        `}
      </script>
    </>
  );
}
