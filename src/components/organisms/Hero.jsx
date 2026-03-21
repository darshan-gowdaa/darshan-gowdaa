// src/components/organisms/Hero.jsx
import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp, FaArrowRight } from 'react-icons/fa';
import { useAnimations } from '../../hooks/useAnimations';
import { NeonButton } from '../atoms/NeonButton';

// lazy load these - they're too big for the initial bundle
const LiquidEther = React.lazy(() => import('../atoms/LiquidEther'));
const TextPressure = React.lazy(() => import('../atoms/TextPressure'));

// Performance configuration for LiquidEther
const LIQUID_CONFIG = {
  high: {
    resolution: 0.6, // good quality
    iterationsViscous: 32,
    iterationsPoisson: 32,
    viscous: 30,
    mouseForce: 25,
    cursorSize: 100,
    dt: 1 / 60
  },
  medium: {
    resolution: 0.4, // medium quality
    iterationsViscous: 22,
    iterationsPoisson: 22,
    viscous: 25,
    mouseForce: 20,
    cursorSize: 80,
    dt: 1 / 60
  },
  low: {
    resolution: 0.2, // lower quality but runs fine on weak hardware
    iterationsViscous: 14,
    iterationsPoisson: 14,
    viscous: 20,
    mouseForce: 15,
    cursorSize: 60,
    dt: 1 / 50 // slower tick for stability
  }
};

const getInitialTier = () => {
  if (typeof window === 'undefined') return 'medium';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  // fallback if browser doesn't support deviceMemory
  const ram = navigator.deviceMemory || 4;
  const isLowPower = cores <= 4 || ram <= 4;

  if (isMobile) {
    return isLowPower ? 'low' : 'medium';
  }
  // Desktop
  return isLowPower ? 'medium' : 'high';
};

const Hero = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [tier, setTier] = useState('medium');


  // Detect Performance Tier
  useEffect(() => {
    const detectTier = () => {
      setTier(getInitialTier());
    };
    detectTier();
    // only runs once on mount, hardware doesn't really change
  }, []);

  // Show scroll button logic
  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = useMemo(() => [
    { href: "https://github.com/darshan-gowdaa", Icon: FaGithub, external: true },
    { href: "https://www.linkedin.com/in/Darshan-Gowda-G-S", Icon: FaLinkedin, external: true },
    { href: "mailto:darshangowdaa223@gmail.com", Icon: FaEnvelope, external: false }
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { animateHero } = useAnimations();
  useEffect(() => {
    const cleanup = animateHero(containerRef, onComplete);
    return cleanup;
  }, [animateHero, onComplete]);

  const config = LIQUID_CONFIG[tier];

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      <section
        id="home"
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-start bg-black"
      >
        {/* Liquid Background */}
        <div className="absolute inset-0 z-0">
          <React.Suspense fallback={<div className="absolute inset-0 bg-black" />}>
            <LiquidEther
              colors={['#5227FF', '#FF9FFC', '#B19EEF']}
              mouseForce={config.mouseForce}
              cursorSize={config.cursorSize}
              isViscous={false}
              viscous={config.viscous}
              iterationsViscous={config.iterationsViscous}
              iterationsPoisson={config.iterationsPoisson}
              resolution={config.resolution}
              dt={config.dt}
              isBounce={false}
              autoDemo={true}
              autoSpeed={tier === 'low' ? 0.2 : 0.4}
              autoIntensity={tier === 'low' ? 1.5 : 2.0}
              takeoverDuration={0.25}
              autoResumeDelay={2500}
              autoRampDuration={0.6}
            />
          </React.Suspense>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full gap-4 sm:gap-6 md:gap-8 pt-20 sm:pt-24">

          {/* Badge */}
          <div className="hero-badge opacity-0">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium tracking-wider text-gray-200 uppercase shadow-lg shadow-purple-500/10">
              Full-Stack Developer
            </span>
          </div>

          {/* Main Title - Text Pressure */}
          <div className="hero-text-pressure w-full max-w-5xl opacity-0">
            <div className="relative w-full h-[80px] sm:h-[120px] md:h-[140px] flex items-center justify-center">
              <React.Suspense fallback={
                <span className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">DARSHAN GOWDA G S</span>
              }>
                <TextPressure
                text="DARSHAN GOWDA G S"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={24}
              />
              </React.Suspense>
            </div>
          </div>

          {/* Description */}
          <p className="hero-description text-center text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-light opacity-0 px-4">
            Software developer & data analytics student crafting responsive web, mobile, and desktop apps.
            Detailed-oriented team player who lives for clean code and next-gen tech.
          </p>

          {/* Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center gap-4 w-auto opacity-0">
            <NeonButton
              href="#projects"
              variant="solid"
              size="lg"
              className="w-56 sm:w-auto"
              aria-label="View My Work"
            >
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                View My Work
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </NeonButton>

            <NeonButton
              href="#contact"
              variant="default"
              size="lg"
              className="w-56 sm:w-auto"
              aria-label="Contact Me"
            >
              Contact Me
            </NeonButton>
          </div>

          {/* Social Links */}
          <div className="hero-socials flex items-center gap-6 mt-2 sm:mt-4">
            {socialLinks.map(({ href, Icon, external }, i) => (
              <a
                key={i}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="p-3 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label={Icon.name.replace('Fa', '')}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default memo(Hero);
