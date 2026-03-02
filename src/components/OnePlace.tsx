import Image from "next/image";

export default function OnePlace() {
    return (
        <section className="py-16 md:py-28 px-5 md:px-4 bg-black overflow-hidden">
            {/* ── Heading ───────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
                <h2 className="text-3xl md:text-[3.25rem] font-bold text-white leading-tight tracking-tight">
                    One place for everywhere
                    <br />
                    you&apos;ve explored
                </h2>
            </div>

            {/* ── Mobile layout (unchanged) ──────────────────────────── */}
            <div className="relative flex flex-col items-center max-w-2xl mx-auto md:hidden">
                <Image
                    src="/assets/racheal.png"
                    alt="Rachel – Traveler"
                    width={900}
                    height={600}
                    className="w-full max-h-[60vh] object-contain"
                    priority
                />
                {/* Gradient overlay + name */}
                <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black via-black/70 to-transparent pt-24 pb-4 text-center">
                    <h3 className="text-white text-2xl font-bold leading-tight">
                        Rachel, 28
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        From <span className="text-white font-semibold">Switzerland</span>
                    </p>
                </div>
            </div>

            {/* ── Desktop layout — profile overlay ──────────────────── */}
            <div className="hidden md:block relative max-w-6xl mx-auto">
                {/* Base Rachel photo — centred */}
                <div className="flex justify-center">
                    <Image
                        src="/assets/racheal.png"
                        alt="Rachel – Traveler"
                        width={900}
                        height={600}
                        className="w-auto max-h-[70vh] object-contain relative z-10"
                        priority
                    />
                </div>

                {/* Profile UI overlay — sits on top, covers the full desktop container */}
                <Image
                    src="/assets/rachelProfile.png"
                    alt="Rachel profile UI"
                    width={1200}
                    height={700}
                    className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
                />

                {/* Black gradient + name — overlaid at the bottom of the image */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42%] z-30 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 text-center">
                    <h3 className="text-white text-[2rem] font-bold leading-tight">
                        Rachel, 28
                    </h3>
                    <p className="text-gray-400 text-base mt-1">
                        From <span className="text-white font-semibold">Switzerland</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

