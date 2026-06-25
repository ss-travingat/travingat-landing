"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import ShareButton from "./ShareButton";

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
    month: "short",
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
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("Not found");
        const post: BlogPost = await res.json();
        setBlog(post);

        // Fetch all blogs for related posts
        const allRes = await fetch("/api/blogs");
        if (allRes.ok) {
          const all: BlogPost[] = await allRes.json();
          const others = all
            .filter((b) => b.slug !== post.slug)
            .filter((b) => b.tags.some((t) => post.tags.includes(t)))
            .slice(0, 2);
          setRelated(
            others.length > 0
              ? others
              : all.filter((b) => b.slug !== post.slug).slice(0, 2)
          );
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/30">
        Loading…
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link
          href="/blog"
          className="text-[#D4A853] hover:underline text-sm"
        >
          ← Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* ── Hero Cover ── */}
      <header className="relative w-full h-[340px] md:h-[480px] overflow-hidden">
        <Image
          src={toLandingAssetUrl(blog.coverImage)}
          alt={blog.title}
          fill
          priority
          className="object-cover animate-hero-zoom"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        {/* Overlaid meta at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:pb-12">
          <div className="max-w-2xl mx-auto">
            {/* Tag pill */}
            {blog.tags.length > 0 && (
              <span className="inline-block rounded-full bg-[#D4A853] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-black mb-4">
                {blog.tags[0]}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-semibold leading-[1.1] tracking-[-1px] text-white mb-5">
              {blog.title}
            </h1>

            {/* Author row */}
            <div className="flex items-center gap-3 text-sm text-white/50">
              <div className="w-8 h-8 rounded-full bg-[#D4A853]/20 flex items-center justify-center text-[#D4A853] text-xs font-bold overflow-hidden">
                {blog.author.charAt(0)}
              </div>
              <span className="font-medium text-white/70">{blog.author}</span>
              <span className="text-white/20">·</span>
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
              <span className="text-white/20">·</span>
              <span>{blog.readTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content Area ── */}
      <article className="max-w-2xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24">
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#1F1F1F] px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between py-6">
          <Link
            href="/blog"
            className="text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#D4A853]"
          >
            ← Back to Journal
          </Link>
          <ShareButton />
        </div>
      </div>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <section className="border-t border-[#1F1F1F] px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold tracking-[-0.3px] mb-8 text-white/60">
              More from the Journal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl border border-[#1F1F1F] bg-[#111111] p-4 transition-colors duration-200 hover:border-[#D4A853]/30"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={toLandingAssetUrl(post.coverImage)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] text-[#6B7280] mb-1">
                      {formatDate(post.publishedAt)}
                    </span>
                    <h3 className="text-sm font-medium leading-snug text-white line-clamp-2 group-hover:text-[#D4A853] transition-colors duration-200">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
