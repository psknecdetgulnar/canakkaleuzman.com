import { createClient } from "@supabase/supabase-js";

// Nöbetçi eczane listesi — pratik/manuel yaklaşım (bkz. schema.sql notu).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key && !url.includes("xxxx") ? createClient(url, key, { auth: { persistSession: false } }) : null;

export type PharmacyDuty = {
  id: string;
  dutyDate: string; // YYYY-MM-DD
  name: string;
  district: string;
  address: string | null;
  phone: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToPharmacy(r: any): PharmacyDuty {
  return {
    id: r.id,
    dutyDate: r.duty_date,
    name: r.name,
    district: r.district,
    address: r.address ?? null,
    phone: r.phone ?? null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function getPharmaciesForDate(date: string): Promise<PharmacyDuty[]> {
  if (!db) return [];
  const { data, error } = await db.from("pharmacy_duty").select("*").eq("duty_date", date).order("district");
  if (error || !data) return [];
  return data.map(rowToPharmacy);
}

// Kalıcı çözümün bir parçası: yönetim ekranından o günün listesi girilmeyi
// unutulursa sayfa sessizce boş kalmasın diye, en son girilen tarihe düşer.
// Böylece "bugün için kayıt yok" durumu yerine en güncel bilinen liste +
// hangi tarihe ait olduğu bilgisi gösterilir.
export async function getTodayPharmaciesWithFallback(): Promise<{ pharmacies: PharmacyDuty[]; date: string; isStale: boolean }> {
  const today = todayIso();
  const todays = await getPharmaciesForDate(today);
  if (todays.length > 0) return { pharmacies: todays, date: today, isStale: false };

  if (!db) return { pharmacies: [], date: today, isStale: false };
  const { data, error } = await db
    .from("pharmacy_duty")
    .select("duty_date")
    .order("duty_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return { pharmacies: [], date: today, isStale: false };

  const latestDate = data.duty_date as string;
  const latest = await getPharmaciesForDate(latestDate);
  return { pharmacies: latest, date: latestDate, isStale: latestDate !== today };
}

export async function getTodayPharmacies(): Promise<PharmacyDuty[]> {
  return getPharmaciesForDate(todayIso());
}

export type NewPharmacyDuty = {
  dutyDate: string;
  name: string;
  district: string;
  address?: string;
  phone?: string;
};

export async function addPharmacyDuty(p: NewPharmacyDuty): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("pharmacy_duty").insert({
    duty_date: p.dutyDate,
    name: p.name.trim().slice(0, 160),
    district: p.district.trim().slice(0, 80),
    address: p.address?.trim() || null,
    phone: p.phone?.trim() || null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deletePharmacyDuty(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("pharmacy_duty").delete().eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
