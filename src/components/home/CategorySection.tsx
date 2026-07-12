"use client";

import Link from "next/link";
import { categories, type CategorySlug } from "@/data/categories";
import { CategoryIcon } from "./Icons";

type CategorySectionProps = {
  activeCategory: CategorySlug | "all";
  onSelect: (category: CategorySlug) => void;
};

export function CategorySection({ activeCategory, onSelect }: CategorySectionProps) {
  return (
    <section id="kategoriler" className="bg-[#fffdf9] px-5 py-6 md:py-7">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-[1.75rem] font-semibold text-[#0d2c4b]">
            Popüler Kategoriler
          </h2>
          <Link
            href="/kategoriler"
            className="hidden text-sm font-semibold text-[#0d2c4b] transition-colors hover:text-[#c99a53] sm:block"
          >
            Tüm Kategorileri Gör →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                className={`group min-h-[104px] rounded-[8px] border bg-[#fffdf9] px-3 py-3 text-center shadow-[0_8px_24px_rgba(13,44,75,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#c99a53] hover:shadow-[0_15px_38px_rgba(13,44,75,0.10)] ${
                  isActive ? "border-[#c99a53]" : "border-[rgba(16,40,68,0.10)]"
                }`}
                onClick={() => onSelect(category.slug)}
                aria-pressed={isActive}
              >
                <CategoryIcon
                  type={category.slug}
                  className={`mx-auto h-9 w-9 ${category.slug === "hukuk" || category.slug === "beslenme" ? "text-[#c99a53]" : "text-[#0d2c4b]"}`}
                />
                <h3 className="mt-2 text-sm font-bold leading-snug text-[#0d2c4b]">
                  {category.name}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
