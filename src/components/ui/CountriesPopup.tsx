"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface CountryItem {
  name: string;
  code: string;
}

interface CountriesPopupProps {
  trigger: ReactNode;
  countries: CountryItem[];
}

/**
 * Shared font-rendering styles applied to Dialog.Content so every
 * descendant inside the portal inherits consistent anti-aliasing
 * across Chrome (Skia) and Safari (Core Text).
 */
const fontRenderingStyles: React.CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  fontSynthesis: "none",
};

export function CountriesPopup({ trigger, countries }: CountriesPopupProps) {
  const [open, setOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only apply on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // Only allow dragging downwards
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If dragged more than 100px downwards, close the modal
    if (dragY > 100) {
      setOpen(false);
      // Wait for exit animation to finish before resetting drag transform
      setTimeout(() => setDragY(0), 300);
    } else {
      // Snap back if not dragged far enough
      setDragY(0);
    }
    touchStartY.current = null;
  };

  const inlineStyles: React.CSSProperties = {
    ...fontRenderingStyles,
  };
  
  if (isDragging) {
    inlineStyles.transform = `translateY(${dragY}px)`;
    inlineStyles.transition = 'none';
  } else if (dragY > 0) {
    inlineStyles.transform = `translateY(0px)`;
    inlineStyles.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpMobile { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDownMobile { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOutOverlay { from { opacity: 1; } to { opacity: 0; } }
        
        .mobile-overlay-bg[data-state="open"] { animation: fadeInOverlay 0.3s ease-out forwards; }
        .mobile-overlay-bg[data-state="closed"] { animation: fadeOutOverlay 0.2s ease-in forwards; }
        
        @media (max-width: 767px) {
          .mobile-popup-content[data-state="open"] { animation: slideUpMobile 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
          .mobile-popup-content[data-state="closed"] { animation: slideDownMobile 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        }
        @media (min-width: 768px) {
          .mobile-popup-content { transform: translate(-50%, -50%); }
          @keyframes slideUpDesktop { from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
          @keyframes slideDownDesktop { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } }
          .mobile-popup-content[data-state="open"] { animation: slideUpDesktop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
          .mobile-popup-content[data-state="closed"] { animation: slideDownDesktop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
        }
      `}} />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 outline-none flex items-center justify-center m-0"
              aria-label="View all countries"
            >
              {trigger}
            </button>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay 
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm mobile-overlay-bg" 
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onTouchStart={(e) => { e.stopPropagation(); }}
          />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 z-[1000] flex w-full flex-col outline-none md:bottom-auto md:left-[50%] md:top-[50%] md:w-full md:max-w-[400px] mobile-popup-content"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div 
            className="flex w-full flex-col max-h-[85vh] md:max-h-[75vh] overflow-hidden rounded-t-[24px] bg-[#1a1a1a] shadow-[0_-8px_30px_rgba(0,0,0,0.5)] md:rounded-[20px] md:border md:border-white/5 md:shadow-2xl relative"
            style={inlineStyles}
          >
            <div 
              className="px-5 pt-4 pb-3 shrink-0"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-[#333] md:hidden cursor-grab active:cursor-grabbing" />
              <Dialog.Title asChild>
                <span
                  className="block text-white text-left ds-font-display m-0 px-3"
                  style={{
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '32px',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {countries.length} Countries
                </span>
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                List of {countries.length} countries visited.
              </Dialog.Description>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-5 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {countries.map((country, index) => (
                <div
                  key={`${country.code}-${index}`}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[2px] bg-[#2a2a2a]">
                    <img
                      src={`/flags/${country.code.toUpperCase()}.svg`}
                      alt={`${country.name} flag`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className="text-white/90 ds-font-display"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '-0.006em',
                      lineHeight: '20px',
                    }}
                  >
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    </>
  );
}
