export default function OrganizeFeaturesDesktop() {
    return (
        <section className="hidden lg:block bg-black px-16 pb-16">
            <div className="relative max-w-5xl mx-auto">
                {/* Background image */}
                <img
                    alt="Country cards collection"
                    className="w-full h-auto block"
                    src="/assets/collection.png"
                />

                {/* Top-left text */}
                <div className="absolute top-[6%] left-[2%] max-w-sm">
                    <h2 style={{
                        fontFamily: '"Inter Display", "Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(3rem, 4.5vw, 3rem)',
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                        color: '#ffffff',
                        marginTop: '6.5rem',
                    }}>
                        Organize your travels by country
                    </h2>
                    <p style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        marginTop: '2rem', // Move text downward
                    }}>
                        Add countries to your profile and neatly group photos and videos from each journey.
                    </p>
                </div>

                {/* Bottom-right text */}
                <div className="absolute bottom-[6%] right-[2%] max-w-sm text-left">
                    <h2 style={{
                        fontFamily: '"Inter Display", "Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(3rem, 4.5vw, 3rem)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: '#ffffff',
                        marginTop: '2.5rem',
                    }}>
                        Create collections that tell a story
                    </h2>
                    <p style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        marginBottom: '4rem', 
                        marginTop: '2rem', // Move text upward
                    }}>
                        Create collections for photography, journeys, moods—or anything you like.
                    </p>
                </div>
            </div>
        </section>
    );
}
