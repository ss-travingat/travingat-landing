import { fontFamily, fontWeight, lineHeight, letterSpacing } from '@/lib/design-system';

export default function OrganizeFeaturesMobile() {
    return (
        <section className="pt-16 pb-8 md:pt-24 px-5 md:px-10 bg-black overflow-hidden lg:hidden">
            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 gap-10 items-center">
                {/* Text */}
                <div className="text-center">
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
                        className="text-secondary-text mx-auto"
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

                {/* Image */}
                <div className="flex justify-center">
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
