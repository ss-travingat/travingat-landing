import Link from "next/link";
import LoadedImage from "@/components/ui/LoadedImage";
import { ContextMenu } from "./ProfileComponent";
import { MediaResolver } from "@/lib/media-resolver";

export const DesktopCountryHeader = ({ countryCode, countryName, profile, updatedLabel, menuRef, showMenu, setShowMenu }: any) => {
  return (
    <div className="hidden md:flex flex-col items-center shrink-0 pt-[48px]" style={{ gap: '20px', marginBottom: '48px', width: '600px' }}>
      <div className="flex flex-col items-center justify-center w-full" style={{ gap: '24px' }}>
        <div className="overflow-hidden rounded-[8px] shrink-0 bg-transparent" style={{ width: '120px', height: '80px' }}>
          <img src={`/flags/${countryCode.toUpperCase()}.svg`} alt={`${countryName} flag`} className="w-full h-full block" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        </div>
        <h1 className="text-white text-center whitespace-nowrap" style={{ fontFamily: 'var(--font-inter-display, "Inter Display")', fontSize: '52px', fontWeight: 700, lineHeight: '60px', letterSpacing: '-1px' }}>
          {countryName}
        </h1>
      </div>
      <div className="flex items-center justify-center w-full" style={{ gap: '12px' }}>
        <div className="flex items-center shrink-0" style={{ gap: '8px' }}>
          <span className="text-white whitespace-nowrap font-normal" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.096px' }}>By</span>
          <div className="overflow-hidden shrink-0" style={{ width: '20px', height: '20px', borderRadius: '6px' }}>
            <LoadedImage
              originalSrc={MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
              src={MediaResolver.getOptimized(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
              thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url), 144)}
              blurhash={typeof profile.images.avatar === "object" ? profile.images.avatar.blurhash : undefined}
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
