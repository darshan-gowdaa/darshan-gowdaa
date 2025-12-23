// src/components/ui/LazyImage.jsx
import React, { useState, useEffect, useRef, memo } from 'react';

/**
 * LazyImage - A performant image component with:
 * - Intersection Observer based lazy loading
 * - Blur-up placeholder effect
 * - Smooth fade-in animation on load
 * - Native loading="lazy" fallback
 */
const LazyImage = memo(({
    src,
    alt,
    className = '',
    wrapperClassName = '',
    placeholderColor = 'rgba(255, 255, 255, 0.05)',
    threshold = 0.1,
    rootMargin = '50px',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            setIsInView(true);
            return;
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        // Stop observing once in view
                        if (observerRef.current && imgRef.current) {
                            observerRef.current.unobserve(imgRef.current);
                        }
                    }
                });
            },
            {
                threshold,
                rootMargin,
            }
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold, rootMargin]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${wrapperClassName}`}
            style={{ backgroundColor: placeholderColor }}
        >
            {/* Placeholder skeleton */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                        background: `linear-gradient(90deg, ${placeholderColor} 25%, rgba(255,255,255,0.1) 50%, ${placeholderColor} 75%)`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                    }}
                />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                    {...props}
                />
            )}

            {/* Shimmer animation keyframes */}
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
        </div>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
