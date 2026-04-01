"use client";

import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";

type ArrowDirection = "none" | "top" | "bottom" | "left" | "right" | "bottom-left" | "bottom-right";

type TooltipBubbleProps = {
  theme: "light" | "dark";
  arrow: ArrowDirection;
  supportingText?: boolean;
};

function Arrow({ theme, arrow }: { theme: "light" | "dark"; arrow: ArrowDirection }) {
  const color = theme === "dark" ? "#212329" : "#ffffff";

  if (arrow === "none") {
    return null;
  }

  if (arrow === "top") {
    return (
      <span
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1.5"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: `6px solid ${color}`,
        }}
      />
    );
  }

  if (arrow === "bottom") {
    return (
      <span
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    );
  }

  if (arrow === "bottom-left") {
    return (
      <span
        aria-hidden
        className="absolute bottom-0 left-6 translate-y-1.5"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    );
  }

  if (arrow === "bottom-right") {
    return (
      <span
        aria-hidden
        className="absolute bottom-0 right-6 translate-y-1.5"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    );
  }

  if (arrow === "left") {
    return (
      <span
        aria-hidden
        className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderTop: "8px solid transparent",
          borderBottom: "8px solid transparent",
          borderRight: `6px solid ${color}`,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="absolute right-0 top-1/2 translate-x-1.5 -translate-y-1/2"
      style={{
        width: 0,
        height: 0,
        borderTop: "8px solid transparent",
        borderBottom: "8px solid transparent",
        borderLeft: `6px solid ${color}`,
      }}
    />
  );
}

function TooltipBubble({ theme, arrow, supportingText = false }: TooltipBubbleProps) {
  const light = theme === "light";

  return (
    <div className="relative inline-flex">
      <div
        className="ds-font-body relative rounded-lg px-3 py-2 shadow-[0_12px_16px_rgba(16,24,40,0.08),0_4px_6px_rgba(16,24,40,0.03)]"
        style={{
          width: supportingText ? 300 : "auto",
          backgroundColor: light ? "#ffffff" : "#212329",
          color: light ? "#474d5d" : "#ffffff",
        }}
      >
        {supportingText ? (
          <>
            <p className="mb-2 text-[12px] font-bold leading-4">This is a tooltip</p>
            <p className="text-[12px] font-medium leading-4 text-[#576072]" style={{ color: light ? "#576072" : "#ffffff" }}>
              Tooltips are used to describe or identify an element. In most scenarios, tooltips help users understand
              meaning, function or alt-text.
            </p>
          </>
        ) : (
          <p className="text-[12px] font-medium leading-4">This is a tooltip</p>
        )}
      </div>
      <Arrow theme={theme} arrow={arrow} />
    </div>
  );
}

function TooltipColumn({ theme }: { theme: "light" | "dark" }) {
  const topVariants: ArrowDirection[] = ["none", "top", "bottom", "left", "right", "bottom-left", "bottom-right"];
  const lowerVariants: ArrowDirection[] = ["none", "bottom", "top", "left", "right", "bottom-left", "bottom-right"];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {topVariants.map((arrow) => (
          <div key={`${theme}-small-${arrow}`} className="relative pl-2 pt-2">
            <TooltipBubble theme={theme} arrow={arrow} />
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {lowerVariants.map((arrow) => (
          <div key={`${theme}-large-${arrow}`} className="relative pl-2 pt-2">
            <TooltipBubble theme={theme} arrow={arrow} supportingText />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TooltipShowcase() {
  const sides = ["top", "right", "bottom", "left"] as const;

  return (
    <TooltipProvider delayDuration={100}>
      <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
        <div className="ds-shell overflow-hidden bg-[#1a1a1f] p-5 md:p-8 xl:p-10">
          <h2 className="ds-font-display mb-8 text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">Tooltips</h2>

          {/* Interactive Radix tooltip demos */}
          <div className="mb-10 rounded-xl border border-white-700 p-6">
            <p className="ds-font-body mb-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white-400">
              Interactive — hover to reveal
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {sides.map((side) => (
                <Tooltip key={`dark-${side}`} content="This is a tooltip" theme="dark" side={side}>
                  <button className="rounded-full bg-black-500 px-4 py-2 text-[14px] text-white transition-colors hover:bg-black-400">
                    {side}
                  </button>
                </Tooltip>
              ))}
              {sides.map((side) => (
                <Tooltip key={`light-${side}`} content="This is a tooltip" theme="light" side={side}>
                  <button className="rounded-full bg-white-200 px-4 py-2 text-[14px] text-black-950 transition-colors hover:bg-white-100">
                    {side} light
                  </button>
                </Tooltip>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Tooltip
                title="This is a tooltip"
                content="Tooltips are used to describe or identify an element. In most scenarios, tooltips help users understand meaning, function or alt-text."
                theme="dark"
                side="bottom"
              >
                <button className="rounded-full bg-black-500 px-4 py-2 text-[14px] text-white transition-colors hover:bg-black-400">
                  With title (dark)
                </button>
              </Tooltip>
              <Tooltip
                title="This is a tooltip"
                content="Tooltips are used to describe or identify an element. In most scenarios, tooltips help users understand meaning, function or alt-text."
                theme="light"
                side="bottom"
              >
                <button className="rounded-full bg-white-200 px-4 py-2 text-[14px] text-black-950 transition-colors hover:bg-white-100">
                  With title (light)
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Visual reference: all bubble variants */}
          <div className="rounded-xl border border-[#4d2cff] border-dashed p-4 md:p-6">
            <div className="grid gap-8 xl:grid-cols-2">
              <TooltipColumn theme="light" />
              <TooltipColumn theme="dark" />
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
