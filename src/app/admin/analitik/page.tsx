"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getEventCounts, getTopExperts, type EventCounts, type TrackEvent } from "@/lib/analytics";
import { AdminCard, Empty, PageTitle } from "@/components/admin/ui";

// Analitik: dönüşüm olayları (görüntülenme, tıklamalar, paylaşım) + CSV dışa aktarma.
const EVENT_LABELS: [TrackEvent, string][] = [
  ["profile_view", "Profil görüntülenme"],
  ["phone_click", "Telefon tıklama"],
  ["whatsapp_click", "WhatsApp tıklama"],
  ["email_click", "E-posta tıklama"],
  ["share", "Profil paylaşımı"],
  ["website_click", "Web sitesi tıklama"],
  ["search", "Arama"],
];

type Range = "7d" | "30d" | "90d";

export default function AnalitikPage() {
  const [range, setRange] = useState<Range>("30d");
  const [counts, setCounts] = useState<EventCounts | null>(null);
  const [top, setTop] = useState<{ expertId: string; views: number }[]>([]);

  const since = useCallback(() => new Date(Date.now() - (range === "7d" ? 7 : range === "30d" ? 30 : 90) * 864e5).toISOString(), [range]);

  useEffect(() => {
    getEventCounts(since()).then(setCounts);
    getTopExperts(since(), 15).then(setTop);
  }, [since]);

  function exportCsv() {
    const rows = [["Metrik", "Sayı"], ...EVENT_LABELS.map(([k, label]) => [label, String(counts?.[k] ?? 0)])];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `canakkaleuzman-analitik-${range}.csv`;
    a.click();
  }

  const max = Math.max(1, ...EVENT_LABELS.map(([k]) => counts?.[k] ?? 0));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle title="Analitik" desc="Ziyaretçi dönüşüm olayları. Veriler sitede gerçek etkileşimlerden toplanır (kişisel veri tutulmaz)." />
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-[8px] bg-[#e8e2d6] p-1">
            {(["7d", "30d", "90d"] as Range[]).map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${range === r ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844]"}`}>
                {r === "7d" ? "7 gün" : r === "30d" ? "30 gün" : "90 gün"}
              </button>
            ))}
          </div>
          <button type="button" onClick={exportCsv} className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53]">CSV indir</button>
        </div>
      </div>

      <AdminCard>
        <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">Olaylar</h3>
        {counts === null ? (
          <div className="mt-3 h-32 animate-pulse rounded-[8px] bg-[#f3eee6]" />
        ) : (
          <div className="mt-3 space-y-2.5">
            {EVENT_LABELS.map(([k, label]) => {
              const v = counts[k] ?? 0;
              return (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-44 shrink-0 text-[#102844]">{label}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#f3eee6]">
                    <div className="h-full rounded-full bg-[#0d2c4b]" style={{ width: `${(v / max) * 100}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right font-semibold text-[#0d2c4b]">{v}</span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <AdminCard className="mt-4">
        <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">En çok görüntülenen uzmanlar</h3>
        {top.length === 0 ? (
          <div className="mt-3"><Empty text="Bu aralıkta görüntülenme yok." /></div>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead><tr className="text-left text-xs text-[rgba(16,40,68,0.55)]"><th className="pb-2">#</th><th className="pb-2">Uzman</th><th className="pb-2 text-right">Görüntülenme</th></tr></thead>
            <tbody>
              {top.map((t, i) => (
                <tr key={t.expertId} className="border-t border-[rgba(16,40,68,0.06)]">
                  <td className="py-2 text-[rgba(16,40,68,0.5)]">{i + 1}</td>
                  <td className="py-2"><Link href={`/uzman/${t.expertId}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{t.expertId}</Link></td>
                  <td className="py-2 text-right font-semibold text-[#0d2c4b]">{t.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  );
}
