import { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-primary">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-white text-xl font-heading font-bold">HealthInfo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/conditions" className="nav-link">
                Conditions
              </Link>
              <Link href="/drugs-supplements" className="nav-link">
                Drugs & Supplements
              </Link>
              <Link href="/well-being" className="nav-link">
                Well-Being
              </Link>
              <Link href="/tools" className="nav-link">
                Tools
              </Link>
              <Link href="/symptom-checker" className="nav-link">
                Symptom Checker
              </Link>
              <Link href="/doctors" className="nav-link">
                Find a Doctor
              </Link>
              <div className="relative group">
                <button className="nav-link flex items-center">
                  More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute z-10 hidden group-hover:block mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/health-news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Health News
                    </Link>
                    <Link href="/videos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Videos
                    </Link>
                    <Link href="/quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Quizzes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="text-sm text-white hover:text-white/80"
              onClick={() => {
                const newLang = localStorage.getItem('language') === 'hi' ? 'en' : 'hi';
                localStorage.setItem('language', newLang);
                window.location.reload();
              }}
            >
              {localStorage.getItem('language') === 'hi' ? 'English' : 'हिंदी'}
            </button>
            <Link href="/subscribe" className="text-sm text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-primary transition-colors">
              Subscribe
            </Link>
            <Link href="/login" className="text-sm text-white hover:text-white/80">
              Log In
            </Link>
            <SearchBar />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/conditions" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Conditions
            </Link>
            <Link href="/drugs-supplements" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Drugs & Supplements
            </Link>
            <Link href="/well-being" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Well-Being
            </Link>
            <Link href="/tools" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Tools
            </Link>
            <Link href="/symptom-checker" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Symptom Checker
            </Link>
            <Link href="/doctors" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Find a Doctor
            </Link>
            <Link href="/health-news" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Health News
            </Link>
            <Link href="/videos" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Videos
            </Link>
            <Link href="/quizzes" className="block nav-link py-2 px-3 rounded hover:bg-primary-light">
              Quizzes
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-light">
            <div className="flex items-center px-5">
              <SearchBar />
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                className="block w-full text-left text-white py-2 px-3 rounded hover:bg-primary-light"
                onClick={() => {
                  const newLang = localStorage.getItem('language') === 'hi' ? 'en' : 'hi';
                  localStorage.setItem('language', newLang);
                  window.location.reload();
                }}
              >
                {localStorage.getItem('language') === 'hi' ? 'English' : 'हिंदी'}
              </button>
              <Link href="/subscribe" className="block text-white py-2 px-3 rounded hover:bg-primary-light">
                Subscribe
              </Link>
              <Link href="/login" className="block text-white py-2 px-3 rounded hover:bg-primary-light">
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}