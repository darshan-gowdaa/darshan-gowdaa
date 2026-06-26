import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/organisms/Navbar';
import Hero from './components/organisms/Hero';
import Lenis from 'lenis';

// Lazy load below-the-fold components
const About = lazy(() => import('./components/organisms/About'));
const Skills = lazy(() => import('./components/organisms/Skills'));
const Experience = lazy(() => import('./components/organisms/Experience'));
const Projects = lazy(() => import('./components/organisms/Projects'));
const Certifications = lazy(() => import('./components/organisms/Certifications'));
const Contact = lazy(() => import('./components/organisms/Contact'));

function App() {
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const handleHeroComplete = useCallback(() => setIsHeroComplete(true), []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,            // simple lerp: much cheaper to compute than expo easing
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: true,        // Lenis manages its own RAF internally
    });

    return () => {
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
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
        </Suspense>
      </main>

      {/* analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
