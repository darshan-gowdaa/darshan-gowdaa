// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',

  minFontSize = 24
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const charCentersRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const isTouchRef = useRef(false);
  // Cache titleRect — avoids getBoundingClientRect on every RAF frame
  const titleRectRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = e => {
      isTouchRef.current = false;
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchStart = e => {
      isTouchRef.current = true;
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
    };
    const handleTouchMove = e => {
      isTouchRef.current = true;
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();
      // Update cached rect
      titleRectRef.current = textRect;

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
      
      // OPTIMIZATION: Cache the relative center percentages of each char
      if (spansRef.current.length > 0) {
        const parentRect = titleRef.current.getBoundingClientRect();
        charCentersRef.current = spansRef.current.map(span => {
          if (!span) return { xPct: 0, yPct: 0 };
          const rect = span.getBoundingClientRect();
          return {
            xPct: parentRect.width > 0 ? (rect.x + rect.width / 2 - parentRect.x) / parentRect.width : 0,
            yPct: parentRect.height > 0 ? (rect.y + rect.height / 2 - parentRect.y) / parentRect.height : 0
          };
        });
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setSize();
      });
    }
  }, [setSize]);

  useEffect(() => {
    let rafId;
    let isVisible = true;

    const observer = new IntersectionObserver(
        ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                if (!rafId) animate();
            } else {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        },
        { threshold: 0 }
    );

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    const animate = () => {
      if (!isVisible) return;

      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 12;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 9;

      if (titleRef.current) {
        const titleRect = titleRectRef.current;
        const maxDist = titleRect.width / 2;

        if (isTouchRef.current) {
          cursorRef.current.y = titleRect.y + titleRect.height / 2;
          mouseRef.current.y = cursorRef.current.y;
        }

        spansRef.current.forEach((span, i) => {
          if (!span) return;

          const pct = charCentersRef.current[i];
          if (!pct) return;

          const charCenter = {
            x: titleRect.x + pct.xPct * titleRect.width,
            y: titleRect.y + pct.yPct * titleRect.height
          };

          const d = dist(mouseRef.current, charCenter);

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    return () => {
       if (rafId) cancelAnimationFrame(rafId);
       observer.disconnect();
    };
  }, [width, weight, italic, alpha]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
    );
  }, [textColor, strokeColor, strokeWidth]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent">
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${className} ${
          flex ? 'flex justify-between' : ''
        } ${stroke ? 'stroke' : ''} uppercase text-center`}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor
        }}
      >
        {chars.map((char, i) => (
          <span key={i} ref={el => (spansRef.current[i] = el)} data-char={char} className="inline-block" style={{ willChange: 'font-variation-settings' }}>
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
