const demoTabs = ["Tab Item", "Tab Item", "Tab Item", "Tab Item", "Tab Item", "Tab Item", "Tab Item", "Tab Item"];

type TabState = "default" | "selected" | "hover";

function TabPill({ label, state }: { label: string; state: TabState }) {
  const bg = state === "default" ? "#161616" : "#1e1e1e";
  const color = state === "default" ? "#bdbdbd" : "#ffffff";
  const fontWeight = state === "selected" ? 500 : 400;

  return (
    <button
      type="button"
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
    </button>
  );
}

export default function TabsShowcase() {
  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden bg-[#1a1a1f] p-5 md:p-8 xl:p-10">
        <h2 className="ds-font-display mb-8 text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">Tabs</h2>

        <div className="mb-14 overflow-x-auto">
          <div className="flex min-w-235 items-center gap-2">
            {demoTabs.map((label, index) => (
              <TabPill key={`${label}-${index}`} label={label} state={index === 0 ? "selected" : "default"} />
            ))}
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-[#4d2cff] border-dashed p-5">
          <div className="space-y-5">
            <TabPill label="Countries" state="default" />
            <TabPill label="Countries" state="selected" />
            <TabPill label="Countries" state="hover" />
          </div>
        </div>
      </div>
    </section>
  );
}
