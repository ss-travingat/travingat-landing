import { BUTTON_SIZES, BUTTON_THEMES, ButtonSizeToken, ButtonTheme } from "@/components/designsystem/designSystemData";

type ButtonState = "default" | "hover" | "disabled";

const STATE_ORDER: ButtonState[] = ["default", "hover", "disabled"];

function ButtonSample({
  size,
  theme,
  state,
}: {
  size: ButtonSizeToken;
  theme: ButtonTheme;
  state: ButtonState;
}) {
  const palette = theme.states[state];
  const isGhost = theme.id === "ghost";

  return (
    <button
      type="button"
      disabled={state === "disabled"}
      className="ds-font-body inline-flex items-center justify-center rounded-full font-medium"
      style={{
        minWidth: size.id === "xs" ? 56 : size.id === "sm" ? 72 : 84,
        height: size.height,
        paddingLeft: size.paddingX,
        paddingRight: size.paddingX,
        paddingTop: size.paddingY,
        paddingBottom: size.paddingY,
        fontSize: size.fontSize,
        lineHeight: `${size.lineHeight}px`,
        letterSpacing: `${size.letterSpacing}px`,
        backgroundColor: palette.bg,
        color: palette.text,
        border: isGhost ? "1px solid transparent" : palette.border ? `1px solid ${palette.border}` : "1px solid transparent",
        opacity: state === "disabled" ? 0.95 : 1,
      }}
    >
      Button
    </button>
  );
}

function ThemeBlock({ theme }: { theme: ButtonTheme }) {
  const rowClass = theme.id === "ghost" ? "flex min-w-[650px] items-center gap-4 border-t border-[#1b1f28] pt-3" : "flex min-w-[650px] items-center gap-4";

  return (
    <div className="mb-9">
      <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">{theme.label}</p>
      <div className="space-y-4">
        {STATE_ORDER.map((state) => (
          <div key={`${theme.id}-${state}`} className={rowClass}>
            {BUTTON_SIZES.map((size) => (
              <ButtonSample key={`${theme.id}-${state}-${size.id}`} size={size} theme={theme} state={state} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ButtonShowcase() {
  return (
    <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
      <div className="ds-shell overflow-hidden p-5 md:p-8 xl:p-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="ds-font-display text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">Buttons</h2>
          <p className="ds-font-body text-[14px] text-[#798298]">States x Sizes</p>
        </div>

        <div className="rounded-2xl border border-[#4d2cff] border-dashed p-5 md:p-6">
          <div className="overflow-x-auto">
            <div className="min-w-205">
              {BUTTON_THEMES.map((theme) => (
                <ThemeBlock key={theme.id} theme={theme} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
