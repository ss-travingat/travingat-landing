"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

type AdminUser = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  based_in: string;
  countries_traveled: number;
  onboarded: boolean;
  auth_provider: string;
  avatar_url: string;
  cover_image_url: string;
  total_media_count: number;
  image_count: number;
  video_count: number;
  storage_bytes: number;
  last_active_at: string;
  activity_events_30d: number;
  active_days_30d: number;
  weekly_frequency: number;
  status: "active" | "disabled";
  disabled_at?: string;
  disabled_reason: string;
  created_at: string;
  has_explorer_card?: boolean;
  card_style?: string;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDateTime(input: string) {
  if (!input) return "-";
  return new Date(input).toLocaleString();
}

/* ─── Dropdown Menu Component ─── */
function UserActionsDropdown({
  user,
  onDelete,
  onToggleStatus,
  processing,
}: {
  user: AdminUser;
  onDelete: (u: AdminUser) => void;
  onToggleStatus: (u: AdminUser) => void;
  processing: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasExplorerCard = !!user.has_explorer_card;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger – more-dropdown icon */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
        title="More actions"
        disabled={processing}
      >
        <img
          src="/icons/more-dropdown.png"
          alt="More actions"
          className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[90]" onClick={close} />

          {/* Dropdown panel */}
          <div
            className="absolute right-0 top-full mt-1 z-[100] rounded-2xl border border-[#1E1E1E] bg-[#161616] shadow-[20px_20px_20px_rgba(0,0,0,0.25)] text-left overflow-hidden"
            style={{ width: hasExplorerCard ? 276 : 140 }}
          >
            {/* ── Explorer card section (conditional) ── */}
            {hasExplorerCard && (
              <>
                {/* Section header */}
                <p className="px-5 pt-4 pb-1 text-[13px] font-bold text-white tracking-wide">
                  Explore card
                </p>
                {/* View */}
                <a
                  href={`/view/explorercard/${user.id}?style=${user.card_style?.toLowerCase() || "adventure"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={close}
                >
                  View
                </a>
                {/* Edit */}
                <a
                  href={`/edit/explorercard?userId=${user.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={close}
                >
                  Edit
                </a>
                {/* Resend */}
                <button
                  className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                  onClick={() => {
                    alert("Resend explorer card email (not yet wired)");
                    close();
                  }}
                >
                  Resend
                </button>

                {/* Separator */}
                <div className="mx-5 my-2 h-px bg-[#303030]" />
              </>
            )}

            {/* ── Profile section ── */}
            <p className={`px-5 ${hasExplorerCard ? "pt-1" : "pt-4"} pb-1 text-[13px] font-bold text-white tracking-wide`}>
              Profile
            </p>
            {/* View */}
            <a
              href={`/profiles/${user.username || user.id}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              onClick={close}
            >
              View
            </a>
            {/* Edit */}
            <a
              href={`/admin/profiles?edit=${user.id}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              onClick={close}
            >
              Edit
            </a>
            {/* Resend email */}
            <button
              className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
              onClick={() => {
                alert("Resend profile email (not yet wired)");
                close();
              }}
            >
              Resend email
            </button>
            {/* Delete profile */}
            <button
              className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
              onClick={() => {
                alert("Delete profile (not yet wired)");
                close();
              }}
            >
              Delete
            </button>

            {hasExplorerCard && (
              <>
                {/* Separator */}
                <div className="mx-5 my-2 h-px bg-[#303030]" />

                {/* Resend waitlist confirmation email */}
                <button
                  className="w-full px-5 py-2 text-[12px] text-white/70 hover:text-white hover:bg-white/5 text-left transition-colors"
                  onClick={() => {
                    alert("Resend waitlist confirmation email (not yet wired)");
                    close();
                  }}
                >
                  Resend waitlist confirmation email
                </button>
              </>
            )}

            {/* Separator */}
            <div className="mx-5 my-2 h-px bg-[#303030]" />

            {/* Delete everything */}
            <button
              className="w-full px-5 pt-1 pb-4 text-[12px] text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/5 text-left transition-colors"
              onClick={() => {
                onDelete(user);
                close();
              }}
            >
              Delete everything
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export function MainUsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUserID, setProcessingUserID] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users?limit=50", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load users");
        return;
      }
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onToggleStatus = async (user: AdminUser) => {
    const disableTarget = user.status !== "disabled";
    const reason = disableTarget
      ? window.prompt("Disable reason (optional):", user.disabled_reason || "") || ""
      : "";

    setProcessingUserID(user.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: disableTarget, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update account status");
        return;
      }
      await loadUsers();
    } catch {
      setError("Failed to update account status");
    } finally {
      setProcessingUserID("");
    }
  };

  const onDeleteUser = async (user: AdminUser) => {
    const confirmed = window.confirm(`Delete account for ${user.email}? This action is permanent.`);
    if (!confirmed) return;

    setProcessingUserID(user.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete account");
        return;
      }
      await loadUsers();
    } catch {
      setError("Failed to delete account");
    } finally {
      setProcessingUserID("");
    }
  };

  const onSignOut = async () => {
    await fetch("/api/cms/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.display_name || "").toLowerCase().includes(q) ||
        (u.based_in || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="flex-1 w-full relative">

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[28px] font-bold tracking-[-0.5px]">Users</h2>
            <p className="text-white/40 text-sm">View account analytics, activity patterns, media usage, and admin controls.</p>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email / username / country"
            className="max-w-[320px] bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#5A45F9]/60"
          />
        </div>

        {loading && <p className="text-white/50 text-sm">Loading users...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
            <table className="w-full min-w-[1700px] text-sm">
              <thead className="text-white/60 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Username</th>
                  <th className="text-left px-4 py-3 font-medium">Profile</th>
                  <th className="text-left px-4 py-3 font-medium">Media</th>
                  <th className="text-left px-4 py-3 font-medium">Storage</th>
                  <th className="text-left px-4 py-3 font-medium">Activity</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 min-w-[240px]">
                      <p className="font-medium">{u.email}</p>
                      <p className="text-white/45 text-xs">{u.id}</p>
                    </td>
                    <td className="px-4 py-3">{u.username}</td>
                    <td className="px-4 py-3">
                      <p className="text-white/90">{u.display_name || "-"}</p>
                      <p className="text-white/50 text-xs uppercase">{u.auth_provider} • {u.based_in || "NA"}</p>
                      <p className="text-white/50 text-xs">Countries: {u.countries_traveled} • Onboarded: {u.onboarded ? "Yes" : "No"}</p>
                    </td>
                    <td className="px-4 py-3 min-w-[230px]">
                      <div className="flex items-center gap-2">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10" />
                        )}
                        {u.cover_image_url ? (
                          <img src={u.cover_image_url} alt="Cover" className="w-24 h-10 rounded-md object-cover border border-white/10" />
                        ) : (
                          <div className="w-24 h-10 rounded-md bg-white/10" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p>Total: {u.total_media_count}</p>
                      <p className="text-white/55 text-xs">Images: {u.image_count} • Videos: {u.video_count}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{formatBytes(u.storage_bytes)}</p>
                    </td>
                    <td className="px-4 py-3 min-w-[220px]">
                      <p className="text-white/90">Last: {formatDateTime(u.last_active_at)}</p>
                      <p className="text-white/55 text-xs">Events(30d): {u.activity_events_30d} • Active days: {u.active_days_30d}</p>
                      <p className="text-white/55 text-xs">Frequency: {u.weekly_frequency.toFixed(1)} / week</p>
                    </td>
                    <td className="px-4 py-3 min-w-[190px]">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${u.status === "active" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                        {u.status}
                      </span>
                      {u.status === "disabled" ? (
                        <p className="text-xs text-white/50 mt-1">
                          {u.disabled_reason || "No reason provided"}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {formatDateTime(u.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <UserActionsDropdown
                        user={u}
                        onDelete={onDeleteUser}
                        onToggleStatus={onToggleStatus}
                        processing={processingUserID === u.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-6 text-sm text-white/50">No users found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
