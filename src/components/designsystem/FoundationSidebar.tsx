type FoundationSidebarProps = {
  title: string;
  tabs: [string, string];
  description: string;
};

export default function FoundationSidebar({ title, tabs, description }: FoundationSidebarProps) {
  return (
    <aside className="w-full border-b border-[#cfd4db] bg-[#f6f7f9] p-6 text-[#212329] md:border-b-0 md:border-r md:p-8 xl:p-10">
      <div className="mb-16 flex items-center gap-2 md:mb-24">
        <span className="rounded-full border border-[#d8dde5] bg-[#f1f4f7] px-3 py-1 text-[11px] font-medium leading-4 text-[#576072]">
          {tabs[0]}
        </span>
        <span className="rounded-full border border-[#d8dde5] bg-[#f1f4f7] px-3 py-1 text-[11px] font-medium leading-4 text-[#576072]">
          {tabs[1]}
        </span>
      </div>

      <div className="max-w-[320px]">
        <h2 className="mb-3 text-[32px] font-semibold leading-[1.25] tracking-[-0.5px] text-[#212329]">{title}</h2>
        <p className="text-[15px] leading-6 text-[#576072]">{description}</p>
      </div>

      <div className="mt-16 flex items-center justify-between rounded-full border border-[#d8dde5] bg-[#eef1f5] px-4 py-2 text-[12px] text-[#576072] md:mt-24">
        <span>travingat.com</span>
        <span>v1.0</span>
      </div>
    </aside>
  );
}
