import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron: her sabah 10:00 (TR / 07:00 UTC — bkz. vercel.json) çalışır,
// önümüzdeki 7 gün için nöbetçi eczane kaydı olmayan günleri havuzdan
// dönüşümlü (round-robin) doldurur. Elle girilen günlere DOKUNMAZ — yalnızca
// boş günleri tamamlar; böylece admin gerçek listeyi girdiğinde otomatik veri
// onu ezmez.
// Not: Gerçek NosyAPI verisi bağlandığında havuz yerine o kaynak kullanılacak.
// Nöbet, kaydın duty_date sabahından ertesi güne (08:30 – 08:30) kadardır.

const POOL = [
  { name: "Truva Eczanesi", district: "Merkez", address: "Cumhuriyet Meydanı No:3", phone: "+90 286 555 40 01" },
  { name: "Kepez Eczanesi", district: "Kepez", address: "Barbaros Mah. Atatürk Cad. No:22", phone: "+90 286 555 40 02" },
  { name: "Biga Merkez Eczanesi", district: "Biga", address: "Hükümet Meydanı No:1", phone: "+90 286 555 40 03" },
  { name: "Çan Eczanesi", district: "Çan", address: "İstiklal Cad. No:8", phone: "+90 286 555 40 04" },
  { name: "Ezine Şifa Eczanesi", district: "Ezine", address: "Cumhuriyet Cad. No:14", phone: "+90 286 555 40 05" },
  { name: "Gelibolu Sahil Eczanesi", district: "Gelibolu", address: "Sahil Yolu No:2", phone: "+90 286 555 40 06" },
];

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  // Vercel Cron isteği CRON_SECRET ile doğrulanır (proje env'inde tanımlıysa
  // Vercel isteğe otomatik ekler). Tanımlı değilse route reddeder.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "supabase env eksik" }, { status: 500 });
  }
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });

  const filled: string[] = [];
  // Havuz kaydırması tarihe bağlı (deterministik) — aynı gün tekrar çalışsa
  // da aynı seçimi üretir.
  const epochDay = Math.floor(Date.now() / 86_400_000);

  for (let i = 0; i < 7; i++) {
    const date = isoDate(i);
    const { data: existing, error: qe } = await db
      .from("pharmacy_duty")
      .select("id")
      .eq("duty_date", date)
      .limit(1);
    if (qe) return NextResponse.json({ error: qe.message }, { status: 500 });
    if (existing && existing.length > 0) continue; // elle girilmiş, dokunma

    const picks = [0, 1, 2].map((k) => POOL[(epochDay + i + k) % POOL.length]);
    const { error: ie } = await db.from("pharmacy_duty").insert(
      picks.map((p) => ({ duty_date: date, name: p.name, district: p.district, address: p.address, phone: p.phone }))
    );
    if (ie) return NextResponse.json({ error: ie.message }, { status: 500 });
    filled.push(date);
  }

  return NextResponse.json({ ok: true, filled });
}
