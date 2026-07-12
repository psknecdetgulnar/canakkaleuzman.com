"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/components/home/Icons";

export type CategoryWithExperts = {
  slug: string;
  name: string;
  description: string;
  count: number;
  titles: string[]; // gerçek uzman ünvanları (o kategorideki uzmanlardan)
};

const POPULAR = ["Klinik Psikolog", "Diyetisyen", "Avukat", "Fizyoterapist", "Öğrenci Koçu"];

function normalize(v: string) {
  return v.toLocaleLowerCase("tr").trim();
}

// Kategoriler sayfası: tamamen gerçek uzman verisinden türetilir (Task 1+2).
// Her kart tıklandığında o kategorideki gerçek uzmanların listelendiği
// /kategoriler/[slug] sayfasına gider — "sekme" burada gerçek bir sayfadır.
export function CategoryBrowser({ categories }: { categories: CategoryWithExperts[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return categories;
    return categories
      .map((c) => {
        const nameHit = normalize(c.name).includes(q);
        const titleHit = c.titles.some((t) => normalize(t).includes(q));
        return nameHit || titleHit ? c : null;
      })
      .filter((c): c is CategoryWithExperts => c !== null);
  }, [query, categories]);

  return (
    <>
      <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        <div className="flex flex-1 items-center gap-2 rounded-[8px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d2c4b" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kategori veya meslek ara…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-[rgba(16,40,68,0.5)]"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-sm text-[rgba(16,40,68,0.5)] hover:text-[#0d2c4b]">
              Temizle
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#0d2c4b]">Popüler aramalar:</span>
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuery(p)}
              className="rounded-full border border-[rgba(16,40,68,0.14)] px-3 py-1 text-xs font-medium text-[#102844] transition-colors hover:border-[#c99a53] hover:text-[#0d2c4b]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
          &ldquo;{query}&rdquo; için sonuç bulunamadı.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((category) => (
            <Link
              key={category.slug}
              href={`/kategoriler/${category.slug}`}
              className="flex flex-col rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[rgba(16,40,68,0.10)] pb-4">
                <div className="flex items-center gap-3">
                  <CategoryIcon type={category.slug} className="h-9 w-9 text-[#0d2c4b]" />
                  <span className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">
                    {category.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-[#0d2c4b] px-3 py-1 text-xs font-semibold text-[#fffdf9]">
                  {category.count} Uzman
                </span>
              </div>

              <p className="mt-3 text-sm text-[#102844]">{category.description}</p>

              {category.titles.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.titles.map((t) => (
                    <li key={t} className="rounded-full border border-[rgba(16,40,68,0.12)] bg-[#f3eee6] px-3 py-1.5 text-sm text-[#102844]">
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0d2c4b]">
                Uzmanları gör
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
