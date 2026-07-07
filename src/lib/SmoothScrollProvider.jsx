// src/lib/SmoothScrollProvider.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const SmoothScrollContext = createContext(null);

/**
 * Exposes the Lenis instance to the entire tree.
 * - 60 fps on standard displays, 120 fps on ProMotion / high-refresh
 * - Touch devices keep native momentum (smoothTouch off)
 * - Respects prefers-reduced-motion
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // Bail entirely for users who prefer reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const instance = new Lenis({
      lerp: 0.1,             // smooth but responsive — good balance for 60–120 Hz
      smoothWheel: true,
      smoothTouch: false,     // native touch momentum feels better on mobile
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: true,          // Lenis manages its own RAF loop
    });

    lenisRef.current = instance;
    setLenis(instance);

    return () => {
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/**
 * Returns the Lenis instance (or null before mount / reduced-motion).
 * Use lenis.scrollTo() for programmatic navigation.
 */
export function useLenis() {
  return useContext(SmoothScrollContext);
}
