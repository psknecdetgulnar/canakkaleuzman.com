"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories, type CategorySlug } from "@/data/categories";
import type { Expert } from "@/data/experts";
import type { BlogPost } from "@/data/blog";
import type { Company, JobListing } from "@/lib/companies";
import type { PharmacyDuty } from "@/lib/pharmacy";
import { createCompany } from "@/lib/companies";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HomePharmacyBanner } from "./HomePharmacyBanner";
import { CategorySection } from "./CategorySection";
import { ExpertSection } from "./ExpertSection";
import { WhySection } from "./WhySection";
import { HomeBlogSection } from "./HomeBlogSection";
import { HomeCompaniesSection } from "./HomeCompaniesSection";
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

export function HomePage({
  experts: allExperts,
  blogPosts,
  companies,
  jobs,
  pharmacies,
}: {
  experts: Expert[];
  blogPosts: BlogPost[];
  companies: Company[];
  jobs: JobListing[];
  pharmacies: PharmacyDuty[];
}) {
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
      <HomePharmacyBanner pharmacies={pharmacies} />
      <main>
        <Hero filters={filters} onFilterChange={setFilters} onSearch={scrollToExperts} />
        <CategorySection activeCategory={filters.category} onSelect={selectCategory} />
        <div ref={expertsRef}>
          <ExpertSection experts={filteredExperts} />
        </div>
        <HomeBlogSection posts={blogPosts} />
        <HomeCompaniesSection companies={companies} jobs={jobs} />
        <WhySection />
        <JoinCta onJoinClick={() => setActiveModal({ type: "join" })} />
      </main>
      <Footer />

      {activeModal?.type === "join" && (
        <Modal title="Kayıt ol" onClose={() => setActiveModal(null)}>
          <RegisterForm onDone={() => setActiveModal(null)} />
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

const STORAGE_COMPANY_KEY = "cbuz_company_active_id";

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [tab, setTab] = useState<"uzman" | "sirket">("uzman");
  return (
    <div>
      <div className="mb-5 flex gap-2 rounded-[8px] bg-[#f3eee6] p-1">
        <button
          type="button"
          onClick={() => setTab("uzman")}
          className={`flex-1 rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "uzman" ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844] hover:text-[#0d2c4b]"
          }`}
        >
          Uzman olarak
        </button>
        <button
          type="button"
          onClick={() => setTab("sirket")}
          className={`flex-1 rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "sirket" ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844] hover:text-[#0d2c4b]"
          }`}
        >
          Şirket olarak
        </button>
      </div>
      {tab === "uzman" ? <ExpertJoinForm /> : <CompanyJoinForm onDone={onDone} />}
    </div>
  );
}

function ExpertJoinForm() {
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

function CompanyJoinForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", sector: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Şirket adı zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createCompany({ name: form.name, sector: form.sector || "Diğer", phone: form.phone });
    setBusy(false);
    if (res.ok && res.id) {
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_COMPANY_KEY, res.id);
      onDone();
      router.push("/sirket-paneli");
    } else {
      setError(res.error ?? "Kaydedilemedi.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Şirket adı" placeholder="Örn. Atlas Tıp Merkezi" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
      <Field label="Sektör" placeholder="Örn. Sağlık" value={form.sector} onChange={(v) => setForm((f) => ({ ...f, sector: v }))} />
      <Field label="Telefon" placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742] disabled:opacity-50"
      >
        {busy ? "Oluşturuluyor…" : "Şirket sayfamı oluştur"}
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
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#0d2c4b]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-2 h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#c99a53]"
      />
    </label>
  );
}

function normalize(value: string) {
  return value.toLocaleLowerCase("tr").trim();
}
