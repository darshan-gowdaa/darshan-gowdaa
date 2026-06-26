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

  // Initialize Lenis smooth scrolling — single RAF loop shared with the browser
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,          // slightly shorter = snappier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,   // native-feeling on touch
      infinite: false,
    });

    // Single RAF loop — Lenis ticks first, everything else follows
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
        Skip to content
      </a>

      {/* top edge shadow */}
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
