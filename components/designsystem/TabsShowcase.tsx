"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

const demoTabs = [
  "Explore",
  "Countries",
  "Cities",
  "Hotels",
  "Flights",
  "Activities",
  "Reviews",
  "Saved",
];

type TabState = "default" | "selected" | "hover";

/** Visual-only pill for the state reference section */
function TabPill({ label, state }: { label: string; state: TabState }) {
  const bg = state === "default" ? "#161616" : "#1e1e1e";
  const color = state === "default" ? "#bdbdbd" : "#ffffff";
  const fontWeight = state === "selected" ? 500 : 400;

  return (
    <span
      className="ds-font-body inline-flex h-10 items-center rounded-full px-6"
      style={{
        backgroundColor: bg,
        color,
        fontSize: 16,
        lineHeight: "24px",
        letterSpacing: "-0.6px",
        fontWeight,
        border: state === "selected" ? "1px solid #ffffff" : "1px solid transparent",
      }}
    >
      {label}
    </span>
  );
}

export default function TabsShowcase() {
  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden bg-[#1a1a1f] p-5 md:p-8 xl:p-10">
        <h2 className="ds-font-display mb-8 text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">Tabs</h2>

        {/* Interactive demo using Radix Tabs */}
        <Tabs defaultValue="explore" className="mb-14">
          <div className="overflow-x-auto">
            <TabsList className="min-w-235">
              {demoTabs.map((label) => (
                <TabsTrigger key={label} value={label.toLowerCase()}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {demoTabs.map((label) => (
            <TabsContent key={label} value={label.toLowerCase()} className="mt-4">
              <p className="ds-font-body text-[14px] text-white-300">
                Content for &ldquo;{label}&rdquo; tab.
              </p>
            </TabsContent>
          ))}
        </Tabs>

        {/* Visual state reference */}
        <div className="inline-flex rounded-xl border border-[#4d2cff] border-dashed p-5">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="ds-font-body w-20 text-[12px] text-white-400">Default</span>
              <TabPill label="Countries" state="default" />
            </div>
            <div className="flex items-center gap-4">
              <span className="ds-font-body w-20 text-[12px] text-white-400">Selected</span>
              <TabPill label="Countries" state="selected" />
            </div>
            <div className="flex items-center gap-4">
              <span className="ds-font-body w-20 text-[12px] text-white-400">Hover</span>
              <TabPill label="Countries" state="hover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
