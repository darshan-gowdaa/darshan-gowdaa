import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';
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
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top-center
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Capitalize first letter to match links array
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

  const scrollToSection = useCallback((sectionId) => {
    setActiveSection(sectionId); // Instant feedback
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
        const offsetPosition = elementPosition + window.pageYOffset - 100; // Adjusted offset for floating nav

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

  const menuAnimation = useSpring({
    transform: mobileMenuOpen ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)',
    opacity: mobileMenuOpen ? 1 : 0,
    config: { tension: 280, friction: 22 },
  });

  return (
    <>
      {/* Floating Centered Pill Navbar */}
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-[3px] bg-black/5 group overflow-hidden"
        style={{ width: 'fit-content' }}
      >
        {/* Neon Glow Borders (Top & Bottom) */}
        <span className="absolute h-px opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />
        <span className="absolute transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />

        {/* Liquid Glass Shine - Subtle */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
        </div>

        <div className="flex items-center justify-center space-x-1 sm:space-x-1 relative z-10">

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center p-1">
            {links.map((link) => {
              const isActive = activeSection === link;
              return (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className={`relative px-5 py-2.5 rounded-full text-sm sm:text-base font-medium uppercase tracking-wider transition-colors duration-300 group select-none ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
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

                  {/* Subtle Hover Glint Wrapper (Non-active only) */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button - Centered when on mobile */}
          <div className="md:hidden px-2">
            <button
              onClick={toggleMobileMenu}
              className="relative p-3 rounded-full text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="relative z-10">
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </span>
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Content - distinct from the pill, floating below or overlaying */}
      <animated.div
        style={menuAnimation}
        className="md:hidden fixed top-0 right-0 h-screen w-72 pt-24 px-6 shadow-2xl z-40 bg-gray-950/95 backdrop-blur-xl border-l border-white/10"
      >
        <div className="flex flex-col space-y-4">
          {links.map((link, index) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              className={`text-left text-lg font-medium py-3 border-b border-white/5 transition-colors duration-300 ${activeSection === link ? 'text-white border-white/30' : 'text-gray-300 hover:text-white'
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link}
            </button>
          ))}
        </div>
      </animated.div>
    </>
  );
};

export default memo(Navbar);