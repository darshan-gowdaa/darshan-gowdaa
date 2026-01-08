import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Analytics } from '@vercel/analytics/react';

import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
const About = React.lazy(() => import('./components/About'));
const Skills = React.lazy(() => import('./components/Skills'));
const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Certifications = React.lazy(() => import('./components/Certifications'));
const Contact = React.lazy(() => import('./components/Contact'));
import LiquidEther from './components/react-bits/LiquidEther';

// Custom hook to detect if we're on a mobile device
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    };
    checkMobile();
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    mq.addEventListener('change', checkMobile);
    return () => mq.removeEventListener('change', checkMobile);
  }, []);

  // Force-refresh ScrollTrigger positions after things load in
  useEffect(() => {
    // Standard registration
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh after a small delay to allow layout to settle
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return isMobile;
};

function App() {
  const isMobile = useIsMobile();
  const [isHeroComplete, setIsHeroComplete] = React.useState(false);

  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">

      {/* Subtle background liquid effect */}
      <div className="fixed inset-0 h-screen w-full opacity-30 pointer-events-none z-[1] mix-blend-screen">
        <div className="absolute inset-0">
          <LiquidEther
            colors={['#FFFFFF', '#C0C0C0', '#808080']}
            mouseForce={isMobile ? 15 : 30}
            cursorSize={isMobile ? 80 : 120}
            isViscous={false}
            viscous={10}
            iterationsViscous={isMobile ? 10 : 20}
            iterationsPoisson={isMobile ? 10 : 20}
            resolution={isMobile ? 0.25 : 0.5}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0}
            autoIntensity={0}
          />
        </div>
      </div>
      {/* Navigation */}
      <Navbar show={isHeroComplete} />

      {/* Main Content */}
      <main className="relative">
        <Hero onComplete={() => setIsHeroComplete(true)} />
        <React.Suspense fallback={
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
            <span className="text-gray-500 text-xs font-medium tracking-widest uppercase animate-pulse">Loading Experience</span>
          </div>
        }>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
        </React.Suspense>
      </main>

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
