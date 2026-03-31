import TypographyShowcase from "@/components/designsystem/TypographyShowcase";
import ColorPaletteShowcase from "@/components/designsystem/ColorPaletteShowcase";
import ButtonShowcase from "@/components/designsystem/ButtonShowcase";
import TabsShowcase from "@/components/designsystem/TabsShowcase";
import TooltipShowcase from "@/components/designsystem/TooltipShowcase";

export default function DesignSystemPage() {
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

      <TypographyShowcase withSidebar />
      <ColorPaletteShowcase withSidebar />
      <ButtonShowcase />
      <TabsShowcase />
      <TooltipShowcase />
    </main>
  );
}
