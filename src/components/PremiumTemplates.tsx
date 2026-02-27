import { fontFamily, fontWeight, lineHeight, letterSpacing } from '@/lib/design-system';

export default function PremiumTemplates() {
    return (
        <section className="py-16 md:py-24 px-5 md:px-10 lg:px-16 bg-black">
            <div className="max-w-7xl mx-auto text-center mb-10 md:mb-16">
                <h2
                    className="text-white mb-4"
                    style={{
                        fontFamily: fontFamily.display,
                        fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                        lineHeight: lineHeight.h2,
                        fontWeight: fontWeight.bold,
                        letterSpacing: letterSpacing.tight,
                    }}
                >
                    Premium templates to<br className="hidden md:block" /> elevate your profile
                </h2>
            </div>

            {/* ── Desktop layout ─────────────────────────────────────── */}
            <div className="hidden md:flex flex-col gap-8 max-w-7xl mx-auto">

                {/* Row 1 */}
                <div className="flex flex-row gap-8 items-center justify-center" style={{ height: 'clamp(280px, 32vw, 520px)' }}>
                    <img src="/assets/mockup1.png" alt="Premium Template Desktop 1"
                        className="h-full w-auto rounded-3xl" />
                    <img src="/assets/mockup2.png" alt="Premium Template Mobile 1"
                        className="h-full w-auto rounded-3xl" />
                </div>

                {/* Row 2 */}
                <div className="flex flex-row gap-8 items-center justify-center" style={{ height: 'clamp(280px, 32vw, 520px)' }}>
                    <img src="/assets/mockup3.png" alt="Premium Template Mobile 2"
                        className="h-full w-auto rounded-3xl" />
                    <img src="/assets/mockup4.png" alt="Premium Template Desktop 2"
                        className="h-full w-auto rounded-3xl" />
                </div>

            </div>

            {/* ── Mobile layout — stacked ─────────────────────────────── */}
            <div className="flex flex-col gap-4 md:hidden max-w-7xl mx-auto">
                <img src="/assets/mockup1.png" alt="Premium Template Desktop 1" className="w-full h-auto rounded-2xl" />
                <img src="/assets/mockup2.png" alt="Premium Template Mobile 1"  className="w-full h-auto rounded-2xl" />
                <img src="/assets/mockup3.png" alt="Premium Template Mobile 2"  className="w-full h-auto rounded-2xl" />
                <img src="/assets/mockup4.png" alt="Premium Template Desktop 2" className="w-full h-auto rounded-2xl" />
            </div>
        </section>
    );
}

