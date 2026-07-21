import { Badge } from "@/components/ui/Badge";

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "violet",
  "coral",
  "amber",
  "cyan",
] as const;

export default function BadgeShowcase() {
  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden p-5 md:p-8 xl:p-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="ds-font-display text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">
            Badges
          </h2>
          <p className="ds-font-body text-[14px] text-[#798298]">Variants</p>
        </div>

        <div className="rounded-2xl border border-[#4d2cff] border-dashed p-5 md:p-6">
          <div className="flex flex-wrap gap-4">
            {BADGE_VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-2">
                <Badge variant={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
