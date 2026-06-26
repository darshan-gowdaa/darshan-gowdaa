// src/components/organisms/Hero.jsx
import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp, FaArrowRight } from 'react-icons/fa';
import { useAnimations } from '../../hooks/useAnimations';
import { NeonButton } from '../atoms/NeonButton';
import TextPressure from '../atoms/TextPressure';
import LightRays from '../atoms/LightRays';

const Hero = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = useMemo(() => [
    { href: "https://github.com/darshan-gowdaa", Icon: FaGithub, external: true, label: "GitHub" },
    { href: "https://www.linkedin.com/in/Darshan-Gowda-G-S", Icon: FaLinkedin, external: true, label: "LinkedIn" },
    { href: "mailto:darshangowdaa223@gmail.com", Icon: FaEnvelope, external: false, label: "Email" }
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { animateHero } = useAnimations();
  useEffect(() => {
    const cleanup = animateHero(containerRef, onComplete);
    return cleanup;
  }, [animateHero, onComplete]);

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-50 p-3 rounded-full glass-element glass-base text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center group shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      <section
        id="home"
        ref={containerRef}
        className="relative h-[100svh] w-full overflow-hidden flex flex-col items-center justify-start bg-black"
        style={{ contain: 'layout paint' }}
      >
        {/* LightRays Background */}
        <div className="absolute inset-0 z-0" style={{ contain: 'strict' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={3}
            lightSpread={1.5}
            rayLength={2.8}
            followMouse={true}
            mouseInfluence={0.3}
            noiseAmount={0.2}
            distortion={0.1}
            fadeDistance={1.5}
            saturation={1.6}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full gap-4 sm:gap-6 md:gap-8 pt-20 sm:pt-24">

          {/* Main Title - Text Pressure */}
          <div className="hero-text-pressure w-full max-w-5xl">
            <div className="relative w-full h-[80px] sm:h-[120px] md:h-[140px] flex items-center justify-center">
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
            </div>
          </div>

          {/* Description */}
          <p className="hero-description text-center text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-light opacity-0 px-4">
            Software developer &amp; data analytics student crafting responsive web, mobile, and desktop apps.
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
            {socialLinks.map(({ href, Icon, external, label }, i) => (
              <a
                key={i}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="p-3 group block"
                aria-label={label}
              >
                <div className="text-gray-400 group-hover:text-white transition-all duration-300 group-hover:scale-110 transform">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default memo(Hero);
