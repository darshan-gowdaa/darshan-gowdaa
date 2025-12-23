import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import LiquidEther from './components/react-bits/LiquidEther';


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
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>

    </div>
  );
}

export default App;
