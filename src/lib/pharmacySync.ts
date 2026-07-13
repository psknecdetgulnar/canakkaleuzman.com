import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchCanakkalePharmacies, dutyDateOf, type NosyPharmacy } from "@/lib/nosyapi";

// NosyAPI'den çekilen nöbetçi eczaneleri pharmacy_duty tablosuna yazar.
// - Veriyi nöbet başlangıç tarihine göre gruplar (bir ilde farklı ilçelerin
//   nöbeti aynı güne denk gelir; tarih yoksa "bugün" varsayılır).
// - O tarihlere ait mevcut kayıtları silip yeniden yazar → idempotent, aynı
//   gün tekrar çalışsa da çift kayıt olmaz.
// - API başarısızsa veya hiç kayıt yoksa tabloya DOKUNMAZ (eski veri korunur).
export type SyncResult =
  | { ok: true; dates: string[]; inserted: number }
  | { ok: false; error: string };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function syncPharmacyDuty(db: SupabaseClient, apiKey: string): Promise<SyncResult> {
  const res = await fetchCanakkalePharmacies(apiKey);
  if (!res.ok) return { ok: false, error: res.error };
  if (res.pharmacies.length === 0) return { ok: false, error: "NosyAPI boş liste döndü — mevcut veri korundu." };

  // Tarihe göre grupla.
  const byDate = new Map<string, NosyPharmacy[]>();
  for (const p of res.pharmacies) {
    const date = dutyDateOf(p) ?? todayIso();
    const list = byDate.get(date) ?? [];
    list.push(p);
    byDate.set(date, list);
  }

  let inserted = 0;
  const dates: string[] = [];
  for (const [date, list] of byDate) {
    const { error: de } = await db.from("pharmacy_duty").delete().eq("duty_date", date);
    if (de) return { ok: false, error: de.message };
    const rows = list.map((p) => ({
      duty_date: date,
      name: p.name.slice(0, 160),
      district: p.district.slice(0, 80),
      address: p.address?.slice(0, 300) ?? null,
      phone: p.phone?.slice(0, 60) ?? null,
    }));
    const { error: ie } = await db.from("pharmacy_duty").insert(rows);
    if (ie) return { ok: false, error: ie.message };
    inserted += rows.length;
    dates.push(date);
  }

  return { ok: true, dates, inserted };
}
