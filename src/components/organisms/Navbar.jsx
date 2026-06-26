// src/components/organisms/Navbar.jsx
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// site sections
const links = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

// glassy borders
const GradientBorder = ({ className = "" }) => (
  <>
    <span className={`absolute h-px opacity-100 inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none ${className}`} />
    <span className={`absolute h-px opacity-100 inset-x-0 bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none ${className}`} />
  </>
);

// glass overlay
const GlassOverlay = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30" />
  </div>
);

const Navbar = ({ show }) => {
  // menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [forceShowNavbar, setForceShowNavbar] = useState(false);

  const mobileNavRef = useRef(null);
  const isScrolling = useRef(false);
  const pendingSectionRef = useRef(null);
  const forceShowTimeoutRef = useRef(null);

  // update page title
  useEffect(() => { document.title = `${activeSection} | Darshan Gowda G S`; }, [activeSection]);

  // track active section
  useEffect(() => {
    const getSections = () => links
      .map((link) => ({
        name: link,
        el: document.getElementById(link.toLowerCase())
      }))
      .filter((item) => item.el);

    const updateActiveFromScroll = () => {
      if (isScrolling.current) {
        if (pendingSectionRef.current) {
          setActiveSection((prev) => (prev === pendingSectionRef.current ? prev : pendingSectionRef.current));
        }
        return;
      }

      const sections = getSections();
      if (!sections.length) return;

      const anchorY = window.innerHeight * 0.35;
      let best = null;

      sections.forEach(({ name, el }) => {
        const rect = el.getBoundingClientRect();
        const containsAnchor = rect.top <= anchorY && rect.bottom >= anchorY;
        const distance = Math.abs(rect.top - anchorY);

        if (containsAnchor) {
          if (!best || !best.containsAnchor || distance < best.distance) {
            best = { name, distance, containsAnchor: true };
          }
        } else if (!best || (!best.containsAnchor && distance < best.distance)) {
          best = { name, distance, containsAnchor: false };
        }
      });

      if (best) {
        setActiveSection((prev) => (prev === best.name ? prev : best.name));
      }
    };

    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveFromScroll);
    };

    const t = setTimeout(() => {
      updateActiveFromScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }, 100);

    return () => {
      clearTimeout(t);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // auto hide mobile nav
  useEffect(() => {
    const visibleElements = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => visibleElements.set(entry.target, entry.isIntersecting));
      const isAnyVisible = Array.from(visibleElements.values()).some(isVisible => isVisible);
      setIsHeadingVisible(isAnyVisible);
    }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });

    // Delay to ensure DOM and lazy-loaded headings are ready
    const t = setTimeout(() => {
      const headings = document.querySelectorAll('h2.glass-heading');
      headings.forEach(h => observer.observe(h));
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, []);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (!mobileMenuOpen) return;

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside, { passive: true });
    };
  }, [mobileMenuOpen]);

  // scroll to section
  const scrollToSection = (sectionId) => {
    isScrolling.current = true;
    pendingSectionRef.current = sectionId;

    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }

    setMobileMenuOpen(false);
    setActiveSection(sectionId);

    setForceShowNavbar(true);
    if (forceShowTimeoutRef.current) clearTimeout(forceShowTimeoutRef.current);
    forceShowTimeoutRef.current = setTimeout(() => setForceShowNavbar(false), 2500);

    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId.toLowerCase());
      if (!element) {
        isScrolling.current = false;
        pendingSectionRef.current = null;
        return;
      }

      const targetTop = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      const anchorY = window.innerHeight * 0.35;
      const lockStart = performance.now();
      const maxLockMs = 2200;
      let rafId = null;

      const finishScrollLock = () => {
        if (rafId) cancelAnimationFrame(rafId);
        isScrolling.current = false;
        pendingSectionRef.current = null;
      };

      const ensureTargetVisible = () => {
        const target = document.getElementById(sectionId.toLowerCase());
        if (!target) {
          finishScrollLock();
          return;
        }

        const rect = target.getBoundingClientRect();
        const isVisibleAtAnchor = rect.top <= anchorY && rect.bottom >= anchorY;

        if (isVisibleAtAnchor) {
          finishScrollLock();
          return;
        }

        if (performance.now() - lockStart > maxLockMs) {
          finishScrollLock();
          return;
        }

        rafId = requestAnimationFrame(ensureTargetVisible);
      };

      rafId = requestAnimationFrame(ensureTargetVisible);
    });
  };

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

  const renderLinks = (isMobile = false) => {
    return links.map((link) => {
      const isActive = activeSection === link;
      return (
        <button
          key={link}
          onClick={(e) => { isMobile && e.stopPropagation(); scrollToSection(link); }}
          className={isMobile
            ? "relative w-full py-1 text-base font-medium uppercase tracking-wider transition-colors duration-300 shrink-0 drop-shadow-md text-white"
            : `nav-link-btn ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`
          }
          style={isMobile ? { textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)' } : {}}
        >
          {isActive && (
            <motion.div
              layoutId={isMobile ? "mobile-bubble" : "desktop-bubble"}
              className={isMobile ? "nav-mobile-bubble absolute inset-0" : "nav-bubble-desktop absolute inset-0"}
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
              style={isMobile ? { width: '80%', left: '10%', height: '100%' } : {}}
            />
          )}
          <span className="relative z-10">{link}</span>
          {!isActive && !isMobile && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )}
        </button>
      );
    });
  };

  return (
    <>
      {/* desktop nav */}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.7 }}
            className="hidden md:flex fixed top-6 inset-x-0 justify-center z-50 pointer-events-none"
          >
            <nav className="pointer-events-auto rounded-full px-3 py-1.5 duration-300 group overflow-hidden nav-glass-group" style={{ width: 'fit-content' }}>
              <GradientBorder className="transition-all duration-500 ease-in-out via-white/50" />
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
              </div>
              <div className="flex items-center p-1 relative z-10">{renderLinks()}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile nav */}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.7 }}
            className="md:hidden fixed top-6 inset-x-0 flex justify-center z-50 pointer-events-none"
          >
            <div ref={mobileNavRef} className={`pointer-events-auto rounded-3xl overflow-hidden nav-mobile-glass nav-mobile-base ${mobileMenuOpen ? 'nav-mobile-open' : 'nav-mobile-closed'} ${!mobileMenuOpen && isHeadingVisible && !forceShowNavbar ? '-translate-y-[200%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
              <GradientBorder />
              <GlassOverlay />
              <button aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen} className={`relative w-full h-[40px] flex items-center justify-center cursor-pointer ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ transition: 'opacity 0.25s ease-out', background: 'none', border: 'none' }} onClick={toggleMobileMenu}>
                <span className="text-white text-sm font-medium tracking-wider uppercase drop-shadow-md px-6">{activeSection}</span>
              </button>
              <div className={`absolute inset-0 w-full h-full ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ transition: mobileMenuOpen ? 'opacity 0.35s ease-out 0.15s' : 'opacity 0.2s ease-in' }}>
                <div className="w-full h-full flex flex-col items-center justify-start pt-2 pb-4 space-y-1 relative">
                  {renderLinks(true)}
                </div>
              </div>
            </div>
            {mobileMenuOpen && <div className="fixed inset-0 z-40 transparent" onClick={toggleMobileMenu} onTouchStart={toggleMobileMenu} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);

