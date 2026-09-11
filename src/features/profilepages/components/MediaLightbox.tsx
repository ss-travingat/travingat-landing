"use client";

import { useState, useRef, useEffect } from "react";
import { toLandingAssetUrl, getOptimizedMediaUrl } from "@/lib/landing-assets";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { ThumbnailImage, getThumbnailUrl } from "@/components/ThumbnailImage";
import LoadedImage from "@/components/ui/LoadedImage";

export type LightboxItem = {
  id?: string;
  url: string;
  isVideo: boolean;
};

export type MediaLightboxProps = {
  items: LightboxItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  onShareClick?: () => void;
  sidebarContent: React.ReactNode;
};

export function MediaLightbox({
  items,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
  onShareClick,
  sidebarContent,
}: MediaLightboxProps) {
  const { showComingSoonToast } = useMobileComingSoon();
  const [showBrowser, setShowBrowser] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMediaLoaded(false);
    setImageError(false);
  }, [activeIndex]);

  const activeItem = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;

  useEffect(() => {
    if (scrollContainerRef.current && !showBrowser) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        const containerWidth = container.clientWidth;
        if (containerWidth === 0) return;
        const itemWidth = 60; // w-[60px]
        const gap = 12; // gap-3
        const paddingLeft = 40; // px-10
        const targetCenter = paddingLeft + (activeIndex * (itemWidth + gap)) + (itemWidth / 2);
        const targetScrollLeft = targetCenter - (containerWidth / 2);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [activeIndex, showBrowser]);

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-black"
      onClick={onClose}
    >
      {/* Left image panel */}
      <div
        className="relative flex flex-1 flex-col min-w-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Top bar: image counter + grid toggle */}
        <div className="flex items-center justify-between px-10 py-6">
          <span className="text-[14px] font-normal tracking-[-0.084px] text-[#989898]">{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => setShowBrowser((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center text-[#989898] transition hover:text-white"
            aria-label="Toggle photo browser"
          >
            <span className="material-symbols-rounded text-[22px]">dashboard</span>
          </button>
        </div>

        {showBrowser ? (
          <div className="flex-1 min-h-0 overflow-y-auto px-10 pb-8">
            <div className="columns-2 md:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {items.map((item, idx) => (
                <button
                  key={item.id || `item-${idx}`}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    setShowBrowser(false);
                  }}
                  className="mb-6 w-full break-inside-avoid overflow-hidden rounded-[22px] bg-[#0a0a0a] text-left"
                  aria-label={`Open photo ${idx + 1}`}
                >
                  <div className="relative">
                    {item.isVideo ? (
                      <>
                        <video className="h-auto w-full">
                          <source src={getOptimizedMediaUrl(toLandingAssetUrl(item.url))} type="video/webm" />
                          <source src={toLandingAssetUrl(item.url)} type="video/mp4" />
                        </video>
                        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55">
                          <span className="material-symbols-rounded text-[18px] text-white">play_arrow</span>
                        </div>
                      </>
                    ) : (
                      <LoadedImage 
                        src={toLandingAssetUrl(item.url)} 
                        thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(item.url), 720)}
                        alt={`Gallery thumbnail ${idx + 1}`}
                        className="h-auto w-full"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Image + nav arrows */}
            <div className="relative flex flex-1 min-h-0 pb-8">
              {/* Main image */}
              <div className="relative flex flex-1 items-center justify-center px-10 min-h-0">
                <div className="relative group inline-block h-full max-w-full text-center">
                  {/* Hover Buttons */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => showComingSoonToast("featureLaunch")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Like"
                    >
                      <span className="material-symbols-rounded text-[20px]">favorite_border</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        showComingSoonToast("featureLaunch");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Share"
                    >
                      <span className="material-symbols-rounded text-[20px] -mt-[2px]">ios_share</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showComingSoonToast("featureLaunch")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="More options"
                    >
                      <span className="flex items-center gap-1">
                        <span className="block h-1 w-1 rounded-full bg-white" />
                        <span className="block h-1 w-1 rounded-full bg-white" />
                        <span className="block h-1 w-1 rounded-full bg-white" />
                      </span>
                    </button>
                  </div>

                  {/* Loading Skeleton */}
                  {!mediaLoaded && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[12px] bg-[#141414] animate-pulse">
                      <img src="/icons/travingat-logo.svg" alt="Loading..." className="h-6 opacity-30" />
                    </div>
                  )}

                  {activeItem?.isVideo ? (
                    <video
                      key={`video-${activeIndex}`}
                      controls
                      autoPlay
                      onLoadedData={() => setMediaLoaded(true)}
                      className={`block h-full w-full object-contain carousel-image rounded-[12px] mx-auto transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <source src={getOptimizedMediaUrl(toLandingAssetUrl(activeItem.url))} type="video/webm" />
                      <source src={toLandingAssetUrl(activeItem.url)} type="video/mp4" />
                    </video>
                  ) : !imageError ? (
                    <img
                      key={`img-${activeIndex}`}
                      src={getOptimizedMediaUrl(toLandingAssetUrl(activeItem?.url))}
                      alt="Carousel media"
                      className={`block h-full w-full object-contain carousel-image rounded-[12px] mx-auto transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setMediaLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const originalUrl = toLandingAssetUrl(activeItem?.url || "");
                        if (target.src !== originalUrl) {
                          target.src = originalUrl;
                        } else {
                          setMediaLoaded(true); // Fallback failed too, stop skeleton
                          setImageError(true);
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 z-20 bg-[#151515] flex items-center justify-center rounded-[12px]">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.9973 21.0011C23.5339 18.4645 27.6719 18.4899 30.2399 21.0579L53.2668 44.0848C55.8347 46.6527 55.8601 50.7908 53.3235 53.3274C50.7869 55.864 46.6489 55.8386 44.0809 53.2706L21.054 30.2437C18.4861 27.6758 18.4607 23.5377 20.9973 21.0011ZM27.0272 30.093L30.391 30.3376L30.146 26.9742L26.7826 26.7292L27.0272 30.093ZM23.0197 27.8352C22.5366 28.3184 22.5414 29.1066 23.0305 29.5957C23.5197 30.0848 24.3079 30.0897 24.791 29.6065C25.2742 29.1233 25.2693 28.3351 24.7802 27.846C24.2911 27.3569 23.5029 27.352 23.0197 27.8352ZM27.8313 23.0236C27.3482 23.5067 27.353 24.2949 27.8422 24.7841C28.3313 25.2732 29.1195 25.278 29.6026 24.7949C30.0858 24.3117 30.081 23.5235 29.5918 23.0344C29.1027 22.5453 28.3145 22.5404 27.8313 23.0236Z" fill="#212121"/>
                        <path d="M8.4121 49.9708C6.82242 48.3812 6.80669 45.8195 8.37696 44.2493L18.3529 34.2733C19.4868 33.1394 21.3366 33.1508 22.4845 34.2987L26.1627 37.9769L14.1337 50.006C12.5634 51.5763 10.0018 51.5605 8.4121 49.9708Z" fill="#212121"/>
                        <path d="M15.6809 51.1157L25.3041 41.4925C26.512 40.2846 28.4825 40.2967 29.7053 41.5195L36.7905 48.6047L34.166 51.2293C29.0928 56.3024 20.8168 56.2516 15.6809 51.1157Z" fill="#212121"/>
                        <path d="M51.1119 15.6847L41.4887 25.308C40.2808 26.5159 40.2929 28.4864 41.5157 29.7092L48.6009 36.7944L51.2254 34.1699C56.2986 29.0967 56.2478 20.8206 51.1119 15.6847Z" fill="#212121"/>
                        <path d="M49.967 8.41595C48.3773 6.82627 45.8157 6.81054 44.2454 8.38082L34.2695 18.3567C33.1356 19.4907 33.1469 21.3404 34.2948 22.4884L37.9731 26.1666L50.0021 14.1375C51.5724 12.5673 51.5567 10.0056 49.967 8.41595Z" fill="#212121"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Prev arrow — left edge aligned with counter */}
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Previous photo"
              >
                <span className="material-symbols-rounded text-[24px]">chevron_left</span>
              </button>

              {/* Next arrow — right edge matching right column margin */}
              <button
                type="button"
                onClick={onNext}
                className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Next photo"
              >
                <span className="material-symbols-rounded text-[24px]">chevron_right</span>
              </button>
            </div>

            {/* Carousel preview strip */}
            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-auto px-10 pb-6 pt-2"
            >
              <div className={`relative flex items-center gap-3 pt-3 w-max ${items.length <= 10 ? "mx-auto" : ""}`}>
                {/* Floating sliding indicator bar */}
                <div
                  className="absolute top-0 left-0 h-[3px] w-[60px] bg-white rounded-full transition-transform duration-300 ease-out z-10"
                  style={{
                    transform: `translate3d(calc(${activeIndex} * 72px), 0, 0)`,
                  }}
                />
                {items.map((item, idx) => (
                  <button
                    key={item.id || `thumb-${idx}`}
                    onClick={() => onSelectIndex(idx)}
                    className={`relative h-[60px] w-[60px] shrink-0 rounded-[10px] overflow-hidden transition group ${idx === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-100"
                      }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    {item.isVideo ? (
                      <>
                        <video
                          src={getOptimizedMediaUrl(toLandingAssetUrl(item.url))}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="material-symbols-rounded text-white text-[20px]">play_circle</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ThumbnailImage originalSrc={toLandingAssetUrl(item.url)} size={320}
                          alt={`Carousel thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {sidebarContent}
    </div>
  );
}
