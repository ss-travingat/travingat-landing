import Link from "next/link";
import LoadedImage from "@/components/ui/LoadedImage";
import { ContextMenu } from "./ProfileComponent";
import { MediaResolver } from "@/lib/media-resolver";

export const MobileCountryHeader = ({ countryCode, countryName, profile, updatedLabel, menuRef, showMenu, setShowMenu }: any) => {
  return (
    <div className="flex md:hidden flex-col items-center gap-[1.5rem] w-full max-w-[37.5rem] pt-[48px]">
      <div className="flex flex-col items-center gap-[1.75rem]">
        <div className="h-[5rem] w-[7.5rem] overflow-hidden rounded-[0.5rem] shrink-0">
          <img
            src={`/flags/${countryCode.toUpperCase()}.svg`}
            alt={`${countryName} flag`}
            className="w-full h-full object-cover block"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <h1 className="text-white text-center" style={{ fontFamily: 'var(--font-inter-display, "Inter Display")', fontSize: '1.75rem', lineHeight: 1, letterSpacing: '-0.03125rem', fontWeight: 600 }}>
          {countryName}
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
                kind="country"
                viewLabel="View main profile"
                shareLabel="Share country"
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
