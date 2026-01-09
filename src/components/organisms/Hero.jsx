// src/components/organisms/Hero.jsx
import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp, FaArrowRight } from 'react-icons/fa';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAnimations } from '../../hooks/useAnimations';
import LiquidEther from '../atoms/LiquidEther';
import TextPressure from '../atoms/TextPressure';
import { NeonButton } from '../atoms/NeonButton';

const Hero = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // mobile check for perf
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    };
    checkMobile();
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    mq.addEventListener('change', checkMobile);
    return () => mq.removeEventListener('change', checkMobile);
  }, []);

  // show scroll button
  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { passive: true });
  }, []);

  // social links
  const socialLinks = useMemo(() => [
    { href: "https://github.com/darshan-gowdaa", Icon: FaGithub, external: true },
    { href: "https://www.linkedin.com/in/Darshan-Gowda-G-S", Icon: FaLinkedin, external: true },
    { href: "mailto:darshangowdaa223@gmail.com", Icon: FaEnvelope, external: false }
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // init animations
  const { animateHero } = useAnimations();
  animateHero(containerRef, onComplete);

  return (
    <>
      {/* scroll to top */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="liquid-glass-icon !fixed !bottom-10 sm:!bottom-12 !right-6 sm:!right-8 !z-[9999] text-gray-300 hover:text-white transition-all p-3 sm:p-3.5 md:p-4 rounded-full transform hover:scale-110 duration-300 flex items-center justify-center group touch-manipulation select-none animate-fadeIn"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      )}

      <div
        id="home"
        className="h-screen w-full relative z-20 overflow-hidden flex items-center justify-center"
        ref={containerRef}
      >
        {/* liquid background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={isMobile ? 12 : 20}
            cursorSize={isMobile ? 60 : 100}
            isViscous={false}
            viscous={isMobile ? 20 : 30}
            iterationsViscous={isMobile ? 16 : 32}
            iterationsPoisson={isMobile ? 16 : 32}
            resolution={isMobile ? 0.25 : 0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={isMobile ? 0.3 : 0.5}
            autoIntensity={isMobile ? 1.5 : 2.2}
            takeoverDuration={0.25}
            autoResumeDelay={2500}
            autoRampDuration={0.6}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-start sm:justify-center min-h-[85vh] sm:min-h-screen w-full pt-12 sm:pt-40 md:pt-48 pb-12 sm:pb-16 md:pb-20">
          {/* content */}
          <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl text-center px-4 sm:px-6 md:px-8 flex flex-col items-center">
            
            <div className="hero-badge mb-16 sm:mb-8 md:mb-10 opacity-0">
              <span 
                className={`liquid-glass-badge mobile-hover-default inline-block bg-clip-text text-gray-200 bg-gradient-to-r from-white to-gray-300 font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm tracking-widest uppercase transition-all duration-300`}
              >
                Full-Stack Developer
              </span>
            </div>

            <div className="hero-text-pressure relative h-[120px] sm:h-[120px] md:h-[150px] w-full mb-2 sm:mb-14 max-w-5xl mx-auto opacity-0 px-2 sm:px-0">
              <TextPressure
                text="Darshan Gowda"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={36}
              />
            </div>

            <p className="hero-description text-base sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-14 max-w-3xl md:max-w-4xl mx-auto px-4 leading-relaxed font-light tracking-wide opacity-0">
              Software developer & data analytics student crafting responsive web, mobile, and desktop apps that solve real problems. Deploy scalable MERN solutions with AWS, Docker, and cybersecurity fundamentals. Team player who lives for clean code and next-gen tech.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-4 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4 opacity-0 mt-8 sm:mt-0">
              <NeonButton
                href="#projects"
                variant="solid"
                size="lg"
                className="w-full sm:w-auto"
                aria-label="View My Work"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" size={14} />
                </span>
              </NeonButton>
              <NeonButton
                href="#contact"
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                aria-label="Contact Me"
              >
                Contact Me
              </NeonButton>
            </div>

            <div className="hero-socials flex justify-center items-center gap-8 sm:gap-4 md:gap-6 px-2 pb-8 sm:pb-0">
              {socialLinks.map(({ href, Icon, external }, i) => (
                <a
                  key={i}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`liquid-glass-icon transition-all p-3 sm:p-2.5 md:p-3 rounded-full duration-300 select-none opacity-0 ${
                    isMobile 
                      ? '!bg-white/15 !border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.25)] text-white scale-110' 
                      : 'text-gray-300 hover:text-white transform hover:scale-110'
                  }`}
                  aria-label={Icon.name.replace('Fa', '')}
                >
                  <Icon className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default memo(Hero);
