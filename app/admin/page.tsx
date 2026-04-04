"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [testimonialCount, setTestimonialCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  const onSignOut = async () => {
    await fetch("/api/cms/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTestimonialCount(d.length))
      .catch(() => {});
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setBlogCount(d.length))
      .catch(() => {});

    fetch("/api/admin/users", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => typeof d?.count === "number" && setUserCount(d.count))
      .catch(() => {});

    fetch("/api/waitlist", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => typeof d?.total === "number" && setWaitlistCount(d.total))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Back to site
          </Link>
          <button onClick={onSignOut} className="text-white/40 hover:text-white text-sm transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-[28px] font-bold tracking-[-0.5px] mb-2">
          Content Management
        </h2>
        <p className="text-white/40 text-sm mb-10">
          Manage all your site content from here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Testimonials Card */}
          <Link
            href="/admin/testimonials"
            className="group bg-[#141414] border border-white/10 hover:border-[#5A45F9]/50 rounded-2xl p-7 transition-all hover:shadow-[0_0_30px_rgba(90,69,249,0.1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5A45F9]/10 flex items-center justify-center text-2xl mb-5">
              💬
            </div>
            <h3 className="text-[20px] font-semibold mb-1.5 group-hover:text-[#5A45F9] transition-colors">
              Testimonials
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Manage customer reviews, photos, and social links displayed on the
              homepage.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">
                {testimonialCount !== null
                  ? `${testimonialCount} testimonial${testimonialCount !== 1 ? "s" : ""}`
                  : "Loading…"}
              </span>
              <span className="text-[#5A45F9] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </div>
          </Link>

          {/* Blogs Card */}
          <Link
            href="/admin/blogs"
            className="group bg-[#141414] border border-white/10 hover:border-[#5A45F9]/50 rounded-2xl p-7 transition-all hover:shadow-[0_0_30px_rgba(90,69,249,0.1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5A45F9]/10 flex items-center justify-center text-2xl mb-5">
              ✍️
            </div>
            <h3 className="text-[20px] font-semibold mb-1.5 group-hover:text-[#5A45F9] transition-colors">
              Blog Posts
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Write and publish blog posts with the WYSIWYG editor. Supports
              images and YouTube embeds.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">
                {blogCount !== null
                  ? `${blogCount} post${blogCount !== 1 ? "s" : ""}`
                  : "Loading…"}
              </span>
              <span className="text-[#5A45F9] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </div>
          </Link>

          {/* Users Card */}
          <Link
            href="/admin/users"
            className="group bg-[#141414] border border-white/10 hover:border-[#5A45F9]/50 rounded-2xl p-7 transition-all hover:shadow-[0_0_30px_rgba(90,69,249,0.1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5A45F9]/10 flex items-center justify-center text-2xl mb-5">
              👤
            </div>
            <h3 className="text-[20px] font-semibold mb-1.5 group-hover:text-[#5A45F9] transition-colors">
              Users
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              View registered users, providers, onboarding status, and account creation times.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">
                {userCount !== null ? `${userCount} users` : "Loading…"}
              </span>
              <span className="text-[#5A45F9] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </div>
          </Link>

          {/* Waitlist Card */}
          <Link
            href="/admin/waitlist"
            className="group bg-[#141414] border border-white/10 hover:border-[#5A45F9]/50 rounded-2xl p-7 transition-all hover:shadow-[0_0_30px_rgba(90,69,249,0.1)]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5A45F9]/10 flex items-center justify-center text-2xl mb-5">
              📋
            </div>
            <h3 className="text-[20px] font-semibold mb-1.5 group-hover:text-[#5A45F9] transition-colors">
              Waitlist
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              View waitlist signups with device, browser, and location details.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">
                {waitlistCount !== null
                  ? `${waitlistCount} signup${waitlistCount !== 1 ? "s" : ""}`
                  : "Loading…"}
              </span>
              <span className="text-[#5A45F9] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
