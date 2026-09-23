"use client";
import { MediaResolver } from "@/lib/media-resolver";

import { useState, useRef, useEffect, type SyntheticEvent } from "react";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { ThumbnailImage } from "@/components/ThumbnailImage";
import LoadedImage from "@/components/ui/LoadedImage";
import { useImagePreloader } from "@/hooks/useImagePreloader";

export type LightboxItem = {
  id?: string;
  url: string;
  isVideo: boolean;
  width?: number;
  height?: number;
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
  const [mediaError, setMediaError] = useState(false);
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number | null>(null);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);

  if (activeIndex !== prevActiveIndex) {
    setPrevActiveIndex(activeIndex);
    setMediaLoaded(false);
    setMediaError(false);
    setFallbackLevel(0);
    setNaturalAspectRatio(
      items[activeIndex]?.width && items[activeIndex]?.height
        ? items[activeIndex]!.width! / items[activeIndex]!.height!
        : null
    );
  }

  const activeItemUrl = items[activeIndex]?.url;

  const activeItem = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;

  // Preload 1 behind and 2 ahead to avoid blocking the browser's connection limit (max 6 concurrent)
  const urlsToPreload = [];
  const preloadIndices = [activeIndex - 1, activeIndex, activeIndex + 1, activeIndex + 2];

  for (const i of preloadIndices) {
    if (i >= 0 && i < totalCount && items[i] && !items[i].isVideo) {
      const originalUrl = MediaResolver.getBase(items[i].url);
      const optimizedUrl = MediaResolver.getOptimized(originalUrl);
      urlsToPreload.push(optimizedUrl);
    }
  }
  useImagePreloader(urlsToPreload);

  useEffect(() => {
    if (scrollContainerRef.current && !showBrowser) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        const containerWidth = container.clientWidth;
        if (containerWidth === 0) return;
        const itemWidth = 60; // w-[3.75rem]
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

  let currentImgSrc = "";
  if (activeItem && !activeItem.isVideo) {
    let base = MediaResolver.getBase(activeItem.url || "");
    if (fallbackLevel === 0) {
      currentImgSrc = MediaResolver.getOptimized(base);
    } else if (fallbackLevel === 1) {
      currentImgSrc = MediaResolver.getThumbnail(base, 720);
    } else {
      currentImgSrc = base;
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-black"
      onClick={onClose}
    >
      {/* Left image panel */}
      <div
        className="relative flex flex-1 flex-col min-w-0 min-h-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Top bar: image counter + grid toggle */}
        <div className="flex items-center justify-between px-10 py-6">
          <span className="text-[0.875rem] font-normal tracking-[-0.084px] text-[#989898]">{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => setShowBrowser((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center text-[#989898] transition hover:text-white"
            aria-label="Toggle photo browser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <mask id="mask0_10615_9855" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_10615_9855)">
                <path d="M13 9V3H21V9H13ZM3 13V3H11V13H3ZM13 21V11H21V21H13ZM3 21V15H11V21H3ZM5 11H9V5H5V11ZM15 19H19V13H15V19ZM15 7H19V5H15V7ZM5 19H9V17H5V19Z" fill="currentColor" />
              </g>
            </svg>
          </button>
        </div>

        <div className={`flex-1 min-h-0 overflow-y-auto px-10 pb-8 ${showBrowser ? '' : 'hidden'}`}>
          <div className="columns-2 md:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
            {items.map((item, idx) => (
              <button
                key={item.id || `item-${idx}`}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  setShowBrowser(false);
                }}
                className="mb-6 w-full break-inside-avoid overflow-hidden rounded-[1.375rem] bg-[#0a0a0a] text-left"
                aria-label={`Open photo ${idx + 1}`}
              >
                <div className="relative">
                  {item.isVideo ? (
                    <>
                      <video className="h-auto w-full">
                        <source src={MediaResolver.getOptimized(MediaResolver.getBase(item.url))} type="video/webm" />
                        <source src={MediaResolver.getOptimized(MediaResolver.getBase(item.url))} type="video/mp4" />
                      </video>
                      <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <LoadedImage
                      originalSrc={MediaResolver.getBase(item.url)} src={MediaResolver.getOptimized(MediaResolver.getBase(item.url))}
                      thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(item.url), 720)}
                      alt={`Gallery thumbnail ${idx + 1}`}
                      className="h-auto w-full"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Image + nav arrows */}
        <div className={`relative flex-1 min-h-0 mb-[2.25rem] overflow-hidden ${!showBrowser ? '' : 'hidden'}`}>
          {/* Main image */}
          <div className="absolute inset-0 flex items-center justify-center px-10">
            {/* Loading Skeleton */}
            {!mediaLoaded && (
              <div className="absolute inset-x-10 inset-y-0 z-10 flex items-center justify-center rounded-[0.75rem] bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50 animate-pulse z-20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.9973 21.0011C23.5339 18.4645 27.6719 18.4899 30.2399 21.0579L53.2668 44.0848C55.8347 46.6527 55.8601 50.7908 53.3235 53.3274C50.7869 55.864 46.6489 55.8386 44.0809 53.2706L21.054 30.2437C18.4861 27.6758 18.4607 23.5377 20.9973 21.0011ZM27.0272 30.093L30.391 30.3376L30.146 26.9742L26.7826 26.7292L27.0272 30.093ZM23.0197 27.8352C22.5366 28.3184 22.5414 29.1066 23.0305 29.5957C23.5197 30.0848 24.3079 30.0897 24.791 29.6065C25.2742 29.1233 25.2693 28.3351 24.7802 27.846C24.2911 27.3569 23.5029 27.352 23.0197 27.8352ZM27.8313 23.0236C27.3482 23.5067 27.353 24.2949 27.8422 24.7841C28.3313 25.2732 29.1195 25.278 29.6026 24.7949C30.0858 24.3117 30.081 23.5235 29.5918 23.0344C29.1027 22.5453 28.3145 22.5404 27.8313 23.0236Z" fill="white" />
                  <path d="M8.4121 49.9708C6.82242 48.3812 6.80669 45.8195 8.37696 44.2493L18.3529 34.2733C19.4868 33.1394 21.3366 33.1508 22.4845 34.2987L26.1627 37.9769L14.1337 50.006C12.5634 51.5763 10.0018 51.5605 8.4121 49.9708Z" fill="white" />
                  <path d="M15.6809 51.1157L25.3041 41.4925C26.512 40.2846 28.4825 40.2967 29.7053 41.5195L36.7905 48.6047L34.166 51.2293C29.0928 56.3024 20.8168 56.2516 15.6809 51.1157Z" fill="white" />
                  <path d="M51.1119 15.6847L41.4887 25.308C40.2808 26.5159 40.2929 28.4864 41.5157 29.7092L48.6009 36.7944L51.2254 34.1699C56.2986 29.0967 56.2478 20.8206 51.1119 15.6847Z" fill="white" />
                  <path d="M49.967 8.41595C48.3773 6.82627 45.8157 6.81054 44.2454 8.38082L34.2695 18.3567C33.1356 19.4907 33.1469 21.3404 34.2948 22.4884L37.9731 26.1666L50.0021 14.1375C51.5724 12.5673 51.5567 10.0056 49.967 8.41595Z" fill="white" />
                </svg>
              </div>
            )}

            <div
              className="relative group mx-auto my-auto"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                aspectRatio: naturalAspectRatio ? `${naturalAspectRatio}` : 'auto',
                height: naturalAspectRatio ? '100%' : 'auto',
                width: naturalAspectRatio ? 'auto' : 'fit-content'
              }}
            >
              {/* Hover Buttons */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    showComingSoonToast("featureLaunch");
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-colors hover:bg-black/60 transform-gpu"
                  aria-label="Share"
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[0.125rem] -translate-y-[0.125rem]">
                    <path d="M4.66667 10V6C4.66667 5.63333 4.79722 5.31944 5.05833 5.05833C5.31944 4.79722 5.63333 4.66667 6 4.66667H11.4333L9.71667 2.95L10.6667 2L14 5.33333L10.6667 8.66667L9.71667 7.73333L11.4333 6H6V10H4.66667ZM3.33333 14C2.96667 14 2.65278 13.8694 2.39167 13.6083C2.13056 13.3472 2 13.0333 2 12.6667V2.66667H3.33333V12.6667H11.3333V10H12.6667V12.6667C12.6667 13.0333 12.5361 13.3472 12.275 13.6083C12.0139 13.8694 11.7 14 11.3333 14H3.33333Z" fill="white" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => showComingSoonToast("featureLaunch")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-colors hover:bg-black/60 transform-gpu"
                  aria-label="Like"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[0.0625rem]">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => showComingSoonToast("featureLaunch")}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-colors hover:bg-black/60 transform-gpu"
                  aria-label="More options"
                >
                  <span className="flex items-center gap-1">
                    <span className="block h-1 w-1 rounded-full bg-white" />
                    <span className="block h-1 w-1 rounded-full bg-white" />
                    <span className="block h-1 w-1 rounded-full bg-white" />
                  </span>
                </button>
              </div>
              {activeItem?.isVideo ? (
                <video
                  key={`video-${activeIndex}`}
                  controls
                  autoPlay
                  onLoadedData={(e: SyntheticEvent<HTMLVideoElement>) => {
                    setMediaLoaded(true);
                    setNaturalAspectRatio(e.currentTarget.videoWidth / e.currentTarget.videoHeight);
                  }}
                  className={`block w-full h-full object-contain carousel-image rounded-[0.75rem] mx-auto transition-opacity duration-300 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                  <source src={MediaResolver.getOptimized(MediaResolver.getBase(activeItem.url))} type="video/webm" />
                  <source src={MediaResolver.getOptimized(MediaResolver.getBase(activeItem.url))} type="video/mp4" />
                </video>
              ) : (
                <img
                  key={currentImgSrc}
                  src={currentImgSrc}
                  alt="Carousel media"
                  className={`block w-full h-full object-contain carousel-image rounded-[0.75rem] mx-auto transition-opacity duration-300 ${mediaLoaded && !mediaError ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
                    setMediaLoaded(true);
                    setNaturalAspectRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight);
                  }}
                  onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    if (fallbackLevel < 2) {
                      setFallbackLevel((prev) => prev + 1);
                    } else {
                      setMediaError(true);
                      setMediaLoaded(true); // Fallback failed too, stop skeleton
                    }
                  }}
                />
              )}

              {/* Fallback Error State */}
              {mediaError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[0.75rem] bg-[#0a0a0a]">
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.9973 21.0011C23.5339 18.4645 27.6719 18.4899 30.2399 21.0579L53.2668 44.0848C55.8347 46.6527 55.8601 50.7908 53.3235 53.3274C50.7869 55.864 46.6489 55.8386 44.0809 53.2706L21.054 30.2437C18.4861 27.6758 18.4607 23.5377 20.9973 21.0011ZM27.0272 30.093L30.391 30.3376L30.146 26.9742L26.7826 26.7292L27.0272 30.093ZM23.0197 27.8352C22.5366 28.3184 22.5414 29.1066 23.0305 29.5957C23.5197 30.0848 24.3079 30.0897 24.791 29.6065C25.2742 29.1233 25.2693 28.3351 24.7802 27.846C24.2911 27.3569 23.5029 27.352 23.0197 27.8352ZM27.8313 23.0236C27.3482 23.5067 27.353 24.2949 27.8422 24.7841C28.3313 25.2732 29.1195 25.278 29.6026 24.7949C30.0858 24.3117 30.081 23.5235 29.5918 23.0344C29.1027 22.5453 28.3145 22.5404 27.8313 23.0236Z" fill="white" />
                    <path d="M8.4121 49.9708C6.82242 48.3812 6.80669 45.8195 8.37696 44.2493L18.3529 34.2733C19.4868 33.1394 21.3366 33.1508 22.4845 34.2987L26.1627 37.9769L14.1337 50.006C12.5634 51.5763 10.0018 51.5605 8.4121 49.9708Z" fill="white" />
                    <path d="M15.6809 51.1157L25.3041 41.4925C26.512 40.2846 28.4825 40.2967 29.7053 41.5195L36.7905 48.6047L34.166 51.2293C29.0928 56.3024 20.8168 56.2516 15.6809 51.1157Z" fill="white" />
                    <path d="M51.1119 15.6847L41.4887 25.308C40.2808 26.5159 40.2929 28.4864 41.5157 29.7092L48.6009 36.7944L51.2254 34.1699C56.2986 29.0967 56.2478 20.8206 51.1119 15.6847Z" fill="white" />
                    <path d="M49.967 8.41595C48.3773 6.82627 45.8157 6.81054 44.2454 8.38082L34.2695 18.3567C33.1356 19.4907 33.1469 21.3404 34.2948 22.4884L37.9731 26.1666L50.0021 14.1375C51.5724 12.5673 51.5567 10.0056 49.967 8.41595Z" fill="white" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Prev arrow — left edge aligned with counter */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 transform-gpu"
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-[0.125rem]">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Next arrow — right edge matching right column margin */}
          <button
            type="button"
            onClick={onNext}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 transform-gpu"
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-[0.125rem]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Carousel preview strip */}
        <div
          ref={scrollContainerRef}
          className={`flex-none w-full overflow-x-auto px-10 pb-[3rem] ${!showBrowser ? '' : 'hidden'}`}
        >
          <div className={`relative flex items-center gap-3 pt-[0.75rem] w-max ${items.length <= 10 ? "mx-auto" : ""}`}>
            {/* Floating sliding indicator bar */}
            <div
              className="absolute top-0 left-0 h-[0.1875rem] w-[3.75rem] bg-white rounded-full transition-transform duration-300 ease-out z-10"
              style={{
                transform: `translate3d(calc(${activeIndex} * 72px), 0, 0)`,
              }}
            />
            {items.map((item, idx) => (
              <button
                key={item.id || `thumb-${idx}`}
                onClick={() => onSelectIndex(idx)}
                className={`relative h-[3.75rem] w-[3.75rem] shrink-0 rounded-[0.625rem] overflow-hidden transition group ${idx === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                aria-label={`View photo ${idx + 1}`}
              >
                {item.isVideo ? (
                  <>
                    <video
                      data-original-src={MediaResolver.getBase(item.url)} src={MediaResolver.getOptimized(MediaResolver.getBase(item.url))}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="material-symbols-rounded text-white text-[1.25rem]">play_circle</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ThumbnailImage originalSrc={MediaResolver.getBase(item.url)} size={720}
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
      </div>

      {sidebarContent}
    </div>
  );
}
