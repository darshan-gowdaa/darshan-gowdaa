// src/hooks/useIsMobile.js
import { useState, useEffect } from 'react';

const MOBILE_MEDIA_QUERY = '(hover: none) and (pointer: coarse)';

/**
 * Shared hook to detect touch/mobile devices.
 * Uses pointer media query — reliable across modern browsers.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  return isMobile;
};
