// Nöbetçi eczane listesini seed eder. Kalıcı çözüm gelene kadar bu script
// günlük/haftalık olarak elle çalıştırılabilir (veya bir cron job'a bağlanabilir):
//   npx tsx scripts/seed-pharmacy.ts
// Varsayılan olarak bugünden başlayarak 7 gün için, sabit bir eczane
// havuzundan dönüşümlü (round-robin) nöbetçi ataması yapar — gerçek listenin
// yerini tutmaz, ama demo/başlangıç verisi boş kalmasın diye buradadır.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error(".env.local içinde SUPABASE anahtarları eksik");

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const pool = [
  { name: "Truva Eczanesi", district: "Merkez", address: "Cumhuriyet Meydanı No:3", phone: "+90 286 555 40 01" },
  { name: "Kepez Eczanesi", district: "Kepez", address: "Barbaros Mah. Atatürk Cad. No:22", phone: "+90 286 555 40 02" },
  { name: "Biga Merkez Eczanesi", district: "Biga", address: "Hükümet Meydanı No:1", phone: "+90 286 555 40 03" },
  { name: "Çan Eczanesi", district: "Çan", address: "İstiklal Cad. No:8", phone: "+90 286 555 40 04" },
  { name: "Ezine Şifa Eczanesi", district: "Ezine", address: "Cumhuriyet Cad. No:14", phone: "+90 286 555 40 05" },
  { name: "Gelibolu Sahil Eczanesi", district: "Gelibolu", address: "Sahil Yolu No:2", phone: "+90 286 555 40 06" },
];

const DAYS_AHEAD = Number(process.argv[2] ?? 7);

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function main() {
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = isoDate(i);
    // Her gün havuzdan 3 eczane, döngüsel kaydırmayla seçilir.
    const picks = [0, 1, 2].map((k) => pool[(i + k) % pool.length]);
    const rows = picks.map((p) => ({ duty_date: date, ...p, address: p.address, phone: p.phone }));

    const { error: de } = await db.from("pharmacy_duty").delete().eq("duty_date", date);
    if (de) throw de;
    const { error: ie } = await db.from("pharmacy_duty").insert(
      rows.map((r) => ({
        duty_date: r.duty_date,
        name: r.name,
        district: r.district,
        address: r.address,
        phone: r.phone,
      }))
    );
    if (ie) throw ie;
    console.log(`${date}: ${rows.map((r) => r.name).join(", ")}`);
  }
}

main()
  .then(() => {
    console.log(`Tamamlandı (${DAYS_AHEAD} gün).`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
