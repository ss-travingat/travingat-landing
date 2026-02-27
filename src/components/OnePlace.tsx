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

            {/* ── Rachel image + name ────────────────────────────────── */}
            <div className="relative flex flex-col items-center max-w-2xl mx-auto">
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
                    <h3 className="text-white text-2xl md:text-[2rem] font-bold leading-tight">
                        Rachel, 28
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base mt-1">
                        From <span className="text-white font-semibold">Switzerland</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
