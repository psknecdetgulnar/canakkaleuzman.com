"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";

// İş ilanı moderasyonu: kapatma/açma, soft delete, ilan sahibini görme.
type Row = {
  id: string; company_id: string; title: string; employment_type: string;
  location: string; status: string; deleted_at: string | null; created_at: string;
};

export default function IlanlarPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { confirm, modal } = useConfirm();

  const load = useCallback(async () => {
    if (!sb) return;
    let query = sb.from("job_listings").select("id,company_id,title,employment_type,location,status,deleted_at,created_at").order("created_at", { ascending: false }).limit(300);
    if (!showDeleted) query = query.is("deleted_at", null);
    const { data } = await query;
    setRows((data as Row[]) ?? []);
  }, [showDeleted]);

  useEffect(() => {
    load();
  }, [load]);

  async function update(row: Row, patch: Record<string, unknown>, action: string) {
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.from("job_listings").update(patch).eq("id", row.id);
    await logAdminAction({ action, targetType: "job_listing", targetId: row.id, newData: patch, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

  return (
    <div>
      <PageTitle title="İş İlanları" desc="Şirketlerin ilanlarını denetle: kapat, yeniden aç veya sil (geri alınabilir)." />
      <AdminCard className="mb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold"><input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="h-4 w-4 accent-[#b3261e]" /> Silinenleri göster</label>
      </AdminCard>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text="İlan bulunamadı." />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((j) => (
            <AdminCard key={j.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#0d2c4b]">{j.title}</span>
                    <Badge text={j.status === "open" ? "Yayında" : "Kapalı"} tone={j.status === "open" ? "green" : "muted"} />
                    {j.deleted_at && <Badge text="Silinmiş" tone="red" />}
                  </div>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                    <Link href={`/sirket/${j.company_id}`} target="_blank" className="font-semibold hover:text-[#c99a53]">{j.company_id}</Link>
                    {" "}· {j.employment_type} · {j.location} · {new Date(j.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {j.deleted_at ? (
                    <Btn small tone="navy" disabled={busy} onClick={() => update(j, { deleted_at: null }, "job.restore")}>Geri al</Btn>
                  ) : (
                    <>
                      <Btn small disabled={busy} onClick={() => update(j, { status: j.status === "open" ? "closed" : "open" }, j.status === "open" ? "job.close" : "job.open")}>
                        {j.status === "open" ? "Kapat" : "Yeniden aç"}
                      </Btn>
                      <Btn small tone="red" disabled={busy} onClick={async () => {
                        const r = await confirm({ title: "İlanı sil (soft delete)", desc: `"${j.title}" görünmez olur; geri alınabilir.`, danger: true });
                        if (r.ok) update(j, { deleted_at: new Date().toISOString() }, "job.softdelete");
                      }}>Sil</Btn>
                    </>
                  )}
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
      {modal}
    </div>
  );
}
