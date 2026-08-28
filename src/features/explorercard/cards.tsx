import React from "react";
import LoadedImage from "@/components/ui/LoadedImage";
import { toLandingAssetUrl } from "@/lib/landing-assets";

interface CardProps {
  form: {
    fullName: string;
    country: string;
    coverImage: string;
    profileImage: string;
  };
  sampleFlags: Record<string, string>;
  visitedArray: string[];
}

export function ClassicCard({ form, sampleFlags, visitedArray }: CardProps) {
  return (
    <div className="flex w-[360px] flex-col items-center rounded-[24px] border border-[#252525] bg-black px-2 pb-[24px] pt-2">
      {/* Profile section */}
      <div className="flex w-full shrink-0 flex-col items-center">
        {/* Background image: 344x226, negative margin to allow avatar overlap */}
        <div className="z-0 -mb-[36px] flex h-[226px] w-[344px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#161616]">
          {form.coverImage ? (
            <LoadedImage src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholderIcon />
          )}
        </div>

        {/* Photo Avatar */}
        <div className="relative z-10 h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[16px] border-[4px] border-black bg-[#161616]">
          {form.profileImage ? (
            <LoadedImage src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white-600">
              <div className="relative w-[48px] h-[48px]">
                <AvatarPlaceholderIcon className="w-full h-full object-cover" />
                <div className="absolute left-[30px] w-[11px] h-[11px] top-[31.7px] pointer-events-none z-0">
                  <div className="absolute inset-[0_-16.67%_-33.33%_-16.67%]">
                    <img alt="" className="block max-w-none w-full h-full" src="/icons/Add user button.png" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="flex w-full shrink-0 flex-col items-center gap-[20px] px-[12px] pt-[20px]">
        {/* Country and name container */}
        <div className="flex w-full shrink-0 flex-col items-center gap-[10px]">
          {/* Country container */}
          <div className="flex shrink-0 items-center justify-center gap-[6px]">
            {form.country && sampleFlags[form.country] ? (
              <>
                <div className="h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                  <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
                </div>
                <span className="text-[14px] font-[family-name:var(--font-inter)] font-normal leading-[20px] tracking-[-0.084px] text-[#656565]">{form.country}</span>
              </>
            ) : (
              <span className="text-[14px] font-[family-name:var(--font-inter)] font-normal leading-[20px] tracking-[-0.084px] text-[#656565]">Your country</span>
            )}
          </div>
          <h3 className="w-full text-center text-[20px] font-[family-name:var(--font-inter-display)] font-semibold leading-[28px] tracking-[-0.1px] text-white">
            {form.fullName || "Your full name"}
          </h3>
        </div>

        {/* FLAGS */}
        <div className="flex w-[310px] h-[48px] shrink-0 flex-wrap content-center items-center justify-center gap-[4px] mx-auto">
          {visitedArray.length > 0 ? (
            <>
              {visitedArray.slice(0, 35).map((c) => (
                <div
                  key={c}
                  title={c}
                  className="h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]"
                >
                  <span className={`fi fi-${sampleFlags[c].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={c} />
                </div>
              ))}
              {visitedArray.length > 35 && (
                <div className="flex h-[13.333px] min-w-[20px] shrink-0 items-center justify-center rounded-[2px] bg-[#533df6] px-1 text-[9px] font-semibold text-white">
                  +{visitedArray.length - 35}
                </div>
              )}
            </>
          ) : (
            // Placeholder empty flags if none visited
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[13.333px] w-[20px] shrink-0 overflow-hidden rounded-[2px] bg-[#2a2a2a]" />
            ))
          )}
        </div>

        {/* Countries explored container */}
        <div className="flex w-full shrink-0 flex-col items-center gap-[12px]">
          <p className="text-[32px] font-[family-name:var(--font-inter-display)] font-normal leading-[40px] tracking-[-0.5px] text-white">
            {visitedArray.length} Countries
          </p>
          <p className="pl-[24px] bg-linear-to-l from-[#3c3c3c] to-[#242424] bg-clip-text text-[32px] font-[family-name:var(--font-antonio)] font-bold leading-[40px] tracking-[24px] text-transparent uppercase">
            Explored
          </p>
        </div>

        {/* Call to action container */}
        <div className="flex w-full shrink-0 items-center justify-center">
          <a href="/edit/explorercard" className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.084px] text-[#7c7c7c] hover:text-white transition-colors underline decoration-wavy underline-offset-2">
            Join me on Travingat
          </a>
        </div>
      </div>
    </div>
  );
}

export function MinimalCard({ form, sampleFlags, visitedArray }: CardProps) {
  return (
    <div
      id="minimal-card"
      className="flex w-[382px] shrink-0 flex-col items-center gap-[20px] rounded-[24px] border border-[#252525] bg-black px-[8px] pb-[24px] pt-0"
    >
      {/* Country badge at top */}
      <div className="flex w-full shrink-0 items-start justify-center relative">
        <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 -mr-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#1E1E1E"/>
        </svg>
        <div className="relative z-10 flex h-[32px] items-center justify-center gap-[6px] rounded-b-[12px] bg-[#1e1e1e] px-[12px]">
          <div className="h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
             {form.country && sampleFlags[form.country] && (
               <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
             )}
          </div>
          <p className="whitespace-nowrap text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-white">
            {form.country || "Your country"}
          </p>
        </div>
        <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 scale-x-[-1] -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#1E1E1E"/>
        </svg>
      </div>

      {/* Main content container */}
      <div className="flex w-full shrink-0 flex-col items-center gap-[8px]">
        {/* Profile Container: side-by-side */}
        <div className="grid grid-cols-2 w-full h-[224px] shrink-0 gap-[8px]">
          {/* Profile image (acts like cover image here) */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#1a1a1a]">
            {form.coverImage ? (
              <LoadedImage src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
            ) : (
              <ImagePlaceholderIcon />
            )}
          </div>
          
          {/* Profile info */}
          <div className="flex h-full w-full flex-col items-start justify-end gap-[12px] rounded-[16px] bg-[#111111] p-[16px]">
            <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[10px] bg-[#2a2a2a]">
              {form.profileImage ? (
                <LoadedImage src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-[36px] w-[36px]">
                  <AvatarPlaceholderIcon className="h-full w-full object-cover" />
                  <div className="absolute left-[22.5px] top-[23.7px] z-0 h-[8.25px] w-[8.25px] pointer-events-none">
                    <div className="absolute inset-[0_-16.67%_-33.33%_-16.67%]">
                      <img alt="" className="block h-full w-full max-w-none" src="/icons/Add user button.png" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col text-[24px] font-[family-name:var(--font-inter-display)] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              <span>{(form.fullName || "Your full name").trim().split(" ")[0]}</span>
              <span>{(form.fullName || "Your full name").trim().split(" ").slice(1).join(" ")}</span>
            </div>

          </div>
        </div>

        {/* Stats Container */}
        <div className="flex w-full shrink-0 flex-col items-start justify-end gap-[24px] rounded-[16px] bg-[#111111] px-[20px] py-[24px]">
           <div className="flex flex-col items-start whitespace-nowrap">
             <p className="text-[64px] font-[family-name:var(--font-inter-display)] font-normal leading-[72px] tracking-[-1px] text-white">
               {visitedArray.length}
             </p>
             <p className="text-[16px] font-normal leading-[1.5] tracking-[-0.5px] text-[#a8a8a8]">
               Countries Explored
             </p>
           </div>

           <div className="flex w-[296px] h-[84px] shrink-0 flex-wrap content-center items-center gap-[4px]">
             {visitedArray.length > 0 ? (
               <>
                 {visitedArray.slice(0, 35).map((c) => (
                    <div key={c} title={c} className="h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                      <span className={`fi fi-${sampleFlags[c].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={c} />
                    </div>
                 ))}
                 {visitedArray.length > 35 && (
                    <div className="flex h-[18px] min-w-[26px] shrink-0 items-center justify-center rounded-[2px] bg-[#533df6] px-1 text-[11px] font-medium text-white">
                      +{visitedArray.length - 35}
                    </div>
                 )}
               </>
             ) : (
                Array.from({ length: 10 }).map((_, i) => (
                   <div key={i} className="h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[2px] bg-[#2a2a2a]" />
                ))
             )}
           </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-center">
        <a href="/edit/explorercard" className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.084px] text-[#7c7c7c] hover:text-white transition-colors underline decoration-wavy underline-offset-2">
          Join me on Travingat
        </a>
      </div>
    </div>
  );
}

export function AdventureCard({ form, sampleFlags, visitedArray }: CardProps) {
  return (
    <div
      id="adventure-card"
      className="flex h-[600px] w-[360px] shrink-0 flex-col items-center justify-between rounded-[24px] border border-[#252525] bg-black p-2 pb-[24px]"
    >
      {/* Main Image Container */}
      <div 
        className="relative flex w-[344px] h-[528px] shrink-0 flex-col items-center justify-end overflow-hidden rounded-[16px] bg-[#161616] isolate"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        
        {/* Notch Overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 flex w-full shrink-0 items-start justify-center">
          <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 -mr-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#000000"/>
          </svg>
          <div className="relative z-10 flex h-[32px] items-center justify-center gap-[6px] rounded-b-[12px] bg-black px-[12px]">
            <div className="h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
               {form.country && sampleFlags[form.country] ? (
                 <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
               ) : (
                 <div className="h-full w-full rounded-[2px] bg-[#2a2a2a]" />
               )}
            </div>
            <p className="whitespace-nowrap text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-white">
              {form.country || <span className="text-[#656565]">Your country</span>}
            </p>
          </div>
          <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 scale-x-[-1] -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#000000"/>
          </svg>
        </div>

        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          {form.coverImage ? (
            <LoadedImage src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute top-[127px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
               <span className="material-symbols-rounded text-[#E3E3E3] text-[40px]">add_photo_alternate</span>
            </div>
          )}
        </div>

        {/* Content at Bottom with Gradient & Blur */}
        <div className="relative z-20 mt-auto flex w-full flex-col items-center pb-[24px] px-[8px]">
          
          {/* Blurred Background Layer with Progressive Gradient Mask */}
          <div 
            className="absolute -inset-x-4 -bottom-4 -top-[48px] z-0 backdrop-blur-[16px] pointer-events-none" 
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 48px, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 48px, black 100%)'
            }}
          />

          {/* Profile Picture */}
          <div className="relative z-10 mb-[12px] flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] border-[3px] border-white bg-[#2a2a2a] shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
            {form.profileImage ? (
              <LoadedImage src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-[36px] w-[36px]">
                <AvatarPlaceholderIcon className="h-full w-full object-cover" />
                <div className="absolute left-[22.5px] top-[23.7px] z-0 h-[8.25px] w-[8.25px] pointer-events-none">
                  <div className="absolute inset-[0_-16.67%_-33.33%_-16.67%]">
                    <img alt="" className="block h-full w-full max-w-none" src="/icons/Add user button.png" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Container: Name & Countries Explored */}
          <div className="relative z-10 flex w-full flex-col items-center gap-[4px] mb-[16px]">
            <h3 className="w-full break-words px-2 text-center text-[28px] font-bold font-[family-name:var(--font-inter-display)] leading-[36px] tracking-[-0.5px] text-white">
              {form.fullName || "Your full name"}
            </h3>

            <p className="whitespace-nowrap text-center text-[16px] font-[family-name:var(--font-inter)] font-normal leading-[24px] tracking-[-0.096px] text-white/90">
              {visitedArray.length} Countries explored
            </p>
          </div>

          {/* Flags */}
          <div className="relative z-10 flex h-[48px] w-[308px] shrink-0 flex-wrap content-center justify-center gap-[4px] gap-y-[4px]">
            {visitedArray.length > 0 ? (
              <>
                {visitedArray.slice(0, 35).map((c) => (
                  <div key={c} title={c} className="h-[13.333px] w-[20px] aspect-[3/2] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                    <span className={`fi fi-${sampleFlags[c].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={c} />
                  </div>
                ))}
                {visitedArray.length > 35 && (
                  <div className="flex h-[13.333px] min-w-[26px] shrink-0 items-center justify-center rounded-[2px] bg-[#533df6] px-1 text-[9px] font-medium text-white">
                    +{visitedArray.length - 35}
                  </div>
                )}
              </>
            ) : (
               Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-[13.333px] w-[20px] shrink-0 overflow-hidden rounded-[2px] bg-white/20" />
               ))
            )}
          </div>

        </div>
      </div>

      {/* Call to Action Container */}
      <div className="flex w-full shrink-0 items-center justify-center">
        <a href="/edit/explorercard" className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.084px] text-[#7c7c7c] hover:text-white transition-colors underline decoration-wavy underline-offset-2">
          Join me on Travingat
        </a>
      </div>
    </div>
  );
}

export function ImagePlaceholderIcon() {
  return (
    <span className="material-symbols-rounded text-[#E3E3E3] text-[32px]">add_photo_alternate</span>
  );
}

export function AvatarPlaceholderIcon({ className }: { className?: string }) {
  return (
    <img src="/icons/placeholder.png" alt="Placeholder avatar" className={className || "w-[60px] h-[60px] shrink-0 aspect-square object-cover"} />
  );
}
