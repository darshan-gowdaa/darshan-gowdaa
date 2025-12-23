import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.1, // Reduced for snappier response
    MIN_COPIES: 2,
    COPY_HEADROOM: 2
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
    useEffect(() => {
        if (!window.ResizeObserver) {
            const handleResize = () => callback();
            window.addEventListener('resize', handleResize);
            callback();
            return () => window.removeEventListener('resize', handleResize);
        }

        const observers = elements.map(ref => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });

        callback();
        return () => {
            observers.forEach(observer => observer?.disconnect());
        };
    }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
    useEffect(() => {
        const images = seqRef.current?.querySelectorAll('img') ?? [];

        if (images.length === 0) {
            onLoad();
            return;
        }

        let remainingImages = images.length;
        const handleImageLoad = () => {
            remainingImages -= 1;
            if (remainingImages === 0) {
                onLoad();
            }
        };

        images.forEach(img => {
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener('load', handleImageLoad, { once: true });
                img.addEventListener('error', handleImageLoad, { once: true });
            }
        });

        return () => {
            images.forEach(img => {
                img.removeEventListener('load', handleImageLoad);
                img.removeEventListener('error', handleImageLoad);
            });
        };
    }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, isDragging, dragVelocity) => {
    const rafRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const offsetRef = useRef(0);
    // Init with target to avoid ramp-up if starting from 0
    const velocityRef = useRef(targetVelocity);
    const initializedRef = useRef(false);

    // Expose offsetRef for drag manipulation
    useEffect(() => {
        if (trackRef.current) {
            trackRef.current._offsetRef = offsetRef;
        }
    }, [trackRef]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // If targetVelocity changes drastically and we haven't started, update ref
        if (!initializedRef.current && targetVelocity !== 0) {
            velocityRef.current = targetVelocity;
            initializedRef.current = true;
        }

        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const seqSize = isVertical ? seqHeight : seqWidth;

        if (seqSize > 0) {
            if (isNaN(offsetRef.current)) offsetRef.current = 0;
            offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
            const transformValue = isVertical
                ? `translate3d(0, ${-offsetRef.current}px, 0)`
                : `translate3d(${-offsetRef.current}px, 0, 0)`;
            track.style.transform = transformValue;
        }

        if (prefersReduced) {
            track.style.transform = isVertical ? 'translate3d(0, 0, 0)' : 'translate3d(0, 0, 0)';
            return () => {
                lastTimestampRef.current = null;
            };
        }

        const animate = timestamp => {
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            const deltaTime = Math.min(0.1, Math.max(0, timestamp - lastTimestampRef.current) / 1000);
            lastTimestampRef.current = timestamp;

            // During drag, use drag velocity; otherwise use normal target
            let target;
            if (isDragging) {
                target = 0; // Stop auto-scroll during drag
            } else if (dragVelocity !== 0) {
                // Apply momentum after drag release
                target = dragVelocity;
            } else if (isHovered && hoverSpeed !== undefined) {
                target = hoverSpeed;
            } else {
                target = targetVelocity;
            }

            const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
            velocityRef.current += (target - velocityRef.current) * easingFactor;

            if (seqSize > 0 && !isDragging) {
                let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
                offsetRef.current = nextOffset;

                const transformValue = isVertical
                    ? `translate3d(0, ${-offsetRef.current}px, 0)`
                    : `translate3d(${-offsetRef.current}px, 0, 0)`;
                track.style.transform = transformValue;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastTimestampRef.current = null;
        };
    }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef, isDragging, dragVelocity]);
};

