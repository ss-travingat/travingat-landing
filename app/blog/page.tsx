"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-[-0.5px]">
            Travingat
          </Link>
          <span className="text-white/40 text-sm" style={{ fontFamily: "'Georgia', serif" }}>
            Blog
          </span>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-12">
        <h1
          className="text-[36px] xl:text-[48px] font-bold tracking-[-1.5px] mb-2"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Stories & Insights
        </h1>
        <p className="text-white/40 text-lg mb-12" style={{ fontFamily: "'Georgia', serif" }}>
          Travel inspiration, tips, and updates from the Travingat team.
        </p>

        {loading ? (
          <div className="py-20 text-center text-white/30">Loading…</div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-white/30">No posts yet</div>
        ) : (
          <div className="space-y-10">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col md:flex-row gap-6 py-6 border-b border-white/5"
              >
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 text-sm text-white/40">
                    <span className="font-medium text-white/60">
                      {blog.author}
                    </span>
                    <span>·</span>
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                  <h2
                    className="text-[20px] xl:text-[22px] font-bold text-white leading-snug tracking-[-0.3px] mb-2 group-hover:text-[#5A45F9] transition-colors"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    {blog.title}
                  </h2>
                  <p
                    className="text-white/40 text-[15px] leading-relaxed line-clamp-2 mb-3"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-white/25 ml-auto">
                      {blog.readTime} min read
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative w-full md:w-[200px] h-[140px] md:h-[134px] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
