"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompanyProfile } from "@/components/company-panel/CompanyProfileContext";
import { CompanySwitcher } from "@/components/company-panel/CompanySwitcher";
import { createCompany, getJobListingsByCompany } from "@/lib/companies";

const SECTORS = ["Sağlık", "Hukuk", "Eğitim", "Perakende", "Turizm", "İnşaat", "Teknoloji", "Diğer"];

export default function CompanyPanelHubPage() {
  const { companies, activeId, loading, refresh, setActiveId } = useCompanyProfile();
  const active = companies.find((c) => c.id === activeId);
  const [openJobs, setOpenJobs] = useState<number | null>(null);

  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    setOpenJobs(null);
    getJobListingsByCompany(activeId).then((rows) => {
      if (alive) setOpenJobs(rows.filter((j) => j.status === "open").length);
    });
    return () => {
      alive = false;
    };
  }, [activeId]);

  if (!loading && companies.length === 0) {
    return <CreateCompanyOnboarding onCreated={(id) => { refresh(); setActiveId(id); }} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Şirket Paneli</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          Şirketini tanıt, tercih edersen iş ilanlarını burada paylaş. Bu panel uzman panelinden
          bağımsızdır — Çanakkale&apos;de faaliyet gösteren her şirket kendi sayfasını oluşturabilir.
        </p>
      </div>

      <CompanySwitcher />

      {active && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
              <div className="text-xs text-[rgba(16,40,68,0.6)]">Yayındaki iş ilanı</div>
              <div className="mt-1 font-display text-[1.6rem] font-semibold text-[#0d2c4b]">
                {openJobs === null ? "…" : openJobs}
              </div>
            </div>
            <div className="rounded-[12px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
              <div className="text-xs text-[rgba(16,40,68,0.6)]">Sayfan yayında</div>
              <div className="mt-1 font-display text-[1.6rem] font-semibold text-[#0d2c4b]">
                <Link href={`/sirket/${active.id}`} target="_blank" className="hover:text-[#c99a53]">
                  /sirket/{active.id} →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PanelLink
              href="/sirket-paneli/profil"
              title="Şirket profili"
              description="Tanıtım metni, sektör, iletişim bilgileri ve adresi düzenle."
            />
            <PanelLink
              href="/sirket-paneli/is-ilanlari"
              title="İş ilanları"
              description="İsteğe bağlı olarak açık pozisyon paylaş, başvuruları iletişim bilgilerinle topla."
            />
          </div>

          <details className="rounded-[10px] border border-dashed border-[rgba(16,40,68,0.18)] p-4 text-sm text-[#102844]">
            <summary className="cursor-pointer font-semibold text-[#0d2c4b]">+ Yeni şirket kaydı oluştur</summary>
            <div className="mt-4">
              <CreateCompanyOnboarding onCreated={(id) => { refresh(); setActiveId(id); }} compact />
            </div>
          </details>
        </>
      )}
    </div>
  );
}

function CreateCompanyOnboarding({ onCreated, compact }: { onCreated: (id: string) => void; compact?: boolean }) {
  const [form, setForm] = useState({ name: "", sector: SECTORS[0], description: "", phone: "", email: "", website: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!form.name.trim()) {
      setError("Şirket adı zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createCompany(form);
    setBusy(false);
    if (res.ok && res.id) {
      onCreated(res.id);
    } else {
      setError(res.error ?? "Kaydedilemedi.");
    }
  }

  const body = (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[rgba(16,40,68,0.6)]">Şirket adı</span>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[rgba(16,40,68,0.6)]">Sektör</span>
        <select value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]">
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[rgba(16,40,68,0.6)]">Tanıtım metni</span>
        <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} maxLength={1000} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Telefon</span>
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">E-posta</span>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Web sitesi</span>
          <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Adres</span>
          <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
      </div>
      {error && <p className="text-sm text-[#b3261e]">{error}</p>}
      <button type="button" disabled={busy} onClick={submit} className="self-start rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
        {busy ? "Oluşturuluyor…" : "Şirket sayfamı oluştur"}
      </button>
    </div>
  );

  if (compact) return body;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Şirketini oluştur</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          Henüz bir şirket kaydın yok. Aşağıdaki formu doldurarak halka açık şirket sayfanı hemen
          oluşturabilirsin — istersen sonrasında iş ilanı da paylaşabilirsin.
        </p>
      </div>
      <div className="max-w-lg rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        {body}
      </div>
    </div>
  );
}

function PanelLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="flex flex-col rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]">
      <span className="font-display text-[1.25rem] font-semibold text-[#0d2c4b]">{title}</span>
      <p className="mt-2 text-sm text-[#102844]">{description}</p>
      <span className="mt-4 text-sm font-semibold text-[#0d2c4b]">Aç →</span>
    </Link>
  );
}
