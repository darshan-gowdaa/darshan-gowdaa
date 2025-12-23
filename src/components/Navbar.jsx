import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const links = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    document.title = `${activeSection} | Darshan Gowda`;
  }, [activeSection]);

  useEffect(() => {
    const sections = links.map(link => document.getElementById(link.toLowerCase()));

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const sectionName = id.charAt(0).toUpperCase() + id.slice(1);
          setActiveSection(sectionName);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
      observer.disconnect();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId.toLowerCase());
    if (section) {
      if (sectionId.toLowerCase() === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        const heading = section.querySelector('h2');
        const targetElement = heading || section;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Desktop Floating Centered Pill Navbar */}
      <nav
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-3 py-2.5 transition-all duration-300 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-[3px] bg-black/5 group overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        {/* Neon Glow Borders (Top & Bottom) */}
        <span className="absolute h-px opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />
        <span className="absolute transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />

        {/* Liquid Glass Shine */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
        </div>

        <div className="flex items-center p-1 relative z-10">
          {links.map((link) => {
            const isActive = activeSection === link;
            return (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className={`relative px-5 py-2.5 rounded-full text-base font-medium uppercase tracking-wider transition-colors duration-300 group select-none ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                style={{ outline: 'none' }}
              >
                <span className="relative z-10">{link}</span>

                {/* Active Liquid Bubble Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeBubble"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: `
                        inset 0px 4px 6px rgba(255, 255, 255, 0.4), 
                        inset 0px -4px 6px rgba(255, 255, 255, 0.2), 
                        0px 8px 16px rgba(0, 0, 0, 0.3),
                        inset 2px 0px 4px rgba(255, 255, 255, 0.2)
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Subtle Hover Glint */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: Current Section Indicator (top) - Liquid Glass Style */}
      <div
        className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 0 20px rgba(255, 255, 255, 0.1),
            inset 0 0 15px rgba(255, 255, 255, 0.03)
          `
        }}
      >
        {/* Neon Glow Border - Top */}
        <span className="absolute h-px opacity-100 inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
        {/* Neon Glow Border - Bottom */}
        <span className="absolute h-px opacity-100 inset-x-0 bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
        {/* Liquid Glass Shine */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
        </div>
        <span className="relative z-10 text-white text-sm font-medium tracking-wider uppercase">{activeSection}</span>
      </div>

      {/* Mobile: Fixed FAB (Bottom Left) - Thumb Friendly with Liquid Glass Neon */}
      <AnimatePresence>
        {!mobileMenuOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={toggleMobileMenu}
            className="md:hidden fixed bottom-10 sm:bottom-12 left-6 sm:left-8 z-50 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 select-none group overflow-hidden"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 0 25px rgba(255, 255, 255, 0.15),
                0 0 50px rgba(255, 255, 255, 0.08),
                inset 0 0 20px rgba(255, 255, 255, 0.05)
              `
            }}
            aria-label="Open menu"
          >
            {/* Neon Glow Border - Top */}
            <span className="absolute h-px opacity-100 inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent pointer-events-none" />
            {/* Neon Glow Border - Bottom */}
            <span className="absolute h-px opacity-100 inset-x-0 bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent pointer-events-none" />
            {/* Liquid Glass Shine */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
            </div>
            <FaBars size={20} className="relative z-10 text-white group-hover:text-white/90 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ touchAction: 'manipulation' }}
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-black/95"
              onClick={closeMobileMenu}
            />

            {/* Menu Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="relative w-full max-w-xs"
            >
              {/* Glass Container - Liquid Glass Theme */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `
                    0 0 60px rgba(255, 255, 255, 0.08),
                    inset 0 0 30px rgba(255, 255, 255, 0.02)
                  `
                }}
              >
                {/* Top Neon Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Menu Items */}
                <div className="p-4 space-y-1">
                  {links.map((link, index) => {
                    const isActive = activeSection === link;
                    return (
                      <motion.button
                        key={link}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => scrollToSection(link)}
                        className="w-full text-left py-3.5 px-5 rounded-xl text-base font-medium transition-all duration-200 select-none"
                        style={{
                          touchAction: 'manipulation',
                          WebkitTapHighlightColor: 'transparent',
                          background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          color: isActive ? '#ffffff' : 'rgba(156, 163, 175, 1)',
                          border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                          boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.05)' : 'none'
                        }}
                      >
                        {link}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Bottom Neon Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>

              {/* Close Button - Liquid Glass Style */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={closeMobileMenu}
                className="w-full mt-4 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 select-none text-white overflow-hidden relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 0 25px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* Neon Glow Border - Top */}
                <span className="absolute h-px opacity-100 inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
                {/* Neon Glow Border - Bottom */}
                <span className="absolute h-px opacity-100 inset-x-0 bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
                <FaTimes size={16} className="relative z-10" />
                <span className="relative z-10">Close</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);