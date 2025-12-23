import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showMobileWarning = false,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false
}) {
    const ref = useRef(null);
    const resetTimeoutRef = useRef(null);
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

    const [lastY, setLastY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleInteraction = useCallback((clientX, clientY) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = clientX - rect.left - rect.width / 2;
        const offsetY = clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(clientX - rect.left);
        y.set(clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }, [lastY, rotateAmplitude, rotateX, rotateY, x, y, rotateFigcaption]);

    function handleMouse(e) {
        handleInteraction(e.clientX, e.clientY);
    }

    function handleMouseEnter() {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
        scale.set(scaleOnHover);
        opacity.set(1);
        setIsHovered(true);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
        setIsHovered(false);
    }

    // Touch handlers with effect persistence
    function handleTouchStart(e) {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
        scale.set(scaleOnHover);
        setIsHovered(true);

        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleInteraction(touch.clientX, touch.clientY);
        }
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleInteraction(touch.clientX, touch.clientY);
        }
    }

    function handleTouchEnd() {
        // Keep the effect visible for 2 seconds after touch ends
        resetTimeoutRef.current = setTimeout(() => {
            scale.set(1);
            rotateX.set(0);
            rotateY.set(0);
            rotateFigcaption.set(0);
            setIsHovered(false);
            resetTimeoutRef.current = null;
        }, 2000);
    }

    return (
        <figure
            ref={ref}
            className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center select-none"
            style={{
                height: containerHeight,
                width: containerWidth,
                touchAction: 'none' // Prevent scrolling while interacting
            }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {showMobileWarning && (
                <div className="absolute top-4 text-center text-sm block sm:hidden text-gray-500">
                    Tap and drag to interact
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
                {/* Rotating Shadow */}
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-70 transition-all duration-300 -z-10"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, white, transparent 30%)',
                        animation: `spin-slow ${isHovered ? '1s' : '4s'} linear infinite`,
                    }}
                />

                <motion.img
                    src={imageSrc}
                    alt={altText}
                    className="absolute top-0 left-0 object-cover rounded-full will-change-transform [transform:translateZ(0)]"
                    style={{
                        width: imageWidth,
                        height: imageHeight
                    }}
                    draggable={false}
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
                    style={{
                        x,
                        y,
                        opacity,
                        rotate: rotateFigcaption
                    }}
                >
                    {captionText}
                </motion.figcaption>
            )}
        </figure>
    );
}
