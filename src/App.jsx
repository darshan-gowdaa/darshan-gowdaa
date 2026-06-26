import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/organisms/Navbar';
import Hero from './components/organisms/Hero';
import About from './components/organisms/About';
import Skills from './components/organisms/Skills';
import Experience from './components/organisms/Experience';
import Projects from './components/organisms/Projects';
import Certifications from './components/organisms/Certifications';
import Contact from './components/organisms/Contact';
import Lenis from 'lenis';

function App() {
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const handleHeroComplete = useCallback(() => setIsHeroComplete(true), []);

  // initialize smooth scrolling with lenis
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
        Skip to content
      </a>

      {/* top edge shadow — gives a clean fade when scrolling */}
      <div className="fixed top-0 inset-x-0 h-50 z-30 pointer-events-none top-shadow-fade" />

      {/* navbar */}
      <Navbar show={isHeroComplete} />

      {/* main content */}
      <main id="main-content" className="relative">
        <Hero onComplete={handleHeroComplete} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      {/* analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
