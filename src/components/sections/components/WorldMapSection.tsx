import Image from "next/image";

export default function WorldMapSection() {
  return (
    <section className="py-12 md:py-16 xl:px-0 xl:py-20">
      {/* Title */}
      <h2 className="ds-font-display text-center text-[32px] leading-10 font-semibold text-white mb-8 tracking-[-0.5px] px-5 md:px-8 md:text-[52px] md:leading-15 md:tracking-[-1px] md:mb-10 xl:px-24 xl:text-[64px] xl:leading-18 xl:text-center xl:max-w-200 xl:mx-auto xl:mb-12 xl:tracking-[-1px]">
        One place for everywhere you&apos;ve explored
      </h2>

      {/* Illustration area */}
      <div className="relative mx-0 overflow-hidden xl:mx-auto xl:h-137.5 xl:max-w-325">
        {/* Mobile and iPad: Rachel + map background only */}
        <div className="relative xl:hidden">
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/Map.png"
              alt=""
              fill
              className="object-contain object-top opacity-100"
              priority
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-129.5 md:max-w-129.5">
            <Image
              src="/images/Rachel.png"
              alt="Rachel exploring the world"
              width={1036}
              height={1156}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Desktop: 3-part split with map background */}
        <div className="relative hidden h-137.5 xl:block">
          <div className="pointer-events-none absolute left-1/2 top-[7.6%] z-0 h-[96%] w-[61.6%] -translate-x-1/2">
            <Image
              src="/images/Map.png"
              alt=""
              fill
              className="object-contain opacity-100"
            />
          </div>

          <div className="relative z-10 grid h-full grid-cols-[1fr_1.35fr_1fr] items-end gap-2 px-4 2xl:gap-6 2xl:px-[4.6%]">
            <div className="w-full max-w-75 self-center justify-self-end translate-x-1">
              <Image
                src="/images/countries.png"
                alt="28 Countries"
                width={640}
                height={1156}
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="relative mx-auto h-full w-full max-w-129.5">
              <Image
                src="/images/Rachel.png"
                alt="Rachel exploring the world"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>

            <div className="w-full max-w-75 self-center justify-self-start -translate-x-1">
              <Image
                src="/images/collections copy.png"
                alt="16 Collections"
                width={320}
                height={578}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
