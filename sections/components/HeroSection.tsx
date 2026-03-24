import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="px-3 py-12 md:px-12 md:pt-16 xl:px-24 xl:pt-16 xl:pb-8">
      {/* Text content */}
      <div className="mb-6 md:mb-8 xl:mb-10 xl:text-center xl:max-w-[1000px] xl:mx-auto">
        <h1 className="text-[32px] leading-[1.2] font-bold text-white mb-3 text-center md:text-[42px] xl:text-[64px] xl:leading-[1.15] xl:mb-4">
          Build your travel profile
        </h1>
        <p className="text-[16px] leading-normal text-gray-400 text-center md:text-[18px] xl:text-[20px]">
          Turn your journeys into a beautiful personal archive.
        </p>
      </div>

      {/* Email input + CTA */}
      <div className="flex flex-col items-center gap-3 mb-12 px-2 md:mb-14 xl:mb-16">
        {/* Mobile and iPad: stacked */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full max-w-[340px] md:max-w-[500px] h-12 md:h-[60px] rounded-full border border-[#3d3d3d] px-6 bg-black text-white text-[16px] font-medium placeholder:text-[#464646] focus:outline-none focus:border-gray-500 transition-colors xl:hidden"
        />
        <button className="w-full max-w-[340px] md:max-w-[500px] h-12 md:h-[52px] rounded-full bg-white text-black font-medium text-[16px] hover:bg-gray-200 transition-colors xl:hidden">
          Get early access
        </button>
        {/* Desktop: inline input with button */}
        <div className="hidden xl:flex items-center w-full max-w-[500px] h-[60px] rounded-full border border-gray-600 bg-transparent pl-6 pr-1 focus-within:border-gray-400 transition-colors">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent text-white text-[16px] placeholder:text-gray-500 focus:outline-none"
          />
          <button className="h-[52px] px-8 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-gray-200 transition-colors">
            Get early access
          </button>
        </div>
      </div>

      {/* Phone mockups — Desktop: single SVG composite */}
      <div className="hidden xl:block xl:max-w-[1256px] xl:mx-auto">
        <div className="relative w-full" style={{ aspectRatio: '1256 / 802' }}>
          <Image
            src="/images/hero-phones.svg"
            alt="Phone mockups showing travel profiles"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Phone mockups — iPad: 3 phones side by side using mobile assets */}
      <div className="hidden md:flex md:justify-center md:gap-2 md:items-end md:mx-auto md:max-w-[738px] xl:hidden">
        <div className="relative" style={{ width: '33%', aspectRatio: '272.64 / 564.89' }}>
          <Image
            src="/assets/mobile-assets/hero.png"
            alt="Phone mockup 1"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative" style={{ width: '33%', aspectRatio: '272.64 / 564.89' }}>
          <Image
            src="/assets/mobile-assets/travel.png"
            alt="Phone mockup 2"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative" style={{ width: '33%', aspectRatio: '272.64 / 564.89' }}>
          <Image
            src="/assets/mobile-assets/image.png"
            alt="Phone mockup 3"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Phone mockups — Mobile: single image from Figma */}
      <div className="relative mx-auto overflow-hidden md:hidden xl:hidden">
        <Image
          src="/images/hero-mobile-mockup.png"
          alt="Phone mockups showing travel profiles"
          width={369}
          height={351}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
