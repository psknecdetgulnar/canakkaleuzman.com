"use client";

import { useEffect, useState } from "react";
import { getPharmaciesForDate, addPharmacyDuty, deletePharmacyDuty, type PharmacyDuty } from "@/lib/pharmacy";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Hafif, pratik yönetim ekranı: gerçek zamanlı otomatik çekme yerine, günlük
// listeyi elle (eczacı odası duyurusundan) girmek için. Auth gelene kadar
// herkese açık — spesifikasyonun "pratik yöntem" isteğine karşılık gelir.
export default function ManagePharmacyDutyPage() {
  const [date, setDate] = useState(todayIso());
  const [list, setList] = useState<PharmacyDuty[] | null>(null);
  const [form, setForm] = useState({ name: "", district: "", address: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setList(null);
    setList(await getPharmaciesForDate(date));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function submit() {
    if (!form.name.trim() || !form.district.trim()) {
      setError("Eczane adı ve ilçe zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await addPharmacyDuty({ dutyDate: date, ...form });
    setBusy(false);
    if (res.ok) {
      setForm({ name: "", district: "", address: "", phone: "" });
      load();
    } else {
      setError(res.error ?? "Kaydedilemedi.");
    }
  }

  async function remove(id: string) {
    setBusy(true);
    await deletePharmacyDuty(id);
    await load();
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Nöbetçi Eczane — Yönetim</h1>
        <p className="mt-1 text-sm text-[#102844]">
          Otomatik, güvenilir bir üçüncü taraf kazıma sistemi bu ortamdan kurulamıyor — bunun yerine
          eczacı odası/il sağlık müdürlüğü duyurusundaki günlük listeyi buradan elle girebilirsin.
          Girilen kayıtlar anında{" "}
          <a href="/nobetci-eczane" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
            halka açık sayfada
          </a>{" "}
          görünür.
        </p>

        <label className="mt-6 flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Tarih</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-fit rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
          />
        </label>

        <div className="mt-5 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Eczane adı</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">İlçe</span>
              <input value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Adres</span>
              <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Telefon</span>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
            </label>
          </div>
          {error && <p className="mt-2 text-sm text-[#b3261e]">{error}</p>}
          <button type="button" disabled={busy} onClick={submit} className="mt-4 rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
            Listeye ekle
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {list === null ? (
            <div className="h-20 animate-pulse rounded-[10px] bg-[#f3eee6]" />
          ) : list.length === 0 ? (
            <p className="text-sm text-[rgba(16,40,68,0.6)]">Bu tarih için kayıt yok.</p>
          ) : (
            list.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-3">
                <div className="text-sm">
                  <span className="font-semibold text-[#0d2c4b]">{p.name}</span>
                  <span className="ml-2 text-[rgba(16,40,68,0.6)]">{p.district}</span>
                </div>
                <button type="button" disabled={busy} onClick={() => remove(p.id)} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">
                  Sil
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
