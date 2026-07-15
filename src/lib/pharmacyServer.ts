import "server-only";
import { createClient } from "@supabase/supabase-js";
import { syncPharmacyDuty } from "@/lib/pharmacySync";
import { getPharmaciesForDate, getTodayPharmaciesWithFallback, type PharmacyDuty } from "@/lib/pharmacy";

// KENDİ KENDİNİ ONARAN eczane verisi (yalnızca sunucu).
// Cron herhangi bir sebeple çalışmadıysa (env eksik, plan kısıtı vb.) sayfa
// render'ı sırasında bugünün listesi boşsa NosyAPI'den senkron denenir.
// Sayfalar revalidate=300 olduğundan en fazla 5 dakikada bir denenir; anahtar
// yoksa veya API hata verirse sessizce mevcut fallback davranışına düşülür.
export async function getFreshPharmacies(): Promise<{ pharmacies: PharmacyDuty[]; date: string; isStale: boolean }> {
  const today = new Date().toISOString().slice(0, 10);
  let list = await getPharmaciesForDate(today);
  if (list.length === 0) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.NOSYAPI_KEY;
    if (url && serviceKey && apiKey) {
      try {
        const db = createClient(url, serviceKey, { auth: { persistSession: false } });
        await syncPharmacyDuty(db, apiKey);
        list = await getPharmaciesForDate(today);
      } catch {
        // sessiz — fallback devreye girer
      }
    }
  }
  if (list.length > 0) return { pharmacies: list, date: today, isStale: false };
  return getTodayPharmaciesWithFallback();
}
