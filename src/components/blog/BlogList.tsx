"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";

function formatDate(iso: string) {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function normalizeTr(v: string) {
  return v.toLocaleLowerCase("tr").trim();
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<string>("all");
  const [authorQuery, setAuthorQuery] = useState<string>("");

  const categories = useMemo(() => [...new Set(posts.map((p) => p.category))].sort(), [posts]);

  const filtered = useMemo(() => {
    const q = normalizeTr(authorQuery);
    return posts
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => !q || normalizeTr(p.authorName).includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [posts, category, authorQuery]);

  return (
    <>
      {/* Filtreler */}
      <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        <FilterRow label="Kategori">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>Tümü</Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </FilterRow>
        <div className="mt-3 border-t border-[rgba(16,40,68,0.08)] pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-[#0d2c4b]">Yazar:</span>
            <div className="flex flex-1 items-center gap-2 rounded-[8px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d2c4b" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                value={authorQuery}
                onChange={(e) => setAuthorQuery(e.target.value)}
                placeholder="Yazar adına göre ara…"
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-[rgba(16,40,68,0.5)]"
              />
              {authorQuery && (
                <button type="button" onClick={() => setAuthorQuery("")} className="text-xs text-[rgba(16,40,68,0.5)] hover:text-[#0d2c4b]">
                  Temizle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sonuç */}
      <p className="mt-5 text-sm text-[rgba(16,40,68,0.6)]">{filtered.length} yazı</p>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
          Bu filtrelere uygun yazı bulunamadı.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
            >
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="rounded-full bg-[#0d2c4b] px-3 py-1 text-[#fffdf9]">{post.category}</span>
                <span className="text-[rgba(16,40,68,0.6)]">{post.readMinutes} dk okuma</span>
              </div>
              <h2 className="mt-3 font-display text-[1.4rem] font-semibold leading-snug text-[#0d2c4b]">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#c99a53]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#102844]">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[rgba(16,40,68,0.10)] pt-4">
                <Link href={`/uzman/${post.authorId}`} className="group flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d2c4b] text-xs font-semibold text-[#fffdf9]">
                    {initials(post.authorName)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-[#0d2c4b] group-hover:text-[#c99a53]">{post.authorName}</span>
                    <span className="block text-xs text-[rgba(16,40,68,0.6)]">{post.authorTitle}</span>
                  </span>
                </Link>
                <span className="text-xs text-[rgba(16,40,68,0.6)]">{formatDate(post.date)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold text-[#0d2c4b]">{label}:</span>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#0d2c4b] text-[#fffdf9]"
          : "border border-[rgba(16,40,68,0.14)] text-[#102844] hover:border-[#c99a53]"
      }`}
    >
      {children}
    </button>
  );
}
