"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";
import { rowToListing, type PublicListing } from "@/lib/publicListings";

// İş ilanı moderasyonu: halka açık gönderimler (onay kuyruğu) + şirket ilanları.
type Row = {
  id: string; company_id: string; title: string; employment_type: string;
  location: string; status: string; deleted_at: string | null; created_at: string;
};

export default function IlanlarPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [pubs, setPubs] = useState<PublicListing[] | null>(null);
  const [pubFilter, setPubFilter] = useState<"pending" | "all">("pending");
  const [showDeleted, setShowDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { confirm, modal } = useConfirm();

  const load = useCallback(async () => {
    if (!sb) return;
    let query = sb.from("job_listings").select("id,company_id,title,employment_type,location,status,deleted_at,created_at").order("created_at", { ascending: false }).limit(300);
    if (!showDeleted) query = query.is("deleted_at", null);
    const { data } = await query;
    setRows((data as Row[]) ?? []);
    // Halka açık gönderimler (iş ilanı + iş arayan)
    let pq = sb.from("public_listings").select("*").order("created_at", { ascending: false }).limit(300);
    if (pubFilter === "pending") pq = pq.eq("status", "pending");
    const { data: pdata } = await pq;
    setPubs((pdata ?? []).map(rowToListing));
  }, [showDeleted, pubFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updatePub(l: PublicListing, patch: Record<string, unknown>, action: string) {
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.from("public_listings").update(patch).eq("id", l.id);
    await logAdminAction({ action, targetType: "public_listing", targetId: l.id, oldData: { status: l.status }, newData: patch, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

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
      <PageTitle title="İş İlanları" desc="Halka açık gönderilen ilanlar (onay kuyruğu) + şirket paneli ilanları." />

      {/* Halka açık gönderimler — onay kuyruğu */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-[1.15rem] font-semibold text-[#0d2c4b]">Gönderilen İlanlar {pubs && pubFilter === "pending" && pubs.length > 0 ? `(${pubs.length} bekliyor)` : ""}</h2>
        <div className="flex gap-1 rounded-[8px] bg-[#e8e2d6] p-1">
          {(["pending", "all"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setPubFilter(f)} className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${pubFilter === f ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844]"}`}>
              {f === "pending" ? "Onay bekleyen" : "Tümü"}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        {pubs === null ? (
          <div className="h-24 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
        ) : pubs.length === 0 ? (
          <Empty text={pubFilter === "pending" ? "Onay bekleyen gönderim yok. 🎉" : "Gönderilmiş ilan yok."} />
        ) : (
          pubs.map((l) => (
            <AdminCard key={l.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#0d2c4b]">{l.kind === "is_ilani" ? "💼" : "🔎"} {l.title}</span>
                    <Badge text={l.kind === "is_ilani" ? "İşveren ilanı" : "İş arayan"} tone="navy" />
                    <Badge text={l.status === "pending" ? "Bekliyor" : l.status === "approved" ? "Yayında" : "Reddedildi"} tone={l.status === "pending" ? "gold" : l.status === "approved" ? "green" : "red"} />
                    {l.deletedAt && <Badge text="Silinmiş" tone="red" />}
                  </div>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                    {[l.orgName ?? l.contactName, l.employmentType, l.location, l.salary].filter(Boolean).join(" · ")} · {new Date(l.createdAt).toLocaleString("tr-TR")}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-[#102844]">{l.description}</p>
                  {l.requirements && <p className="mt-1 text-xs text-[#102844]"><strong>Nitelikler:</strong> {l.requirements}</p>}
                  {l.experience && <p className="mt-1 text-xs text-[#102844]"><strong>Deneyim:</strong> {l.experience} {l.education ? `· ${l.education}` : ""}</p>}
                  <p className="mt-1 text-xs font-semibold text-[#0d2c4b]">
                    İletişim: {l.contactName} · {[l.contactPhone, l.contactEmail, l.contactWhatsapp].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.status !== "approved" && !l.deletedAt && (
                    <Btn small tone="navy" disabled={busy} onClick={() => updatePub(l, { status: "approved", rejection_reason: null }, "public_listing.approve")}>Onayla / Yayınla</Btn>
                  )}
                  {l.status !== "rejected" && !l.deletedAt && (
                    <Btn small tone="red" disabled={busy} onClick={async () => {
                      const r = await confirm({ title: "İlanı reddet", desc: "İlan yayınlanmaz.", danger: true, withReason: true });
                      if (r.ok) updatePub(l, { status: "rejected", rejection_reason: r.reason ?? null }, "public_listing.reject");
                    }}>Reddet</Btn>
                  )}
                  {l.status === "approved" && !l.deletedAt && (
                    <Btn small disabled={busy} onClick={() => updatePub(l, { deleted_at: new Date().toISOString() }, "public_listing.softdelete")}>Yayından kaldır</Btn>
                  )}
                  {l.deletedAt && (
                    <Btn small tone="navy" disabled={busy} onClick={() => updatePub(l, { deleted_at: null }, "public_listing.restore")}>Geri al</Btn>
                  )}
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <h2 className="mb-2 font-display text-[1.15rem] font-semibold text-[#0d2c4b]">Şirket Paneli İlanları</h2>
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
