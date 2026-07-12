"use client";

import { categories, districts, type CategorySlug } from "@/data/categories";
import { SearchIcon } from "./Icons";

export type SearchFilters = {
  query: string;
  category: CategorySlug | "all";
  district: string;
};

type SearchBarProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
};

export function SearchBar({ filters, onChange, onSearch }: SearchBarProps) {
  return (
    <form
      className="grid w-full gap-3 rounded-[10px] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(13,44,75,0.16)] md:grid-cols-[1.7fr_1fr_0.85fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
      aria-label="Uzman arama"
    >
      <label className="relative block min-w-0">
        <span className="sr-only">Uzmanlık, isim veya anahtar kelime</span>
        <input
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          className="h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] pl-4 pr-11 text-sm text-[#102844] outline-none transition-colors placeholder:text-[rgba(16,40,68,0.48)] focus:border-[#c99a53]"
          placeholder="Uzmanlık, isim veya anahtar kelime"
          type="search"
        />
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[rgba(16,40,68,0.58)]" />
      </label>

      <label className="block min-w-0">
        <span className="sr-only">Kategori</span>
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({ ...filters, category: event.target.value as SearchFilters["category"] })
          }
          className="h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4 text-sm text-[#102844] outline-none transition-colors focus:border-[#c99a53]"
        >
          <option value="all">Popüler Kategoriler</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.shortName}
            </option>
          ))}
        </select>
      </label>

      <label className="block min-w-0">
        <span className="sr-only">İlçe</span>
        <select
          value={filters.district}
          onChange={(event) => onChange({ ...filters, district: event.target.value })}
          className="h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4 text-sm text-[#102844] outline-none transition-colors focus:border-[#c99a53]"
        >
          <option value="all">Çanakkale</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="h-12 rounded-[6px] bg-[#0d2c4b] px-8 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
      >
        Ara
      </button>
    </form>
  );
}
