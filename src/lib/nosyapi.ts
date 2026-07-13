// NosyAPI — Çanakkale nöbetçi eczane verisini çeker.
// Docs: https://www.nosyapi.com/api/nobetci-eczane
// Endpoint: GET /apiv2/service/pharmacies-on-duty?city=canakkale  (1 kredi)
// Auth: ?apiKey=... (veya Authorization: Bearer ...). Anahtar yalnızca sunucu
// tarafında (env) tutulur, istemciye asla gönderilmez.

const BASE = "https://www.nosyapi.com/apiv2/service";

export type NosyPharmacy = {
  name: string;
  district: string;
  address: string | null;
  phone: string | null;
  dutyStart: string | null; // ISO benzeri ("2026-07-13 08:30:00")
  dutyEnd: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalize(r: any): NosyPharmacy {
  const district = String(r.district ?? "").trim() || "Merkez";
  const town = String(r.town ?? "").trim();
  // Belde varsa ilçeyle birlikte göster: "Ayvacık · Küçükkuyu".
  const districtLabel = town && town !== district ? `${district} · ${town}` : district;
  return {
    name: String(r.pharmacyName ?? r.name ?? "").trim(),
    district: districtLabel,
    address: r.address ? String(r.address).trim() : null,
    phone: r.phone ? String(r.phone).trim() : null,
    dutyStart: r.pharmacyDutyStart ? String(r.pharmacyDutyStart) : null,
    dutyEnd: r.pharmacyDutyEnd ? String(r.pharmacyDutyEnd) : null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Bir tarih-saat metninden yalnızca YYYY-MM-DD kısmını güvenle çıkarır.
export function dutyDateOf(p: NosyPharmacy): string | null {
  const src = p.dutyStart ?? "";
  const m = src.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export type NosyResult =
  | { ok: true; pharmacies: NosyPharmacy[] }
  | { ok: false; error: string };

// Çanakkale'nin tüm ilçelerindeki (city=canakkale) o an nöbetçi eczaneleri.
export async function fetchCanakkalePharmacies(apiKey: string): Promise<NosyResult> {
  const url = `${BASE}/pharmacies-on-duty?city=canakkale&apiKey=${encodeURIComponent(apiKey)}`;
  let json: unknown;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    json = await res.json();
  } catch (e) {
    return { ok: false, error: `İstek başarısız: ${(e as Error).message}` };
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const j = json as any;
  if (j?.status !== "success") {
    return { ok: false, error: j?.messageTR || j?.message || "Bilinmeyen NosyAPI hatası" };
  }
  const rows: any[] = Array.isArray(j.data) ? j.data : [];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return { ok: true, pharmacies: rows.map(normalize).filter((p) => p.name) };
}
