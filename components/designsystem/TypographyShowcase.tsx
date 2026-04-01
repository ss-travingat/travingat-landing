import { FONT_WEIGHTS, HEADING_TOKENS, TEXT_TOKENS, TypeToken } from "@/components/designsystem/designSystemData";



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

function formatLetterSpacing(value: number, unit: "px" | "%" = "px"): string {
  const formatted = Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;
  return `${formatted}${unit}`;
}

function SpecimenRowView({ row, isLast }: { row: SpecimenRow; isLast: boolean }) {
  const familyClass = row.family === "display" ? "ds-font-display" : "ds-font-body";
  const typeClass = TYPE_CLASS_BY_ID[row.id] ?? "";
  const sampleHeight = row.lineHeight * 2;

  return (
    <div className={`border-t border-[#171b22] ${isLast ? "pb-0" : "pb-16"}`}>
      <div className="flex flex-col gap-1 pt-2 sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:pt-0">
        <p className="ds-font-body text-[14px] font-medium leading-6 tracking-[-0.3px] text-[#d0d8e8]">{row.label}</p>
        <p className="ds-font-body text-[11px] font-medium leading-6 text-[#6f798b]">
          Font size: {row.size}px | Line height: {row.lineHeight}px | Letter spacing: {formatLetterSpacing(row.letterSpacing, row.letterSpacingUnit)}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4" style={{ minHeight: sampleHeight }}>
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

function TypographyBoard() {
  return (
    <div className="flex-1 bg-black p-4 md:p-6 xl:p-8">
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-[#1c212c] bg-[#0f1319] text-center md:h-55">
          <p className="ds-font-open-sauce mb-4 text-[1.25rem] font-semibold leading-[1.1] tracking-[-0.05rem] text-[#d7deeb] md:text-[1.875rem]">Primary Typeface</p>
          <p className="ds-font-open-sauce text-[2.5rem] font-semibold leading-[3rem] tracking-[-0.05rem] text-white md:text-[4.5rem] md:leading-[5rem]">Inter Display</p>
        </div>
        <div className="flex h-44 flex-col items-center justify-center rounded-2xl border border-[#1c212c] bg-[#0f1319] text-center md:h-55">
          <p className="ds-font-open-sauce mb-4 text-[1.25rem] font-semibold leading-[1.1] tracking-[-0.05rem] text-[#d7deeb] md:text-[1.875rem]">Secondary Typeface</p>
          <p className="ds-font-open-sauce text-[2.5rem] font-semibold leading-[3rem] tracking-[-0.05rem] text-white md:text-[4.5rem] md:leading-[5rem]">Inter</p>
        </div>
      </div>

      <div>
        {SPEC_ROWS.map((row, index) => (
          <SpecimenRowView key={row.id} row={row} isLast={index === SPEC_ROWS.length - 1} />
        ))}
      </div>
    </div>
  );
}

export default function TypographyShowcase() {
  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden rounded-2xl">
        <TypographyBoard />
      </div>
    </section>
  );
}
