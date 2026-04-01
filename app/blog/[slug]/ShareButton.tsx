"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Copy link to clipboard"
      className="relative inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#111111] px-4 py-2 text-sm text-[#6B7280] transition-colors duration-200 hover:border-[#D4A853]/40 hover:text-[#D4A853]"
    >
      {/* Share icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Share

      {/* Copied tooltip */}
      <span
        className={`absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-[#D4A853] px-2.5 py-1 text-xs font-medium text-black transition-all duration-200 ${
          copied
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        Copied!
      </span>
    </button>
  );
}
