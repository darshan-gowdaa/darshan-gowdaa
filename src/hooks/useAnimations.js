/* eslint-disable react-hooks/rules-of-hooks */
// src/hooks/useAnimations.js
// import { useRef } from 'react'; // Unused
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useAnimations = () => {

    const sHero = {
        animate: (containerRef, onComplete) => {
            useGSAP(() => {
                const tl = gsap.timeline({
                    defaults: { ease: "power2.out" }
                });

                tl.fromTo(".hero-badge",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 }
                )
                    .call(() => {
                        if (onComplete) onComplete();
                    })
                    .fromTo(".hero-text-pressure",
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.7 },
                        "-=0.3"
                    )
                    .fromTo(".hero-description",
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6 },
                        "-=0.3"
                    )
                    .fromTo(".hero-buttons",
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6 },
                        "-=0.3"
                    )
                    .fromTo(".hero-socials a",
                        { y: 15, opacity: 0, scale: 0.8 },
                        {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            stagger: 0.08,
                            ease: "back.out(1.5)"
                        },
                        "-=0.2"
                    );
            }, { scope: containerRef });
        }
    };

    const sNavbar = {
        animate: ({ navRef, bubbleRef, linkRefs, activeSection, mobileMenuOpen, isFirstRender, isBubbleInitialized, mobileNavRef, mobileBubbleRef, mobileLinkRefs, show }) => {

            // desktop bubble
            useGSAP(() => {
                const activeLinkEl = linkRefs.current[activeSection];
                if (activeLinkEl && bubbleRef.current && navRef.current) {
                    const navRect = navRef.current.getBoundingClientRect();
                    const linkRect = activeLinkEl.getBoundingClientRect();

                    const relativeLeft = linkRect.left - navRect.left;
                    const width = linkRect.width;
                    const height = linkRect.height;
                    const relativeTop = linkRect.top - navRect.top;


                    // decouple from entrance
                    if (!isBubbleInitialized.current) {
                        gsap.set(bubbleRef.current, {
                            x: relativeLeft,
                            y: relativeTop,
                            width: width,
                            height: height
                        });
                        isBubbleInitialized.current = true;
                    } else {
                        gsap.to(bubbleRef.current, {
                            x: relativeLeft,
                            y: relativeTop,
                            width: width,
                            height: height,
                            duration: 0.8,
                            ease: "power3.out",
                            overwrite: 'auto',
                            force3D: true
                        });
                    }
                }
            }, { dependencies: [activeSection], scope: navRef });

            // mobile bubble
            useGSAP(() => {
                const activeMobileLinkEl = mobileLinkRefs.current[activeSection];

                if (activeMobileLinkEl && mobileBubbleRef.current) {
                    const relativeTop = activeMobileLinkEl.offsetTop;
                    const height = activeMobileLinkEl.offsetHeight;

                    gsap.to(mobileBubbleRef.current, {
                        y: relativeTop,
                        xPercent: -50,
                        height: height,
                        duration: 0.6,
                        ease: "power3.out",
                        overwrite: 'auto'
                    });
                }
            }, { dependencies: [activeSection, mobileMenuOpen], scope: mobileNavRef });

            // navbar entrance
            useGSAP(() => {
                if (show) {
                    if (navRef.current) {
                        // desktop: slide down
                        gsap.fromTo(navRef.current,
                            { opacity: 0, y: -20 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power4.out",
                                onComplete: () => {
                                    isFirstRender.current = false;
                                    gsap.set(navRef.current, { clearProps: "opacity,transform" });
                                }
                            }
                        );
                    }
                    if (mobileNavRef.current) {
                        // mobile: slide down
                        gsap.fromTo(mobileNavRef.current,
                            { opacity: 0, y: -20 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.set(mobileNavRef.current, { clearProps: "opacity,transform" });
                                }
                            }
                        );
                    }
                }
            }, { dependencies: [show], scope: navRef });

            // closes mobile menu
            const closeMobileMenuAnim = (onComplete) => {
                if (mobileNavRef.current) {
                    onComplete();
                } else {
                    onComplete();
                }
            };

            return { closeMobileMenuAnim };
        }
    };

    const sAbout = {
        animate: (containerRef) => {
            useGSAP(() => {
                gsap.from('.about-header', {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: '.about-header', start: 'top 85%', toggleActions: "play none none reverse" }
                });

                gsap.from('.about-left', {
                    x: -80, opacity: 0, duration: 0.8, ease: 'power3.out', force3D: true,
                    scrollTrigger: { trigger: '.about-left', start: 'top 75%', toggleActions: "play none none reverse" }
                });

                gsap.from('.about-right', {
                    x: 80, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out', force3D: true,
                    scrollTrigger: { trigger: '.about-right', start: 'top 75%', toggleActions: "play none none reverse" }
                });
            }, { scope: containerRef });
        }
    };

    const sSkills = {
        animate: (containerRef) => {
            useGSAP(() => {
                gsap.from('.skills-header', {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: '.skills-header', start: 'top 85%', toggleActions: "play none none reverse" }
                });

                gsap.from('.skills-loop', {
                    x: 100, opacity: 0, duration: 0.9, ease: 'power3.out', force3D: true,
                    scrollTrigger: { trigger: '.skills-loop', start: 'top 75%', toggleActions: "play none none reverse" }
                });
            }, { scope: containerRef });
        }
    };

    const sExperience = {
        animate: (containerRef) => {
            useGSAP(() => {
                gsap.from('.exp-header', {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: '.exp-header', start: 'top 85%', toggleActions: "play none none reverse" }
                });

                gsap.fromTo('.timeline-spine',
                    { scaleY: 0 },
                    {
                        scaleY: 1, ease: 'none',
                        scrollTrigger: { trigger: containerRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.5 }
                    }
                );

                const items = gsap.utils.toArray('.timeline-item', containerRef.current);
                items.forEach((item, i) => {
                    const content = item.querySelector('.timeline-content');
                    const marker = item.querySelector('.timeline-marker');
                    const isEven = i % 2 === 0;

                    gsap.fromTo(content,
                        { x: isEven ? -30 : 30, opacity: 0 },
                        {
                            x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', force3D: true,
                            scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: "play none none reverse" }
                        }
                    );

                    gsap.to(marker, {
                        scale: 1, opacity: 1, duration: 0.5, delay: 0.15, ease: 'back.out(1.7)',
                        scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: "play none none reverse" }
                    });
                });
            }, { scope: containerRef });
        }
    };

    const sProjects = {
        animate: (containerRef, headerRef) => {
            useGSAP(() => {
                gsap.from(headerRef.current, {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" }
                });

                const cards = gsap.utils.toArray('.project-card', containerRef.current);
                let mm = gsap.matchMedia();

                mm.add("(min-width: 1024px)", () => {
                    cards.forEach((card, i) => {
                        const col = i % 3;
                        let startPos = { opacity: 0, y: 50 };
                        if (col === 0) startPos.x = -100;
                        if (col === 2) startPos.x = 100;

                        gsap.fromTo(card, startPos, {
                            x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power3.out", force3D: true,
                            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" }
                        });
                    });
                });

                mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
                    cards.forEach((card, i) => {
                        const fromLeft = i % 2 === 0;
                        gsap.fromTo(card, { x: fromLeft ? -100 : 100, opacity: 0 }, {
                            x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                            scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none reverse" }
                        });
                    });
                });

                mm.add("(max-width: 767px)", () => {
                    cards.forEach((card, i) => {
                        const fromLeft = i % 2 === 0;
                        gsap.fromTo(card, { x: fromLeft ? -80 : 80, opacity: 0 }, {
                            x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
                            scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none reverse" }
                        });
                    });
                });
            }, { scope: containerRef });
        }
    };

    const sCertifications = {
        animate: (containerRef) => {
            useGSAP(() => {
                gsap.from('.cert-header', {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: '.cert-header', start: 'top 85%', toggleActions: "play none none reverse" }
                });

                const cards = gsap.utils.toArray('.cert-card', containerRef.current);
                cards.forEach((card, i) => {
                    const fromLeft = i % 2 === 0;
                    gsap.fromTo(card,
                        { x: fromLeft ? -80 : 80, opacity: 0 },
                        {
                            x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', force3D: true,
                            scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: "play none none reverse" }
                        }
                    );
                });
            }, { scope: containerRef });
        }
    };

    const sContact = {
        animate: (containerRef, toastRef, toast) => {
            // toast animation
            useGSAP(() => {
                if (toast && toastRef.current) {
                    gsap.fromTo(toastRef.current,
                        { y: -20, opacity: 0, scale: 0.9 },
                        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
                    );
                }
            }, { dependencies: [toast] });

            const animateToastExit = (onComplete) => {
                if (toastRef.current) {
                    gsap.to(toastRef.current, { y: -20, opacity: 0, scale: 0.9, duration: 0.3, onComplete: onComplete });
                } else {
                    onComplete();
                }
            };

            useGSAP(() => {
                gsap.from(".contact-header", {
                    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: ".contact-header", start: "top 85%", toggleActions: "play none none reverse" }
                });

                gsap.from(".contact-left", {
                    x: -80, opacity: 0, duration: 0.7, ease: 'power3.out', force3D: true,
                    scrollTrigger: { trigger: ".contact-left", start: "top 75%", toggleActions: "play none none reverse" }
                });

                gsap.from(".contact-right", {
                    x: 80, opacity: 0, duration: 0.7, ease: 'power3.out', force3D: true,
                    scrollTrigger: { trigger: ".contact-right", start: "top 75%", toggleActions: "play none none reverse" }
                });
            }, { scope: containerRef });

            return { animateToastExit };
        }
    };

    return {
        animateHero: sHero.animate,
        animateNavbar: sNavbar.animate,
        animateAbout: sAbout.animate,
        animateSkills: sSkills.animate,
        animateExperience: sExperience.animate,
        animateProjects: sProjects.animate,
        animateCertifications: sCertifications.animate,
        animateContact: sContact.animate
    };
};
