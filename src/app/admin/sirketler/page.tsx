"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";

// Şirket yönetimi: onay/yayından kaldırma, ret gerekçesi, soft delete.
type Row = {
  id: string; name: string; sector: string; phone: string | null; email: string | null;
  status: string; rejection_reason: string | null; deleted_at: string | null; created_at: string;
};

export default function SirketlerPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { confirm, modal } = useConfirm();

  const load = useCallback(async () => {
    if (!sb) return;
    let query = sb.from("companies").select("id,name,sector,phone,email,status,rejection_reason,deleted_at,created_at").order("created_at", { ascending: false }).limit(300);
    if (q.trim()) query = query.or(`name.ilike.%${q.trim()}%,id.ilike.%${q.trim()}%`);
    if (!showDeleted) query = query.is("deleted_at", null);
    const { data } = await query;
    setRows((data as Row[]) ?? []);
  }, [q, showDeleted]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function update(row: Row, patch: Record<string, unknown>, action: string) {
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.from("companies").update(patch).eq("id", row.id);
    await logAdminAction({ action, targetType: "company", targetId: row.id, oldData: { status: row.status }, newData: patch, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

  return (
    <div>
      <PageTitle title="Şirketler" desc="Şirket sayfalarını onayla, yayından kaldır veya sil (geri alınabilir)." />
      <AdminCard className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Şirket adı ara…" className="h-10 min-w-[200px] flex-1 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
          <label className="flex items-center gap-1.5 text-xs font-semibold"><input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="h-4 w-4 accent-[#b3261e]" /> Silinenleri göster</label>
        </div>
      </AdminCard>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text="Şirket bulunamadı." />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((c) => (
            <AdminCard key={c.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/sirket/${c.id}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{c.name}</Link>
                    <Badge text={c.status === "approved" ? "Yayında" : c.status === "pending" ? "Bekliyor" : "Yayında değil"} tone={c.status === "approved" ? "green" : "muted"} />
                    {c.deleted_at && <Badge text="Silinmiş" tone="red" />}
                  </div>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{c.sector} {c.phone ? `· ${c.phone}` : ""} {c.email ? `· ${c.email}` : ""} · {new Date(c.created_at).toLocaleDateString("tr-TR")}</p>
                  {c.rejection_reason && <p className="mt-1 text-xs text-[#b3261e]">Gerekçe: {c.rejection_reason}</p>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.deleted_at ? (
                    <Btn small tone="navy" disabled={busy} onClick={() => update(c, { deleted_at: null }, "company.restore")}>Geri al</Btn>
                  ) : (
                    <>
                      {c.status === "approved" ? (
                        <Btn small disabled={busy} onClick={async () => {
                          const r = await confirm({ title: "Yayından kaldır", desc: `${c.name} sayfası halka kapanır.`, withReason: true });
                          if (r.ok) update(c, { status: "rejected", rejection_reason: r.reason ?? null }, "company.unpublish");
                        }}>Yayından kaldır</Btn>
                      ) : (
                        <Btn small tone="navy" disabled={busy} onClick={() => update(c, { status: "approved", rejection_reason: null }, "company.approve")}>Onayla / Yayınla</Btn>
                      )}
                      <Btn small tone="red" disabled={busy} onClick={async () => {
                        const r = await confirm({ title: "Şirketi sil (soft delete)", desc: `${c.name} ve ilanları görünmez olur; geri alınabilir.`, danger: true });
                        if (r.ok) update(c, { deleted_at: new Date().toISOString() }, "company.softdelete");
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
