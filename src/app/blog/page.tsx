"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toLandingAssetUrl } from "@/lib/landing-assets";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-[#141414] border border-white/5 hover:border-white/15 transition-all"
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={toLandingAssetUrl(blog.coverImage)}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
          {blog.tags.length > 0 && (
            <>
              <span className="text-white/60 font-medium">{blog.tags[0]}</span>
              <span>•</span>
            </>
          )}
          <span>{formatDate(blog.publishedAt)}</span>
        </div>
        <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.2px] text-white mb-2 group-hover:text-[#5A45F9] transition-colors">
          {blog.title}
        </h3>
        <p className="text-[13px] text-white/40 leading-relaxed line-clamp-2 mt-auto">
          {blog.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = blogs[0] ?? null;
  const rest = blogs.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-[600px] h-[600px] rounded-full border border-white/[0.06]" />
          <div className="absolute w-[450px] h-[450px] rounded-full border border-white/[0.04]" />
        </div>
        <div className="relative max-w-[1100px] mx-auto px-6 pt-16 pb-14 text-center">
          <h1 className="text-[48px] md:text-[64px] font-bold tracking-[-2px] mb-4">
            Newsroom
          </h1>
          <p className="text-white/50 text-[15px] md:text-[16px] max-w-md mx-auto leading-relaxed">
            News and resources from the frontiers of travel, design, and web applications.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center text-white/30">Loading…</div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center text-white/30">No posts yet</div>
      ) : (
        <>
          {/* Featured Post */}
          {featured && (
            <section className="max-w-[1100px] mx-auto px-6 mb-14">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-[#141414] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="p-7 md:p-10 flex flex-col justify-between">
                  {featured.tags.length > 0 && (
                    <span className="text-xs font-medium uppercase tracking-wider text-white/50 mb-4">
                      {featured.tags[0]}
                    </span>
                  )}
                  <div>
                    <h2 className="text-[24px] md:text-[28px] font-bold leading-tight tracking-[-0.5px] text-white mb-3 group-hover:text-[#5A45F9] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[14px] text-white/40 leading-relaxed line-clamp-3 mb-6">
                      {featured.excerpt}
                    </p>
                  </div>
                  <span className="text-sm text-white/30">
                    {formatDate(featured.publishedAt)}
                  </span>
                </div>
                <div className="relative h-[250px] md:h-auto overflow-hidden">
                  <Image
                    src={toLandingAssetUrl(featured.coverImage)}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </Link>
            </section>
          )}

          {/* Newsletter + Follow Section */}
          <section className="max-w-[1100px] mx-auto px-6 mb-14">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 py-8 border-t border-b border-white/10">
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.3px] mb-4">
                  Subscribe to our newsletter for daily industry insights
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="flex-1 max-w-xs rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25"
                  />
                  <button className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5 transition">
                    Start Free Trial
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.3px] mb-2">
                  Follow us
                </h3>
                <p className="text-sm text-white/40 mb-4">
                  Get the latest news and travel inspiration.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-white/40 hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white/40 hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 13 23" fill="currentColor">
                      <path d="M8.5 13H11.5L13 7H8.5V4.5C8.5 3.12 8.5 2 11 2H13V0.14C12.58 0.097 10.94 0 9.22 0C5.64 0 3.5 1.82 3.5 5.16V7H0V13H3.5V23H8.5V13Z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white/40 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.507a2.786 2.786 0 00-.766-1.27 3.05 3.05 0 00-1.338-.742C19.518 4 11.994 4 11.994 4a76.624 76.624 0 00-9.39.47 3.16 3.16 0 00-1.338.76c-.37.356-.638.795-.766 1.277A29.09 29.09 0 000 12a29.09 29.09 0 00.5 5.493 2.786 2.786 0 00.766 1.27 3.05 3.05 0 001.338.742c1.883.494 9.39.494 9.39.494a76.8 76.8 0 009.402-.494 3.05 3.05 0 001.338-.742 2.786 2.786 0 00.766-1.27A29.09 29.09 0 0024 12a29.09 29.09 0 00-.5-5.493zM9.602 15.424V8.577L15.862 12l-6.26 3.424z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Blog Grid */}
          {rest.length > 0 && (
            <section className="max-w-[1100px] mx-auto px-6 pb-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
