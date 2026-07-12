// Şirketler + iş ilanları + nöbetçi eczane için demo veri.
// Çalıştır: npx tsx scripts/seed-companies.ts
// Şema (companies/job_listings/pharmacy_duty) önce SQL Editor'de çalıştırılmış olmalı.
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

const companies = [
  {
    id: "atlas-tip-merkezi",
    name: "Atlas Tıp Merkezi",
    sector: "Sağlık",
    city: "Çanakkale",
    description:
      "Çanakkale merkezde 15 yılı aşkın süredir hizmet veren çok branşlı tıp merkezi. Uzman hekim kadromuzla randevulu muayene imkânı sunuyoruz.",
    logo_initials: "AT",
    website: "https://example.com",
    phone: "+90 286 555 10 10",
    email: "info@atlastipmerkezi.example.com",
    address: "Cevatpaşa Mah. Demircioğlu Cad. No:12, Merkez/Çanakkale",
    status: "approved",
    premium: true,
  },
  {
    id: "truva-hukuk-burosu",
    name: "Truva Hukuk Bürosu",
    sector: "Hukuk",
    city: "Çanakkale",
    description: "Aile hukuku, ticaret hukuku ve icra alanlarında danışmanlık veren hukuk bürosu.",
    logo_initials: "TH",
    website: null,
    phone: "+90 286 555 20 20",
    email: "iletisim@truvahukuk.example.com",
    address: "Kemalpaşa Mah. Fevzipaşa Cad. No:5, Merkez/Çanakkale",
    status: "approved",
    premium: false,
  },
  {
    id: "kepez-fitness-akademi",
    name: "Kepez Fitness Akademi",
    sector: "Sağlık",
    city: "Çanakkale",
    description: "Kişisel antrenörlük, pilates ve grup dersleriyle hizmet veren spor merkezi.",
    logo_initials: "KF",
    website: "https://example.com",
    phone: "+90 286 555 30 30",
    email: null,
    address: "Barbaros Mah. Kepez/Çanakkale",
    status: "approved",
    premium: false,
  },
];

const jobs = [
  {
    company_id: "atlas-tip-merkezi",
    title: "Klinik Psikolog (Tam Zamanlı)",
    description:
      "Merkezimizde çalışacak, yetişkin danışanlarla bireysel terapi deneyimi olan klinik psikolog arıyoruz. Ruhsatname zorunludur.",
    employment_type: "Tam zamanlı",
    location: "Merkez, Çanakkale",
    contact_email: "kariyer@atlastipmerkezi.example.com",
    contact_phone: "+90 286 555 10 10",
    status: "open",
  },
  {
    company_id: "atlas-tip-merkezi",
    title: "Hasta Kabul Görevlisi",
    description: "Ön büroda hasta kabul, randevu yönetimi ve telefon trafiğinden sorumlu personel aranıyor.",
    employment_type: "Tam zamanlı",
    location: "Merkez, Çanakkale",
    contact_email: "kariyer@atlastipmerkezi.example.com",
    contact_phone: null,
    status: "open",
  },
  {
    company_id: "kepez-fitness-akademi",
    title: "Pilates Eğitmeni (Yarı Zamanlı)",
    description: "Hafta içi akşam saatlerinde grup pilates dersi verecek sertifikalı eğitmen aranıyor.",
    employment_type: "Yarı zamanlı",
    location: "Kepez, Çanakkale",
    contact_email: null,
    contact_phone: "+90 286 555 30 30",
    status: "open",
  },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const pharmacyDuty = [
  { duty_date: todayIso(), name: "Truva Eczanesi", district: "Merkez", address: "Cumhuriyet Meydanı No:3", phone: "+90 286 555 40 01" },
  { duty_date: todayIso(), name: "Kepez Eczanesi", district: "Kepez", address: "Barbaros Mah. Atatürk Cad. No:22", phone: "+90 286 555 40 02" },
  { duty_date: todayIso(), name: "Biga Merkez Eczanesi", district: "Biga", address: "Hükümet Meydanı No:1", phone: "+90 286 555 40 03" },
];

async function main() {
  const { error: ce } = await db.from("companies").upsert(companies, { onConflict: "id" });
  if (ce) throw ce;
  console.log(`${companies.length} şirket yüklendi.`);

  // İş ilanlarını tekrar tekrar eklememek için önce mevcut demo ilanları temizle.
  const { error: de } = await db.from("job_listings").delete().in("company_id", companies.map((c) => c.id));
  if (de) throw de;
  const { error: je } = await db.from("job_listings").insert(jobs);
  if (je) throw je;
  console.log(`${jobs.length} iş ilanı yüklendi.`);

  const { error: pde } = await db.from("pharmacy_duty").delete().eq("duty_date", todayIso());
  if (pde) throw pde;
  const { error: pe } = await db.from("pharmacy_duty").insert(pharmacyDuty);
  if (pe) throw pe;
  console.log(`${pharmacyDuty.length} nöbetçi eczane kaydı yüklendi (${todayIso()}).`);
}

main().then(() => {
  console.log("Tamamlandı.");
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
