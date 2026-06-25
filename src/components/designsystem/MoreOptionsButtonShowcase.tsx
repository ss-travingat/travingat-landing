"use client";

import { useState } from "react";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";

type MoreOptionsSize = "sm" | "md" | "lg";

const SIZES: MoreOptionsSize[] = ["sm", "md", "lg"];

function MoreOptionsButtonSample({ size }: { size: MoreOptionsSize }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-32 w-32 border border-[#2a2a2a] rounded-lg bg-[#0a0a0a] p-4 flex items-end justify-end group">
      <MoreOptionsButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        size={size}
        label={`More options (${size})`}
      />
      <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[#666]">
        {size}
      </div>
    </div>
  );
}

export default function MoreOptionsButtonShowcase() {
  const [showcaseTitle] = useState("MoreOptionsButton");

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">{showcaseTitle}</h2>
        <p className="text-sm text-[#999]">
          A reusable 3-dot menu button component with consistent styling. Available in three sizes: small (sm), medium (md), and large (lg). Shows on hover on desktop and is always visible on mobile.
        </p>
      </div>

      <div className="space-y-8">
        {/* Sizes Section */}
        <div>
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
            Sizes
          </p>
          <div className="flex flex-wrap gap-6">
            {SIZES.map((size) => (
              <div key={size}>
                <div className="mb-2">
                  <p className="text-xs text-[#999] mb-1">{size}</p>
                </div>
                <MoreOptionsButtonSample size={size} />
              </div>
            ))}
          </div>
        </div>

        {/* Hover State Section */}
        <div>
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
            Hover Behavior
          </p>
          <p className="text-sm text-[#999] mb-4">
            On desktop, hover over the containers to reveal the buttons. On mobile, buttons are always visible.
          </p>
          <div className="flex gap-6">
            {["sm", "md", "lg"].map((size) => (
              <div
                key={size}
                className="relative h-40 w-40 border border-[#2a2a2a] rounded-lg bg-[#0a0a0a] p-4 flex items-end justify-end group hover:bg-[#151515] transition-colors"
              >
                <MoreOptionsButton
                  isOpen={false}
                  onClick={() => {}}
                  size={size as MoreOptionsSize}
                  label={`More options (${size})`}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[#666]">
                  Hover me
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open State Section */}
        <div>
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
            Open State
          </p>
          <p className="text-sm text-[#999] mb-4">
            When isOpen is true, the button is fully visible regardless of hover state.
          </p>
          <div className="flex gap-6">
            {SIZES.map((size) => (
              <div
                key={size}
                className="relative h-40 w-40 border border-[#2a2a2a] rounded-lg bg-[#0a0a0a] p-4 flex items-end justify-end group"
              >
                <MoreOptionsButton
                  isOpen={true}
                  onClick={() => {}}
                  size={size}
                  label={`More options (${size})`}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[#666]">
                  {size}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Section */}
        <div>
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
            Usage
          </p>
          <pre className="bg-[#0a0a0a] p-4 rounded-lg text-[12px] text-[#888] overflow-x-auto">
            {`<MoreOptionsButton
  isOpen={isMenuOpen}
  onClick={handleMenuToggle}
  size="md"
  showOnHover={true}
  label="More options"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
