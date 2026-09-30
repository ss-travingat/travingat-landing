"use client";

import { ReactNode } from "react";
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
  return (
    <Dialog.Root>
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
        <Dialog.Overlay className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[999] flex w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-[24px] bg-[#111111] border border-white/5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          style={{
            maxHeight: "85vh"
          }}
        >
          <div className="flex flex-col w-full h-full p-[32px] pb-[16px]">
            <Dialog.Title asChild>
              <h2 className="text-white ds-font-display text-[28px] font-semibold leading-[36px] tracking-[-0.5px] mb-[32px] m-0">
                {countries.length} Countries
              </h2>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              List of {countries.length} countries visited.
            </Dialog.Description>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
