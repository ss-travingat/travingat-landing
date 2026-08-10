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
          <div className={`fixed ${activeType === "desktopOnly" ? "top-[79px] max-w-[344px]" : "top-[79px] md:top-[44px] max-w-[344px] md:max-w-[400px]"} left-1/2 -translate-x-1/2 z-[100] w-[344px] ${activeType === "desktopOnly" ? "" : "md:w-[400px]"} pointer-events-none transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`bg-[#161616] pointer-events-auto border border-[#2a2a2a] border-solid drop-shadow-[20px_20px_10px_rgba(0,0,0,0.25)] flex items-center justify-center relative w-full ${activeType === "desktopOnly" ? "gap-[12px] pl-[12px] pr-[16px] py-[12px] rounded-[12px]" : "gap-[12px] md:gap-[16px] pl-[12px] pr-[16px] py-[12px] md:p-[16px] rounded-[12px] md:rounded-[20px]"}`}>
              
              {activeType === "desktopOnly" ? (
                <img src="/icons/toast-laptop.png" alt="Desktop Only" className="shrink-0 size-[48px] object-contain rounded-[9px]" />
              ) : (
                <img src="/icons/toast-launch.png" alt="Feature Launch" className="shrink-0 size-[48px] md:size-[64px] object-contain rounded-[9px] md:rounded-[12px]" />
              )}
              
              <div className="flex flex-[1_0_0] flex-col items-start min-w-px relative">
                <p 
                  className={`[word-break:break-word] relative shrink-0 text-white w-full ${activeType === "desktopOnly" ? "text-[14px] leading-[20px] tracking-[-0.084px]" : "text-[14px] md:text-[18px] leading-[20px] md:leading-[26px] tracking-[-0.084px] md:tracking-[-0.198px]"}`}
                  style={{
                    fontFamily: "var(--font-sans-css), sans-serif",
                    fontWeight: 400
                  }}
                >
                  {activeType === "desktopOnly" ? (
                    <>
                      This is available on desktop only for<br />now. Coming to mobile at launch.
                    </>
                  ) : (
                    <>
                      This feature will be available at<br className="md:hidden" /> launch.{" "}
                      <button 
                        type="button"
                        className="text-[#1fbcfe] hover:text-[#60a5fa] transition-colors bg-transparent border-none p-0 cursor-pointer font-normal text-[14px] md:text-[18px]" 
                        style={{ fontFamily: "inherit" }}
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
                className={`absolute transition-opacity flex items-center justify-center opacity-40 hover:opacity-100 ${activeType === "desktopOnly" ? "right-[7px] top-[7px] size-[20px]" : "right-[7px] md:right-[11px] top-[7px] md:top-[11px] size-[20px] md:size-[24px]"}`}
                onClick={closeToast}
                aria-label="Close"
              >
                <img src="/icons/close-icon.svg" alt="Close" className="w-full h-full object-contain" />
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
