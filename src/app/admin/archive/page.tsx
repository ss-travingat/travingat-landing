"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ArchivedUser = {
  id: string;
  original_id: string;
  email: string;
  source: string;
  data: any;
  deleted_at: string;
};

export default function AdminArchivePage() {
  const [archivedUsers, setArchivedUsers] = useState<ArchivedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingID, setProcessingID] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadArchive = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/archive", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load archive");
        return;
      }
      setArchivedUsers(Array.isArray(data.archived_users) ? data.archived_users : []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchive();
  }, []);

  const onPermanentlyDelete = async (entry: ArchivedUser) => {
    const confirmed = window.confirm(`Permanently delete record for ${entry.email}? This action CANNOT be undone.`);
    if (!confirmed) return;

    setProcessingID(entry.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/archive/${entry.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to permanently delete record");
        return;
      }
      await loadArchive();
    } catch {
      setError("Failed to permanently delete record");
    } finally {
      setProcessingID("");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return archivedUsers;
    return archivedUsers.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.source.toLowerCase().includes(q)
    );
  }, [archivedUsers, query]);

  const calculateDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const deletionDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const msLeft = deletionDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <h1 className="text-lg font-semibold">Admin Dashboard - Archive</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Back to admin
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.5px]">Archived Users</h2>
            <p className="text-white/40 text-sm">Deleted users are kept here for 30 days before being automatically purged.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/waitlist"
              className="h-10 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-[#141414] text-white/50 border border-white/10 hover:text-white hover:border-white/30 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
              Go to Waitlist
            </Link>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email or source"
              className="max-w-[320px] bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#5A45F9]/60"
            />
          </div>
        </div>

        {loading && <p className="text-white/50 text-sm">Loading archive...</p>}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
            <table className="w-full text-sm">
              <thead className="text-white/60 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Email / ID</th>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-left px-4 py-3 font-medium">Deleted At</th>
                  <th className="text-left px-4 py-3 font-medium">Auto-Purge In</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const daysLeft = calculateDaysLeft(u.deleted_at);
                  return (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <p className="font-medium">{u.email}</p>
                        <p className="text-white/45 text-xs">Original ID: {u.original_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center bg-white/5 text-white/70 text-[10px] uppercase font-medium px-2 py-0.5 rounded border border-white/10 tracking-wider">
                          {u.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {new Date(u.deleted_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {daysLeft > 0 ? (
                          <span className="text-yellow-400/80">{daysLeft} days</span>
                        ) : (
                          <span className="text-red-400/80">Pending Purge</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          onClick={() => onPermanentlyDelete(u)}
                          variant="ghost"
                          size="sm"
                          loading={processingID === u.id}
                          className="flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs font-medium border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/70 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          Delete Forever
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-6 text-sm text-white/50 text-center">No archived users found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
