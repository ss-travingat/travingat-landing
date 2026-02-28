"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function Navbar() {
    const [show, setShow] = useState(true);
    const lastScroll = useRef(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const curr = window.scrollY;
                    if (curr === 0) {
                        setShow(true);
                    } else if (curr > lastScroll.current && curr - lastScroll.current > 0) {
                        // Scrolling down
                        setShow(false);
                    } else if (curr < lastScroll.current && lastScroll.current - curr > 5) {
                        // Scrolling up by at least 5px
                        setShow(true);
                    }
                    lastScroll.current = curr;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 top-0 start-0 bg-black transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
            style={{ willChange: 'transform' }}
        >
            <style>{`
                .navbar-inner { height: 5rem; padding-top: 1rem; padding-bottom: 1rem; }
                @media (min-width: 768px) { .navbar-inner { height: 8.25rem; padding-top: 2.75rem; padding-bottom: 2.75rem; } }
                .navbar-logo-text, .navbar-logo-text * { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
            `}</style>
            <div
                className="navbar-inner mx-auto flex items-center justify-between px-5 md:px-11"
                style={{
                    maxWidth: '96rem',
                }}
            >
                {/* Logo */}
                <a className="navbar-logo-text flex items-center" href="#" style={{ gap: '0.75rem' }}>
                    <span className="navbar-brand font-bold whitespace-nowrap" style={{ fontSize: '1.5rem', lineHeight: '2.1875rem' }}>travingat</span>
                </a>

                {/* Mobile menu button */}
                <button
                    aria-controls="navbar-sticky"
                    aria-expanded={false}
                    className="inline-flex items-center justify-center text-white md:hidden"
                    style={{ width: '2.75rem', height: '2.75rem' }}
                    type="button"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1h22M1 9h22M1 17h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>

                {/* Nav links + Join now (desktop) */}
                <div className="hidden md:flex items-center" style={{ gap: '2.5rem' }}>
                    <a className="text-white hover:text-gray-300 transition-colors" href="#templates" style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>Templates</a>
                    <a className="text-white hover:text-gray-300 transition-colors" href="#pricing" style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>Pricing</a>
                    <a className="text-white hover:text-gray-300 transition-colors" href="#" style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>Blog</a>
                    <a
                        href="#join"
                        className="btn btn-light btn-sm"
                    >
                        Join now
                    </a>
                </div>
            </div>
        </nav>
    );
}
