import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.3,
  rotateAmplitude = 30,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const lastYRef = useRef(0);
  const rectRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Core tilt logic — works for both mouse and touch
  const applyTilt = useCallback((clientX, clientY) => {
    if (!ref.current) return;
    
    if (!rectRef.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    x.set(clientX - rect.left);
    y.set(clientY - rect.top);

    const velocityY = offsetY - lastYRef.current;
    rotateFigcaption.set(-velocityY * 0.6);
    lastYRef.current = offsetY;
  }, [rotateAmplitude, rotateX, rotateY, x, y, rotateFigcaption]);

  const handleActivate = useCallback(() => {
    setIsHovered(true);
    scale.set(scaleOnHover);
    opacity.set(1);
  }, [scale, scaleOnHover, opacity]);

  const handleDeactivate = useCallback(() => {
    setIsHovered(false);
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
    rectRef.current = null;
  }, [scale, opacity, rotateX, rotateY, rotateFigcaption]);

  // Mouse handlers
  const handleMouseMove = useCallback((e) => applyTilt(e.clientX, e.clientY), [applyTilt]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    handleActivate();
    const t = e.touches[0];
    applyTilt(t.clientX, t.clientY);
  }, [handleActivate, applyTilt]);

  const handleTouchMove = useCallback((e) => {
    // prevent page scroll while tilting the card
    e.preventDefault();
    const t = e.touches[0];
    applyTilt(t.clientX, t.clientY);
  }, [applyTilt]);

  const handleTouchEnd = useCallback(() => {
    handleDeactivate();
  }, [handleDeactivate]);

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center touch-none"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleActivate}
      onMouseLeave={handleDeactivate}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleDeactivate}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        {/* Rotating glow ring */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-70 transition-all duration-300 -z-10 will-change-transform"
          style={{
            background: 'conic-gradient(from 0deg, transparent, white, transparent 30%)',
            animation: `spin-slow ${isHovered ? '1s' : '4s'} linear infinite`,
          }}
        />

        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 object-cover rounded-full will-change-transform [transform:translateZ(0)]"
          style={{ width: imageWidth, height: imageHeight }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
