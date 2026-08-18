"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type WaitlistEntry = {
  id: number;
  email: string;
  browser: string;
  device: string;
  country: string;
  city: string;
  ip: string;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
  source: string;
  explorer_card_status: string;
  countries_count: number | null;
  card_style: string | null;
  user_uuid?: string;
};

type Filter = "all" | "confirmed" | "unconfirmed";

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setTotal(data.total ?? 0);
        setConfirmedCount(data.confirmed ?? 0);
        setUnconfirmedCount(data.unconfirmed ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      !search ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.country?.toLowerCase().includes(search.toLowerCase()) ||
      e.city?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "confirmed" && e.confirmed) ||
      (filter === "unconfirmed" && !e.confirmed);

    return matchesSearch && matchesFilter;
  });

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
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
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
          <div className="bg-[#141414] border border-[#163d22]/60 rounded-xl p-5">
            <p className="text-[28px] font-bold text-[#4ade80]">{confirmedCount}</p>
            <p className="text-xs text-white/40 mt-1">Confirmed</p>
          </div>
          <div className="bg-[#141414] border border-[#3d2e0e]/60 rounded-xl p-5">
            <p className="text-[28px] font-bold text-[#fbbf24]">{unconfirmedCount}</p>
            <p className="text-xs text-white/40 mt-1">Not confirmed</p>
          </div>
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <p className="text-[28px] font-bold text-white">
              {total > 0 ? Math.round((confirmedCount / total) * 100) : 0}%
            </p>
            <p className="text-xs text-white/40 mt-1">Confirm rate</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            type="text"
            placeholder="Search by email, country, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md border border-white/10 bg-[#141414] placeholder:text-white/30 focus:border-[#5A45F9]/50"
          />
          <div className="flex gap-2 items-center">
            {(["all", "confirmed", "unconfirmed"] as Filter[]).map((f) => (
              <Button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                variant="ghost"
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-white !text-black"
                    : "bg-[#141414] text-white/50 border border-white/10 hover:text-white"
                }`}
              >
                {f}
              </Button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Link
              href="/admin/archive"
              className="h-10 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-[#141414] text-white/50 border border-white/10 hover:text-white hover:border-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
              Archive
            </Link>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-white/40">Loading waitlist...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">
            {search || filter !== "all" ? "No matches found." : "No waitlist signups yet."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#141414]">
                  <th className="px-4 py-3 text-xs font-medium text-white/40 sticky left-0 bg-[#141414] z-10 border-r border-white/5">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Source</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Explorer card</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Countries</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Card style</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Device</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Browser</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Location</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Joined</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="group border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-bold sticky left-0 bg-[#0a0a0a] group-hover:bg-[#0f0f0f] z-10 border-r border-white/5">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{entry.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center bg-white/5 text-white/70 text-[10px] uppercase font-medium px-2 py-0.5 rounded border border-white/10 tracking-wider">
                        {entry.source || "Waitlist"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 capitalize">
                      {entry.explorer_card_status || "Not created"}
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {entry.countries_count ?? "--"}
                    </td>
                    <td className="px-4 py-3 text-white/60 capitalize">
                      {entry.card_style || "--"}
                    </td>
                    <td className="px-4 py-3">
                      {entry.confirmed ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#0e1c12] border border-[#163d22] text-[#4ade80] text-xs font-medium px-2.5 py-1 rounded-full">
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#4ade80",
                              display: "inline-block",
                            }}
                          />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#1c1810] border border-[#3d2e0e] text-[#fbbf24] text-xs font-medium px-2.5 py-1 rounded-full">
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#fbbf24",
                              display: "inline-block",
                            }}
                          />
                          Pending
                        </span>
                      )}
                    </td>
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
                    <td className="px-4 py-3 text-right relative">
                      <div className="relative inline-block">
                        <button 
                          className="text-white/40 hover:text-white transition-colors p-1"
                          title="Actions"
                          onClick={() => setOpenDropdownId(openDropdownId === entry.id ? null : entry.id)}
                        >
                          <span className="material-symbols-rounded text-[18px] align-middle">more_horiz</span>
                        </button>
                        
                        {openDropdownId === entry.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-[#1a1c22] border border-white/10 rounded-lg shadow-xl z-40 overflow-hidden text-left py-1">
                              {entry.explorer_card_status?.toLowerCase() === "created" && entry.user_uuid && (
                                <a 
                                  href={`/view/explorercard/${entry.user_uuid}?style=${entry.card_style?.toLowerCase() || 'adventure'}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                                >
                                  View Explorer Card
                                </a>
                              )}
                              <button className="w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors">Contact user</button>
                              <button className="w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors">Suspend</button>
                              <button className="w-full px-3 py-2 text-xs text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-[#ef4444]/10 text-left transition-colors">Ban</button>
                              <div className="h-px w-full bg-white/5 my-1" />
                              <button className="w-full px-3 py-2 text-xs text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-[#ef4444]/10 text-left transition-colors" onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this waitlist entry?")) {
                                  try {
                                    const res = await fetch(`/api/admin/waitlist/${entry.id}`, { method: "DELETE" });
                                    if (res.ok) {
                                      setEntries(entries.filter(e => e.id !== entry.id));
                                      setTotal(total - 1);
                                      if (entry.confirmed) setConfirmedCount(confirmedCount - 1);
                                      else setUnconfirmedCount(unconfirmedCount - 1);
                                    } else {
                                      alert("Failed to delete entry");
                                    }
                                  } catch (err) {
                                    alert("Error deleting entry");
                                  }
                                }
                                setOpenDropdownId(null);
                              }}>Delete</button>
                            </div>
                          </>
                        )}
                      </div>
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
