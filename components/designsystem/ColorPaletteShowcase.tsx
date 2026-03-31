import FoundationSidebar from "@/components/designsystem/FoundationSidebar";
import { COLOR_GROUPS, FUNCTIONAL_GROUPS, PaletteGroup } from "@/components/designsystem/designSystemData";

type ColorPaletteShowcaseProps = {
  withSidebar?: boolean;
};

function isLight(hex: string): boolean {
  const normalized = hex.replace("#", "");
  const fullHex = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 148;
}

function PaletteRow({ group }: { group: PaletteGroup }) {
  return (
    <div className="mb-8">
      <h3 className="ds-font-display mb-4 text-[34px] font-semibold leading-[1.15] tracking-[-0.5px] text-white">{group.name}</h3>
      <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[1220px] grid-cols-11 gap-3">
          {group.swatches.map((swatch) => {
            const light = isLight(swatch.hex);
            const textColor = light ? "#212329" : "#ffffff";
            const borderColor = swatch.step === "50" || swatch.step === "950" ? "#323232" : "transparent";

            return (
              <div
                key={`${group.name}-${swatch.step}`}
                className="rounded-[14px] border px-3 pb-3 pt-7"
                style={{ backgroundColor: swatch.hex, borderColor }}
              >
                <p className="ds-font-body text-[12px] font-semibold leading-4" style={{ color: textColor }}>
                  {swatch.step}
                </p>
                <p className="ds-font-body mt-1 text-[12px] font-semibold leading-4" style={{ color: textColor }}>
                  {swatch.hex.toLowerCase()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ColorPaletteBoard() {
  return (
    <div className="flex-1 bg-black p-5 md:p-8 xl:p-10">
      {COLOR_GROUPS.map((group) => (
        <PaletteRow key={group.name} group={group} />
      ))}

      <div className="mb-5 mt-2 border-t border-[#232831] pt-6">
        <h3 className="ds-font-display text-[34px] font-semibold leading-[1.15] tracking-[-0.5px] text-white">Functional</h3>
      </div>

      {FUNCTIONAL_GROUPS.map((group) => (
        <PaletteRow key={group.name} group={group} />
      ))}
    </div>
  );
}

export default function ColorPaletteShowcase({ withSidebar = true }: ColorPaletteShowcaseProps) {
  if (!withSidebar) {
    return (
      <section className="px-3 py-12 md:px-12 md:py-16 xl:px-24 xl:py-20">
        <div className="ds-shell overflow-hidden">
          <ColorPaletteBoard />
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden md:grid md:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        <FoundationSidebar
          title="Color Palette"
          tabs={["Foundation", "Color Palette"]}
          description="Our design system uses a purposeful set of color styles as the perfect starting point for any project. Contrast remains central to readability and accessibility."
        />
        <ColorPaletteBoard />
      </div>
    </section>
  );
}
