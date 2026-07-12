"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";

const COUNT = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(iso: string) {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function HomeBlogSection({ posts: allPosts }: { posts: BlogPost[] }) {
  // İlk render sabit (SSR ile uyumlu); mount'ta her ziyaret için rasgele karışır.
  const [posts, setPosts] = useState<BlogPost[]>(() => allPosts.slice(0, COUNT));
  useEffect(() => {
    setPosts(shuffle(allPosts).slice(0, COUNT));
  }, [allPosts]);

  return (
    <section id="blog" className="bg-[#fffdf9] px-5 py-8 md:py-10">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-[1.75rem] font-semibold text-[#0d2c4b]">
            Uzmanlardan Yazılar
          </h2>
          <Link href="/blog" className="hidden text-sm font-semibold text-[#0d2c4b] transition-colors hover:text-[#c99a53] sm:block">
            Tüm Yazıları Gör →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-[#0d2c4b] px-3 py-1 text-[#fffdf9]">{post.category}</span>
                <span className="text-[rgba(16,40,68,0.6)]">{post.readMinutes} dk</span>
              </div>
              <h3 className="mt-3 font-display text-[1.15rem] font-semibold leading-snug text-[#0d2c4b]">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#c99a53]">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#102844]">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[rgba(16,40,68,0.10)] pt-3">
                <Link href={`/uzman/${post.authorId}`} className="text-xs font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
                  {post.authorName}
                </Link>
                <span className="text-xs text-[rgba(16,40,68,0.6)]">{formatDate(post.date)}</span>
              </div>
            </article>
          ))}
        </div>

        <Link href="/blog" className="mt-5 inline-block text-sm font-semibold text-[#0d2c4b] hover:text-[#c99a53] sm:hidden">
          Tüm Yazıları Gör →
        </Link>
      </div>
    </section>
  );
}
