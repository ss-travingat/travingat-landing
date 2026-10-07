"use client";
import { Blurhash } from "react-blurhash";

import { useState, useEffect, useRef } from "react";
import { MediaResolver } from "@/lib/media-resolver";

export default function LoadedImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  skeletonClassName = "absolute inset-0",
  priority = false,
  blurhash,
  thumbnailSrc,

  originalSrc,
  onClick,
  onLoad,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  priority?: boolean;
  blurhash?: string;
  thumbnailSrc?: string;

  originalSrc?: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
  style?: React.CSSProperties;
}) {
  // --- Phase tracking ---
  // "skeleton" → "blurPreview" → "loaded" → done
  // "error" is a terminal state
  const [phase, setPhase] = useState<"skeleton" | "blurPreview" | "loaded" | "error">(src ? "skeleton" : "error");
  const [retryCount, setRetryCount] = useState(0);
  const [healState, setHealState] = useState<"none" | "optimized" | "original">("none");
  const hasTriggeredHealRef = useRef(false);
  const [blurPreviewFailed, setBlurPreviewFailed] = useState(false);

  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setPhase(src ? "skeleton" : "error");
    setRetryCount(0);
    setHealState("none");
    setBlurPreviewFailed(false);
    hasTriggeredHealRef.current = false;
  }
  const maxRetries = 2;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxLoadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // The main image we are trying to load
  let activeSrc = src;

  // Try optimized fallback first, then original source if neither works
  if (healState === "optimized") {
    activeSrc = originalSrc ? MediaResolver.getOptimized(originalSrc) : MediaResolver.getOptimized(src);
  } else if (healState === "original") {
    activeSrc = originalSrc || src;
  }

  // Add a query param on retries to bypass broken browser cache for the failed image
  let currentSrc = retryCount > 0 && !activeSrc.startsWith("blob:") && !activeSrc.startsWith("data:")
    ? `${activeSrc}${activeSrc.includes("?") ? "&" : "?"}retry=${retryCount}`
    : activeSrc;

  // --- Blur preview URL ---
  // Use the thumbnailSrc as a blur preview since it loads fast.
  const blurPreviewSrc = (() => {
    if (src.startsWith("blob:") || src.startsWith("data:")) return "";
    // If thumbnailSrc is provided, use it as the blur preview while the main image loads
    if (thumbnailSrc && thumbnailSrc !== currentSrc) return thumbnailSrc;
    return "";
  })();

  const handleLoad = () => {
    if (maxLoadTimeoutRef.current) clearTimeout(maxLoadTimeoutRef.current);
    setPhase("loaded");

    // If we loaded successfully via fallback, tell the server to update the DB permanently
    if (healState !== "none" && !hasTriggeredHealRef.current) {
      hasTriggeredHealRef.current = true;
      // Only heal if we fell back to an optimized image format, not if we fell back to the original DB format while processing
      if (!originalSrc && healState === "optimized") {
        fetch("/api/heal-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalUrl: src,
            optimizedUrl: activeSrc
          })
        }).catch((e) => console.error("Failed to trigger image healing", e));
      }
    }

    onLoad?.();
  };

  const handleError = () => {
    if (!activeSrc.startsWith("blob:") && !activeSrc.startsWith("data:")) {
      if (healState === "none") {
        const optimizedTarget = originalSrc ? MediaResolver.getOptimized(originalSrc) : MediaResolver.getOptimized(src);
        if (optimizedTarget && optimizedTarget !== activeSrc) {
          console.warn(`[LoadedImage] Thumbnail failed. Falling back to optimized image: ${optimizedTarget}`);
          setHealState("optimized");
          setRetryCount(0);
          return;
        }
      }
    }

    if (retryCount < maxRetries) {
      const delay = retryCount === 0 ? 1000 : 2000;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, delay);
      return;
    }

    if (maxLoadTimeoutRef.current) clearTimeout(maxLoadTimeoutRef.current);
    setPhase("error");
  };

  useEffect(() => {
    // Force error state if image hangs for more than 5 minutes
    maxLoadTimeoutRef.current = setTimeout(() => {
      setPhase("error");
    }, 300000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxLoadTimeoutRef.current) clearTimeout(maxLoadTimeoutRef.current);
    };
  }, [src, thumbnailSrc]);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;

    // SVGs might have a naturalWidth of 0 depending on their viewbox/width attributes
    const isSvg = currentSrc.includes(".svg");

    const checkState = () => {
      if (node.complete) {
        if (node.naturalWidth > 0 || isSvg) {
          handleLoad();
          return true;
        }
        // If complete is true but naturalWidth is 0 (and not an SVG), it failed to decode or 404'd before hydration!
        handleError();
        return true;
      }
      return false;
    };

    if (checkState()) return;

    // Fallback polling for browsers that drop the load event on lazy images
    const interval = setInterval(() => {
      if (checkState()) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [currentSrc]);

  // Handle blur preview loaded
  const handleBlurPreviewLoad = () => {
    // Only transition to blurPreview if we haven't already fully loaded
    if (phase === "skeleton") {
      setPhase("blurPreview");
    }
  };

  const handleBlurPreviewError = () => {
    // Blur preview failed, that's fine — stay on skeleton until real image loads
    setBlurPreviewFailed(true);
  };

  return (
    <div className={`relative overflow-hidden [transform:translateZ(0)] ${containerClassName}`} style={style}>
      {/* Skeleton placeholder — kept behind the blur preview to prevent edge bleeding into transparent */}
      {(phase === "skeleton" || phase === "blurPreview") && (
        <div className={`absolute inset-0 z-0 pointer-events-none bg-[#1a1a1a] ${phase === "skeleton" ? "animate-pulse" : ""} rounded-[inherit] ${skeletonClassName.replace("absolute inset-0", "")}`} />
      )}

      {/* Blurred thumbnail preview — loads fast, shown blurred behind real image */}
      {blurPreviewSrc && phase !== "error" && !blurPreviewFailed && (
        <img
          key={blurPreviewSrc}
          src={blurPreviewSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover rounded-[inherit] z-[1] transition-opacity duration-500 ${phase === "loaded" ? "opacity-0" : "opacity-100"
            }`}
          style={{ filter: phase === "loaded" ? "blur(0px)" : "blur(10px)", transform: phase === "loaded" ? "scale(1)" : "scale(1.15)" }}
          {...(priority ? { fetchPriority: "high" as any, loading: "eager" } : { loading: "lazy" })}
          decoding="async"
          onLoad={handleBlurPreviewLoad}
          onError={handleBlurPreviewError}
        />
      )}

      {/* Real image — fades in and sharpens over the blur preview */}
      <img
        key={currentSrc}
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`relative z-10 transition-all duration-700 ease-out ${phase === "loaded" ? "opacity-100 blur-none scale-100" : "opacity-0 blur-sm scale-[1.02]"
          } ${className}`}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(priority ? { fetchPriority: "high" as any, loading: "eager" } : { loading: "lazy" })}
        decoding={priority ? "auto" : "async"}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Blurhash Placeholder (or Skeleton) */}
      {phase === "skeleton" && (
        <div className={`absolute inset-0 z-0 ${skeletonClassName}`}>
          {blurhash ? (
            <Blurhash
              hash={blurhash}
              width="100%"
              height="100%"
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          ) : (
            <div className="w-full h-full bg-[#1a1a1a] animate-pulse" />
          )}
        </div>
      )}

      {/* Fallback Error State — shown when all retries fail */}
      {phase === "error" && (
        <div className={`absolute inset-0 z-20 bg-[#151515] animate-pulse flex items-center justify-center rounded-[inherit] ${skeletonClassName}`}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.9973 21.0011C23.5339 18.4645 27.6719 18.4899 30.2399 21.0579L53.2668 44.0848C55.8347 46.6527 55.8601 50.7908 53.3235 53.3274C50.7869 55.864 46.6489 55.8386 44.0809 53.2706L21.054 30.2437C18.4861 27.6758 18.4607 23.5377 20.9973 21.0011ZM27.0272 30.093L30.391 30.3376L30.146 26.9742L26.7826 26.7292L27.0272 30.093ZM23.0197 27.8352C22.5366 28.3184 22.5414 29.1066 23.0305 29.5957C23.5197 30.0848 24.3079 30.0897 24.791 29.6065C25.2742 29.1233 25.2693 28.3351 24.7802 27.846C24.2911 27.3569 23.5029 27.352 23.0197 27.8352ZM27.8313 23.0236C27.3482 23.5067 27.353 24.2949 27.8422 24.7841C28.3313 25.2732 29.1195 25.278 29.6026 24.7949C30.0858 24.3117 30.081 23.5235 29.5918 23.0344C29.1027 22.5453 28.3145 22.5404 27.8313 23.0236Z" fill="#212121" />
            <path d="M8.4121 49.9708C6.82242 48.3812 6.80669 45.8195 8.37696 44.2493L18.3529 34.2733C19.4868 33.1394 21.3366 33.1508 22.4845 34.2987L26.1627 37.9769L14.1337 50.006C12.5634 51.5763 10.0018 51.5605 8.4121 49.9708Z" fill="#212121" />
            <path d="M15.6809 51.1157L25.3041 41.4925C26.512 40.2846 28.4825 40.2967 29.7053 41.5195L36.7905 48.6047L34.166 51.2293C29.0928 56.3024 20.8168 56.2516 15.6809 51.1157Z" fill="#212121" />
            <path d="M51.1119 15.6847L41.4887 25.308C40.2808 26.5159 40.2929 28.4864 41.5157 29.7092L48.6009 36.7944L51.2254 34.1699C56.2986 29.0967 56.2478 20.8206 51.1119 15.6847Z" fill="#212121" />
            <path d="M49.967 8.41595C48.3773 6.82627 45.8157 6.81054 44.2454 8.38082L34.2695 18.3567C33.1356 19.4907 33.1469 21.3404 34.2948 22.4884L37.9731 26.1666L50.0021 14.1375C51.5724 12.5673 51.5567 10.0056 49.967 8.41595Z" fill="#212121" />
          </svg>
        </div>
      )}
    </div>
  );
}
