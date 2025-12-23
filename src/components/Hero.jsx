import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp, FaArrowRight } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import LiquidEther from './react-bits/LiquidEther';
import TextPressure from './react-bits/TextPressure';
import { NeonButton } from './ui/NeonButton';

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll, { passive: true });
  }, []);

  // Memoized social links
  const socialLinks = useMemo(() => [
    { href: "https://github.com/darshan-gowdaa", Icon: FaGithub, external: true },
    { href: "https://www.linkedin.com/in/Darshan-Gowda-G-S", Icon: FaLinkedin, external: true },
    { href: "mailto:darshangowdaa223@gmail.com", Icon: FaEnvelope, external: false }
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 }
    }
  };

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="liquid-glass-icon !fixed !bottom-10 sm:!bottom-12 !right-6 sm:!right-8 !z-[9999] text-gray-300 hover:text-white transition-all p-3 sm:p-3.5 md:p-4 rounded-full transform hover:scale-110 duration-300 flex items-center justify-center group touch-manipulation select-none animate-fadeIn"
          style={{ position: 'fixed', bottom: '2.5rem', right: '1.5rem' }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      )}

      <div
        id="home"
        className="h-screen w-full relative z-20 overflow-hidden flex items-center justify-center"
        ref={ref}
      >
        {/* Liquid Ether Background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={1500}
            autoRampDuration={0.6}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full pt-44 sm:pt-52 md:pt-60 pb-12 sm:pb-16 md:pb-20">
          {/* Content */}
          <motion.div
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl text-center px-4 sm:px-6 md:px-8 flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8 md:mb-10">
              <span className="liquid-glass-badge inline-block bg-clip-text text-gray-200 bg-gradient-to-r from-white to-gray-300 font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm tracking-widest uppercase">
                Full-Stack Developer
              </span>
            </motion.div>

            <div className="relative h-[100px] sm:h-[120px] md:h-[150px] w-full mb-10 sm:mb-14 max-w-5xl mx-auto">
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

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-gray-400 mb-10 sm:mb-14 max-w-3xl md:max-w-4xl mx-auto px-4 leading-relaxed font-light tracking-wide"
            >
              I am a software developer and data analytics student with strong skills in the MERN stack, building full-stack web apps that solve real problems. My experience includes developing scalable systems and interactive platforms. I also have foundational knowledge in DevOps and cloud computing, helping deploy and manage applications efficiently. I enjoy working in teams and continuously learning to keep up with evolving technologies.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4"
            >
              <NeonButton
                href="#projects"
                variant="solid"
                size="lg"
                className="w-full sm:w-auto"
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
              >
                Contact Me
              </NeonButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center space-x-3 sm:space-x-4 md:space-x-6 mb-8 sm:mb-10 md:mb-12 px-2"
            >
              {socialLinks.map(({ href, Icon, external }, i) => (
                <a
                  key={i}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="liquid-glass-icon text-gray-300 hover:text-white transition-all p-2 sm:p-2.5 md:p-3 rounded-full transform hover:scale-110 duration-300 select-none"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>


      </div>
    </>
  );
};

export default memo(Hero);
