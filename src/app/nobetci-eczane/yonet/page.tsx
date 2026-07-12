"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { authDb, sessionIsAdmin } from "@/lib/adminAuth";
import { getPharmaciesForDate, type PharmacyDuty } from "@/lib/pharmacy";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Nöbetçi eczane yönetimi — yalnızca admin. Yazma işlemleri RLS'te
// is_admin() ile korunur; bu yüzden oturumlu authDb istemcisi kullanılır.
// Boş kalan günleri her gece Vercel Cron (api/cron/pharmacy) doldurur;
// buradan girilen gerçek liste otomatik veriyi her zaman ezer (önce sil, ekle).
export default function ManagePharmacyDutyPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState(todayIso());
  const [list, setList] = useState<PharmacyDuty[] | null>(null);
  const [form, setForm] = useState({ name: "", district: "", address: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authDb) {
      setReady(true);
      return;
    }
    authDb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = authDb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function load() {
    setList(null);
    setList(await getPharmaciesForDate(date));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function submit() {
    if (!authDb) return;
    if (!form.name.trim() || !form.district.trim()) {
      setError("Eczane adı ve ilçe zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: ie } = await authDb.from("pharmacy_duty").insert({
      duty_date: date,
      name: form.name.trim().slice(0, 160),
      district: form.district.trim().slice(0, 80),
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
    });
    setBusy(false);
    if (ie) {
      setError(ie.message);
    } else {
      setForm({ name: "", district: "", address: "", phone: "" });
      load();
    }
  }

  async function remove(id: string) {
    if (!authDb) return;
    setBusy(true);
    await authDb.from("pharmacy_duty").delete().eq("id", id);
    await load();
    setBusy(false);
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#fffdf9] px-5 py-10">
        <div className="mx-auto max-w-[640px]"><div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" /></div>
      </main>
    );
  }

  if (!sessionIsAdmin(session)) {
    return (
      <main className="min-h-screen bg-[#fffdf9] px-5 py-10">
        <div className="mx-auto max-w-[640px] rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-8 text-center">
          <h1 className="font-display text-[1.5rem] font-semibold text-[#0d2c4b]">Yönetici girişi gerekli</h1>
          <p className="mt-2 text-sm text-[#102844]">Nöbetçi eczane listesini yalnızca yöneticiler düzenleyebilir.</p>
          <Link href="/admin" className="mt-4 inline-block rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
            Yönetici girişine git
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10">
      <div className="mx-auto max-w-[640px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Nöbetçi Eczane — Yönetim</h1>
          <Link href="/admin" className="text-sm font-semibold text-[#0d2c4b] hover:text-[#c99a53]">← Yönetim paneli</Link>
        </div>
        <p className="mt-1 text-sm text-[#102844]">
          Eczacı odası duyurusundaki günlük listeyi buradan gir. Boş kalan günler her gece
          otomatik doldurulur; senin girdiğin liste her zaman önceliklidir. Kayıtlar anında{" "}
          <a href="/nobetci-eczane" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">halka açık sayfada</a>{" "}
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
