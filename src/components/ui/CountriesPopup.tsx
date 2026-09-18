"use client";

import React, { ReactNode } from "react";
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 flex w-full max-w-[400px] max-h-[75vh] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[20px] bg-[#1a1a1a] border border-white/5 shadow-2xl overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] outline-none"
          style={fontRenderingStyles}
        >
          <div className="px-5 py-5 pb-3 shrink-0">
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
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
