"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";
import { getEventCounts, getTopExperts, type EventCounts } from "@/lib/analytics";
import { getAuditLogs, type AuditLog } from "@/lib/adminPanel";
import { AdminCard, PageTitle, Badge } from "@/components/admin/ui";

// Yönetim ana paneli: platform özet metrikleri + tarih filtresi + son işlemler.

type Range = "today" | "7d" | "30d" | "month";
const RANGES: [Range, string][] = [["today", "Bugün"], ["7d", "Son 7 gün"], ["30d", "Son 30 gün"], ["month", "Bu ay"]];

function sinceOf(r: Range): string {
  const now = new Date();
  if (r === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  if (r === "7d") return new Date(Date.now() - 7 * 864e5).toISOString();
  if (r === "30d") return new Date(Date.now() - 30 * 864e5).toISOString();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

type Counts = {
  experts: number; pendingExperts: number; suspended: number; companies: number;
  openJobs: number; pendingSupport: number; pendingAppointments: number;
  premiumExpiring: number; blogPosts: number;
};

export default function AdminDashboard() {
  const [range, setRange] = useState<Range>("7d");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [events, setEvents] = useState<EventCounts | null>(null);
  const [top, setTop] = useState<{ expertId: string; views: number }[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const load = useCallback(async () => {
    if (!sb) return;
    const since = sinceOf(range);
    const cnt = async (table: string, filter?: (q: ReturnType<NonNullable<typeof sb>["from"]>["select"] extends never ? never : any) => any) => {
      let q = sb!.from(table).select("*", { count: "exact", head: true });
      if (filter) q = filter(q);
      const { count } = await q;
      return count ?? 0;
    };
    const in30d = new Date(Date.now() + 30 * 864e5).toISOString();
    const [experts, pendingExperts, suspended, companies, openJobs, pendingSupport, pendingAppointments, premiumExpiring, blogPosts, ev, topList, logList] = await Promise.all([
      cnt("experts", (q: any) => q.eq("status", "approved").is("deleted_at", null)),
      cnt("experts", (q: any) => q.eq("status", "pending")),
      cnt("experts", (q: any) => q.eq("status", "suspended")),
      cnt("companies", (q: any) => q.eq("status", "approved").is("deleted_at", null)),
      cnt("job_listings", (q: any) => q.eq("status", "open").is("deleted_at", null)),
      cnt("support_messages", (q: any) => q.eq("status", "open")),
      cnt("appointments", (q: any) => q.eq("status", "pending")),
      cnt("experts", (q: any) => q.eq("premium", true).not("premium_until", "is", null).lte("premium_until", in30d)),
      cnt("blog_posts", (q: any) => q.is("deleted_at", null)),
      getEventCounts(since),
      getTopExperts(since, 5),
      getAuditLogs(8),
    ]);
    setCounts({ experts, pendingExperts, suspended, companies, openJobs, pendingSupport, pendingAppointments, premiumExpiring, blogPosts });
    setEvents(ev);
    setTop(topList);
    setLogs(logList);
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle title="Dashboard" desc="Platformun genel durumu ve dönüşüm metrikleri." />
        <div className="flex gap-1 rounded-[8px] bg-[#e8e2d6] p-1">
          {RANGES.map(([r, label]) => (
            <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${range === r ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844]"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform durumu */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Yayındaki uzmanlar" value={counts?.experts} href="/admin/uzmanlar" />
        <Stat label="Onay bekleyen başvuru" value={counts?.pendingExperts} href="/admin/uzmanlar?durum=pending" accent={Boolean(counts?.pendingExperts)} />
        <Stat label="Askıya alınmış profil" value={counts?.suspended} href="/admin/uzmanlar?durum=suspended" />
        <Stat label="Şirketler" value={counts?.companies} href="/admin/sirketler" />
        <Stat label="Açık iş ilanı" value={counts?.openJobs} href="/admin/ilanlar" />
        <Stat label="Bekleyen destek" value={counts?.pendingSupport} href="/admin/destek" accent={Boolean(counts?.pendingSupport)} />
        <Stat label="Bekleyen randevu" value={counts?.pendingAppointments} />
        <Stat label="Premium'u bitecek (30g)" value={counts?.premiumExpiring} href="/admin/uzmanlar?premium=1" />
      </div>

      {/* Dönüşüm metrikleri (analytics_events) */}
      <h2 className="mt-7 mb-3 font-display text-[1.2rem] font-semibold text-[#0d2c4b]">Dönüşüm metrikleri <span className="text-sm font-normal text-[rgba(16,40,68,0.5)]">({RANGES.find(([r]) => r === range)?.[1]})</span></h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Profil görüntülenme" value={events ? (events.profile_view ?? 0) : undefined} />
        <Stat label="Telefon tıklama" value={events ? (events.phone_click ?? 0) : undefined} />
        <Stat label="WhatsApp tıklama" value={events ? (events.whatsapp_click ?? 0) : undefined} />
        <Stat label="E-posta tıklama" value={events ? (events.email_click ?? 0) : undefined} />
        <Stat label="Profil paylaşımı" value={events ? (events.share ?? 0) : undefined} />
        <Stat label="Web sitesi tıklama" value={events ? (events.website_click ?? 0) : undefined} />
        <Stat label="Arama" value={events ? (events.search ?? 0) : undefined} />
        <Stat label="Blog yazısı (toplam)" value={counts?.blogPosts} href="/admin/icerik" />
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {/* En çok görüntülenen uzmanlar */}
        <AdminCard>
          <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">En çok görüntülenen uzmanlar</h3>
          {top.length === 0 ? (
            <p className="mt-3 text-sm text-[rgba(16,40,68,0.55)]">Bu aralıkta görüntülenme verisi yok.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {top.map((t, i) => (
                <li key={t.expertId} className="flex items-center justify-between text-sm">
                  <Link href={`/uzman/${t.expertId}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{i + 1}. {t.expertId}</Link>
                  <span className="text-[rgba(16,40,68,0.6)]">{t.views} görüntülenme</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Son admin işlemleri */}
        <AdminCard>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">Son yönetim işlemleri</h3>
            <Link href="/admin/loglar" className="text-xs font-semibold text-[#0d2c4b] hover:text-[#c99a53]">Tümü →</Link>
          </div>
          {logs.length === 0 ? (
            <p className="mt-3 text-sm text-[rgba(16,40,68,0.55)]">Henüz kayıt yok.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {logs.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="min-w-0 truncate text-[#102844]"><strong>{l.adminEmail}</strong> · {l.action} {l.targetId ? `→ ${l.targetId}` : ""}</span>
                  <span className="shrink-0 text-[rgba(16,40,68,0.5)]">{new Date(l.createdAt).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      {counts?.pendingExperts ? (
        <div className="mt-5">
          <Badge text={`${counts.pendingExperts} başvuru onay bekliyor — Uzmanlar sayfasından incele`} tone="gold" />
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, href, accent }: { label: string; value: number | undefined; href?: string; accent?: boolean }) {
  const inner = (
    <AdminCard className={accent ? "border-[#c99a53]" : ""}>
      <div className="text-xs text-[rgba(16,40,68,0.6)]">{label}</div>
      <div className={`mt-1 font-display text-[1.7rem] font-semibold ${accent ? "text-[#c99a53]" : "text-[#0d2c4b]"}`}>
        {value === undefined ? "…" : value}
      </div>
    </AdminCard>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
