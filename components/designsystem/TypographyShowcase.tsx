import { FONT_WEIGHTS, HEADING_TOKENS, TEXT_TOKENS, TypeToken } from "@/components/designsystem/designSystemData";

type TypographyShowcaseProps = {
  withSidebar?: boolean;
};

type SpecimenRow = TypeToken & {
  family: "display" | "body";
};

const TYPE_CLASS_BY_ID: Record<string, string> = {
  h1: "ds-h1",
  h2: "ds-h2",
  h3: "ds-h3",
  h4: "ds-h4",
  h5: "ds-h5",
  h6: "ds-h6",
  h7: "ds-h7",
  "text-lg": "ds-text-lg",
  "text-md": "ds-text-md",
  "text-sm": "ds-text-sm",
  "text-xs": "ds-text-xs",
  "text-xxs": "ds-text-xxs",
};

const SPEC_ROWS: SpecimenRow[] = [
  ...HEADING_TOKENS.map((token) => ({ ...token, family: "display" as const })),
  ...TEXT_TOKENS.map((token) => ({ ...token, family: "body" as const })),
];

function formatLetterSpacing(value: number): string {
  return Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;
}

function SpecimenRowView({ row, isLast }: { row: SpecimenRow; isLast: boolean }) {
  const familyClass = row.family === "display" ? "ds-font-display" : "ds-font-body";
  const typeClass = TYPE_CLASS_BY_ID[row.id] ?? "";
  const sampleHeight = row.lineHeight * 2;

  return (
    <div className={`border-t border-[#171b22] ${isLast ? "pb-0" : "pb-16"}`}>
      <div className="flex h-10 items-center justify-between pt-0">
        <p className="ds-font-body text-[14px] font-medium leading-6 tracking-[-0.3px] text-[#d0d8e8]">{row.label}</p>
        <p className="ds-font-body text-[11px] font-medium leading-6 text-[#6f798b]">
          Font size: {row.size}px | Line height: {row.lineHeight}px | Letter spacing: {formatLetterSpacing(row.letterSpacing)}px
        </p>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-8" style={{ minHeight: sampleHeight }}>
        {FONT_WEIGHTS.map((weight) => (
          <div key={`${row.id}-${weight.label}`}>
            <p
                className={`${familyClass} ${typeClass} whitespace-pre-line text-white`}
              style={{
                fontWeight: weight.value,
              }}
            >
              {`${row.label}\n${weight.label}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographySidebar() {
  return (
    <aside className="flex min-h-full flex-col border-r border-[#d8dee8] bg-[#f6f7f9] p-4 text-[#212329] md:p-6 xl:p-8">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-[#d7dce6] bg-[#f1f4f8] px-3 py-1 text-[11px] font-medium leading-4 text-[#5d6678]">
          Foundation
        </span>
        <span className="rounded-full border border-[#d7dce6] bg-[#f1f4f8] px-3 py-1 text-[11px] font-medium leading-4 text-[#5d6678]">
          Typography
        </span>
      </div>

      <div className="mt-20 max-w-77.5 md:mt-24 xl:mt-28">
        <h2 className="mb-3 text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-[#212329]">Typography</h2>
        <p className="text-[14px] leading-6 text-[#576072]">
          Typography establishes clear hierarchies in design layouts. A well-chosen typeface guides the eye, enhances focus,
          and applies emphasis where needed.
        </p>
        <p className="mt-5 text-[14px] leading-6 text-[#576072]">
          Our design system leverages a purposeful set of typographic styles. We&apos;ve stress-tested this typographic scale across
          dozens of projects to make sure it&apos;s robust enough to use across (almost) any project, while remaining as accessible as
          possible for everyone.
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="rounded-full border border-[#d7dce6] bg-[#eef1f5] px-3 py-1 text-[11px] font-medium leading-4 text-[#5d6678]">
          travingat.com
        </span>
        <span className="rounded-full border border-[#d7dce6] bg-[#eef1f5] px-3 py-1 text-[11px] font-medium leading-4 text-[#5d6678]">
          v1.0
        </span>
      </div>
    </aside>
  );
}

function TypographyBoard({ compact }: { compact: boolean }) {
  return (
    <div className="flex-1 bg-black p-4 md:p-6 xl:p-8">
      <div className="overflow-x-auto">
        <div style={{ minWidth: compact ? 960 : 1360 }}>
          <div className="mb-16 grid grid-cols-2 gap-8">
            <div className="flex h-55 flex-col items-center justify-center rounded-2xl border border-[#1c212c] bg-[#0f1319] text-center">
              <p className="ds-font-body mb-4 text-[30px] leading-[1.1] text-[#d7deeb]">Primary Typeface</p>
              <p className="ds-font-display text-[72px] font-semibold leading-[1.05] tracking-[-1px] text-white">Inter Display</p>
            </div>
            <div className="flex h-55 flex-col items-center justify-center rounded-2xl border border-[#1c212c] bg-[#0f1319] text-center">
              <p className="ds-font-body mb-4 text-[30px] leading-[1.1] text-[#d7deeb]">Secondary Typeface</p>
              <p className="ds-font-body text-[72px] font-semibold leading-[1.05] tracking-[-1px] text-white">Inter</p>
            </div>
          </div>

          <div>
            {SPEC_ROWS.map((row, index) => (
              <SpecimenRowView key={row.id} row={row} isLast={index === SPEC_ROWS.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypographyShowcase({ withSidebar = true }: TypographyShowcaseProps) {
  if (!withSidebar) {
    return (
      <section className="px-3 py-12 md:px-12 md:py-16 xl:px-24 xl:py-20">
        <div className="ds-shell overflow-hidden">
          <TypographyBoard compact />
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="overflow-x-auto">
        <div className="ds-shell grid min-h-295 min-w-370" style={{ gridTemplateColumns: "30.4% 69.6%" }}>
          <TypographySidebar />
          <TypographyBoard compact={false} />
        </div>
      </div>
    </section>
  );
}
