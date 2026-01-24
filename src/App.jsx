import React, { useState, useEffect, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/organisms/Navbar';
import Hero from './components/organisms/Hero';
import LiquidEther from './components/atoms/LiquidEther';

// lazy load components
const About = React.lazy(() => import('./components/organisms/About'));
const Skills = React.lazy(() => import('./components/organisms/Skills'));
const Experience = React.lazy(() => import('./components/organisms/Experience'));
const Projects = React.lazy(() => import('./components/organisms/Projects'));
const Certifications = React.lazy(() => import('./components/organisms/Certifications'));
const Contact = React.lazy(() => import('./components/organisms/Contact'));

// global constants
const MOBILE_MEDIA_QUERY = '(hover: none) and (pointer: coarse)';
const SCROLL_REFRESH_DELAY = 500;

// config for liquid effect
const getLiquidConfig = (isMobile) => ({
  colors: ['#FFFFFF', '#C0C0C0', '#808080'],
  mouseForce: isMobile ? 15 : 30,
  cursorSize: isMobile ? 80 : 120,
  isViscous: false,
  viscous: 10,
  iterationsViscous: isMobile ? 10 : 20,
  iterationsPoisson: isMobile ? 10 : 20,
  resolution: isMobile ? 0.25 : 0.5,
  isBounce: false,
  autoDemo: false,
  autoSpeed: 0,
  autoIntensity: 0
});

// loading spinner
const LoadingFallback = memo(() => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
    <span className="text-gray-500 text-xs font-medium tracking-widest uppercase animate-pulse">
      Loading Experience
    </span>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia(MOBILE_MEDIA_QUERY).matches);
    checkMobile();

    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    mq.addEventListener('change', checkMobile);
    return () => mq.removeEventListener('change', checkMobile);
  }, []);

  return isMobile;
};

// scrolltrigger setup
const useScrollTrigger = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger); // register gsap plugin

    // refresh scrolltrigger after layout settles
    const timer = setTimeout(() => ScrollTrigger.refresh(), SCROLL_REFRESH_DELAY);
    return () => clearTimeout(timer);
  }, []);
};

function App() {
  const isMobile = useIsMobile(); // detect mobile
  useScrollTrigger(); // init scrolltrigger
  const [isHeroComplete, setIsHeroComplete] = useState(false); // hero animation done

  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">

      {/* background liquid effect */}
      <div className="fixed inset-0 h-screen w-full opacity-30 pointer-events-none z-[1] mix-blend-screen">
        <div className="absolute inset-0">
          <LiquidEther {...getLiquidConfig(isMobile)} />
        </div>
      </div>

      {/* navbar */}
      <Navbar show={isHeroComplete} />

      {/* main content */}
      <main className="relative">
        <Hero onComplete={() => setIsHeroComplete(true)} />

        {/* lazy loaded sections */}
        <React.Suspense fallback={<LoadingFallback />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
        </React.Suspense>
      </main>

      {/* analytics */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
