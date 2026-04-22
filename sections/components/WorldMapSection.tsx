import Image from "next/image";
import { toLandingAssetUrl } from "@/lib/landing-assets";

const mapPins = [
  { left: "17.34%", top: "34.84%" },
  { left: "73.57%", top: "16.05%" },
  { left: "76.06%", top: "50.63%" },
];

export default function WorldMapSection() {
  return (
    <section className="py-12 md:py-16 xl:px-0 xl:py-20">
      {/* Title */}
      <h2 className="ds-font-display text-center text-[32px] leading-10 font-semibold text-white mb-8 tracking-[-0.5px] px-3 md:px-12 md:text-[52px] md:leading-15 md:tracking-[-1px] md:mb-10 xl:px-0 xl:text-[64px] xl:leading-18 xl:text-center xl:max-w-200 xl:mx-auto xl:mb-12 xl:tracking-[-1px]">
        One place for everywhere you&apos;ve explored
      </h2>

      {/* Illustration area */}
      <div className="relative mx-0 xl:max-w-325 xl:mx-auto xl:h-137.5 overflow-hidden">
        {/* Mobile and iPad: single image with gradient + text overlay */}
        <div className="xl:hidden relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-36 w-full md:h-48">
            <Image
              src={toLandingAssetUrl("/images/dotted-world-map.svg")}
              alt=""
              fill
              className="object-contain opacity-65"
            />
          </div>
          <Image
            src={toLandingAssetUrl("/images/travel-mobile-mockup.png")}
            alt="One place for everywhere you've explored"
            width={393}
            height={450}
            className="relative z-10 w-full h-auto block"
            priority
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.75) 55%, rgba(10,10,10,1) 100%)",
            }}
          />
          {/* Text */}
          <div className="absolute inset-x-0 bottom-0 pb-7 flex flex-col items-center gap-1">
            <p className="text-[28px] font-bold text-white tracking-[-0.5px] leading-none ds-font-display">
              Rachel, 28
            </p>
            <p className="text-[15px] font-medium">
              <span className="text-[#a8a8a8]">From </span>
              <span className="text-white">Switzerland</span>
            </p>
          </div>
        </div>

        {/* Desktop: full illustration */}
        <div className="hidden xl:block relative w-full h-137.5">
        {/* World map background */}
        <div className="pointer-events-none absolute left-1/2 top-[7.6%] z-0 h-[96%] w-[61.6%] -translate-x-1/2">
          <Image
            src={toLandingAssetUrl("/images/dotted-world-map.svg")}
            alt=""
            fill
              className="object-contain opacity-100"
          />

            {mapPins.map((pin) => (
              <div
                key={`${pin.left}-${pin.top}`}
                className="absolute -translate-x-1/2"
                style={{ left: pin.left, top: pin.top }}
              >
                <span className="block h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff9aa6_0%,#f0526a_55%,#cb2e47_100%)] shadow-[0_0_0_2px_rgba(240,82,106,0.2)]" />
                <span className="mx-auto mt-0.5 block h-3.5 w-0.5 rounded-full bg-[#cfd0d1]" />
              </div>
            ))}
        </div>

        {/* Central explore.png image (already contains tags + pins) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[320px] xl:w-165 h-full z-10">
          <Image
            src={toLandingAssetUrl("/images/traveler-rachel-figma.png")}
            alt="Traveler exploring the world"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Gradient overlay at bottom for name */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[320px] xl:w-137.5 h-50 flex flex-col items-center justify-end z-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,1) 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-1 pb-1">
            <div className="flex items-center gap-1 text-white">
              <span className="text-[24px] xl:text-[32px] font-bold tracking-[-0.5px] ds-font-display">
                Rachel,
              </span>
              <span className="text-[24px] xl:text-[32px] font-bold tracking-[-0.5px] ds-font-display">
                28
              </span>
            </div>
            <div className="flex items-center gap-1 text-[14px] xl:text-[16px] font-medium tracking-[-0.1px]">
              <span className="text-[#a8a8a8]">From</span>
              <span className="text-white">Switzerland</span>
            </div>
          </div>
        </div>

        {/* 28 Countries card - left side */}
        <div className="absolute top-[20%] left-[4.6%] bg-[#111] border border-black-300 rounded-[20px] p-6 w-[320px] overflow-hidden z-20 hidden xl:flex flex-col gap-6">
          <p className="text-[20px] font-medium text-white tracking-[-0.5px] ds-font-display">
            28 Countries
          </p>
          <div className="flex flex-col gap-2">
            {/* Row 1 */}
            <div className="flex gap-2">
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/country-greece-figma.png")}
                  alt="Greece"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  Greece
                </span>
              </div>
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/country-thailand-figma.png")}
                  alt="Thailand"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  Thailand
                </span>
              </div>
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/country-switzerland-figma.png")}
                  alt="Switzerland"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  Switzerland
                </span>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex gap-2">
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/map-italy.jpg")}
                  alt="Italy"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  Italy
                </span>
              </div>
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/map-nepal.jpg")}
                  alt="Nepal"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  Nepal
                </span>
              </div>
              <div className="flex-1 aspect-square rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/map-france.jpg")}
                  alt="France"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-1.5 left-1.5 text-[12px] font-black text-white drop-shadow-sm">
                  France
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 16 Collections card - right side */}
        <div className="absolute top-[33%] right-[4.6%] bg-[#111] border border-black-300 rounded-[20px] p-6 w-[320px] overflow-hidden z-20 hidden xl:flex flex-col gap-6">
          <p className="text-[20px] font-medium text-white tracking-[-0.5px] ds-font-display">
            16 Collections
          </p>
          <div className="flex flex-col gap-2">
            {/* Row 1 */}
            <div className="flex gap-2">
              <div className="flex-1 h-21.25 rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/collection-streetshots.jpg")}
                  alt="Street Shots"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-2 left-2 text-[12px] font-black text-white drop-shadow-sm">
                  Street Shots
                </span>
              </div>
              <div className="flex-1 h-21.25 rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/collection-nightportraits.jpg")}
                  alt="Night Portraits"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-2 left-2 text-[12px] font-black text-white drop-shadow-sm">
                  Night Portraits
                </span>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex gap-2">
              <div className="flex-1 h-22 rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/collection-skiing.jpg")}
                  alt="Swiss Skiing"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-2 left-2 text-[12px] font-black text-white drop-shadow-sm">
                  Swiss Skiing
                </span>
              </div>
              <div className="flex-1 h-22 rounded-[10px] overflow-hidden relative">
                <Image
                  src={toLandingAssetUrl("/images/collection-franceroadtrip.jpg")}
                  alt="France Road Trip"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/50" />
                <span className="absolute bottom-2 left-2 text-[12px] font-black text-white drop-shadow-sm">
                  France Road Trip
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
