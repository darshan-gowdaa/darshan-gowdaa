import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAnimations } from '../hooks/useAnimations';

const links = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

const Navbar = ({ show }) => {
  // Keeping track of menu state and active section scrolling
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [forceShowNavbar, setForceShowNavbar] = useState(false);
  
  // Refs for the nav elements and bubble animations
  const navRef = useRef(null);
  const bubbleRef = useRef(null);
  const linkRefs = useRef({});
  const mobileNavRef = useRef(null);
  const mobileBubbleRef = useRef(null);
  const mobileLinkRefs = useRef({});
  const mobileScrollContainerRef = useRef(null);
  const forceShowTimeoutRef = useRef(null);
  const isScrolling = useRef(false);
  const isFirstRender = useRef(true);

  // Custom hook to manage the navbar's GSAP animations
  const { animateNavbar } = useAnimations();
  const { closeMobileMenuAnim } = animateNavbar({ 
    navRef, bubbleRef, linkRefs, activeSection, mobileMenuOpen, isFirstRender,
    mobileNavRef, mobileBubbleRef, mobileLinkRefs, mobileScrollContainerRef, show
  });

  // Dynamic page title
  useEffect(() => {
    document.title = `${activeSection} | Darshan Gowda`;
  }, [activeSection]);

  // Detect which section is currently in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isScrolling.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const sectionName = id.charAt(0).toUpperCase() + id.slice(1);
          setActiveSection(sectionName);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const observeSections = () => {
      const sections = links.map(link => document.getElementById(link.toLowerCase()));
      sections.forEach(section => section && observer.observe(section));
    };

    observeSections();

    const mutationObserver = new MutationObserver(observeSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Hide navbar when someone is looking at a big heading on mobile
  useEffect(() => {
    const visibleElements = new Map();
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visibleElements.set(entry.target, entry.isIntersecting);
      });
      
      const isAnyVisible = Array.from(visibleElements.values()).some(Boolean);
      setIsHeadingVisible(isAnyVisible);
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20% 0px'
    });

    const updateTargets = () => {
      document.querySelectorAll('h2.glass-heading')
        .forEach(h => observer.observe(h));
    };

    setTimeout(updateTargets, 100);
    
    const mutationObserver = new MutationObserver(updateTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Smooth scroll easing
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const smoothScrollTo = useCallback((targetPosition, duration) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      window.scrollTo(0, startPosition + (distance * easeOutExpo(progress)));
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        isScrolling.current = false;
      }
    };
    requestAnimationFrame(animation);
  }, []);

  // Function to scroll to sections when a link is clicked
  const scrollToSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    
    // Show navbar briefly
    setForceShowNavbar(true);
    if (forceShowTimeoutRef.current) clearTimeout(forceShowTimeoutRef.current);
    forceShowTimeoutRef.current = setTimeout(() => setForceShowNavbar(false), 2500);
    
    const isMobile = window.innerWidth < 768;
    const maxAttempts = isMobile ? 30 : 1;
    
    const tryScroll = (attempts = 0) => {
      const section = document.getElementById(sectionId.toLowerCase());
      if (!section) {
        if (attempts < maxAttempts) setTimeout(() => tryScroll(attempts + 1), 100);
        return;
      }
      
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      if (isMobile && attempts < maxAttempts) {
        setTimeout(() => {
          const rect = section.getBoundingClientRect();
          if (Math.abs(rect.top) > 100) tryScroll(attempts + 1);
        }, 100);
      }
    };
    tryScroll();
  }, []);

  // Handlers for opening/closing the mobile menu view
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    closeMobileMenuAnim(() => setMobileMenuOpen(false));
  }, [closeMobileMenuAnim]);

  return (
    <>
      {/* Desktop Navbar - unchanged */}
      <nav
        ref={navRef}
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-3 py-1.5 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-[3px] bg-black/5 group overflow-hidden"
        style={{ width: 'fit-content', opacity: 0 }}
      >
        <span className="absolute h-px opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />
        <span className="absolute transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/50 to-transparent block pointer-events-none" />

        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
        </div>

        <div
          ref={bubbleRef}
          className="absolute rounded-full -z-10 pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            boxShadow: `
              inset 0px 4px 6px rgba(255, 255, 255, 0.4), 
              inset 0px -4px 6px rgba(255, 255, 255, 0.2), 
              0px 8px 16px rgba(0, 0, 0, 0.3),
              inset 2px 0px 4px rgba(255, 255, 255, 0.2)
            `,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            top: 0, left: 0, width: 0, height: 0
          }}
        />

        <div className="flex items-center p-1 relative z-10">
          {links.map((link) => {
            const isActive = activeSection === link;
            return (
              <button
                key={link}
                ref={el => linkRefs.current[link] = el}
                onClick={() => scrollToSection(link)}
                aria-label={`Scroll to ${link} section`}
                className={`relative px-5 py-2 rounded-full text-base font-medium uppercase tracking-wider transition-colors duration-300 group select-none ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
                style={{ 
                  outline: 'none',
                  textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2)'
                }}
              >
                <span className="relative z-10">{link}</span>
                {!isActive && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile navigation structure */}
      <div 
        ref={mobileNavRef}
        className={`md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-[2rem] overflow-hidden ${
          !mobileMenuOpen && isHeadingVisible && !forceShowNavbar
            ? '-translate-y-[200%] opacity-0 pointer-events-none' 
            : 'translate-y-0'
        }`}
        style={{
          width: mobileMenuOpen ? '260px' : 'auto',
          height: mobileMenuOpen ? '290px' : '50px',
          background: mobileMenuOpen ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: mobileMenuOpen ? 'blur(8px)' : 'blur(12px)',
          WebkitBackdropFilter: mobileMenuOpen ? 'blur(8px)' : 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: mobileMenuOpen ? 
            '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05)' : 
            '0 10px 20px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.02)',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: 0
        }}
      >
        <span className="absolute h-px opacity-100 inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
        <span className="absolute h-px opacity-100 inset-x-0 bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white/40 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30" />
        </div>

        {/* Current section name shown when menu is closed */}
        <div 
          className={`relative w-full h-[50px] flex items-center justify-center cursor-pointer ${
            mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ transition: 'opacity 0.25s ease-out' }}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          role="button"
          tabIndex={0}
        >
          <span className="text-white text-sm font-medium tracking-wider uppercase drop-shadow-md px-6">
            {activeSection}
          </span>
        </div>

        {/* Expanded nav links for mobile menu */}
        <div 
          className={`absolute inset-0 w-full h-full ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            transition: mobileMenuOpen 
              ? 'opacity 0.35s ease-out 0.15s' 
              : 'opacity 0.2s ease-in'
          }}
        >
          <div 
            ref={mobileScrollContainerRef}
            className="w-full h-full flex flex-col items-center justify-start pt-6 pb-4 space-y-1 relative"
          >
            <div
              ref={mobileBubbleRef}
              className="absolute rounded-full -z-10 pointer-events-none transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 0 8px rgba(255,255,255,0.05)',
                width: '80%', 
                left: '10%',
                height: '0px', 
                top: '0px'
              }}
            />

            {links.map((link) => {
              const isActive = activeSection === link;
              return (
                <button
                  key={link}
                  ref={el => mobileLinkRefs.current[link] = el}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    scrollToSection(link);
                  }}
                  aria-label={`Scroll to ${link} section`}
                  className={`relative w-full py-1 text-base font-medium uppercase tracking-wider transition-colors duration-300 shrink-0 drop-shadow-md ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white/80'
                  }`}
                >
                  {link}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 transparent" 
          onClick={toggleMobileMenu}
          onTouchStart={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default memo(Navbar);
