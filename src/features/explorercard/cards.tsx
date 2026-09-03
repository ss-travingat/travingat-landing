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
  isPreview?: boolean;
}

export function LogoWatermark() {
  return (
    <div className="absolute flex h-[100px] w-[29px] items-center justify-center pointer-events-none select-none z-[40]" style={{ left: '5.91px', top: '22.5px' }}>
      <div className="-rotate-90 flex-none">
        <div className="flex items-center opacity-40">
          <p 
            className="whitespace-nowrap bg-gradient-to-l from-[rgba(255,255,255,0.10)] to-white bg-clip-text text-transparent"
            style={{
              fontFamily: 'var(--font-logo, Righteous)',
              fontSize: '23.14px',
              fontWeight: 400,
              letterSpacing: '-0.41px',
            }}
          >
            travingat
          </p>
        </div>
      </div>
    </div>
  );
}

export function CountryNotch({ form, sampleFlags, fill = "#000000", emptyBg = "bg-[#2a2a2a]", wrapperClassName = "" }: { form: any, sampleFlags: any, fill?: string, emptyBg?: string, wrapperClassName?: string }) {
  return (
    <div className={`flex items-start justify-center pointer-events-none ${wrapperClassName}`}>
      {/* Left Curve */}
      <svg width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 relative z-20 overflow-visible">
        <path d="M35 0H0L15.8765 0.44712C25.5527 0.719623 33.4182 8.33753 34 18H35V0Z" fill={fill}/>
      </svg>
      {/* Center Rectangle */}
      <div className="relative z-10 flex min-w-[134px] h-[27px] items-center justify-center rounded-b-[12px] px-[12px] pointer-events-auto" style={{ backgroundColor: fill }}>
        <div className="flex items-center justify-center gap-[6px]">
          <div className="h-[9px] w-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
             {form.country && sampleFlags[form.country] ? (
               <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
             ) : (
               <div className={`h-full w-full rounded-[2px] ${emptyBg}`} />
             )}
          </div>
          <p className="whitespace-nowrap text-[14px] font-[family-name:var(--font-inter)] font-normal leading-[14px] tracking-[-0.084px] text-white">
            {form.country || <span className="text-[#656565]">Your country</span>}
          </p>
        </div>
      </div>
      {/* Right Curve */}
      <svg width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 relative z-20 overflow-visible">
        <path d="M-1 0H34L18.1235 0.44712C8.44727 0.719623 0.581831 8.33753 0 18H-1V0Z" fill={fill}/>
      </svg>
    </div>
  );
}