export const LogoLoop = memo(
    ({
        logos,
        speed = 120,
        direction = 'left',
        width = '100%',
        logoHeight = 28,
        gap = 32,
        pauseOnHover,
        hoverSpeed,
        fadeOut = false,
        fadeOutColor,
        scaleOnHover = false,
        renderItem,
        ariaLabel = 'Partner logos',
        className,
        style
    }) => {
        const containerRef = useRef(null);
        const trackRef = useRef(null);
        const seqRef = useRef(null);

        const [seqWidth, setSeqWidth] = useState(0);
        const [seqHeight, setSeqHeight] = useState(0);
        const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
        const [isHovered, setIsHovered] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [dragVelocity, setDragVelocity] = useState(0);

        // Drag tracking refs
        const dragStartRef = useRef({ x: 0, y: 0 });
        const lastDragPosRef = useRef({ x: 0, y: 0 });
        const lastDragTimeRef = useRef(0);
        const dragVelocityRef = useRef(0);

        const effectiveHoverSpeed = useMemo(() => {
            if (hoverSpeed !== undefined) return hoverSpeed;
            if (pauseOnHover === true) return 0;
            if (pauseOnHover === false) return undefined;
            return 0;
        }, [hoverSpeed, pauseOnHover]);

        const isVertical = direction === 'up' || direction === 'down';

        const targetVelocity = useMemo(() => {
            const magnitude = Math.abs(speed);
            let directionMultiplier;
            if (isVertical) {
                directionMultiplier = direction === 'up' ? 1 : -1;
            } else {
                directionMultiplier = direction === 'left' ? 1 : -1;
            }
            const speedMultiplier = speed < 0 ? -1 : 1;
            return magnitude * directionMultiplier * speedMultiplier;
        }, [speed, direction, isVertical]);

        const updateDimensions = useCallback(() => {
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const sequenceRect = seqRef.current?.getBoundingClientRect?.();
            const sequenceWidth = sequenceRect?.width ?? 0;
            const sequenceHeight = sequenceRect?.height ?? 0;
            if (isVertical) {
                const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
                if (containerRef.current && parentHeight > 0) {
                    const targetHeight = Math.ceil(parentHeight);
                    if (containerRef.current.style.height !== `${targetHeight}px`)
                        containerRef.current.style.height = `${targetHeight}px`;
                }
                if (sequenceHeight > 0) {
                    setSeqHeight(Math.ceil(sequenceHeight));
                    const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
                    const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
                    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
                }
            } else if (sequenceWidth > 0) {
                setSeqWidth(Math.ceil(sequenceWidth));
                const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
                setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
            }
        }, [isVertical]);

        useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

        useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

        useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical, isDragging, dragVelocity);

        // Drag handlers
        const handleDragStart = useCallback((clientX, clientY) => {
            setIsDragging(true);
            setDragVelocity(0);
            dragStartRef.current = { x: clientX, y: clientY };
            lastDragPosRef.current = { x: clientX, y: clientY };
            lastDragTimeRef.current = Date.now();
            dragVelocityRef.current = 0;
        }, []);

        const handleDragMove = useCallback((clientX, clientY) => {
            if (!isDragging) return;

            const track = trackRef.current;
            if (!track || !track._offsetRef) return;

            const currentTime = Date.now();
            const deltaTime = Math.max(1, currentTime - lastDragTimeRef.current) / 1000;

            const delta = isVertical
                ? clientY - lastDragPosRef.current.y
                : clientX - lastDragPosRef.current.x;

            // Update velocity for momentum
            dragVelocityRef.current = -delta / deltaTime;

            // Update offset directly
            const seqSize = isVertical ? seqHeight : seqWidth;
            if (seqSize > 0) {
                let newOffset = track._offsetRef.current - delta;
                newOffset = ((newOffset % seqSize) + seqSize) % seqSize;
                track._offsetRef.current = newOffset;

                const transformValue = isVertical
                    ? `translate3d(0, ${-newOffset}px, 0)`
                    : `translate3d(${-newOffset}px, 0, 0)`;
                track.style.transform = transformValue;
            }

            lastDragPosRef.current = { x: clientX, y: clientY };
            lastDragTimeRef.current = currentTime;
        }, [isDragging, isVertical, seqWidth, seqHeight, trackRef]);

        const handleDragEnd = useCallback(() => {
            if (!isDragging) return;
            setIsDragging(false);

            // Apply momentum - clamp velocity to reasonable range
            const momentumVelocity = Math.max(-500, Math.min(500, dragVelocityRef.current));
            setDragVelocity(momentumVelocity);

            // Gradually return to normal auto-scroll
            setTimeout(() => setDragVelocity(0), 1000);
        }, [isDragging]);

        // Mouse event handlers
        const handleMouseDown = useCallback((e) => {
            e.preventDefault();
            handleDragStart(e.clientX, e.clientY);
        }, [handleDragStart]);

        useEffect(() => {
            if (!isDragging) return;

            const handleMouseMove = (e) => {
                handleDragMove(e.clientX, e.clientY);
            };

            const handleMouseUp = () => {
                handleDragEnd();
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }, [isDragging, handleDragMove, handleDragEnd]);

        // Touch event handlers
        const handleTouchStart = useCallback((e) => {
            const touch = e.touches[0];
            handleDragStart(touch.clientX, touch.clientY);
        }, [handleDragStart]);

        const handleTouchMove = useCallback((e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
        }, [isDragging, handleDragMove]);

        const handleTouchEnd = useCallback(() => {
            handleDragEnd();
        }, [handleDragEnd]);

        const cssVariables = useMemo(
            () => ({
                '--logoloop-gap': `${gap}px`,
                '--logoloop-logoHeight': `${logoHeight}px`,
                ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
            }),
            [gap, logoHeight, fadeOutColor]
        );

        const rootClasses = useMemo(
            () =>
                cx(
                    'relative group',
                    isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden',
                    '[--logoloop-gap:32px]',
                    '[--logoloop-logoHeight:28px]',
                    '[--logoloop-fadeColorAuto:#ffffff]',
                    'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
                    scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
                    isDragging ? 'cursor-grabbing' : 'cursor-grab',
                    'select-none touch-none',
                    className
                ),
            [isVertical, scaleOnHover, isDragging, className]
        );

        const handleMouseEnter = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(true);
        }, [effectiveHoverSpeed]);
        const handleMouseLeave = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(false);
        }, [effectiveHoverSpeed]);

        const renderLogoItem = useCallback(
            (item, key) => {
                if (renderItem) {
                    return (
                        <li
                            className={cx(
                                'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
                                isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
                                scaleOnHover && 'overflow-visible group/item'
                            )}
                            key={key}
                            role="listitem"
                        >
                            {renderItem(item, key)}
                        </li>
                    );
                }

                const isNodeItem = 'node' in item;

                const content = isNodeItem ? (
                    <span
                        className={cx(
                            'inline-flex items-center',
                            'motion-reduce:transition-none',
                            scaleOnHover &&
                            'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120'
                        )}
                        aria-hidden={!!item.href && !item.ariaLabel}
                    >
                        {item.node}
                    </span>
                ) : (
                    <img
                        className={cx(
                            'h-[var(--logoloop-logoHeight)] w-auto block object-contain',
                            '[-webkit-user-drag:none] pointer-events-none',
                            '[image-rendering:-webkit-optimize-contrast]',
                            'motion-reduce:transition-none',
                            scaleOnHover &&
                            'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120'
                        )}
                        src={item.src}
                        srcSet={item.srcSet}
                        sizes={item.sizes}
                        width={item.width}
                        height={item.height}
                        alt={item.alt ?? ''}
                        title={item.title}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                    />
                );

                const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);

                const inner = item.href ? (
                    <a
                        className={cx(
                            'inline-flex items-center no-underline rounded',
                            'transition-opacity duration-200 ease-linear',
                            'hover:opacity-80',
                            'focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2'
                        )}
                        href={item.href}
                        aria-label={itemAriaLabel || 'logo link'}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {content}
                    </a>
                ) : (
                    content
                );

                return (
                    <li
                        className={cx(
                            'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
                            isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
                            scaleOnHover && 'overflow-visible group/item'
                        )}
                        key={key}
                        role="listitem"
                    >
                        {inner}
                    </li>
                );
            },
            [isVertical, scaleOnHover, renderItem]
        );

        const logoLists = useMemo(
            () =>
                Array.from({ length: copyCount }, (_, copyIndex) => (
                    <ul
                        className={cx('flex items-center', isVertical && 'flex-col')}
                        key={`copy-${copyIndex}`}
                        role="list"
                        aria-hidden={copyIndex > 0}
                        ref={copyIndex === 0 ? seqRef : undefined}
                    >
                        {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
                    </ul>
                )),
            [copyCount, logos, renderLogoItem, isVertical]
        );

        const containerStyle = useMemo(
            () => ({
                width: isVertical
                    ? toCssLength(width) === '100%'
                        ? undefined
                        : toCssLength(width)
                    : (toCssLength(width) ?? '100%'),
                cursor: isDragging ? 'grabbing' : 'grab',
                ...cssVariables,
                ...style
            }),
            [width, cssVariables, style, isVertical, isDragging]
        );

        return (
            <div
                ref={containerRef}
                className={rootClasses}
                style={containerStyle}
                role="region"
                aria-label={ariaLabel}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {fadeOut && (
                    <>
                        {isVertical ? (
                            <>
                                <div
                                    aria-hidden
                                    className={cx(
                                        'pointer-events-none absolute inset-x-0 top-0 z-10',
                                        'h-[clamp(24px,8%,120px)]',
                                        'bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                                    )}
                                />
                                <div
                                    aria-hidden
                                    className={cx(
                                        'pointer-events-none absolute inset-x-0 bottom-0 z-10',
                                        'h-[clamp(24px,8%,120px)]',
                                        'bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <div
                                    aria-hidden
                                    className={cx(
                                        'pointer-events-none absolute inset-y-0 left-0 z-10',
                                        'w-[clamp(24px,8%,120px)]',
                                        'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                                    )}
                                />
                                <div
                                    aria-hidden
                                    className={cx(
                                        'pointer-events-none absolute inset-y-0 right-0 z-10',
                                        'w-[clamp(24px,8%,120px)]',
                                        'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                                    )}
                                />
                            </>
                        )}
                    </>
                )}

                <div
                    className={cx(
                        'flex will-change-transform select-none relative z-0',
                        'motion-reduce:transform-none',
                        isVertical ? 'flex-col h-max w-full' : 'flex-row w-max'
                    )}
                    ref={trackRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {logoLists}
                </div>
            </div>
        );
    }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
