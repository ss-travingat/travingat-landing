"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [profileCount, setProfileCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => typeof d?.count === "number" && setUserCount(d.count))
      .catch(() => {});

    fetch("/api/waitlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => typeof d?.total === "number" && setWaitlistCount(d.total))
      .catch(() => {});

    fetch("/api/profiles")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setProfileCount(d.length))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <h2 className="ds-font-display text-[36px] md:text-[46px] font-semibold tracking-[-1px] text-white mb-3">
          Content Management
        </h2>
        <p className="ds-font-body text-[#798298] text-[16px] mb-12 max-w-xl">
          Overview of platform activity, user management, and administrative tools.
        </p>

        {/* Users & Waitlist Hero Card */}
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="group ds-shell flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 transition-all hover:border-[#5A45F9]/50 hover:shadow-[0_0_40px_rgba(90,69,249,0.15)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5A45F9]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#5A45F9]/10 flex items-center justify-center shrink-0 border border-[#5A45F9]/20 shadow-[0_0_15px_rgba(90,69,249,0.2)] group-hover:shadow-[0_0_25px_rgba(90,69,249,0.4)] transition-all">
                <span className="material-symbols-rounded text-[28px] text-[#5A45F9]">group</span>
              </div>
              <div className="pt-1">
                <h3 className="ds-font-display text-[24px] font-semibold mb-1 text-white group-hover:text-[#5A45F9] transition-colors tracking-tight">
                  Users & Waitlist
                </h3>
                <p className="ds-font-body text-[#798298] text-[14px] max-w-md leading-relaxed">
                  View waitlist signups, registered users, activity patterns, and comprehensive admin controls.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-4 mt-6 md:mt-0 relative z-10 md:pl-8 border-t md:border-t-0 md:border-l border-[#2d2f37] pt-6 md:pt-0">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="text-left md:text-right">
                  <p className="ds-font-display text-3xl font-semibold text-white tracking-tight">
                    {userCount !== null ? userCount.toLocaleString() : "..."}
                  </p>
                  <p className="ds-font-body text-[11px] font-semibold uppercase tracking-wider text-[#5A45F9] mt-1">Users</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="ds-font-display text-3xl font-semibold text-white tracking-tight">
                    {waitlistCount !== null ? waitlistCount.toLocaleString() : "..."}
                  </p>
                  <p className="ds-font-body text-[11px] font-semibold uppercase tracking-wider text-[#5A45F9] mt-1">Waitlist</p>
                </div>
              </div>
              <span className="text-[#5A45F9] text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 ds-font-body mt-2 md:mt-0">
                Manage accounts <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Secondary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Profiles List */}
          <Link
            href="/admin-profiles"
            className="group ds-card p-7 transition-all hover:border-[#5A45F9]/50 hover:bg-[#151a26] hover:shadow-[0_0_30px_rgba(90,69,249,0.08)] flex flex-col h-full relative"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/70 group-hover:text-[#5A45F9] group-hover:bg-[#5A45F9]/10 group-hover:border-[#5A45F9]/20 transition-all">
              <span className="material-symbols-rounded text-[24px]">id_card</span>
            </div>
            <h3 className="ds-font-display text-[20px] font-semibold mb-2 text-white transition-colors tracking-tight">
              Profiles List
            </h3>
            <p className="ds-font-body text-[#798298] text-[14px] leading-relaxed flex-1">
              Browse and manage all traveler profiles currently active on the platform.
            </p>
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#20242d] group-hover:border-[#5A45F9]/20 transition-colors">
              <span className="ds-font-display text-[15px] font-semibold text-white/90">
                {profileCount !== null ? `${profileCount} Profiles` : "Loading..."}
              </span>
              <span className="material-symbols-rounded text-[18px] text-[#5A45F9] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>

          {/* Featured Profiles */}
          <Link
            href="/admin/profiles"
            className="group ds-card p-7 transition-all hover:border-[#5A45F9]/50 hover:bg-[#151a26] hover:shadow-[0_0_30px_rgba(90,69,249,0.08)] flex flex-col h-full relative"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/70 group-hover:text-[#5A45F9] group-hover:bg-[#5A45F9]/10 group-hover:border-[#5A45F9]/20 transition-all">
              <span className="material-symbols-rounded text-[24px]">public</span>
            </div>
            <h3 className="ds-font-display text-[20px] font-semibold mb-2 text-white transition-colors tracking-tight">
              Featured Profiles
            </h3>
            <p className="ds-font-body text-[#798298] text-[14px] leading-relaxed flex-1">
              Curate and highlight top traveler profiles. Control images, links, and featured status.
            </p>
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#20242d] group-hover:border-[#5A45F9]/20 transition-colors">
              <span className="ds-font-body text-[#5A45F9] text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage featured
              </span>
              <span className="material-symbols-rounded text-[18px] text-[#5A45F9] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>

          {/* Featured Requests */}
          <Link
            href="/admin/featured-requests"
            className="group ds-card p-7 transition-all hover:border-[#5A45F9]/50 hover:bg-[#151a26] hover:shadow-[0_0_30px_rgba(90,69,249,0.08)] flex flex-col h-full relative"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/70 group-hover:text-[#5A45F9] group-hover:bg-[#5A45F9]/10 group-hover:border-[#5A45F9]/20 transition-all">
              <span className="material-symbols-rounded text-[24px]">mark_email_unread</span>
            </div>
            <h3 className="ds-font-display text-[20px] font-semibold mb-2 text-white transition-colors tracking-tight">
              Featured Requests
            </h3>
            <p className="ds-font-body text-[#798298] text-[14px] leading-relaxed flex-1">
              Review applications from users requesting to be featured on the platform.
            </p>
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#20242d] group-hover:border-[#5A45F9]/20 transition-colors">
              <span className="ds-font-body text-[#5A45F9] text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Review queue
              </span>
              <span className="material-symbols-rounded text-[18px] text-[#5A45F9] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>

          {/* Design System */}
          <Link
            href="/designsystem"
            className="group ds-card p-7 transition-all hover:border-[#5A45F9]/50 hover:bg-[#151a26] hover:shadow-[0_0_30px_rgba(90,69,249,0.08)] flex flex-col h-full relative"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/70 group-hover:text-[#5A45F9] group-hover:bg-[#5A45F9]/10 group-hover:border-[#5A45F9]/20 transition-all">
              <span className="material-symbols-rounded text-[24px]">palette</span>
            </div>
            <h3 className="ds-font-display text-[20px] font-semibold mb-2 text-white transition-colors tracking-tight">
              Design System
            </h3>
            <p className="ds-font-body text-[#798298] text-[14px] leading-relaxed flex-1">
              Browse the visual foundations, color palettes, typography, and core components.
            </p>
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#20242d] group-hover:border-[#5A45F9]/20 transition-colors">
              <span className="ds-font-body text-[#5A45F9] text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View components
              </span>
              <span className="material-symbols-rounded text-[18px] text-[#5A45F9] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>

          {/* Recycle Bin */}
          <Link
            href="/admin/recycle-bin"
            className="group ds-card p-7 transition-all hover:border-red-500/50 hover:bg-[#1a1111] hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] flex flex-col h-full relative"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/70 group-hover:text-red-500 group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all">
              <span className="material-symbols-rounded text-[24px]">delete</span>
            </div>
            <h3 className="ds-font-display text-[20px] font-semibold mb-2 text-white transition-colors tracking-tight">
              Recycle Bin
            </h3>
            <p className="ds-font-body text-[#798298] text-[14px] leading-relaxed flex-1">
              Recover or permanently purge soft-deleted records. Items are kept for 30 days.
            </p>
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#20242d] group-hover:border-red-500/20 transition-colors">
              <span className="ds-font-body text-red-500 text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage deletions
              </span>
              <span className="material-symbols-rounded text-[18px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>
          
        </div>
      </div>
    </div>
  );
}
