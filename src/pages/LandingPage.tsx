import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { BodyMap } from '../components/landing/BodyMap';
import { Comparison } from '../components/landing/Comparison';
import { Footer } from '../components/landing/Footer';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { theme } = useTheme();

  useEffect(() => {
    // Force LTR for the landing page
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    window.scrollTo(0, 0);

    return () => {
      // Revert to RTL if navigating away (assuming dashboard is RTL)
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'fa';
    };
  }, []);

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans ${theme}`}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <BodyMap />
        <Comparison />
      </main>
      <Footer />
    </div>
  );
}
