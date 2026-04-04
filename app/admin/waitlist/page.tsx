"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type WaitlistEntry = {
  id: number;
  email: string;
  browser: string;
  device: string;
  country: string;
  city: string;
  ip: string;
  created_at: string;
};

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/waitlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? entries.filter(
        (e) =>
          e.email.toLowerCase().includes(search.toLowerCase()) ||
          e.country?.toLowerCase().includes(search.toLowerCase()) ||
          e.city?.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const deviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return "smartphone";
      case "tablet":
        return "tablet_mac";
      default:
        return "desktop_windows";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-lg font-semibold">Waitlist</h1>
          <span className="text-xs text-white/30 bg-white/5 rounded-full px-2.5 py-0.5">
            {total} signups
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <p className="text-[28px] font-bold text-white">{total}</p>
            <p className="text-xs text-white/40 mt-1">Total signups</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <p className="text-[28px] font-bold text-white">
              {entries.filter((e) => e.device === "desktop").length}
            </p>
            <p className="text-xs text-white/40 mt-1">Desktop</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <p className="text-[28px] font-bold text-white">
              {entries.filter((e) => e.device === "mobile").length}
            </p>
            <p className="text-xs text-white/40 mt-1">Mobile</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <p className="text-[28px] font-bold text-white">
              {entries.filter((e) => e.device === "tablet").length}
            </p>
            <p className="text-xs text-white/40 mt-1">Tablet</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email, country, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md h-10 rounded-lg border border-white/10 bg-[#141414] px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#5A45F9]/50"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-white/40">Loading waitlist...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            {search ? "No matches found." : "No waitlist signups yet."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#141414]">
                  <th className="px-4 py-3 text-xs font-medium text-white/40">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Device</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Browser</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Location</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3 text-white/20">{i + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{entry.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-white/60">
                        <span className="material-symbols-rounded text-[16px]">
                          {deviceIcon(entry.device)}
                        </span>
                        <span className="capitalize">{entry.device}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{entry.browser}</td>
                    <td className="px-4 py-3 text-white/60">
                      {entry.city !== "Unknown" ? `${entry.city}, ` : ""}
                      {entry.country}
                    </td>
                    <td className="px-4 py-3 text-white/40 whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
