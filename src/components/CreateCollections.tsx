import { fontFamily, fontWeight, lineHeight, letterSpacing } from '@/lib/design-system';

export default function CreateCollections() {
    return (
        <section className="pt-8 pb-16 md:pb-24 lg:pt-16 px-5 md:px-10 lg:px-16 bg-black">
            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Card collage image */}
                <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                    <img
                        alt="Collection cards showing Portraits, Hiking Himalaya, and Street Shots of Europe"
                        className="w-full h-auto"
                        style={{ maxWidth: '28rem' }}
                        src="/assets/section2-2.png"
                    />
                </div>

                {/* Text */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
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
                        Create collections that tell a story
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
                        Create collections for photography, journeys, moods—or anything you like.
                    </p>
                </div>
            </div>
        </section>
    );
}
