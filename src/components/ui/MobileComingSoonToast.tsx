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
            className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeToast}
          />

          {/* Toast container */}
          <div className={`fixed top-[env(safe-area-inset-top,24px)] mt-[16px] left-1/2 -translate-x-1/2 z-[100] px-[16px] w-full max-w-[343px] pointer-events-none transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-[#161616] pointer-events-auto border border-[#2a2a2a] border-solid drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex gap-[12px] items-center justify-center pl-[12px] pr-[16px] py-[12px] relative rounded-[12px] w-full">
              {activeType === "desktopOnly" ? (
                <div className="bg-[#252525] flex items-center p-[5.5px] relative rounded-[9px] shrink-0">
                  <div className="overflow-clip relative shrink-0 size-[37px]">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[46px]">
                      <Image 
                        src="/images/laptop-icon.png" 
                        alt="Laptop Icon" 
                        width={46} 
                        height={46} 
                        className="absolute left-[-10%] max-w-none size-full top-0 object-contain" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#252525] flex items-center justify-center relative rounded-[9px] shrink-0 size-[48px]">
                  <img src="/favicons/Fav%20icon%20-dark.png" alt="Travingat Ghost" className="size-[24px] opacity-90" />
                </div>
              )}
              
              <div className="flex flex-[1_0_0] flex-col items-start min-w-px relative pr-[16px]">
                <p className="[word-break:break-word] font-[family-name:var(--font-inter-google)] font-normal leading-[20px] relative shrink-0 text-[14px] text-[#ededed] tracking-[-0.084px] w-full">
                  {activeType === "desktopOnly" ? (
                    "This is available on desktop only for now. Coming to mobile at launch."
                  ) : (
                    <>
                      This feature will be available at launch.{" "}
                      <button 
                        type="button"
                        className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors bg-transparent border-none p-0 cursor-pointer" 
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
                className="absolute right-[7px] size-[20px] top-[7px] text-white/40 hover:text-white transition-colors flex items-center justify-center"
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
