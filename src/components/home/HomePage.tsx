"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories, type CategorySlug } from "@/data/categories";
import type { Expert } from "@/data/experts";
import type { BlogPost } from "@/data/blog";
import type { Company } from "@/lib/companies";
import type { JobItem } from "./HomeCompaniesSection";
import type { PharmacyDuty } from "@/lib/pharmacy";
import { createCompany } from "@/lib/companies";
import { createExpertApplication } from "@/lib/db";
import { signIn, signUpUser } from "@/lib/adminAuth";
import { getSetting } from "@/lib/adminPanel";
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
  pharmacyDate,
}: {
  experts: Expert[];
  blogPosts: BlogPost[];
  companies: Company[];
  jobs: JobItem[];
  pharmacies: PharmacyDuty[];
  pharmacyDate?: string;
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
      <HomePharmacyBanner pharmacies={pharmacies} date={pharmacyDate} />
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
          <LoginForm onDone={() => setActiveModal(null)} />
        </Modal>
      )}
    </div>
  );
}

const STORAGE_COMPANY_KEY = "cbuz_company_active_id";

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [tab, setTab] = useState<"uzman" | "sirket">("uzman");
  // Admin ayarları: kayıtlar/başvurular kapatılabilir (site_settings).
  const [cfg, setCfg] = useState<{ registrationsOpen: boolean; expertApplicationsOpen: boolean } | null>(null);
  useEffect(() => {
    getSetting("site_config", { registrationsOpen: true, expertApplicationsOpen: true }).then((v) =>
      setCfg({ registrationsOpen: v.registrationsOpen !== false, expertApplicationsOpen: v.expertApplicationsOpen !== false })
    );
  }, []);
  if (cfg && !cfg.registrationsOpen) {
    return (
      <p className="rounded-[8px] bg-[#f3eee6] p-4 text-sm leading-6 text-[#102844]">
        Yeni kayıtlar geçici olarak durduruldu. Daha sonra tekrar dene veya bizimle iletişime geç.
      </p>
    );
  }
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
      {tab === "uzman" ? (
        cfg && !cfg.expertApplicationsOpen ? (
          <p className="rounded-[8px] bg-[#f3eee6] p-4 text-sm leading-6 text-[#102844]">Uzman başvuruları geçici olarak durduruldu.</p>
        ) : (
          <ExpertJoinForm onDone={onDone} />
        )
      ) : (
        <CompanyJoinForm onDone={onDone} />
      )}
    </div>
  );
}

function ExpertJoinForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    title: "",
    category: categories[0].slug as string,
    phone: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"ok" | "confirm" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.phone.trim() || !form.email.trim() || !form.password) {
      setError("Tüm alanlar zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    // 1) Gerçek hesap: Supabase Auth (role: uzman)
    const acc = await signUpUser(form.email, form.password, "uzman");
    if (!acc.ok || !acc.userId) {
      setBusy(false);
      setError(acc.error ?? "Hesap oluşturulamadı.");
      return;
    }
    // 2) Başvuru profili (pending) — hesabına owner_id ile bağlanır.
    const cat = categories.find((c) => c.slug === form.category) ?? categories[0];
    const res = await createExpertApplication({
      name: form.name,
      title: form.title,
      category: cat.slug,
      categoryLabel: cat.name,
      phone: form.phone,
      ownerId: acc.userId,
    });
    setBusy(false);
    if (res.ok) {
      if (acc.needsConfirm) setDone("confirm");
      else {
        // Oturum açık: doğrudan paneline götür (orada "Onay bekliyor" görür).
        onDone();
        router.push("/panel");
      }
    } else setError(res.error ?? "Başvuru gönderilemedi.");
  }

  if (done) {
    return (
      <div className="rounded-[8px] bg-[#f3eee6] p-4 text-sm leading-6 text-[#102844]">
        <p className="font-semibold text-[#0d2c4b]">Başvurun alındı! 🎉</p>
        <p className="mt-1">
          {done === "confirm"
            ? "Önce e-posta adresine gelen doğrulama bağlantısına tıkla. Profilin ekibimiz tarafından onaylandığında yayına girecek; ardından e-posta ve şifrenle giriş yapıp panelini kullanabilirsin."
            : "Profilin ekibimiz tarafından incelenecek ve onaylandığında dizinde yayına girecek. E-posta ve şifrenle giriş yapıp panelinden durumu takip edebilirsin."}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Ad soyad" placeholder="Adınız ve soyadınız" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
      <Field label="Uzmanlık alanı" placeholder="Örn. Klinik Psikolog" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
      <label className="block">
        <span className="text-sm font-semibold text-[#0d2c4b]">Kategori</span>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="mt-2 h-12 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-4 text-sm outline-none focus:border-[#c99a53]"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <Field label="Telefon" placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      <Field label="E-posta" placeholder="ornek@mail.com" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
      <Field label="Şifre" placeholder="En az 6 karakter" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742] disabled:opacity-50"
      >
        {busy ? "Gönderiliyor…" : "Hesap oluştur ve başvur"}
      </button>
      <p className="text-xs leading-5 text-[rgba(16,40,68,0.6)]">
        Başvurun admin onayından geçtikten sonra profilin yayına girer. Sağlık ve hukuk
        branşlarında diploma/ruhsat belgesi istenir. Paneline e-posta ve şifrenle girersin.
      </p>
    </form>
  );
}

function CompanyJoinForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", sector: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Şirket adı, e-posta ve şifre zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    // 1) Gerçek hesap: Supabase Auth (role: sirket)
    const acc = await signUpUser(form.email, form.password, "sirket");
    if (!acc.ok) {
      setBusy(false);
      setError(acc.error ?? "Hesap oluşturulamadı.");
      return;
    }
    if (acc.needsConfirm) {
      // E-posta doğrulaması açık: şirket kaydı girişten sonra panelde tamamlanır.
      setBusy(false);
      setConfirmMsg(true);
      return;
    }
    // 2) Oturum açıldı — şirket sayfasını sahibiyle oluştur.
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

  if (confirmMsg) {
    return (
      <div className="rounded-[8px] bg-[#f3eee6] p-4 text-sm leading-6 text-[#102844]">
        <p className="font-semibold text-[#0d2c4b]">Hesabın oluşturuldu! 🎉</p>
        <p className="mt-1">
          E-posta adresine gelen doğrulama bağlantısına tıkla, ardından giriş yapıp şirket
          panelinden sayfanı oluşturabilirsin.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Şirket adı" placeholder="Şirketinizin adı" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
      <Field label="Sektör" placeholder="Örn. Sağlık" value={form.sector} onChange={(v) => setForm((f) => ({ ...f, sector: v }))} />
      <Field label="Telefon" placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      <Field label="E-posta" placeholder="ornek@mail.com" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
      <Field label="Şifre" placeholder="En az 6 karakter" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742] disabled:opacity-50"
      >
        {busy ? "Oluşturuluyor…" : "Hesap oluştur ve sayfamı aç"}
      </button>
      <p className="text-xs leading-5 text-[rgba(16,40,68,0.6)]">
        Şirket paneline e-posta ve şifrenle girersin.
      </p>
    </form>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("E-posta ve şifre zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await signIn(form.email, form.password);
    setBusy(false);
    if (res.ok && res.redirect) {
      onDone();
      router.push(res.redirect);
    } else {
      setError(res.error ?? "Giriş başarısız.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="E-posta" placeholder="ornek@mail.com" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
      <Field label="Şifre" placeholder="••••••••" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <button
        type="button"
        onClick={async () => {
          if (!form.email.trim()) { setError("Önce e-posta adresini yaz, sonra tıkla."); return; }
          const { sb } = await import("@/lib/supabaseClient");
          if (!sb) return;
          await sb.auth.resetPasswordForEmail(form.email.trim(), { redirectTo: window.location.origin + "/sifre-yenile" });
          setError(null);
          alert("Şifre sıfırlama bağlantısı e-postana gönderildi (hesap varsa).");
        }}
        className="self-start text-xs font-semibold text-[rgba(16,40,68,0.6)] underline underline-offset-4 hover:text-[#c99a53]"
      >
        Şifremi unuttum
      </button>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50"
      >
        {busy ? "Giriş yapılıyor…" : "Giriş yap"}
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
