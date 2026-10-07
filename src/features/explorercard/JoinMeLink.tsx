"use client";
import React from "react";

export function JoinMeLink() {
  return (
    <object className="inline-block pointer-events-none">
      <a
        href="https://travingat.com/explorer-card"
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap text-[14px] font-medium leading-[20px] tracking-[-0.084px] text-[#7c7c7c] hover:text-white transition-colors underline decoration-wavy underline-offset-2 cursor-pointer pointer-events-auto block"
        onClick={(e) => e.stopPropagation()}
      >
        Join me on Travingat
      </a>
    </object>
  );
}
