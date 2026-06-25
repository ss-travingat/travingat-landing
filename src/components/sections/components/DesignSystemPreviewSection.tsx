import Link from "next/link";

export default function DesignSystemPreviewSection() {
  return (
    <section className="px-5 py-12 md:px-8 md:py-16 xl:px-24 xl:py-20">
      <div className="rounded-3xl border border-[#20242d] bg-[#0d1017] p-5 md:p-8 xl:p-10">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="ds-font-body mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#8a94ab]">
              New in Landing
            </p>
            <h2 className="ds-font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.7px] text-white md:text-[52px]">
              Design System Foundations
            </h2>
            <p className="ds-font-body mt-3 max-w-175 text-[17px] leading-7 text-[#aeb7ca]">
              Typography is now aligned to Inter Display + Inter with the same token families used in the Figma
              foundations.
            </p>
          </div>

          <Link
            href="/designsystem"
            className="ds-font-body inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-black transition hover:bg-white-100"
          >
            Open /designsystem
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#1f2430] bg-black p-5">
            <p className="mb-3 text-[14px] text-[#95a0b5]">Primary Typeface</p>
            <p className="ds-font-display text-[52px] font-semibold leading-[1.05] tracking-[-1px] text-white">Inter Display</p>
          </div>
          <div className="rounded-2xl border border-[#1f2430] bg-black p-5">
            <p className="mb-3 text-[14px] text-[#95a0b5]">Secondary Typeface</p>
            <p className="ds-font-body text-[52px] font-semibold leading-[1.05] tracking-[-1px] text-white">Inter</p>
          </div>
        </div>
      </div>
    </section>
  );
}
