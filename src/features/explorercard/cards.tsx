import React from "react";

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
    <div className="flex h-[600px] w-[360px] flex-col items-center rounded-[24px] border border-[#252525] bg-black px-2 pb-[24px] pt-2">
      {/* Profile section */}
      <div className="flex w-full shrink-0 flex-col items-center">
        {/* Background image: 344x226, negative margin to allow avatar overlap */}
        <div className="z-0 -mb-[36px] flex h-[226px] w-[344px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#161616]">
          {form.coverImage ? (
            <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholderIcon />
          )}
        </div>

        {/* Photo Avatar */}
        <div className="relative z-10 h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[16px] border-[4px] border-black bg-[#161616]">
          {form.profileImage ? (
            <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white-600">
              <AvatarPlaceholderIcon />
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
                <div className="h-[10px] w-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                  <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
                </div>
                <span className="text-[14px] font-[family-name:var(--font-inter-display)] font-medium leading-[20px] tracking-[-0.084px] text-[#656565]">{form.country}</span>
              </>
            ) : (
              <span className="text-[14px] font-[family-name:var(--font-inter-display)] font-medium leading-[20px] tracking-[-0.084px] text-[#656565]">Your country</span>
            )}
          </div>
          <h3 className="w-full text-center text-[28px] font-[family-name:var(--font-inter-display)] font-semibold leading-[36px] tracking-[-0.1px] text-white">
            {form.fullName || "Your full name"}
          </h3>
        </div>

        {/* FLAGS */}
        <div className="flex w-[310px] shrink-0 flex-wrap items-start justify-center gap-[4px] mx-auto">
          {visitedArray.length > 0 ? (
            <>
              {visitedArray.slice(0, 35).map((c) => (
                <div
                  key={c}
                  title={c}
                  className="h-[13.333px] w-[20px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]"
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
            Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-[13.333px] w-[20px] shrink-0 overflow-hidden rounded-[2px] bg-[#2a2a2a]" />
            ))
          )}
        </div>

        {/* Countries explored container */}
        <div className="flex w-full shrink-0 flex-col items-center gap-[12px]">
          <p className="text-[32px] font-[family-name:var(--font-inter-display)] font-medium leading-[40px] tracking-[-0.5px] text-white">
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
          <div className="h-[9px] w-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
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
        <div className="flex w-full h-[224px] shrink-0 items-center gap-[8px]">
          {/* Profile image (acts like cover image here) */}
          <div className="relative flex h-full flex-[1_0_0] items-center justify-center overflow-hidden rounded-[16px] bg-[#1a1a1a]">
            {form.coverImage ? (
              <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
            ) : (
              <ImagePlaceholderIcon />
            )}
          </div>
          
          {/* Profile info */}
          <div className="flex h-full flex-[1_0_0] flex-col items-start justify-end gap-[12px] rounded-[16px] bg-[#111111] p-[16px]">
            <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[10px] bg-[#2a2a2a]">
              {form.profileImage ? (
                <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center"><AvatarPlaceholderIcon /></div>
              )}
            </div>
            <p className="w-[min-content] min-w-full break-words text-[24px] font-[family-name:var(--font-inter-display)] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {form.fullName || "Your full name"}
            </p>
            <div className="flex w-full shrink-0 items-center gap-[6px]">
              <div className="h-[10px] w-[15px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                {form.country && sampleFlags[form.country] && (
                  <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
                )}
              </div>
              <p className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-[#656565]">
                {form.country || "Your country"}
              </p>
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

           <div className="flex w-[296px] shrink-0 flex-wrap content-start items-start gap-[4px]">
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
                Array.from({ length: 35 }).map((_, i) => (
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
      className="flex w-[382px] shrink-0 flex-col items-center gap-[20px] rounded-[24px] border border-[#252525] bg-[#0c0c0c] px-[8px] pb-[24px] pt-[8px] mb-[24px]"
    >
      {/* Main Image Container */}
      <div className="relative flex w-full h-[528px] shrink-0 flex-col items-center justify-end overflow-hidden rounded-[16px] bg-[#0c0c0c]">
        
        {/* Notch Overlay */}
        <div className="absolute top-0 z-20 flex w-full shrink-0 items-start justify-center">
          <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 -mr-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#0c0c0c"/>
          </svg>
          <div className="relative z-10 flex h-[32px] items-center justify-center gap-[6px] rounded-b-[12px] bg-[#0c0c0c] px-[12px]">
            <div className="h-[9px] w-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
               {form.country && sampleFlags[form.country] && (
                 <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
               )}
            </div>
            <p className="whitespace-nowrap text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-white">
              {form.country || "Your country"}
            </p>
          </div>
          <svg preserveAspectRatio="none" overflow="visible" className="h-[24px] w-[24px] shrink-0 scale-x-[-1] -ml-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#0c0c0c"/>
          </svg>
        </div>

        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          {form.coverImage ? (
            <img src={form.coverImage} alt="cover" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
               <ImagePlaceholderIcon />
            </div>
          )}
        </div>

        {/* Content at Bottom with Gradient & Blur */}
        <div className="relative z-20 flex w-full flex-col items-center pb-[32px] px-[8px]">
          
          {/* Blurred Background Layer with Gradient Mask */}
          <div 
            className="absolute z-0 bg-linear-to-b from-black/0 to-black/50 backdrop-blur-[12px]" 
            style={{ 
              top: 0,
              bottom: '-32px',
              left: '-32px',
              right: '-32px',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 80px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 80px)'
            }}
          />

          {/* Profile Picture */}
          <div className="relative z-10 mb-[16px] h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[16px] border-[3px] border-white bg-[#2a2a2a] shadow-lg">
            {form.profileImage ? (
              <img src={form.profileImage} alt="profile" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"><AvatarPlaceholderIcon /></div>
            )}
          </div>

          {/* Name */}
          <p className="relative z-10 mb-[8px] w-full break-words px-4 text-center text-[32px] font-[family-name:var(--font-inter-display)] font-bold leading-[40px] tracking-[-0.5px] text-white">
            {form.fullName || "Your full name"}
          </p>

          {/* Stats */}
          <p className="relative z-10 mb-[24px] whitespace-nowrap text-center text-[16px] font-normal leading-[1.5] tracking-[-0.5px] text-white/80">
            {visitedArray.length} Countries explored
          </p>

          {/* Flags */}
          <div className="relative z-10 flex w-[296px] shrink-0 flex-wrap content-start items-start justify-center gap-[4px]">
            {visitedArray.length > 0 ? (
              <>
                {visitedArray.slice(0, 35).map((c) => (
                  <div key={c} title={c} className="h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
                    <span className={`fi fi-${sampleFlags[c].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={c} />
                  </div>
                ))}
                {visitedArray.length > 35 && (
                  <div className="flex h-[18px] min-w-[26px] shrink-0 items-center justify-center rounded-[2px] bg-[#533df6] px-1 text-[11px] font-semibold text-white">
                    +{visitedArray.length - 35}
                  </div>
                )}
              </>
            ) : (
               Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[2px] bg-white/10" />
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

export function ImagePlaceholderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white-700">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function AvatarPlaceholderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white-700">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
