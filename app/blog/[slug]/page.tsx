"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
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

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/30">
        Loading…
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/blog" className="text-[#5A45F9] hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Minimal header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-[-0.5px]">
            Travingat
          </Link>
          <Link
            href="/blog"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            ← All posts
          </Link>
        </div>
      </header>

      <article className="max-w-[720px] mx-auto px-6 py-12 xl:py-16">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-5">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold uppercase tracking-wider text-[#5A45F9] bg-[#5A45F9]/10 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="text-[32px] xl:text-[42px] font-bold leading-[1.15] tracking-[-1px] mb-5"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-white/40 mb-8 pb-8 border-b border-white/10">
          <span className="font-medium text-white/60">{blog.author}</span>
          <span>·</span>
          <span>{formatDate(blog.publishedAt)}</span>
          <span>·</span>
          <span>{blog.readTime} min read</span>
        </div>

        {/* Cover image */}
        <div className="relative w-full h-[300px] xl:h-[420px] rounded-xl overflow-hidden mb-10">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="blog-content"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-8">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="text-[#5A45F9] text-sm font-semibold hover:underline"
          >
            ← All posts
          </Link>
          <Link
            href="/"
            className="text-white/40 text-sm hover:text-white transition-colors"
          >
            Travingat Home
          </Link>
        </div>
      </div>
    </div>
  );
}
