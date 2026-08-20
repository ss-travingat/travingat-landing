"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WaitlistTab } from "./WaitlistTab";
import { MainUsersTab } from "./MainUsersTab";

export default function UsersAdminWrapper() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "users">("waitlist");

  const onSignOut = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
              ← Back
            </Link>
            <h1 className="text-lg font-semibold">Users Management</h1>
          </div>
          <div className="flex bg-[#141414] rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => setActiveTab('waitlist')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'waitlist' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
            >
              Waitlist
            </button>
            <button 
              onClick={() => setActiveTab('users')} 
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'users' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
            >
              Main Users
            </button>
          </div>
        </div>
        <Button onClick={onSignOut} variant="ghost" size="sm" className="text-sm text-white/50 hover:text-white">Sign out</Button>
      </header>

      <main className="flex-1 w-full relative">
        {activeTab === 'waitlist' ? (
          <WaitlistTab />
        ) : (
          <div className="relative h-full flex flex-col">
            <MainUsersTab />
            <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center z-[100]">
              <div className="bg-[#141414] border border-white/10 p-8 rounded-xl flex flex-col items-center max-w-sm text-center shadow-2xl">
                <span className="material-symbols-rounded text-[48px] text-[#5A45F9] mb-4">construction</span>
                <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
                <p className="text-white/50 text-sm">Main user management and analytics dashboard is currently under construction.</p>
                <button 
                  onClick={() => setActiveTab('waitlist')}
                  className="mt-6 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition"
                >
                  Back to Waitlist
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