export function MinimalCountryNotch({ form, sampleFlags, wrapperClassName = "" }: { form: any, sampleFlags: any, wrapperClassName?: string }) {
  return (
    <div className={`flex items-start justify-center pointer-events-none ${wrapperClassName}`}>
      <div className="relative flex h-[32px] w-[182px] items-center justify-center pointer-events-auto">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg width="182" height="32" viewBox="0 0 182 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_444_18)">
              <path d="M24 0H0L0.533106 0.0283589C13.3936 0.712479 23.5897 11.1279 24 24V0Z" fill="#1E1E1E"/>
              <path d="M23 0 H159 V20 H158 C158 26.6274 152.627 32 146 32 H36 C29.3726 32 24 26.6274 24 20 H23 V0 Z" fill="#1E1E1E"/>
              <path d="M158 0H182L181.467 0.0283589C168.606 0.712479 158.41 11.1279 158 24V0Z" fill="#1E1E1E"/>
            </g>
            <defs>
              <clipPath id="clip0_444_18">
                <rect width="182" height="32" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="relative z-10 flex items-center justify-center gap-[6px]">
          <div className="h-[9px] w-[14px] shrink-0 overflow-hidden rounded-[2px] bg-[#161616]">
             {form.country && sampleFlags[form.country] ? (
               <span className={`fi fi-${sampleFlags[form.country].toLowerCase()} !block !h-full !w-full !bg-cover !bg-center !text-[0px]`} title={form.country} />
             ) : (
               <div className="h-full w-full rounded-[2px] bg-[#2a2a2a]" />
             )}
          </div>
          <p className="whitespace-nowrap text-[14px] font-[family-name:var(--font-inter)] font-normal leading-[14px] tracking-[-0.084px] text-white">
            {form.country || <span className="text-[#656565]">Your country</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClassicCard({ form, sampleFlags, visitedArray, isPreview }: CardProps) {
  return (
    <div className="flex h-[600px] w-[360px] flex-col items-center gap-[20px] rounded-[24px] border border-[#252525] bg-black px-[8px] pb-[24px] pt-[8px]">
      {/* Profile section */}
      <div className="flex w-full shrink-0 flex-col items-center">
        {/* Background image: 344x226, negative margin to allow avatar overlap */}
        <div className="relative z-0 -mb-[36px] flex h-[226px] w-[344px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#161616]">
          {form.coverImage ? (
            <LoadedImage priority src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholderIcon />
          )}
          {isPreview && <PreviewWatermark />}
          {!isPreview && <LogoWatermark />}
        </div>

        {/* Photo Avatar */}
        <div className="relative z-10 h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[16px] border-[4px] border-black bg-[#161616]">
          {form.profileImage ? (
            <LoadedImage priority src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white-600">
              <div className="relative w-[60px] h-[60px]">
                <AvatarPlaceholderIcon className="w-full h-full object-cover" />
                <div className="absolute left-[39px] w-[16px] h-[16px] top-[41px] pointer-events-none z-0">
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
      <div className="flex w-full shrink-0 flex-col items-center gap-[20px] px-[12px]">
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
        <div className="flex w-full shrink-0 flex-wrap items-start justify-center gap-[4px] px-[6px]">
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
            Array.from({ length: 9 }).map((_, i) => (
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
        <div className="mt-auto flex w-full shrink-0 items-center justify-center">
          <a href="/edit/explorercard" className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.084px] text-[#7c7c7c] hover:text-white transition-colors underline decoration-wavy underline-offset-2">
            Join me on Travingat
          </a>
        </div>
      </div>
    </div>
  );
}

export function MinimalCard({ form, sampleFlags, visitedArray, isPreview }: CardProps) {
  return (
    <div
      id="minimal-card"
      className="flex h-[600px] w-[360px] shrink-0 flex-col items-center gap-[20px] rounded-[24px] border border-[#252525] bg-black px-[8px] pb-[24px] pt-0"
    >
      {/* Country badge at top */}
      <MinimalCountryNotch form={form} sampleFlags={sampleFlags} wrapperClassName="w-full shrink-0 relative" />

      {/* Main content container */}
      <div className="flex w-full shrink-0 flex-col items-center gap-[8px]">
        {/* Profile Container: side-by-side */}
        <div className="grid grid-cols-2 w-full h-[224px] shrink-0 gap-[8px]">
          {/* Profile image (acts like cover image here) */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#1a1a1a]">
            {form.coverImage ? (
              <LoadedImage priority src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
            ) : (
              <ImagePlaceholderIcon />
            )}
            {isPreview && <PreviewWatermark />}
            {!isPreview && <LogoWatermark />}
          </div>
          
          {/* Profile info */}
          <div className="flex h-full w-full flex-col items-start justify-end gap-[12px] rounded-[16px] bg-[#111111] p-[16px]">
            <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[10px] bg-[#2a2a2a]">
              {form.profileImage ? (
                <LoadedImage priority src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
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

           <div className="flex w-full shrink-0 flex-wrap items-start gap-[4px]">
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
                Array.from({ length: 8 }).map((_, i) => (
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

export function AdventureCard({ form, sampleFlags, visitedArray, isPreview }: CardProps) {
  return (
    <div
      id="adventure-card"
      className="flex h-[600px] w-[360px] shrink-0 flex-col items-center gap-[20px] rounded-[24px] border border-[#252525] bg-black px-[8px] pb-[24px] pt-[8px]"
    >
      {/* Main Image Container */}
      <div 
        className="relative flex w-full h-[528px] shrink-0 flex-col items-center justify-end overflow-hidden rounded-[16px] bg-[#161616] isolate"
      >
        
        {/* Notch Overlay */}
        <CountryNotch form={form} sampleFlags={sampleFlags} fill="#000000" wrapperClassName="absolute top-0 left-0 right-0 z-30 w-full shrink-0" />

        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          {form.coverImage ? (
            <LoadedImage priority src={toLandingAssetUrl(form.coverImage)} alt="cover" containerClassName="h-full w-full" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute top-[127px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
               <span className="material-symbols-rounded text-[#E3E3E3] text-[40px]">add_photo_alternate</span>
            </div>
          )}
        </div>
        {isPreview && <PreviewWatermark />}
        {!isPreview && <LogoWatermark />}

        {/* Content at Bottom with Gradient & Blur */}
        <div className="relative z-20 mt-auto flex w-full flex-col items-center gap-[16px] pb-[32px] px-[8px]">
          
          {/* Blurred Background Layer with Progressive Gradient Mask */}
          <div 
            className="absolute -inset-x-4 -bottom-4 -top-[48px] z-0 backdrop-blur-[16px] pointer-events-none" 
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 48px, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 48px, black 100%)'
            }}
          />

          {/* Profile Picture */}
          <div className="relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-[3px] border-white bg-[#2a2a2a] shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
            {form.profileImage ? (
              <LoadedImage priority src={toLandingAssetUrl(form.profileImage)} alt="profile" containerClassName="h-full w-full" className="h-full w-full object-cover" />
            ) : (
              <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                <AvatarPlaceholderIcon className="h-full w-full object-cover" />
                <div className="absolute left-[20.7px] top-[21.8px] z-0 h-[8.7px] w-[8.7px] pointer-events-none">
                  <div className="absolute inset-[0_-16.67%_-33.33%_-16.67%]">
                    <img alt="" className="block h-full w-full max-w-none" src="/icons/Add user button.png" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Container: Name & Countries Explored */}
          <div className="relative z-10 flex w-full flex-col items-center gap-[24px]">
            <div className="relative z-10 flex w-full flex-col items-center gap-[4px]">
              <h3 className="w-full break-words px-2 text-center text-[28px] font-bold font-[family-name:var(--font-inter-display)] leading-[36px] tracking-[-0.5px] text-white">
                {form.fullName || "Your full name"}
              </h3>

              <p className="whitespace-nowrap text-center text-[16px] font-[family-name:var(--font-inter)] font-medium leading-[24px] tracking-[-0.096px] text-white">
                {visitedArray.length} Countries explored
              </p>
            </div>

            {/* Flags */}
            <div className="relative z-10 flex w-full shrink-0 flex-wrap items-start justify-center gap-[4px] px-[6px]">
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
      </div>

      {/* Call to Action Container */}
      <div className="mt-auto flex w-full shrink-0 items-center justify-center">
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

export function PreviewWatermark() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [tampered, setTampered] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkTamper = () => {
      if (!el || !document.body.contains(el)) {
        setTampered(true);
        return;
      }
      const styles = window.getComputedStyle(el);
      if (
        styles.display === "none" ||
        styles.opacity === "0" ||
        styles.visibility === "hidden"
      ) {
        setTampered(true);
      }
      
      const span = el.querySelector('span');
      if (span) {
        const spanStyles = window.getComputedStyle(span);
        if (
          spanStyles.display === "none" ||
          spanStyles.opacity === "0" ||
          spanStyles.visibility === "hidden" ||
          spanStyles.color === "rgba(0, 0, 0, 0)" ||
          spanStyles.color === "transparent" ||
          spanStyles.fontSize === "0px"
        ) {
          setTampered(true);
        }
      }
    };

    const observer = new MutationObserver(() => checkTamper());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    const interval = setInterval(checkTamper, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  if (tampered) {
    return (
      <div className="absolute inset-0 z-[999999] bg-black flex items-center justify-center p-4 text-center rounded-[16px]">
        <span className="text-white text-lg font-bold">Preview watermark removed. Please reload.</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-[99] flex items-center justify-center pointer-events-none select-none mix-blend-plus-lighter"
    >
      <span style={{
        color: 'rgba(255, 255, 255, 0.50)',
        fontFamily: 'var(--font-inter-display, "Inter Display")',
        fontSize: 'var(--Heading-H4-Bold-Size, 32px)',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'var(--Heading-H4-Bold-Line-Height, 40px)',
        letterSpacing: '-0.5px'
      }}>
        PREVIEW
      </span>
    </div>
  );
}
