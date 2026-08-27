import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PageClient from '../src/components/organisms/PageClient';

const About = dynamic(() => import('../src/components/organisms/About'));
const Skills = dynamic(() => import('../src/components/organisms/Skills'));
const Experience = dynamic(() => import('../src/components/organisms/Experience'));
const Projects = dynamic(() => import('../src/components/organisms/Projects'));
const Certifications = dynamic(() => import('../src/components/organisms/Certifications'));
const Contact = dynamic(() => import('../src/components/organisms/Contact'));

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-[#050505] via-[#050505] to-[#050505] text-white min-h-screen overflow-x-hidden relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to content
      </a>

      {/* top edge shadow */}
      <div className="fixed top-0 inset-x-0 h-50 z-30 pointer-events-none top-shadow-fade" />

      {/* navbar + hero state coordination */}
      <PageClient />

      {/* below-fold sections */}
      <main id="main-content" className="relative">
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}
