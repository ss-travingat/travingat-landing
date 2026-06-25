"use client";

import { useEffect } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { useWaitlistForm } from "@/lib/use-waitlist-form";

interface WaitlistPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
  loadingLabel?: string;
  showAvatarStrip?: boolean;
  showMapBackground?: boolean;
  closeOnSuccess?: boolean;
  onSuccess?: () => void;
}

export function WaitlistPopup({
  open,
  onClose,
  title = "Join travelers from around the world.",
  subtitle = "Be first to build and share your travel profile.",
  inputPlaceholder = "Enter your email",
  submitLabel = "Get early access",
  loadingLabel = "Joining...",
  showAvatarStrip = true,
  showMapBackground = true,
  closeOnSuccess = false,
  onSuccess,
}: WaitlistPopupProps) {
  const { email, setEmail, status, message, submit } = useWaitlistForm();
  const isLoading = status === "loading";
  const waitlistAvatars = [
    "/images/join-avatar1-figma.png",
    "/images/join-avatar2-figma.png",
    "/images/join-avatar3-figma.png",
    "/images/join-avatar4-figma.png",
  ] as const;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || status !== "success") return;
    onSuccess?.();
    if (closeOnSuccess) {
      onClose();
    }
  }, [closeOnSuccess, onClose, onSuccess, open, status]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1280px] overflow-hidden rounded-[36px] border border-[#1d1d1d] bg-black px-6 py-10 shadow-[0_8px_40px_rgba(0,0,0,0.7)] md:px-12 md:py-14"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {showMapBackground ? (
          <div className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-[300px] w-full max-w-[1180px] md:h-[420px]">
            <img
              src={toLandingAssetUrl("/images/dotted-world-map.svg")}
              alt=""
              className="h-full w-full object-contain opacity-35"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] text-[#b8b8b8] transition hover:text-white"
          aria-label="Close"
        >
          <span className="material-symbols-rounded text-[20px]">close</span>
        </button>

        <div className="relative z-10 mx-auto flex max-w-[1060px] flex-col items-center text-center">
          {showAvatarStrip ? (
            <div className="mb-8 flex items-center justify-center pr-[19px]">
              {waitlistAvatars.map((src, index) => {
                const rotations = [
                  "rotate-[4.28deg]",
                  "rotate-[-17.79deg]",
                  "rotate-[4.76deg]",
                  "rotate-[-10.12deg]",
                ];
                return (
                  <div key={src} className="mr-[-19px] flex h-[92px] w-[92px] items-center justify-center">
                    <div className={rotations[index]}>
                      <div className="h-[84px] w-[84px] overflow-hidden rounded-2xl border-[4.8px] border-black">
                        <img src={toLandingAssetUrl(src)} alt="Traveler" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <h3 className="ds-font-display text-[40px] font-semibold leading-[1.05] tracking-[-1px] text-white md:text-[64px]">
            {title}
          </h3>
          <p className="mt-5 text-[20px] leading-7 text-[#8f8f8f]">
            {subtitle}
          </p>

          {message ? (
            <p className={`mt-4 text-sm ${status === "success" || status === "duplicate" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          ) : null}

          <form
            onSubmit={submit}
            className="mt-8 flex h-15 w-full max-w-[640px] items-center justify-between overflow-hidden rounded-full border border-white-900 bg-black pl-6 pr-1"
          >
            <input
              type="email"
              placeholder={inputPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent text-[20px] font-medium leading-7 tracking-[-0.5px] text-white placeholder:text-white-800 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="ds-font-display h-13 shrink-0 rounded-full bg-white px-8 text-[20px] font-medium leading-7 tracking-[-0.5px] text-black transition hover:bg-white-100 disabled:opacity-50"
            >
              {isLoading ? loadingLabel : submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
