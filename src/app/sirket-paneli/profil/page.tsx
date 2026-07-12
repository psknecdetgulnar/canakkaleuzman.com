"use client";

import { useEffect, useState } from "react";
import { useCompanyProfile } from "@/components/company-panel/CompanyProfileContext";
import { CompanySwitcher } from "@/components/company-panel/CompanySwitcher";
import { updateCompany } from "@/lib/companies";

const SECTORS = ["Sağlık", "Hukuk", "Eğitim", "Perakende", "Turizm", "İnşaat", "Teknoloji", "Diğer"];

export default function CompanyProfilePage() {
  const { companies, activeId, loading, refresh } = useCompanyProfile();
  const active = companies.find((c) => c.id === activeId);
  const [form, setForm] = useState({ sector: SECTORS[0], description: "", phone: "", email: "", website: "", address: "" });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!active) return;
    setForm({
      sector: active.sector,
      description: active.description ?? "",
      phone: active.phone ?? "",
      email: active.email ?? "",
      website: active.website ?? "",
      address: active.address ?? "",
    });
    setSaved(false);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!active) return;
    setBusy(true);
    setSaved(false);
    const res = await updateCompany(active.id, form);
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      refresh();
    }
  }

  if (!loading && !active) {
    return <p className="text-sm text-[#102844]">Önce panel ana sayfasından bir şirket oluştur.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Şirket profili</h1>
        <p className="mt-1 text-sm text-[#102844]">{active?.name}</p>
      </div>

      <CompanySwitcher />

      {active && (
        <div className="max-w-lg rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Sektör</span>
              <select value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]">
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Tanıtım metni</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} maxLength={1000} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
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
            <button type="button" disabled={busy} onClick={save} className="self-start rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
              {busy ? "Kaydediliyor…" : "Kaydet"}
            </button>
            {saved && <p className="text-sm text-[#0d2c4b]">Kaydedildi.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
