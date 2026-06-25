// src/components/molecules/TiltedCard.jsx
import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';

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
    const cardRef = useRef(null);
    const tooltipRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);
    const [lastY, setLastY] = useState(0);
    const cachedRectRef = useRef(null);
    
    // Setup GSAP quickTo for performant animations
    const gsapContext = useRef(null);
    const animators = useRef({});

    useEffect(() => {
        if (!cardRef.current) return;
        
        let ctx = gsap.context(() => {
            // Set initial state
            gsap.set(cardRef.current, { transformPerspective: 800 });
            if (tooltipRef.current) {
                gsap.set(tooltipRef.current, { opacity: 0 });
            }

            animators.current = {
                rotateX: gsap.quickTo(cardRef.current, "rotationX", { duration: 0.2, ease: "power2.out" }),
                rotateY: gsap.quickTo(cardRef.current, "rotationY", { duration: 0.2, ease: "power2.out" }),
                scale: gsap.quickTo(cardRef.current, "scale", { duration: 0.3, ease: "power2.out" }),
                tooltipX: tooltipRef.current ? gsap.quickTo(tooltipRef.current, "x", { duration: 0.15, ease: "power2.out" }) : null,
                tooltipY: tooltipRef.current ? gsap.quickTo(tooltipRef.current, "y", { duration: 0.15, ease: "power2.out" }) : null,
                tooltipRotate: tooltipRef.current ? gsap.quickTo(tooltipRef.current, "rotation", { duration: 0.2, ease: "power2.out" }) : null,
                tooltipOpacity: tooltipRef.current ? gsap.quickTo(tooltipRef.current, "opacity", { duration: 0.3, ease: "power2" }) : null
            };
        }, ref);
        
        gsapContext.current = ctx;

        return () => ctx.revert();
    }, []);

    const handleInteraction = useCallback((clientX, clientY) => {
        if (!ref.current || !animators.current.rotateX) return;

        if (!cachedRectRef.current) {
            cachedRectRef.current = ref.current.getBoundingClientRect();
        }
        const rect = cachedRectRef.current;
        const offsetX = clientX - rect.left - rect.width / 2;
        const offsetY = clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        animators.current.rotateX(rotationX);
        animators.current.rotateY(rotationY);

        if (tooltipRef.current) {
            animators.current.tooltipX(clientX - rect.left);
            animators.current.tooltipY(clientY - rect.top);

            const velocityY = offsetY - lastY;
            animators.current.tooltipRotate(-velocityY * 0.6);
        }
        
        setLastY(offsetY);
    }, [lastY, rotateAmplitude]);

    function handleMouse(e) {
        handleInteraction(e.clientX, e.clientY);
    }

    function handleMouseEnter() {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
        setIsHovered(true);
        if (ref.current) {
            cachedRectRef.current = ref.current.getBoundingClientRect();
        }
        if (animators.current.scale) animators.current.scale(scaleOnHover);
        if (animators.current.tooltipOpacity) animators.current.tooltipOpacity(1);
    }

    function resetCard() {
        setIsHovered(false);
        cachedRectRef.current = null;
        
        gsap.to(cardRef.current, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out"
        });
        
        if (tooltipRef.current) {
            gsap.to(tooltipRef.current, {
                opacity: 0,
                rotation: 0,
                duration: 0.7,
                ease: "power2.out"
            });
        }
    }

    function handleMouseLeave() {
        resetCard();
    }

    // Touch handlers with effect persistence
    function handleTouchStart(e) {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
        setIsHovered(true);
        if (ref.current) {
            cachedRectRef.current = ref.current.getBoundingClientRect();
        }
        if (animators.current.scale) animators.current.scale(scaleOnHover);

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
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
        resetCard();
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

            <div
                ref={cardRef}
                className="relative [transform-style:preserve-3d]"
                style={{
                    width: imageWidth,
                    height: imageHeight
                }}
            >
                {/* Rotating Shadow */}
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-70 transition-all duration-300 -z-10 will-change-transform"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, white, transparent 30%)',
                        animation: `spin-slow ${isHovered ? '1s' : '4s'} linear infinite`,
                    }}
                />

                <img
                    src={imageSrc}
                    alt={altText}
                    className="absolute top-0 left-0 object-cover rounded-full will-change-transform [transform:translateZ(0)]"
                    style={{
                        width: imageWidth,
                        height: imageHeight
                    }}
                    width={350}
                    height={350}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />

                {displayOverlayContent && overlayContent && (
                    <div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
                        {overlayContent}
                    </div>
                )}
            </div>

            {showTooltip && (
                <figcaption
                    ref={tooltipRef}
                    className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] z-[3] hidden sm:block opacity-0"
                >
                    {captionText}
                </figcaption>
            )}
        </figure>
    );
}
