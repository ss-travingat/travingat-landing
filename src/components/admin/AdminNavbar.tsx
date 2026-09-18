"use client";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/cms/session", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="w-full h-[60px] bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="text-white font-bold text-[15px]">Admin Dashboard</div>
      <div className="flex items-center gap-5">
        <button 
          onClick={handleSignOut} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-[13px] font-medium"
        >
          <span className="material-symbols-rounded text-[16px]">logout</span>
          Sign out
        </button>
      </div>
    </div>
  );
}
