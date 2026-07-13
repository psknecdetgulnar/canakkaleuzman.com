import { sb } from "@/lib/supabaseClient";

// Hafif olay takibi: profil görüntülenme + dönüşüm tıklamaları.
// Kişisel veri toplamaz (yalnızca olay türü + uzman id). Fire-and-forget.
export type TrackEvent =
  | "profile_view"
  | "phone_click"
  | "whatsapp_click"
  | "email_click"
  | "share"
  | "qr"
  | "directions_click"
  | "website_click"
  | "search";

export function track(event: TrackEvent, expertId?: string, meta?: string): void {
  if (!sb) return;
  // await edilmez — kullanıcı deneyimini asla bloklamaz, hata yutulur.
  sb.from("analytics_events")
    .insert({ event, expert_id: expertId ?? null, meta: meta?.slice(0, 200) ?? null })
    .then(() => {});
}

export type EventCounts = Partial<Record<TrackEvent, number>>;

// Belirli tarihten bu yana olay sayıları (personel; RLS korur).
export async function getEventCounts(sinceIso: string): Promise<EventCounts> {
  if (!sb) return {};
  const { data } = await sb
    .from("analytics_events")
    .select("event")
    .gte("created_at", sinceIso)
    .limit(10000);
  const counts: EventCounts = {};
  for (const r of data ?? []) counts[r.event as TrackEvent] = (counts[r.event as TrackEvent] ?? 0) + 1;
  return counts;
}

// En çok görüntülenen uzmanlar (basit istemci-tarafı agregasyon).
export async function getTopExperts(sinceIso: string, limit = 10): Promise<{ expertId: string; views: number }[]> {
  if (!sb) return [];
  const { data } = await sb
    .from("analytics_events")
    .select("expert_id")
    .eq("event", "profile_view")
    .gte("created_at", sinceIso)
    .not("expert_id", "is", null)
    .limit(10000);
  const map = new Map<string, number>();
  for (const r of data ?? []) map.set(r.expert_id, (map.get(r.expert_id) ?? 0) + 1);
  return [...map.entries()]
    .map(([expertId, views]) => ({ expertId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
