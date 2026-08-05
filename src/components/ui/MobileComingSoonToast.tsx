"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";

export type ToastType = "desktopOnly" | "featureLaunch";

type MobileComingSoonContextType = {
  showComingSoonToast: (type?: ToastType) => void;
};

const MobileComingSoonContext = createContext<MobileComingSoonContextType>({
  showComingSoonToast: () => {},
});

export function MobileComingSoonProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeType, setActiveType] = useState<ToastType>("desktopOnly");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
  };

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  const closeToast = useCallback(() => {
    setIsVisible(false);
    unmountTimeoutRef.current = setTimeout(() => {
      setIsMounted(false);
    }, 500); // 500ms fade out
  }, []);

  const showComingSoonToast = useCallback((type: ToastType = "desktopOnly") => {
    clearTimeouts();
    setActiveType(type);
    setIsMounted(true);
    
    // Tiny delay to allow DOM to mount before triggering transition
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    // Auto hide after 5 seconds
    hideTimeoutRef.current = setTimeout(() => {
      closeToast();
    }, 5000);
  }, [closeToast]);

  return (
    <MobileComingSoonContext.Provider value={{ showComingSoonToast }}>
      {children}
      
      {isMounted && (
        <>
          {/* Dim overlay */}
          <div 
            className={`fixed inset-0 z-[90] bg-black/60 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeToast}
          />

          {/* Toast container */}
          <div className={`fixed ${activeType === "desktopOnly" ? "top-[78px] max-w-[344px]" : "top-[78px] md:top-[44px] max-w-[344px] md:max-w-[400px]"} left-1/2 -translate-x-1/2 z-[100] px-[16px] w-full pointer-events-none transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`bg-[#161616] pointer-events-auto border border-[#2a2a2a] border-solid drop-shadow-[20px_20px_10px_rgba(0,0,0,0.25)] flex items-center justify-center relative w-full ${activeType === "desktopOnly" ? "gap-[12px] pl-[12px] pr-[16px] py-[12px] rounded-[12px]" : "gap-[12px] md:gap-[16px] pl-[12px] pr-[16px] py-[12px] md:p-[16px] rounded-[12px] md:rounded-[20px]"}`}>
              {activeType === "desktopOnly" ? (
                <img src="/icons/laptop.png" alt="Desktop Only" className="size-[48px] shrink-0" />
              ) : (
                <img src="/icons/logo-3d.png" alt="Feature Launch" className="size-[48px] md:size-[64px] shrink-0" />
              )}
              
              <div className="flex flex-[1_0_0] flex-col items-start min-w-px relative pr-[16px]">
                <p className={`[word-break:break-word] font-[family-name:var(--font-inter-google)] font-normal relative shrink-0 text-white w-full ${activeType === "desktopOnly" ? "leading-[20px] text-[14px] tracking-[-0.084px]" : "leading-[20px] md:leading-[26px] text-[14px] md:text-[18px] tracking-[-0.084px] md:tracking-[-0.198px]"}`}>
                  {activeType === "desktopOnly" ? (
                    "This is available on desktop only for now. Coming to mobile at launch."
                  ) : (
                    <>
                      This feature will be available at launch.{" "}
                      <button 
                        type="button"
                        className={`text-[#1fbcfe] hover:text-[#60a5fa] transition-colors bg-transparent border-none p-0 cursor-pointer font-normal ${activeType === "desktopOnly" ? "text-[14px]" : "text-[14px] md:text-[18px]"}`} 
                        onClick={() => {
                          closeToast();
                          setTimeout(() => setIsWaitlistOpen(true), 150); // slight delay to feel smoother
                        }}
                      >
                        Join waitlist.
                      </button>
                    </>
                  )}
                </p>
              </div>
              <button 
                className={`absolute text-white/40 hover:text-white transition-colors flex items-center justify-center ${activeType === "desktopOnly" ? "right-[7px] top-[7px] size-[20px]" : "right-[7px] md:right-[11px] top-[7px] md:top-[11px] size-[20px] md:size-[24px]"}`}
                onClick={closeToast}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33333 15.8333L4.16667 14.6667L8.83333 10L4.16667 5.33333L5.33333 4.16667L10 8.83333L14.6667 4.16667L15.8333 5.33333L11.1667 10L15.8333 14.6667L14.6667 15.8333L10 11.1667L5.33333 15.8333Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </MobileComingSoonContext.Provider>
  );
}

export function useMobileComingSoon() {
  return useContext(MobileComingSoonContext);
}
