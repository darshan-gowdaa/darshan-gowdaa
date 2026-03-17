// src/components/organisms/Navbar.jsx
import React, { memo, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAnimations } from '../../hooks/useAnimations';

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

  // animation refs
  const navRef = useRef(null);
  const bubbleRef = useRef(null);
  const linkRefs = useRef({});
  const mobileNavRef = useRef(null);
  const mobileBubbleRef = useRef(null);
  const mobileLinkRefs = useRef({});
  const mobileScrollContainerRef = useRef(null);
  const isScrolling = useRef(false);
  const isFirstRender = useRef(true);
  const isBubbleInitialized = useRef(false);
  const forceShowTimeoutRef = useRef(null);


  // update page title
  useEffect(() => { document.title = `${activeSection} | Darshan Gowda`; }, [activeSection]);


  // shared animation helper
  const { animateNavbar } = useAnimations();
  animateNavbar({
    navRef, bubbleRef, linkRefs, activeSection, mobileMenuOpen, isFirstRender, isBubbleInitialized,
    mobileNavRef, mobileBubbleRef, mobileLinkRefs, show
  });


  // track active section
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };
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
    // Delay to ensure DOM is fully rendered
    const t = setTimeout(() => {
      links.forEach(link => {
        const section = document.getElementById(link.toLowerCase());
        if (section) observer.observe(section);
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(t);
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
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);


  // scroll to section
  const scrollToSection = (sectionId) => {
    isScrolling.current = true;

    // 1. READ: Calculate target position
    let targetTop = null;
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      targetTop = element.getBoundingClientRect().top + window.scrollY;
    }

    // 2. WRITE: Updates state and DOM
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }

    setMobileMenuOpen(false);
    setActiveSection(sectionId);

    setForceShowNavbar(true);
    if (forceShowTimeoutRef.current) clearTimeout(forceShowTimeoutRef.current);
    forceShowTimeoutRef.current = setTimeout(() => setForceShowNavbar(false), 2500);

    // 3. ANIMATE
    if (targetTop !== null) {
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    } else {
      isScrolling.current = false;
    }
  };


  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

  // mobile menu styles
  const mobileStyles = useMemo(() => ({
    width: mobileMenuOpen ? '234px' : '150px',
    height: mobileMenuOpen ? '265px' : '40px',
    background: mobileMenuOpen ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
    backdropFilter: mobileMenuOpen ? 'blur(12px)' : 'blur(8px)',
    WebkitBackdropFilter: mobileMenuOpen ? 'blur(12px)' : 'blur(8px)',
    border: mobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: mobileMenuOpen ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.02)' : '0 0 15px rgba(255, 255, 255, 0.15)',
    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    willChange: 'width, height',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    contain: 'layout paint'
  }), [mobileMenuOpen]);


  // render nav links
  const renderLinks = (refs, isMobile = false) => {
    return links.map((link) => {
      const isActive = activeSection === link;
      return (
        <button
          key={link}
          ref={el => refs.current[link] = el}
          onClick={(e) => { isMobile && e.stopPropagation(); scrollToSection(link); }}
          className={isMobile
            ? "relative w-full py-1 text-base font-medium uppercase tracking-wider transition-colors duration-300 shrink-0 drop-shadow-md text-white"
            : `nav-link-btn ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`
          }
          style={isMobile ? { textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)' } : {}}
        >
          <span className="relative z-10">{link}</span>
          {!isActive && !isMobile && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300" />
            </div>
          )}
        </button>
      );
    });
  };


  return (
    <>
      {/* desktop nav */}
      <div className="hidden md:flex fixed top-6 inset-x-0 justify-center z-50 pointer-events-none">
        <nav ref={navRef} className="pointer-events-auto rounded-full px-3 py-1.5 duration-300 group overflow-hidden nav-glass-group" style={{ width: 'fit-content', opacity: 0 }}>
          <GradientBorder className="transition-all duration-500 ease-in-out via-white/50" />
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-30" />
          </div>
          <div ref={bubbleRef} className="nav-bubble-desktop" style={{ top: 0, left: 0, width: 0, height: 0, willChange: 'transform, width, height', transition: 'none' }} />
          <div className="flex items-center p-1 relative z-10">{renderLinks(linkRefs)}</div>
        </nav>
      </div>

      {/* mobile nav */}
      <div className="md:hidden fixed top-6 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div ref={mobileNavRef} className={`pointer-events-auto rounded-3xl overflow-hidden nav-mobile-glass ${!mobileMenuOpen && isHeadingVisible && !forceShowNavbar ? '-translate-y-[200%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`} style={mobileStyles}>
          <GradientBorder />
          <GlassOverlay />
          <div className={`relative w-full h-[40px] flex items-center justify-center cursor-pointer ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ transition: 'opacity 0.25s ease-out' }} onClick={toggleMobileMenu}>
            <span className="text-white text-sm font-medium tracking-wider uppercase drop-shadow-md px-6">{activeSection}</span>
          </div>
          <div className={`absolute inset-0 w-full h-full ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ transition: mobileMenuOpen ? 'opacity 0.35s ease-out 0.15s' : 'opacity 0.2s ease-in' }}>
            <div ref={mobileScrollContainerRef} className="w-full h-full flex flex-col items-center justify-start pt-2 pb-4 space-y-1 relative">
              <div ref={mobileBubbleRef} className="nav-mobile-bubble" style={{ height: '0px', top: '0px', width: '220px', left: '50%', transform: 'translateX(-50%)', opacity: mobileMenuOpen ? 1 : 0, willChange: 'transform, height', transition: 'none' }} />
              {renderLinks(mobileLinkRefs, true)}
            </div>
          </div>
        </div>
        {mobileMenuOpen && <div className="fixed inset-0 z-40 transparent" onClick={toggleMobileMenu} onTouchStart={toggleMobileMenu} />}
      </div>
    </>
  );
};


export default memo(Navbar);
