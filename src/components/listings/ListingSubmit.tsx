"use client";

import { useState, type FormEvent } from "react";
import { submitListing, type ListingKind } from "@/lib/publicListings";

// "İlan Gönder" alanı: işveren ilanı veya iş arayan ilanı. Gönderim admin
// onayına düşer; onaylanınca /is-ilanlari sayfasında yayınlanır.
const TYPES = ["Tam zamanlı", "Yarı zamanlı", "Stajyer", "Uzaktan", "Proje bazlı"];

export function ListingSubmit() {
  const [open, setOpen] = useState<ListingKind | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!open) return;
    if (!f.title?.trim() || !f.description?.trim() || !f.contactName?.trim()) {
      setError("Yıldızlı alanlar zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await submitListing({
      kind: open,
      title: f.title, description: f.description, location: f.location,
      employmentType: f.employmentType, salary: f.salary,
      contactName: f.contactName, contactPhone: f.contactPhone,
      contactEmail: f.contactEmail, contactWhatsapp: f.contactWhatsapp,
      orgName: f.orgName, requirements: f.requirements,
      experience: f.experience, education: f.education, availability: f.availability,
    });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Gönderilemedi.");
  }

  const inp = "h-11 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]";
  const ta = "w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm outline-none focus:border-[#c99a53]";
  const lbl = "flex flex-col gap-1 text-xs font-semibold text-[#0d2c4b]";

  if (!open) {
    return (
      <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#0d2c4b] p-6 text-[#fffdf9]">
        <h2 className="font-display text-[1.4rem] font-semibold">İlan Gönder</h2>
        <p className="mt-1 text-sm text-[#e8d8c2]">
          Eleman mı arıyorsun, iş mi arıyorsun? İlanını gönder — yönetici onayından sonra bu
          sayfada ücretsiz yayınlanır.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => { setOpen("is_ilani"); setDone(false); setF({}); }} className="rounded-[8px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] hover:bg-[#b98742]">
            💼 Eleman Arıyorum (İşveren)
          </button>
          <button type="button" onClick={() => { setOpen("is_arayan"); setDone(false); setF({}); }} className="rounded-[8px] border border-[#fffdf9]/40 px-5 py-3 text-sm font-semibold hover:bg-[#fffdf9]/10">
            🔎 İş Arıyorum
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-6">
        <p className="font-semibold text-[#0d2c4b]">İlanın alındı! 🎉</p>
        <p className="mt-1 text-sm text-[#102844]">Yönetici onayından geçtikten sonra bu sayfada yayınlanacak.</p>
        <button type="button" onClick={() => setOpen(null)} className="mt-3 text-sm font-semibold text-[#0d2c4b] underline decoration-[#c99a53] underline-offset-4 hover:text-[#c99a53]">← Geri dön</button>
      </div>
    );
  }

  const isJob = open === "is_ilani";
  return (
    <form onSubmit={submit} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">
          {isJob ? "💼 Eleman Arıyorum — İlan Ver" : "🔎 İş Arıyorum — İlan Ver"}
        </h2>
        <button type="button" onClick={() => setOpen(null)} className="text-sm text-[rgba(16,40,68,0.5)] hover:text-[#0d2c4b]">✕ Kapat</button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {isJob ? (
          <>
            <label className={lbl}>Kurum / işveren adı *<input value={f.orgName ?? ""} onChange={set("orgName")} className={inp} required /></label>
            <label className={lbl}>Pozisyon başlığı *<input value={f.title ?? ""} onChange={set("title")} placeholder="Örn. Ön Muhasebe Elemanı" className={inp} required /></label>
          </>
        ) : (
          <>
            <label className={lbl}>Ad soyad *<input value={f.contactName ?? ""} onChange={set("contactName")} className={inp} required /></label>
            <label className={lbl}>Aradığın pozisyon *<input value={f.title ?? ""} onChange={set("title")} placeholder="Örn. Garson, Satış Danışmanı" className={inp} required /></label>
          </>
        )}
        <label className={lbl}>Çalışma şekli
          <select value={f.employmentType ?? TYPES[0]} onChange={set("employmentType")} className={inp}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className={lbl}>Konum<input value={f.location ?? ""} onChange={set("location")} placeholder="Çanakkale" className={inp} /></label>
        <label className={lbl}>{isJob ? "Ücret (isteğe bağlı)" : "Ücret beklentisi (isteğe bağlı)"}
          <input value={f.salary ?? ""} onChange={set("salary")} placeholder="Örn. 25.000–30.000 TL / Görüşmede" className={inp} />
        </label>
        {isJob ? (
          <label className={lbl}>İletişim yetkilisi *<input value={f.contactName ?? ""} onChange={set("contactName")} className={inp} required /></label>
        ) : (
          <label className={lbl}>Ne zaman başlayabilirsin?<input value={f.availability ?? ""} onChange={set("availability")} placeholder="Hemen / 2 hafta içinde" className={inp} /></label>
        )}
      </div>

      <label className={`${lbl} mt-3`}>{isJob ? "İş tanımı ve detaylar *" : "Kendini tanıt (özet) *"}
        <textarea value={f.description ?? ""} onChange={set("description")} rows={4} maxLength={3000} className={ta} required />
      </label>
      {isJob ? (
        <label className={`${lbl} mt-3`}>Aranan nitelikler
          <textarea value={f.requirements ?? ""} onChange={set("requirements")} rows={2} maxLength={1500} className={ta} />
        </label>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={lbl}>Deneyim<textarea value={f.experience ?? ""} onChange={set("experience")} rows={2} maxLength={1500} className={ta} /></label>
          <label className={lbl}>Eğitim durumu<input value={f.education ?? ""} onChange={set("education")} placeholder="Örn. Lise / Üniversite" className={inp} /></label>
        </div>
      )}

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[rgba(16,40,68,0.55)]">İletişim (en az biri zorunlu)</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        <label className={lbl}>Telefon<input value={f.contactPhone ?? ""} onChange={set("contactPhone")} className={inp} /></label>
        <label className={lbl}>E-posta<input type="email" value={f.contactEmail ?? ""} onChange={set("contactEmail")} className={inp} /></label>
        <label className={lbl}>WhatsApp<input value={f.contactWhatsapp ?? ""} onChange={set("contactWhatsapp")} className={inp} /></label>
      </div>

      {error && <p className="mt-3 text-sm text-[#b3261e]">{error}</p>}
      <button type="submit" disabled={busy} className="mt-4 rounded-[8px] bg-[#0d2c4b] px-6 py-3 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">
        {busy ? "Gönderiliyor…" : "Onaya Gönder"}
      </button>
      <p className="mt-2 text-xs text-[rgba(16,40,68,0.55)]">İlanın yönetici onayından sonra yayınlanır; iletişim bilgilerin ilanda görünür.</p>
    </form>
  );
}
