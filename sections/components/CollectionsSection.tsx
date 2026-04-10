import Image from "next/image";
import { toLandingAssetUrl } from "@/lib/landing-assets";

export default function CollectionsSection() {
  return (
    <section className="px-3 py-12 md:px-12 md:py-16 xl:hidden">
      <div>
        {/* Text */}
        <div>
          <h2 className="ds-font-display text-[32px] leading-[40px] font-semibold text-white mb-4 text-center tracking-[-0.5px] md:text-[52px] md:leading-[60px] md:tracking-[-1px] md:mb-6 md:max-w-[600px] md:mx-auto">
            Create collections that tell a story
          </h2>
          <p className="text-[16px] leading-[24px] text-white mb-8 text-center md:text-[20px] md:leading-[1.6] md:mb-10 md:max-w-[520px] md:mx-auto">
            Create collections for photography, journeys, moods—or anything you like.
          </p>
        </div>

        {/* Phone mockup image */}
        <div className="relative mx-auto md:max-w-[600px]">
          <Image
            src={toLandingAssetUrl("/images/collections-mobile-mockup.png")}
            alt="Create collections that tell a story"
            width={369}
            height={369}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
