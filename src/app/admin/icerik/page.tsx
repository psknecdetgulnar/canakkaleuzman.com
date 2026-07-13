"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";

// İçerik yönetimi: blog yazıları moderasyonu (yayından kaldırma, soft delete).
// Uzmanlar yazıyı kendi panelinden yazar; admin burada denetler.
type Row = {
  slug: string; title: string; author_name: string; author_id: string | null;
  category: string; date: string; published: boolean; deleted_at: string | null;
};

export default function IcerikPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [busy, setBusy] = useState(false);
  const { confirm, modal } = useConfirm();

  const load = useCallback(async () => {
    if (!sb) return;
    let query = sb.from("blog_posts").select("slug,title,author_name,author_id,category,date,published,deleted_at").order("date", { ascending: false }).limit(300);
    if (q.trim()) query = query.or(`title.ilike.%${q.trim()}%,author_name.ilike.%${q.trim()}%`);
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
    const { error } = await sb.from("blog_posts").update(patch).eq("slug", row.slug);
    await logAdminAction({ action, targetType: "blog_post", targetId: row.slug, newData: patch, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

  return (
    <div>
      <PageTitle title="İçerik / Blog" desc="Uzmanların yazdığı blog yazılarını denetle: yayından kaldır veya sil (geri alınabilir)." />
      <AdminCard className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Başlık veya yazar ara…" className="h-10 min-w-[200px] flex-1 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
          <label className="flex items-center gap-1.5 text-xs font-semibold"><input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="h-4 w-4 accent-[#b3261e]" /> Silinenleri göster</label>
        </div>
      </AdminCard>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text="Blog yazısı bulunamadı." />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((p) => (
            <AdminCard key={p.slug}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/blog/${p.slug}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{p.title}</Link>
                    <Badge text={p.published ? "Yayında" : "Taslak"} tone={p.published ? "green" : "muted"} />
                    {p.deleted_at && <Badge text="Silinmiş" tone="red" />}
                  </div>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{p.author_name} · {p.category} · {p.date}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.deleted_at ? (
                    <Btn small tone="navy" disabled={busy} onClick={() => update(p, { deleted_at: null }, "blog.restore")}>Geri al</Btn>
                  ) : (
                    <>
                      <Btn small disabled={busy} onClick={() => update(p, { published: !p.published }, p.published ? "blog.unpublish" : "blog.publish")}>
                        {p.published ? "Yayından kaldır" : "Yayınla"}
                      </Btn>
                      <Btn small tone="red" disabled={busy} onClick={async () => {
                        const r = await confirm({ title: "Yazıyı sil (soft delete)", desc: `"${p.title}" görünmez olur; geri alınabilir.`, danger: true });
                        if (r.ok) update(p, { deleted_at: new Date().toISOString() }, "blog.softdelete");
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
