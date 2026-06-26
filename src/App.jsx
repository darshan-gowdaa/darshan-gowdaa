import React, { useState, useEffect, memo, Suspense, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/organisms/Navbar';
import Hero from './components/organisms/Hero';
import SectionSkeleton from './components/skeletons/SectionSkeleton';
import Lenis from 'lenis';

// lazy load components
const About = React.lazy(() => import('./components/organisms/About'));
const Skills = React.lazy(() => import('./components/organisms/Skills'));
const Experience = React.lazy(() => import('./components/organisms/Experience'));
const Projects = React.lazy(() => import('./components/organisms/Projects'));
const Certifications = React.lazy(() => import('./components/organisms/Certifications'));
const Contact = React.lazy(() => import('./components/organisms/Contact'));

// register GSAP plugin once at the module level
gsap.registerPlugin(ScrollTrigger);

// helps with perf during fast scrolling
ScrollTrigger.config({ limitCallbacks: true });

// No longer using spinner fallback

// refresh scrolltrigger after layout settles
const SCROLL_REFRESH_DELAY = 500;

function App() {
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const handleHeroComplete = useCallback(() => setIsHeroComplete(true), []);

  // refresh scrolltrigger after initial layout
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), SCROLL_REFRESH_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // initialize smooth scrolling with lenis
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

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

        {/* lazy loaded sections — separate suspense boundaries for independent hydration */}
        <React.Suspense fallback={<SectionSkeleton />}><About /></React.Suspense>
        <React.Suspense fallback={<SectionSkeleton />}><Skills /></React.Suspense>
        <React.Suspense fallback={<SectionSkeleton />}><Experience /></React.Suspense>
        <React.Suspense fallback={<SectionSkeleton />}><Projects /></React.Suspense>
        <React.Suspense fallback={<SectionSkeleton />}><Certifications /></React.Suspense>
        <React.Suspense fallback={<SectionSkeleton />}><Contact /></React.Suspense>
      </main>

      {/* analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
