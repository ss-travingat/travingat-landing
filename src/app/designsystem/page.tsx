"use client";

import { useState } from "react";

import TypographyShowcase from "@/components/designsystem/TypographyShowcase";
import ColorPaletteShowcase from "@/components/designsystem/ColorPaletteShowcase";
import ButtonShowcase from "@/components/designsystem/ButtonShowcase";
import TabsShowcase from "@/components/designsystem/TabsShowcase";
import TooltipShowcase from "@/components/designsystem/TooltipShowcase";
import MoreOptionsButtonShowcase from "@/components/designsystem/MoreOptionsButtonShowcase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import { WaitlistBar } from "@/components/ui/waitlistbar";

export default function DesignSystemPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className="pb-10">
      <section className="px-3 pb-4 pt-10 md:px-10 md:pt-14 xl:px-24 xl:pt-16">
        <div className="rounded-3xl border border-[#20242d] bg-[radial-gradient(120%_120%_at_10%_10%,#1a1f2b_0%,#0d1017_56%,#06070a_100%)] p-6 md:p-10">
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8b93a3]">Travingat Foundation</p>
          <h1 className="ds-font-display text-[48px] font-semibold leading-[1.08] tracking-[-1px] text-white md:text-[64px]">
            Design System Demo
          </h1>
          <p className="ds-font-body mt-4 max-w-215 text-[18px] leading-7 text-[#b3bccf]">
            This page implements the requested Figma foundations for Typography, Color Palette, Buttons, Tabs, and
            Tooltips with Inter for body copy and Inter Display for headings.
          </p>
          <p className="ds-font-body mt-3 text-[14px] leading-6 text-[#909cb3]">
            Inter Display is loaded directly from <strong>landing/inter-display</strong> to match the Figma typography source.
          </p>
        </div>
      </section>

      <TypographyShowcase />
      <ColorPaletteShowcase withSidebar />
      <ButtonShowcase />
      <MoreOptionsButtonShowcase />
      <TabsShowcase />
      <TooltipShowcase />

      <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
        <div className="ds-shell overflow-hidden bg-[#0f1116] p-5 md:p-8 xl:p-10">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="ds-font-display text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">
                Component Gallery
              </h2>
              <p className="ds-font-body mt-2 text-[14px] text-[#798298]">
                Preview every core UI component in one place.
              </p>
            </div>
            <p className="ds-font-body text-[12px] text-[#6f798b]">
              Use the button below to preview the Waitlist popup overlay.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Text</h3>
              <div className="space-y-3">
                <Text variant="h5" weight="semibold" className="text-white">
                  Display / h5 — Semibold
                </Text>
                <Text variant="text-lg" weight="medium" className="text-white-300">
                  Text lg — Medium
                </Text>
                <Text variant="text-sm" className="text-white-400">
                  Text sm — Regular
                </Text>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="violet">Violet</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Inputs</h3>
              <div className="space-y-3">
                <Input
                  size="sm"
                  placeholder="Input (sm)"
                  className="border border-white-900 bg-black"
                />
                <Input
                  size="md"
                  placeholder="Input (md)"
                  className="border border-white-900 bg-black"
                />
                <Input
                  size="lg"
                  placeholder="Input (lg)"
                  className="border border-white-900 bg-black"
                />
              </div>
              <div className="mt-6 space-y-3">
                <Textarea
                  size="sm"
                  placeholder="Textarea (sm)"
                  className="border border-white-900 bg-black"
                />
                <Textarea
                  size="md"
                  placeholder="Textarea (md)"
                  className="border border-white-900 bg-black"
                />
                <Textarea
                  size="lg"
                  placeholder="Textarea (lg)"
                  className="border border-white-900 bg-black"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Waitlist</h3>
              <div className="space-y-6">
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
                    Waitlist Bar
                  </p>
                  <WaitlistBar className="max-w-[520px]" />
                </div>
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
                    Waitlist Popup
                  </p>
                  <Button variant="secondary" onClick={() => setIsWaitlistOpen(true)}>
                    Open Waitlist Popup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
