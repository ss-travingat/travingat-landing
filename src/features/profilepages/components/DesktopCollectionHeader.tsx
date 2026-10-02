import Link from "next/link";
import LoadedImage from "@/components/ui/LoadedImage";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { DesktopCountriesPopup } from "@/components/ui/DesktopCountriesPopup";
import { ContextMenu } from "./ProfileComponent";
import { MediaResolver } from "@/lib/media-resolver";
import { COUNTRY_LIST } from "@/lib/countries";

export const DesktopCollectionHeader = ({ title, headerCountryCodes, flagOverflowCount, allVisitedCountries, profile, updatedLabel, menuRef, showMenu, setShowMenu }: any) => {
  return (
    <div className="hidden md:flex flex-col items-center shrink-0 w-[600px]" style={{ gap: '16px', marginBottom: '48px' }}>
      <div className="flex flex-col items-center justify-center w-full" style={{ gap: '16px' }}>
        {headerCountryCodes.length === 1 ? (
          <div className="overflow-hidden rounded-[8px] shrink-0 bg-transparent" style={{ width: '120px', height: '80px' }}>
            <img src={`/flags/${headerCountryCodes[0].toUpperCase()}.svg`} alt="flag" className="w-full h-full" style={{ objectFit: 'cover' }} />
          </div>
        ) : (
          <div className="flex items-center justify-center flex-wrap" style={{ gap: '8px' }}>
            {headerCountryCodes.slice(0, 4).map((code: string) => {
              const countryEntry = COUNTRY_LIST.find((c) => c.code.toLowerCase() === code.toLowerCase());
              const countryName = countryEntry ? countryEntry.name : code;
              return (
                <TooltipProvider key={code} delayDuration={100}>
                  <Tooltip content={countryName} theme="light" side="top">
                    <div className="overflow-hidden shrink-0 cursor-pointer rounded-[2px] shadow-sm" style={{ width: '32px', height: '20px' }}>
                      <img src={`/flags/${code.toUpperCase()}.svg`} className="w-full h-full" alt={countryName} style={{ objectFit: 'cover' }} />
                    </div>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
            {flagOverflowCount > 0 && (
              <DesktopCountriesPopup
                countries={allVisitedCountries}
                trigger={
                  <div className="flex shrink-0 items-center justify-center overflow-hidden bg-white cursor-pointer hover:opacity-80 transition-opacity rounded-[2px]" style={{ width: '32px', height: '20px' }}>
                    <span className="font-bold text-violet-600 text-center whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '-0.2px' }}>
                      +{flagOverflowCount}
                    </span>
                  </div>
                }
              />
            )}
          </div>
        )}
        <h1 className="text-white text-center" style={{ fontFamily: 'var(--font-inter-display, "Inter Display")', fontSize: '3.25rem', lineHeight: '3.75rem', letterSpacing: '-0.0625rem', fontWeight: 700 }}>
          {title}
        </h1>
      </div>
      <div className="flex items-center justify-center w-full" style={{ gap: '12px' }}>
        <div className="flex items-center shrink-0" style={{ gap: '8px' }}>
          <span className="text-white whitespace-nowrap font-normal" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.096px' }}>By</span>
          <div className="overflow-hidden shrink-0" style={{ width: '20px', height: '20px', borderRadius: '6px' }}>
            <LoadedImage
              originalSrc={MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
              src={MediaResolver.getOptimized(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
              thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url), 720)}
              alt={profile.name}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
              skeletonClassName="absolute inset-0 bg-[#2a2a2a]"
              containerClassName="w-full h-full relative"
            />
          </div>
          <Link href={`/${profile.handle.replace(/^@/, "")}`} className="text-white hover:underline whitespace-nowrap font-normal" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.096px' }}>
            {profile.handle}
          </Link>
        </div>
        <div className="shrink-0 bg-white" style={{ width: '3px', height: '3px', borderRadius: '50%' }} />
        <div className="flex items-center shrink-0" style={{ gap: '8px' }}>
          <span className="text-[#989898] whitespace-nowrap font-normal" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.096px' }}>Last Updated:</span>
          <span className="text-[#989898] whitespace-nowrap font-normal" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.096px' }}>
            {updatedLabel}
          </span>
          <div className="relative flex items-center ml-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev: boolean) => !prev)}
              className="flex px-[12px] py-[10px] items-center justify-center rounded-[12px] border border-[#1e1e1e] hover:bg-[#222] transition shrink-0"
              aria-label="More options"
            >
              <div className="flex items-center" style={{ gap: '6px' }}>
                <div className="h-[3px] w-[3px] rounded-full bg-white" />
                <div className="h-[3px] w-[3px] rounded-full bg-white" />
                <div className="h-[3px] w-[3px] rounded-full bg-white" />
              </div>
            </button>
            {showMenu && (
              <ContextMenu
                kind="collection"
                viewLabel="View main profile"
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
