import Link from "next/link";
import LoadedImage from "@/components/ui/LoadedImage";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { CountriesPopup } from "@/components/ui/CountriesPopup";
import { ContextMenu } from "./ProfileComponent";
import { MediaResolver } from "@/lib/media-resolver";
import { COUNTRY_LIST } from "@/lib/countries";

export const MobileCollectionHeader = ({ title, headerCountryCodes, flagOverflowCount, allVisitedCountries, profile, updatedLabel, menuRef, showMenu, setShowMenu }: any) => {
  return (
    <div className="flex md:hidden flex-col items-center gap-[1.5rem] w-full max-w-[37.5rem] pt-[16px]">
      <div className="flex flex-col items-center gap-[1.75rem]">
        <div className="flex items-center gap-[0.5rem] justify-center flex-wrap">
          {headerCountryCodes.slice(0, 4).map((code: string) => {
            const countryEntry = COUNTRY_LIST.find((c) => c.code.toLowerCase() === code.toLowerCase());
            const countryName = countryEntry ? countryEntry.name : code;
            return (
              <TooltipProvider key={code} delayDuration={100}>
                <Tooltip content={countryName} theme="light" side="top">
                  <div className="h-[1.5rem] w-[2.125rem] overflow-hidden rounded-[0.1875rem] shadow-sm cursor-pointer">
                    <img src={`/flags/${code.toUpperCase()}.svg`} className="w-full h-full object-cover" alt={countryName} />
                  </div>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          {flagOverflowCount > 0 && (
            <CountriesPopup
              countries={allVisitedCountries}
              trigger={
                <div className="flex h-[1.5rem] w-[2.125rem] shrink-0 items-center justify-center overflow-hidden rounded-[0.1875rem] bg-white cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="font-medium text-violet-600 text-[0.75rem] text-center tracking-[-0.408px] whitespace-nowrap">
                    +{flagOverflowCount}
                  </span>
                </div>
              }
            />
          )}
        </div>
        <h1 className="text-white text-center" style={{ fontFamily: 'var(--font-inter-display, "Inter Display")', fontSize: '1.75rem', lineHeight: 1, letterSpacing: '-0.03125rem', fontWeight: 600 }}>
          {title}
        </h1>
      </div>

      {/* Meta info row */}
      <div className="flex flex-col items-center gap-[0.5rem]">
        <div className="flex items-center gap-[0.5rem]">
          <span className="text-[0.875rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal">By</span>
          <div className="h-[1.25rem] w-[1.25rem] overflow-hidden rounded-[0.375rem] shrink-0">
            <LoadedImage
              originalSrc={MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)} src={MediaResolver.getOptimized(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
              thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url), 720)}
              alt={profile.name}
              className="w-full h-full object-cover"
              skeletonClassName="absolute inset-0 bg-[#2a2a2a]"
              containerClassName="w-full h-full relative"
            />
          </div>
          <Link href={`/${profile.handle.replace(/^@/, "")}`} className="text-[0.875rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal hover:underline">
            {profile.handle}
          </Link>
        </div>

        <div className="flex items-center gap-[0.5rem]">
          <span className="text-[0.875rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">Last Updated:</span>
          <span className="text-[0.875rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">
            {updatedLabel}
          </span>
          <div className="ml-1 relative flex items-center" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev: boolean) => !prev)}
              className="flex px-[0.5rem] py-[0.25rem] items-center justify-center rounded-[3.125rem] bg-[#181818] hover:bg-[#222] transition shrink-0"
              aria-label="More options"
            >
              <div className="flex items-center gap-[0.25rem]">
                <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
                <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
                <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
              </div>
            </button>
            {showMenu && (
              <ContextMenu
                kind="collection"
                viewLabel="View collection"
                shareLabel="Share collection"
                viewHref={`/${profile.handle.replace(/^@/, "")}`}
                showViewAction={false}
                onShare={() => {
                  navigator.clipboard.writeText(window.location.href).catch(() => { });
                  setShowMenu(false);
                }}
                onClose={() => setShowMenu(false)}
                menuRef={menuRef}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
