import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from '@/lib/design-system';

export default function Hero() {
    return (
        <section
            className="hero-section relative mx-auto overflow-hidden px-6 md:px-0"
            style={{
                maxWidth: '96rem',
                width: '100%',
            }}
        >
            <style>{`
                .hero-section { padding-top: 6rem; }
                @media (min-width: 768px) { .hero-section { padding-top: 8.25rem; } }
                .hero-mockups { margin-top: 1.5rem; }
                @media (min-width: 768px) and (max-width: 1279px) { .hero-mockups { margin-top: 6rem; } }
                @media (min-width: 1024px) { .hero-mockups { margin-top: 0; } }
                @media (min-width: 768px) and (max-width: 1023px) {
                    .hero-mockups { height: 22rem !important; }
                    .hero-phone-left-desktop { width: 10rem !important; margin-left: -14rem !important; }
                    .hero-phone-right-desktop { width: 10rem !important; margin-left: 4rem !important; }
                    .hero-phone-center img { width: 12rem !important; }
                }
                .hero-phone-left-mobile { left: 10%; }
                .hero-phone-right-mobile { right: 10%; }
            `}</style>
            {/* Section 1 */}
            <div
                className="flex flex-col items-center mx-auto"
                style={{
                    maxWidth: '96rem',
                    width: '100%',
                    gap: '0',
                }}
            >
                {/* Text + Form block */}
                <div className="flex flex-col items-center text-center w-full">
                    <h1
                        className="text-white"
                        style={{
                            fontFamily: fontFamily.display,
                            fontSize: 'clamp(2.25rem, 8vw, 3.5rem)',
                            lineHeight: lineHeight.h1,
                            fontWeight: fontWeight.bold,
                            letterSpacing: letterSpacing.tight,
                            marginBottom: '1rem',
                        }}
                    >
                        Build your travel profile
                    </h1>
                    <p
                        className="text-secondary-text"
                        style={{
                            fontFamily: fontFamily.sans,
                            fontSize: 'clamp(0.9375rem, 3vw, 1.125rem)',
                            lineHeight: lineHeight.body,
                            marginBottom: '2rem',
                            maxWidth: '32rem',
                            color: '#fff', // Set text color to white
                        }}
                    >
                        Turn your journeys into a beautiful personal archive.
                    </p>

                    {/* Desktop: combined pill */}
                    <div
                        className="hidden md:flex items-center border border-gray-700"
                        style={{
                            borderRadius: '62.5rem',
                            padding: '0.3rem 0.3rem 0.3rem 1.25rem',
                        }}
                    >
                        <input
                            className="bg-transparent text-white placeholder-gray-500 focus:outline-none"
                            placeholder="Enter your email"
                            type="email"
                            style={{
                                fontFamily: fontFamily.sans,
                                fontSize: fontSize['body-sm'],
                                lineHeight: lineHeight.body,
                                border: 'none',
                                width: '16rem',
                                padding: '0.5rem 0',
                            }}
                        />
                        <button className="btn btn-light btn-md" type="button">
                            Get early access
                        </button>
                    </div>

                    {/* Mobile: stacked input + button */}
                    <div className="flex md:hidden flex-col w-full" style={{ gap: '0.75rem' }}>
                        <input
                            className="bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 w-full"
                            placeholder="Enter your email"
                            type="email"
                            style={{
                                fontFamily: fontFamily.sans,
                                fontSize: fontSize.body,
                                lineHeight: lineHeight.body,
                                padding: '1rem 1.5rem',
                                borderRadius: '62.5rem',
                            }}
                        />
                        <button
                            className="btn btn-light btn-lg w-full"
                            style={{
                                whiteSpace: 'nowrap',
                            }}
                            type="button"
                        >
                            Get early access
                        </button>
                    </div>
                </div>

                {/* Phone mockups */}
                <div
                    className="hero-mockups relative w-full overflow-hidden"
                    style={{
                        height: 'clamp(24rem, 45vw, 36rem)',
                    }}
                >
                    <div className="relative w-full h-full flex justify-center">
                        {/* Left phone — behind center */}
                        <div
                            className="hero-phone-left-desktop absolute hidden md:block"
                            style={{
                                left: '50%',
                                marginLeft: '-22rem',
                                bottom: '0',
                                width: '15rem',
                                zIndex: 1,
                            }}
                        >
                            <img
                                alt="Travel grid interface"
                                className="w-full h-auto"
                                src="/assets/mobile_mockup_1.png"
                            />
                        </div>

                        {/* Left phone — mobile layout */}
                        <div
                            className="hero-phone-left-mobile absolute block md:hidden"
                            style={{
                                bottom: '0',
                                width: '28%',
                                maxWidth: '8rem',
                                zIndex: 1,
                            }}
                        >
                            <img
                                alt="Travel grid interface"
                                className="w-full h-auto"
                                src="/assets/mobile_mockup_1.png"
                            />
                        </div>

                        {/* Center phone — in front, largest */}
                        <div
                            className="hero-phone-center absolute"
                            style={{
                                left: '50%',
                                transform: 'translateX(-50%)',
                                bottom: '0',
                                zIndex: 10,
                            }}
                        >
                            <img
                                alt="User profile showing travel stats"
                                className="h-auto"
                                style={{
                                    width: 'clamp(11rem, 32vw, 17rem)',
                                }}
                                src="/assets/centre_image_mobile_herosection.png"
                            />
                        </div>

                        {/* Right phone — behind center */}
                        <div
                            className="hero-phone-right-desktop absolute hidden md:block"
                            style={{
                                left: '50%',
                                marginLeft: '7rem',
                                bottom: '0',
                                width: '15rem',
                                zIndex: 1,
                            }}
                        >
                            <img
                                alt="Profile interface showing countries visited"
                                className="w-full h-auto"
                                src="/assets/mobile_mockup.png"
                            />
                        </div>

                        {/* Right phone — mobile layout */}
                        <div
                            className="hero-phone-right-mobile absolute block md:hidden"
                            style={{
                                bottom: '0',
                                width: '28%',
                                maxWidth: '8rem',
                                zIndex: 1,
                            }}
                        >
                            <img
                                alt="Profile interface showing countries visited"
                                className="w-full h-auto"
                                src="/assets/mobile_mockup.png"
                            />
                        </div>
                    </div>

                    {/* Bottom gradient fade */}
                    <div
                        className="absolute bottom-0 left-0 w-full"
                        style={{
                            height: '12.5rem',
                            zIndex: 20,
                            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
                        }}
                    ></div>
                </div>
            </div>
        </section>
    );
}
