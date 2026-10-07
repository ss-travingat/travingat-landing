"use client";

import { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface CountryItem {
  name: string;
  code: string;
}

interface DesktopCountriesPopupProps {
  trigger: ReactNode;
  countries: CountryItem[];
}

export function DesktopCountriesPopup({ trigger, countries }: DesktopCountriesPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popInDesktop { from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes popOutDesktop { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOutOverlay { from { opacity: 1; } to { opacity: 0; } }
        
        .desktop-overlay[data-state="open"] { animation: fadeInOverlay 0.2s ease-out forwards; }
        .desktop-overlay[data-state="closed"] { animation: fadeOutOverlay 0.2s ease-in forwards; }
        
        .desktop-popup-content[data-state="open"] { animation: popInDesktop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .desktop-popup-content[data-state="closed"] { animation: popOutDesktop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0 outline-none flex items-center justify-center m-0"
            aria-label="View all countries"
          >
            {trigger}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay 
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm desktop-overlay" 
            style={{ pointerEvents: 'auto' }}
          />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[1000] flex w-full max-w-[400px] max-h-[85vh] flex-col overflow-hidden rounded-[24px] bg-[#111111] border border-white/5 shadow-2xl outline-none desktop-popup-content"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="px-[32px] pt-[32px] shrink-0">
            <Dialog.Title asChild>
              <h2 className="text-white text-left ds-font-display text-[24px] font-medium leading-[32px] tracking-[-0.5px] mb-[32px]">
                {countries.length} Countries
              </h2>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              List of {countries.length} countries visited.
            </Dialog.Description>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 px-[32px] pb-[32px] space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {countries.map((country, index) => (
              <div
                key={`${country.code}-${index}`}
                className="flex items-center gap-[12px] group cursor-default"
              >
                <div className="h-[14px] w-[20px] shrink-0 overflow-hidden rounded-[2px] bg-[#2a2a2a] relative shadow-sm">
                  <img
                    src={`/flags/${country.code.toUpperCase()}.svg`}
                    alt={`${country.name} flag`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-white ds-font-display text-[16px] font-medium leading-[24px] tracking-[-0.01em] group-hover:text-white/80 transition-colors">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    </>
  );
}
