import TravingatBadge from "@/components/ui/TravingatBadge";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="w-[205px] h-[205px]">
        <TravingatBadge />
      </div>
    </div>
  );
}
