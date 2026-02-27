import { fontFamily, fontWeight, lineHeight, letterSpacing } from '@/lib/design-system';

export default function OrganizeFeatures() {
    return (
        <section className="pt-16 pb-8 md:pt-24 lg:pb-16 px-5 md:px-10 lg:px-16 bg-black overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Text */}
                <div className="order-1 text-center lg:text-left">
                    <h2
                        className="text-white mb-4"
                        style={{
                            fontFamily: fontFamily.display,
                            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                            lineHeight: lineHeight.h2,
                            fontWeight: fontWeight.bold,
                            letterSpacing: letterSpacing.tight,
                        }}
                    >
                        Organize your travels by country
                    </h2>
                    <p
                        className="text-secondary-text mx-auto lg:mx-0"
                        style={{
                            fontFamily: fontFamily.sans,
                            fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)',
                            lineHeight: lineHeight.body,
                            maxWidth: '28rem',
                        }}
                    >
                        Add countries to your profile and neatly group photos and videos from each journey.
                    </p>
                </div>

                {/* Card collage image */}
                <div className="order-2 flex justify-center lg:justify-end">
                    <img
                        alt="Country cards showing Greece, Thailand, and Switzerland"
                        className="w-full h-auto"
                        style={{ maxWidth: '28rem' }}
                        src="/assets/section2-1.png"
                    />
                </div>
            </div>
        </section>
    );
}
