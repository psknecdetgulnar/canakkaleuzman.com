"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { categories } from "@/data/categories";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";

// Uzman yönetimi: gelişmiş filtre + moderasyon aksiyonları.
// Her işlem audit log'a yazılır; silme soft delete'tir (geri alınabilir).

type Row = {
  id: string; name: string; title: string; category: string; category_label: string;
  district: string; phone: string | null; status: string; premium: boolean;
  premium_from: string | null; premium_until: string | null;
  verified: boolean; sponsored: boolean; rejection_reason: string | null;
  deleted_at: string | null; created_at: string;
};

const STATUS_LABEL: Record<string, [string, "navy" | "gold" | "red" | "muted" | "green"]> = {
  approved: ["Yayında", "green"], pending: ["Onay bekliyor", "gold"],
  rejected: ["Reddedildi", "red"], suspended: ["Askıda", "muted"],
};

export default function Page() {
  return <Suspense fallback={null}><UzmanlarPage /></Suspense>;
}

function UzmanlarPage() {
  const params = useSearchParams();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(params.get("durum") ?? "all");
  const [cat, setCat] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [premiumFor, setPremiumFor] = useState<Row | null>(null);
  const { confirm, modal } = useConfirm();

  const load = useCallback(async () => {
    if (!sb) return;
    let query = sb.from("experts").select("id,name,title,category,category_label,district,phone,status,premium,premium_from,premium_until,verified,sponsored,rejection_reason,deleted_at,created_at").order("created_at", { ascending: false }).limit(300);
    if (status !== "all") query = query.eq("status", status);
    if (cat !== "all") query = query.eq("category", cat);
    if (q.trim()) query = query.or(`name.ilike.%${q.trim()}%,title.ilike.%${q.trim()}%,id.ilike.%${q.trim()}%`);
    if (!showDeleted) query = query.is("deleted_at", null);
    const { data } = await query;
    setRows((data as Row[]) ?? []);
  }, [q, status, cat, showDeleted]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function update(row: Row, patch: Record<string, unknown>, action: string) {
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.from("experts").update(patch).eq("id", row.id);
    await logAdminAction({ action, targetType: "expert", targetId: row.id, oldData: { status: row.status, premium: row.premium, verified: row.verified, sponsored: row.sponsored }, newData: patch, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

  return (
    <div>
      <PageTitle title="Uzmanlar" desc="Başvuru onayı, askıya alma, rozet, sponsorluk, premium süresi ve profil düzenleme. Tüm işlemler kayıt altına alınır; silme geri alınabilir." />

      {/* Filtreler */}
      <AdminCard className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İsim, unvan veya slug ara…" className="h-10 min-w-[200px] flex-1 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm">
            <option value="all">Tüm durumlar</option>
            <option value="pending">Onay bekleyen</option>
            <option value="approved">Yayında</option>
            <option value="suspended">Askıda</option>
            <option value="rejected">Reddedilen</option>
          </select>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm">
            <option value="all">Tüm kategoriler</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#102844]">
            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="h-4 w-4 accent-[#b3261e]" />
            Silinenleri göster
          </label>
        </div>
      </AdminCard>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text="Filtrelere uyan uzman bulunamadı." />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[rgba(16,40,68,0.55)]">{rows.length} kayıt</p>
          {rows.map((e) => {
            const [sLabel, sTone] = STATUS_LABEL[e.status] ?? [e.status, "muted"];
            return (
              <AdminCard key={e.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/uzman/${e.id}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{e.name}</Link>
                      <Badge text={sLabel} tone={sTone} />
                      {e.deleted_at && <Badge text="Silinmiş" tone="red" />}
                      {e.verified && <Badge text="✓ Doğrulanmış" tone="navy" />}
                      {e.sponsored && <Badge text="Sponsorlu" tone="gold" />}
                      {e.premium && <Badge text={`Premium ${premiumLabel(e)}`} tone="gold" />}
                    </div>
                    <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                      {e.title} · {e.category_label} · {e.district} {e.phone ? `· ${e.phone}` : ""} · {new Date(e.created_at).toLocaleDateString("tr-TR")}
                    </p>
                    {e.rejection_reason && <p className="mt-1 text-xs text-[#b3261e]">Ret gerekçesi: {e.rejection_reason}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {e.deleted_at ? (
                      <Btn small tone="navy" disabled={busy} onClick={() => update(e, { deleted_at: null }, "expert.restore")}>Geri al</Btn>
                    ) : (
                      <>
                        {e.status === "pending" && (
                          <>
                            <Btn small tone="navy" disabled={busy} onClick={() => update(e, { status: "approved", rejection_reason: null }, "expert.approve")}>Onayla</Btn>
                            <Btn small tone="red" disabled={busy} onClick={async () => {
                              const r = await confirm({ title: "Başvuruyu reddet", desc: `${e.name} başvurusu reddedilecek.`, danger: true, withReason: true });
                              if (r.ok) update(e, { status: "rejected", rejection_reason: r.reason ?? null }, "expert.reject");
                            }}>Reddet</Btn>
                          </>
                        )}
                        {e.status === "approved" && (
                          <Btn small disabled={busy} onClick={async () => {
                            const r = await confirm({ title: "Askıya al", desc: `${e.name} profili yayından kalkar; panel erişimi sürer.`, withReason: true });
                            if (r.ok) update(e, { status: "suspended", rejection_reason: r.reason ?? null }, "expert.suspend");
                          }}>Askıya al</Btn>
                        )}
                        {(e.status === "suspended" || e.status === "rejected") && (
                          <Btn small tone="navy" disabled={busy} onClick={() => update(e, { status: "approved", rejection_reason: null }, "expert.publish")}>Yayına al</Btn>
                        )}
                        <Btn small tone="gold" disabled={busy} onClick={() => setPremiumFor(e)}>Premium</Btn>
                        <Btn small disabled={busy} onClick={() => update(e, { verified: !e.verified }, e.verified ? "expert.unverify" : "expert.verify")}>{e.verified ? "Rozeti kaldır" : "Doğrula ✓"}</Btn>
                        <Btn small disabled={busy} onClick={() => update(e, { sponsored: !e.sponsored }, e.sponsored ? "expert.unsponsor" : "expert.sponsor")}>{e.sponsored ? "Sponsorluğu kaldır" : "Sponsorlu yap"}</Btn>
                        <Btn small disabled={busy} onClick={() => setEditing(e)}>Düzenle</Btn>
                        <Btn small tone="red" disabled={busy} onClick={async () => {
                          const r = await confirm({ title: "Profili sil (soft delete)", desc: `${e.name} sitede görünmez olur; buradan geri alınabilir. Kalıcı silme kapalıdır.`, danger: true });
                          if (r.ok) update(e, { deleted_at: new Date().toISOString() }, "expert.softdelete");
                        }}>Sil</Btn>
                      </>
                    )}
                  </div>
                </div>
                {premiumFor?.id === e.id && (
                  <PremiumEditor row={e} busy={busy} onClose={() => setPremiumFor(null)} onSave={(patch, action) => { update(e, patch, action); setPremiumFor(null); }} />
                )}
                {editing?.id === e.id && (
                  <EditDrawer row={e} busy={busy} onClose={() => setEditing(null)} onSave={(patch) => { update(e, patch, "expert.update"); setEditing(null); }} />
                )}
              </AdminCard>
            );
          })}
        </div>
      )}
      {modal}
    </div>
  );
}

function premiumLabel(e: Row): string {
  if (!e.premium_from && !e.premium_until) return "(∞)";
  const f = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) : "—");
  return `(${f(e.premium_from)}→${e.premium_until ? f(e.premium_until) : "∞"})`;
}

function PremiumEditor({ row, busy, onClose, onSave }: { row: Row; busy: boolean; onClose: () => void; onSave: (patch: Record<string, unknown>, action: string) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [forever, setForever] = useState(row.premium && !row.premium_until);
  const [from, setFrom] = useState(row.premium_from?.slice(0, 10) ?? today);
  const [until, setUntil] = useState(row.premium_until?.slice(0, 10) ?? "");
  return (
    <div className="mt-3 rounded-[10px] border border-[#c99a53] bg-[#fdf3e9] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#c99a53]">Premium süresi (public görünmez)</p>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={forever} onChange={(e) => setForever(e.target.checked)} className="h-4 w-4 accent-[#c99a53]" /> Sonsuza kadar</label>
      {!forever && (
        <div className="mt-2 flex flex-wrap gap-3">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm" />
          <input type="date" value={until} min={from} onChange={(e) => setUntil(e.target.value)} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm" />
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <Btn small tone="navy" disabled={busy || (!forever && !until)} onClick={() =>
          onSave({ premium: true, premium_from: forever ? null : new Date(`${from}T00:00:00`).toISOString(), premium_until: forever ? null : new Date(`${until}T23:59:59`).toISOString() }, "expert.premium.grant")
        }>Kaydet</Btn>
        {row.premium && <Btn small tone="red" disabled={busy} onClick={() => onSave({ premium: false, premium_from: null, premium_until: null }, "expert.premium.revoke")}>Premium'u kaldır</Btn>}
        <Btn small onClick={onClose}>Vazgeç</Btn>
      </div>
    </div>
  );
}

function EditDrawer({ row, busy, onClose, onSave }: { row: Row; busy: boolean; onClose: () => void; onSave: (patch: Record<string, unknown>) => void }) {
  const [f, setF] = useState({ name: row.name, title: row.title, district: row.district, phone: row.phone ?? "", category: row.category });
  const inp = "h-10 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]";
  return (
    <div className="mt-3 rounded-[10px] border border-[rgba(16,40,68,0.15)] bg-[#f6f3ed] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[rgba(16,40,68,0.6)]">Profil düzenle (admin)</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs">Ad soyad<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} /></label>
        <label className="text-xs">Unvan<input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inp} /></label>
        <label className="text-xs">İlçe<input value={f.district} onChange={(e) => setF({ ...f, district: e.target.value })} className={inp} /></label>
        <label className="text-xs">Telefon<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inp} /></label>
        <label className="text-xs">Kategori
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inp}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn small tone="navy" disabled={busy} onClick={() => {
          const cat = categories.find((c) => c.slug === f.category);
          onSave({ name: f.name.trim(), title: f.title.trim(), district: f.district.trim(), phone: f.phone.trim() || null, category: f.category, category_label: cat?.name ?? row.category_label });
        }}>Kaydet</Btn>
        <Btn small onClick={onClose}>Vazgeç</Btn>
      </div>
    </div>
  );
}
