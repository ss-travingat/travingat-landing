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
  get_featured_status: string;
  countries_count: number | null;
  card_style: string | null;
  user_uuid?: string;
};

type Filter = "all" | "confirmed" | "unconfirmed";

export function WaitlistTab() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [unconfirmedCount, setUnconfirmedCount] = useState(0);
  const [explorerCardCount, setExplorerCardCount] = useState(0);
  const [getFeaturedCount, setGetFeaturedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [detailsModalEntry, setDetailsModalEntry] = useState<WaitlistEntry | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    source: "",
    explorer_card_status: "",
    get_featured_status: "",
    device: "",
    browser: "",
    country: ""
  });

  const uniqueSources = Array.from(new Set(entries.map((e) => e.source || "Waitlist")));
  const uniqueDevices = Array.from(new Set(entries.map((e) => e.device)));
  const uniqueBrowsers = Array.from(new Set(entries.map((e) => e.browser)));
  const uniqueCountries = Array.from(new Set(entries.map((e) => e.country))).filter(Boolean);

  const activeFiltersCount = Object.values(advancedFilters).filter(v => v !== "").length;

  useEffect(() => {
    fetch("/api/waitlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setTotal(data.total ?? 0);
        setConfirmedCount(data.confirmed ?? 0);
        setUnconfirmedCount(data.unconfirmed ?? 0);
        setExplorerCardCount(data.explorerCardCount ?? 0);
        setGetFeaturedCount(data.getFeaturedCount ?? 0);
      })
      .catch(() => { })
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

    const matchesAdvanced =
      (!advancedFilters.source || (e.source || "Waitlist") === advancedFilters.source) &&
      (!advancedFilters.explorer_card_status ||
        (advancedFilters.explorer_card_status === 'Created' && e.explorer_card_status === 'Created') ||
        (advancedFilters.explorer_card_status === 'Not created' && e.explorer_card_status !== 'Created')) &&
      (!advancedFilters.get_featured_status ||
        (advancedFilters.get_featured_status === 'Created' && e.get_featured_status === 'Created') ||
        (advancedFilters.get_featured_status === 'Not created' && e.get_featured_status !== 'Created')) &&
      (!advancedFilters.device || e.device === advancedFilters.device) &&
      (!advancedFilters.browser || e.browser === advancedFilters.browser) &&
      (!advancedFilters.country || e.country === advancedFilters.country);

    return matchesSearch && matchesFilter && matchesAdvanced;
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
    <div className="flex-1 w-full relative">

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
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
          <div className="bg-[#141414] border border-[#163d22]/60 rounded-xl p-5">
            <p className="text-[28px] font-bold text-[#4ade80]">{explorerCardCount}</p>
            <p className="text-xs text-white/40 mt-1">Explorer card</p>
          </div>
          <div className="bg-[#141414] border border-[#163d22]/60 rounded-xl p-5">
            <p className="text-[28px] font-bold text-[#4ade80]">{getFeaturedCount}</p>
            <p className="text-xs text-white/40 mt-1">Get featured</p>
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
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                    ? "bg-white !text-black"
                    : "bg-[#141414] text-white/50 border border-white/10 hover:text-white"
                  }`}
              >
                {f}
              </Button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${activeFiltersCount > 0
                  ? "bg-[#163d22] text-[#4ade80] border-[#4ade80]/30"
                  : "bg-[#141414] text-white/50 border-white/10 hover:text-white hover:border-white/30"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filter
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#4ade80] text-[10px] font-bold text-[#0a0a0a]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <Link
              href="/admin/recycle-bin"
              className="h-10 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-[#141414] text-white/50 border border-white/10 hover:text-white hover:border-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
              Recycle Bin
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
          <div className={`overflow-x-auto rounded-xl border border-white/10 transition-all ${openDropdownId !== null ? 'pb-40' : ''}`}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#141414]">
                  <th className="px-4 py-3 text-xs font-medium text-white/40 sticky left-0 bg-[#141414] z-20 border-r border-white/5">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Source</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Explorer card</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Get featured</th>
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
                    <td className="px-4 py-3 text-white/60 capitalize">
                      {entry.get_featured_status || "Not created"}
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
                    <td className={`px-4 py-3 text-right relative ${openDropdownId === entry.id ? 'z-[100]' : ''}`}>
                      <div className="relative inline-block">
                        <button 
                          className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                          title="More actions"
                          onClick={() => setOpenDropdownId(openDropdownId === entry.id ? null : entry.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50 hover:opacity-100 transition-opacity">
                            <circle cx="8" cy="3" r="1.5" fill="white"/>
                            <circle cx="8" cy="8" r="1.5" fill="white"/>
                            <circle cx="8" cy="13" r="1.5" fill="white"/>
                          </svg>
                        </button>

                        {openDropdownId === entry.id && (
                          <>
                            <div
                              className="fixed inset-0 z-[90]"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div
                              className="absolute right-0 top-full mt-1 z-[100] rounded-2xl border border-[#1E1E1E] bg-[#161616] shadow-[20px_20px_20px_rgba(0,0,0,0.25)] text-left overflow-hidden"
                              style={{ width: entry.explorer_card_status?.toLowerCase() === "created" ? 276 : 140 }}
                            >
                              {/* ── Explorer card section (only if created) ── */}
                              {entry.explorer_card_status?.toLowerCase() === "created" && (
                                <>
                                  <p className="px-5 pt-4 pb-1 text-[13px] font-bold text-white tracking-wide">
                                    Explore card
                                  </p>
                                  {entry.user_uuid && (
                                    <a
                                      href={`/view/explorercard/${entry.user_uuid}?style=${entry.card_style?.toLowerCase() || 'adventure'}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      View
                                    </a>
                                  )}
                                  {entry.user_uuid && (
                                    <a
                                      href={`/edit/explorercard?userId=${entry.user_uuid}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      Edit
                                    </a>
                                  )}
                                  <button
                                    className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                                    onClick={() => {
                                      alert("Resend explorer card email (not yet wired)");
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    Resend
                                  </button>
                                  <div className="mx-5 my-2 h-px bg-[#303030]" />
                                </>
                              )}

                              {/* ── Profile section ── */}
                              <p className={`px-5 ${entry.explorer_card_status?.toLowerCase() === "created" ? "pt-1" : "pt-4"} pb-1 text-[13px] font-bold text-white tracking-wide`}>
                                Profile
                              </p>
                              {entry.user_uuid && (
                                <button
                                  className="block w-full px-5 py-2 text-[12px] text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                  onClick={() => {
                                    setDetailsModalEntry(entry);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  View Details
                                </button>
                              )}
                              {entry.user_uuid && (
                                <a
                                  href={`/admin/profiles?edit=${entry.user_uuid}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                  onClick={() => setOpenDropdownId(null)}
                                >
                                  Edit
                                </a>
                              )}
                              <button
                                className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                                onClick={() => {
                                  alert("Resend email (not yet wired)");
                                  setOpenDropdownId(null);
                                }}
                              >
                                Resend email
                              </button>
                              <button
                                className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                                onClick={() => {
                                  alert("Delete profile (not yet wired)");
                                  setOpenDropdownId(null);
                                }}
                              >
                                Delete
                              </button>

                              {/* ── Resend waitlist confirmation (only if explorer card) ── */}
                              {entry.explorer_card_status?.toLowerCase() === "created" && (
                                <>
                                  <div className="mx-5 my-2 h-px bg-[#303030]" />
                                  <button
                                    className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                                    onClick={() => {
                                      alert("Resend waitlist confirmation email (not yet wired)");
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    Resend waitlist confirmation email
                                  </button>
                                </>
                              )}

                              {/* ── Separator + Delete everything ── */}
                              <div className="mx-5 my-2 h-px bg-[#303030]" />
                              <button
                                className="w-full px-5 pt-1 pb-4 text-[12px] text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/5 text-left transition-colors"
                                onClick={async () => {
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
                                }}
                              >
                                Delete everything
                              </button>
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
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
          <div className="bg-[#141414] border border-white/10 rounded-xl w-full max-w-lg p-6 relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Advanced Filters</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-white/40 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Source */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Source</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.source}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, source: e.target.value })}
                >
                  <option value="">All Sources</option>
                  {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Explorer Card Status */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Explorer Card</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.explorer_card_status}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, explorer_card_status: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Created">Created</option>
                  <option value="Not created">Not created</option>
                </select>
              </div>

              {/* Get Featured Status */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Get Featured</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.get_featured_status}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, get_featured_status: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Created">Created</option>
                  <option value="Not created">Not created</option>
                </select>
              </div>

              {/* Device */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Device</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.device}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, device: e.target.value })}
                >
                  <option value="">All Devices</option>
                  {uniqueDevices.map(d => d && <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Browser */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Browser</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.browser}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, browser: e.target.value })}
                >
                  <option value="">All Browsers</option>
                  {uniqueBrowsers.map(b => b && <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Country</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#5A45F9]/50 focus:outline-none"
                  value={advancedFilters.country}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, country: e.target.value })}
                >
                  <option value="">All Countries</option>
                  {uniqueCountries.map(c => c && <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                onClick={() => setAdvancedFilters({
                  source: "",
                  explorer_card_status: "",
                  get_featured_status: "",
                  device: "",
                  browser: "",
                  country: ""
                })}
              >
                Clear all
              </button>
              <button
                className="px-5 py-2 text-sm font-medium bg-[#5A45F9] text-white rounded-lg hover:bg-[#4b3ae0] transition-colors"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Side Panel */}
      {detailsModalEntry && (
        <div className="fixed inset-0 z-[120] flex justify-end p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailsModalEntry(null)} />
          <div className="bg-[#161616] border border-[#1E1E1E] rounded-2xl w-[420px] h-full relative z-10 shadow-[20px_20px_40px_rgba(0,0,0,0.40)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            
            <div className="p-6 flex justify-between items-center bg-[#161616] shrink-0">
              <h2 className="text-xl font-bold text-white">View details</h2>
              <button 
                onClick={() => setDetailsModalEntry(null)} 
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-md p-1.5 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="px-6 pb-8 overflow-y-auto flex-1 flex flex-col">
              
              {/* Basic info */}
              <div className="mb-6">
                <h3 className="text-[15px] font-bold text-white mb-4">Basic info</h3>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  {detailsModalEntry.user_uuid && (
                    <div className="grid grid-cols-[130px_1fr] items-center">
                      <span className="text-white/50 font-medium">User ID</span>
                      <span className="text-white font-mono text-xs">{detailsModalEntry.user_uuid}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Email</span>
                    <span className="text-white break-all">{detailsModalEntry.email}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Country</span>
                    <span className="text-white">{detailsModalEntry.country || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Joined</span>
                    <span className="text-white">
                      {new Date(detailsModalEntry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {new Date(detailsModalEntry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Source</span>
                    <span className="text-white">{detailsModalEntry.source || "Waitlist"}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Waitlist status</span>
                    <div className="flex">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${
                        detailsModalEntry.confirmed 
                          ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20" 
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      }`}>
                        {detailsModalEntry.confirmed ? "Confirmed" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Email verified</span>
                    <span className="text-white">
                      {detailsModalEntry.confirmed_at ? (
                        <>{new Date(detailsModalEntry.confirmed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {new Date(detailsModalEntry.confirmed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-white/5 mb-6" />

              {/* Explorer Card */}
              <div className="mb-6">
                <h3 className="text-[15px] font-bold text-white mb-4">Explorer Card</h3>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Status</span>
                    <div className="flex">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${
                        detailsModalEntry.explorer_card_status?.toLowerCase() === 'created'
                          ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20" 
                          : "bg-white/10 text-white/70 border border-white/10"
                      }`}>
                        {detailsModalEntry.explorer_card_status || "Not created"}
                      </span>
                    </div>
                  </div>
                  {detailsModalEntry.explorer_card_status?.toLowerCase() === 'created' && (
                    <>
                      <div className="grid grid-cols-[130px_1fr] items-center">
                        <span className="text-white/50 font-medium">Card style</span>
                        <span className="text-white capitalize">{detailsModalEntry.card_style || "Adventure"}</span>
                      </div>
                      <div className="grid grid-cols-[130px_1fr] items-center">
                        <span className="text-white/50 font-medium">Countries visited</span>
                        <span className="text-white">{detailsModalEntry.countries_count || 0}</span>
                      </div>
                      <div className="grid grid-cols-[130px_1fr] items-center">
                        <span className="text-white/50 font-medium">View card</span>
                        <a 
                          href={`/view/explorercard/${detailsModalEntry.user_uuid}?style=${detailsModalEntry.card_style?.toLowerCase() || 'adventure'}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#60a5fa] hover:underline"
                        >
                          Open card
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-white/5 mb-6" />

              {/* Featured Application */}
              <div className="mb-6">
                <h3 className="text-[15px] font-bold text-white mb-4">Featured Application</h3>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Status</span>
                    <div className="flex">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${
                        detailsModalEntry.get_featured_status?.toLowerCase() === 'approved'
                          ? "bg-[#60a5fa]/10 text-[#60a5fa] border border-[#60a5fa]/20"
                          : detailsModalEntry.get_featured_status?.toLowerCase() === 'created'
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-white/10 text-white/70 border border-white/10"
                      }`}>
                        {detailsModalEntry.get_featured_status || "Not created"}
                      </span>
                    </div>
                  </div>
                  
                  {detailsModalEntry.get_featured_status?.toLowerCase() === 'created' && (
                    <div className="flex gap-3 mt-2">
                      <button className="px-4 py-2 bg-[#e8f5e9] text-[#1b5e20] hover:bg-[#c8e6c9] font-medium rounded-lg text-[13px] transition-colors">
                        Mark as Featured
                      </button>
                      <button className="px-4 py-2 bg-white text-black hover:bg-gray-100 font-medium rounded-lg text-[13px] transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-white/5 mb-6" />

              {/* Additional info */}
              <div>
                <h3 className="text-[15px] font-bold text-white mb-4">Additional info</h3>
                <div className="flex flex-col gap-3 text-[13.5px]">
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Device</span>
                    <span className="text-white">{detailsModalEntry.device || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Browser</span>
                    <span className="text-white">{detailsModalEntry.browser || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Location</span>
                    <span className="text-white">
                      {[detailsModalEntry.city, detailsModalEntry.country].filter(Boolean).join(", ") || "N/A"}
                    </span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">IP address</span>
                    <span className="text-white">{detailsModalEntry.ip || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] items-center">
                    <span className="text-white/50 font-medium">Last seen</span>
                    <span className="text-white">
                      {new Date(detailsModalEntry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {new Date(detailsModalEntry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
