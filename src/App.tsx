import React, { useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { LandingPage } from './components/LandingPage';

export default function App() {
  // Smooth scroll helper
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (sectionId === 'poptavka-mesto') {
        setTimeout(() => {
          const input = document.getElementById('city-municipality');
          if (input) {
            input.focus({ preventScroll: true });
          }
        }, 600);
      }
    }
  }, []);

  // Handle URL pathname or hash on load
  useEffect(() => {
    const handleUrlRoute = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      if (pathname === '/hlaseni') {
        setTimeout(() => {
          scrollToSection('hlaseni');
        }, 150);
        return;
      }
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash);
        }, 150);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [scrollToSection]);

  return (
    <div className="w-full min-h-screen bg-white text-[#14294B] font-['Archivo',sans-serif] flex flex-col">
      {/* 1. Header (sticky): logo left, navigation right */}
      <TopBar onScrollToSection={scrollToSection} />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full flex flex-col">
        <LandingPage onScrollToSection={scrollToSection} />
      </main>
    </div>
  );
}
