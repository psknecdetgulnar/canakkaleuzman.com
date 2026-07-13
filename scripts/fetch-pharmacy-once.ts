// NosyAPI aktive edildikten sonra nöbetçi eczaneleri BİR KEZ çeker ve
// pharmacy_duty tablosuna yazar (cron beklemeden hemen görmek için).
// Çalıştır: npx tsx scripts/fetch-pharmacy-once.ts
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { fetchCanakkalePharmacies } from "../src/lib/nosyapi";
import { syncPharmacyDuty } from "../src/lib/pharmacySync";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const apiKey = process.env.NOSYAPI_KEY!;
if (!url || !serviceKey) throw new Error(".env.local içinde SUPABASE anahtarları eksik");
if (!apiKey) throw new Error(".env.local içinde NOSYAPI_KEY eksik");

async function main() {
  // Önce ham veriyi göster (format doğrulama).
  const raw = await fetchCanakkalePharmacies(apiKey);
  if (!raw.ok) {
    console.error("NosyAPI hatası:", raw.error);
    process.exit(1);
  }
  console.log(`NosyAPI'den ${raw.pharmacies.length} nöbetçi eczane geldi. İlk 3 örnek:`);
  console.log(JSON.stringify(raw.pharmacies.slice(0, 3), null, 2));

  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const res = await syncPharmacyDuty(db, apiKey);
  console.log("\nSenkron sonucu:", JSON.stringify(res));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
