"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompanyProfile } from "@/components/company-panel/CompanyProfileContext";
import { CompanySwitcher } from "@/components/company-panel/CompanySwitcher";
import {
  getJobListingsByCompany,
  createJobListing,
  updateJobListingStatus,
  deleteJobListing,
  type JobListing,
} from "@/lib/companies";

const EMPLOYMENT_TYPES = ["Tam zamanlı", "Yarı zamanlı", "Stajyer", "Uzaktan"];

export default function CompanyJobsPage() {
  const { companies, activeId, loading: profileLoading } = useCompanyProfile();
  const active = companies.find((c) => c.id === activeId);
  const [jobs, setJobs] = useState<JobListing[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", employmentType: EMPLOYMENT_TYPES[0], location: "Çanakkale", contactEmail: "", contactPhone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    setJobs(null);
    getJobListingsByCompany(activeId).then((rows) => {
      if (alive) setJobs(rows);
    });
    return () => {
      alive = false;
    };
  }, [activeId]);

  async function refreshJobs() {
    if (!activeId) return;
    setJobs(await getJobListingsByCompany(activeId));
  }

  async function submit() {
    if (!active) return;
    if (!form.title.trim() || !form.description.trim()) {
      setError("Pozisyon başlığı ve açıklama zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createJobListing({ companyId: active.id, ...form });
    setBusy(false);
    if (res.ok) {
      setShowForm(false);
      setForm({ title: "", description: "", employmentType: EMPLOYMENT_TYPES[0], location: "Çanakkale", contactEmail: "", contactPhone: "" });
      refreshJobs();
    } else {
      setError(res.error ?? "Kaydedilemedi.");
    }
  }

  async function toggleStatus(j: JobListing) {
    setBusy(true);
    await updateJobListingStatus(j.id, j.status === "open" ? "closed" : "open");
    await refreshJobs();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Bu iş ilanını silmek istediğine emin misin?")) return;
    setBusy(true);
    await deleteJobListing(id);
    await refreshJobs();
    setBusy(false);
  }

  if (!profileLoading && !active) {
    return <p className="text-sm text-[#102844]">Önce panel ana sayfasından bir şirket oluştur.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">İş ilanları</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          İsteğe bağlıdır. Yayınladığın ilanlar hem şirket sayfanda hem de halka açık iş ilanları
          listesinde görünür.
        </p>
      </div>

      <CompanySwitcher />

      {!showForm && (
        <button type="button" onClick={() => setShowForm(true)} className="self-start rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
          + Yeni ilan
        </button>
      )}

      {showForm && (
        <div className="max-w-lg rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Pozisyon başlığı</span>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Açıklama</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} maxLength={2000} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[rgba(16,40,68,0.6)]">Çalışma şekli</span>
                <select value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]">
                  {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[rgba(16,40,68,0.6)]">Konum</span>
                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[rgba(16,40,68,0.6)]">Başvuru e-posta</span>
                <input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[rgba(16,40,68,0.6)]">Başvuru telefon</span>
                <input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
              </label>
            </div>
            {error && <p className="text-sm text-[#b3261e]">{error}</p>}
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={submit} className="rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
                Yayınla
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-[6px] px-4 py-2 text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {jobs === null ? (
        <div className="h-32 animate-pulse rounded-[14px] bg-[#f3eee6]" />
      ) : jobs.length === 0 ? (
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
          Henüz iş ilanı yok.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0d2c4b]">{j.title}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${j.status === "open" ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"}`}>
                    {j.status === "open" ? "Yayında" : "Kapalı"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{j.employmentType} · {j.location}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/is-ilanlari" target="_blank" className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53]">
                  Görüntüle
                </Link>
                <button type="button" disabled={busy} onClick={() => toggleStatus(j)} className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53] disabled:opacity-50">
                  {j.status === "open" ? "Kapat" : "Yeniden aç"}
                </button>
                <button type="button" disabled={busy} onClick={() => remove(j.id)} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
