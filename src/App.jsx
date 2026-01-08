import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Analytics } from '@vercel/analytics/react';

import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import LiquidEther from './components/react-bits/LiquidEther';

// Mobile detection hook for performance optimization
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

  // Refresh ScrollTrigger on mount and orientation change
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

  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">

      {/* Global Liquid Effect - visible across all sections */}
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
      <Navbar />

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
