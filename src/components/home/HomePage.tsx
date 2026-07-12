"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories, type CategorySlug } from "@/data/categories";
import type { Expert } from "@/data/experts";
import type { BlogPost } from "@/data/blog";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { CategorySection } from "./CategorySection";
import { ExpertSection } from "./ExpertSection";
import { WhySection } from "./WhySection";
import { HomeBlogSection } from "./HomeBlogSection";
import { JoinCta } from "./JoinCta";
import { Footer } from "./Footer";
import { Modal } from "./Modal";
import type { SearchFilters } from "./SearchBar";

type ActiveModal = { type: "join" } | { type: "login" } | null;

const initialFilters: SearchFilters = {
  query: "",
  category: "all",
  district: "all",
};

export function HomePage({ experts: allExperts, blogPosts }: { experts: Expert[]; blogPosts: BlogPost[] }) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const expertsRef = useRef<HTMLDivElement | null>(null);

  const filteredExperts = useMemo(() => {
    const query = normalize(filters.query);
    const filtered = allExperts.filter((expert) => {
      const matchesQuery =
        !query ||
        normalize(`${expert.name} ${expert.title} ${expert.categoryLabel} ${expert.district}`).includes(
          query
        );
      const matchesCategory = filters.category === "all" || expert.category === filters.category;
      const matchesDistrict = filters.district === "all" || expert.district === filters.district;
      return matchesQuery && matchesCategory && matchesDistrict;
    });
    const noFilter = filters.category === "all" && filters.district === "all" && !query;
    return noFilter ? filtered.slice(0, 5) : filtered;
  }, [filters, allExperts]);

  const scrollToExperts = () => {
    expertsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectCategory = (category: CategorySlug) => {
    setFilters((current) => ({ ...current, category }));
    window.setTimeout(scrollToExperts, 40);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fffdf9]">
      <Header onJoinClick={() => setActiveModal({ type: "join" })} onLoginClick={() => setActiveModal({ type: "login" })} />
      <main>
        <Hero filters={filters} onFilterChange={setFilters} onSearch={scrollToExperts} />
        <CategorySection activeCategory={filters.category} onSelect={selectCategory} />
        <div ref={expertsRef}>
          <ExpertSection experts={filteredExperts} />
        </div>
        <WhySection />
        <HomeBlogSection posts={blogPosts} />
        <JoinCta onJoinClick={() => setActiveModal({ type: "join" })} />
      </main>
      <Footer />

      {activeModal?.type === "join" && (
        <Modal title="Uzman kaydı oluştur" onClose={() => setActiveModal(null)}>
          <JoinForm />
        </Modal>
      )}
      {activeModal?.type === "login" && (
        <Modal title="Giriş yap" onClose={() => setActiveModal(null)}>
          <LoginForm />
        </Modal>
      )}
    </div>
  );
}

function JoinForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/panel");
      }}
    >
      <Field label="Ad soyad" placeholder="Adınız ve soyadınız" />
      <Field label="Uzmanlık alanı" placeholder="Örn. Klinik Psikolog" />
      <Field label="Telefon" placeholder="+90 5XX XXX XX XX" />
      <button
        type="submit"
        className="w-full rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742]"
      >
        Başvuruyu gönder
      </button>
    </form>
  );
}

function LoginForm() {
  const router = useRouter();
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/panel");
      }}
    >
      <Field label="E-posta" placeholder="ornek@mail.com" type="email" />
      <Field label="Şifre" placeholder="••••••••" type="password" />
      <button
        type="submit"
        className="w-full rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
      >
        Giriş yap
      </button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#0d2c4b]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#c99a53]"
      />
    </label>
  );
}

function normalize(value: string) {
  return value.toLocaleLowerCase("tr").trim();
}
