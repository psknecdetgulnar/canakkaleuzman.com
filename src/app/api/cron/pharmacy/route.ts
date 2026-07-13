import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { syncPharmacyDuty } from "@/lib/pharmacySync";

// Vercel Cron: her sabah 07:00 (TR / 04:00 UTC — bkz. vercel.json) çalışır,
// NosyAPI'den Çanakkale'nin o an nöbetçi eczanelerini çeker ve pharmacy_duty
// tablosuna yazar. Veriyi nöbet başlangıç tarihine (pharmacyDutyStart) göre
// gruplar; o tarihlere ait eski kayıtları silip yenisini yazar (idempotent).
// NosyAPI başarısız olursa veya boş dönerse mevcut kayıtlara DOKUNMAZ.

export async function GET(req: NextRequest) {
  // Vercel Cron isteği CRON_SECRET ile doğrulanır (proje env'inde tanımlıysa
  // Vercel isteğe otomatik ekler). Tanımlı değilse route reddeder.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.NOSYAPI_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "supabase env eksik" }, { status: 500 });
  if (!apiKey) return NextResponse.json({ error: "NOSYAPI_KEY eksik" }, { status: 500 });

  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const result = await syncPharmacyDuty(db, apiKey);
  if (!result.ok) return NextResponse.json(result, { status: 502 });
  return NextResponse.json(result);
}
