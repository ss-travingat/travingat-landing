"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";

const testimonials = [
    {
        quote:
            "Really excited for Travingat\u2019s launch. Organizing my travels by country instead of random posts and folders sounds perfect.",
        name: "Sophia",
        location: "USA",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAx7hU6qT4vifpZQkwWUks1lzgbLGKhkoiBugXN_FMtXzeUyHWxojRrQHVDOXBhJQGAWSVBbaf2HWHo0Y6T_T5gbMK55W8AjG_iNfPWVQDbyw-4OaaabRqxdv7kcMDV3Dhk2UVbFgFRRac2ahC0r_FVr9rA7lG6r4W-sro8j2-uHCMif6CyDKyijQAwe8sxYx0hk4C1hpwKnjnysiRR7IdMhVtNeOremYMI9EJ8RrXwcMOc5QlzwQnoSvrvM3MiciIKB6427M_7_XXZ",
        socials: ["instagram", "youtube", "linkedin"],
    },
    {
        quote:
            "Finally a platform that gets how travelers think. Collections and country pages are exactly what I\u2019ve been looking for.",
        name: "Marco",
        location: "Italy",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        socials: ["instagram", "youtube"],
    },
    {
        quote:
            "I love how clean and visual everything is. It feels like my travel journal came to life online.",
        name: "Aiko",
        location: "Japan",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        socials: ["instagram", "linkedin"],
    },
];

function InstagramIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="4" />
            <polygon points="10,8.5 16,12 10,15.5" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" />
            <path d="M8 11v5M8 8v.01M12 16v-5c0-1 .6-2 2-2s2 1 2 2v5" />
        </svg>
    );
}

const socialIcons: Record<string, React.ReactNode> = {
    instagram: <InstagramIcon />,
    youtube: <YoutubeIcon />,
    linkedin: <LinkedinIcon />,
};

/* Word-by-word fade-in component */
function WordReveal({ text, active }: { text: string; active: boolean }) {
    const words = useMemo(() => text.split(" "), [text]);
    return (
        <span>
            {words.map((word, i) => (
                <span
                    key={`${word}-${i}`}
                    className="inline-block mr-[0.3em]"
                    style={{
                        opacity: active ? 1 : 0,
                        transform: active ? 'translateY(0)' : 'translateY(6px)',
                        filter: active ? 'blur(0)' : 'blur(2px)',
                        transition: `opacity 400ms cubic-bezier(0.4,0,0.2,1) ${i * 40}ms, transform 400ms cubic-bezier(0.4,0,0.2,1) ${i * 40}ms, filter 400ms cubic-bezier(0.4,0,0.2,1) ${i * 40}ms`,
                    }}
                >
                    {word}
                </span>
            ))}
        </span>
    );
}

export default function Testimonial() {
    const [active, setActive] = useState(0);
    const [visible, setVisible] = useState(true);
    const [wordsReady, setWordsReady] = useState(true);
    const transitioning = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goTo = useCallback((idx: number) => {
        if (transitioning.current || idx === active) return;
        transitioning.current = true;
        setVisible(false); // fade out
        setWordsReady(false);

        setTimeout(() => {
            setActive(idx);
            // Small pause so the DOM updates before fading in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setVisible(true); // fade in
                    // Delay word reveal until the container is visible
                    setTimeout(() => setWordsReady(true), 200);
                    transitioning.current = false;
                });
            });
        }, 500);
    }, [active]);

    const prev = () => {
        const idx = active === 0 ? testimonials.length - 1 : active - 1;
        goTo(idx);
    };
    const next = useCallback(() => {
        const idx = (active + 1) % testimonials.length;
        goTo(idx);
    }, [active, goTo]);

    // Auto-advance
    useEffect(() => {
        timerRef.current = setInterval(next, 6000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [next]);

    const t = testimonials[active];

    return (
        <section className="pt-16 pb-24 md:pt-24 md:pb-36 px-5 md:px-10 lg:px-16 bg-primary">
            <div className="max-w-6xl mx-auto">
                {/* Arrows — top-right on desktop, hidden on mobile (shown at bottom instead) */}
                <div className="hidden md:flex gap-3 justify-end mb-6">
                    <button
                        onClick={prev}
                        aria-label="Previous testimonial"
                        className="text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next testimonial"
                        className="text-white/80 hover:text-white transition-colors duration-200"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Animated content */}
                <div
                    className="flex flex-col md:flex-row gap-6 md:gap-14 items-stretch"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(12px)',
                        filter: visible ? 'blur(0px)' : 'blur(4px)',
                        transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1), filter 500ms cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    {/* Image */}
                    <div className="w-full max-w-[280px] mx-auto md:max-w-none md:mx-0 md:w-70 lg:w-80 shrink-0">
                        <div className="rounded-2xl overflow-hidden aspect-3/4 h-full">
                            <img
                                alt={t.name}
                                className="w-full h-full object-cover"
                                src={t.image}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-2 md:py-6">
                        {/* Quote */}
                        <div>
                            <Image
                                src="/assets/dbl.png"
                                alt="Quote mark"
                                width={64}
                                height={48}
                                className="mb-4 select-none w-10 h-auto md:w-16"
                            />
                            <p className="text-white text-lg md:text-2xl lg:text-3xl font-semibold leading-snug">
                                <WordReveal text={t.quote} active={wordsReady} />
                            </p>
                        </div>

                        {/* Divider + footer */}
                        <div className="mt-6 md:mt-8">
                            <div className="h-px bg-white/20 mb-4 md:mb-5" />
                            <div className="flex items-center justify-between">
                                <p className="text-white text-sm md:text-lg font-medium">
                                    {t.name}, {t.location}
                                </p>
                                <div className="flex gap-3 text-white/50">
                                    {t.socials.map((s) => (
                                        <span
                                            key={s}
                                            className="hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            {socialIcons[s]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile arrows — bottom right */}
                <div className="flex md:hidden gap-3 justify-end mt-6">
                    <button
                        onClick={prev}
                        aria-label="Previous testimonial"
                        className="text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next testimonial"
                        className="text-white/80 hover:text-white transition-colors duration-200"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
