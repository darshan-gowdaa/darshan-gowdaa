import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiquidEther from './components/react-bits/LiquidEther';

// Lazy load below-the-fold components for better initial load performance
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));

// Minimal loading spinner component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
      <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-white/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
  </div>
);

function App() {
  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">

      {/* Side Liquid Effect (Civil/Silver) */}
      <div className="fixed inset-0 h-screen w-full opacity-30 pointer-events-none z-[1] mix-blend-screen">
        <div className="absolute inset-0">
          <LiquidEther
            colors={['#FFFFFF', '#C0C0C0', '#808080']} // Brighter Silver: White, Silver, Gray
            mouseForce={30}
            cursorSize={120}
            isViscous={false}
            viscous={10}
            iterationsViscous={20}
            iterationsPoisson={20}
            resolution={0.5}
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
        {/* Hero loads eagerly - it's above the fold */}
        <Hero />

        {/* Below-the-fold sections are lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Certifications />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>

    </div>
  );
}

export default App;

