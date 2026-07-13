"use client";

import { useCallback, useEffect, useState } from "react";
import { sb } from "@/lib/supabaseClient";
import { logAdminAction } from "@/lib/adminPanel";
import { rowToSupportMessage, type SupportMessage } from "@/lib/support";
import { AdminCard, Badge, Btn, Empty, PageTitle } from "@/components/admin/ui";

// Destek kutusu: kullanıcı/uzman/şirket mesajlarına cevap; durum yönetimi.
export default function DestekPage() {
  const [rows, setRows] = useState<SupportMessage[] | null>(null);
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!sb) return;
    let q = sb.from("support_messages").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "open") q = q.eq("status", "open");
    const { data } = await q;
    setRows((data ?? []).map(rowToSupportMessage));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function reply(id: string, text: string) {
    if (!sb || !text.trim()) return;
    setBusy(true);
    const { error } = await sb.from("support_messages").update({ admin_reply: text.trim().slice(0, 2000), status: "answered", replied_at: new Date().toISOString() }).eq("id", id);
    await logAdminAction({ action: "support.reply", targetType: "support_message", targetId: id, result: error ? "failure" : "success" });
    await load();
    setBusy(false);
  }

  async function close(id: string) {
    if (!sb) return;
    setBusy(true);
    await sb.from("support_messages").update({ status: "closed" }).eq("id", id);
    await logAdminAction({ action: "support.close", targetType: "support_message", targetId: id });
    await load();
    setBusy(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle title="Destek" desc="Cevabın, kullanıcının panelindeki Destek sayfasında görünür." />
        <div className="flex gap-1 rounded-[8px] bg-[#e8e2d6] p-1">
          {(["open", "all"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold ${filter === f ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844]"}`}>
              {f === "open" ? "Bekleyenler" : "Tümü"}
            </button>
          ))}
        </div>
      </div>

      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text={filter === "open" ? "Bekleyen destek mesajı yok. 🎉" : "Destek mesajı yok."} />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((m) => <Ticket key={m.id} m={m} busy={busy} onReply={reply} onClose={close} />)}
        </div>
      )}
    </div>
  );
}

function Ticket({ m, busy, onReply, onClose }: { m: SupportMessage; busy: boolean; onReply: (id: string, t: string) => void; onClose: (id: string) => void }) {
  const [draft, setDraft] = useState(m.adminReply ?? "");
  return (
    <AdminCard>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[#0d2c4b]">{m.subject}</span>
        <Badge text={m.status === "open" ? "Yeni" : m.status === "answered" ? "Cevaplandı" : "Kapalı"} tone={m.status === "open" ? "gold" : m.status === "answered" ? "navy" : "muted"} />
      </div>
      <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
        {m.senderName} ({m.senderType}{m.senderId ? `: ${m.senderId}` : ""}){m.senderEmail ? ` · ${m.senderEmail}` : ""} · {new Date(m.createdAt).toLocaleString("tr-TR")}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm text-[#102844]">{m.message}</p>
      <div className="mt-3 border-t border-[rgba(16,40,68,0.08)] pt-3">
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} maxLength={2000} placeholder="Cevabın…" className="w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-2.5 text-sm outline-none focus:border-[#c99a53]" />
        <div className="mt-2 flex gap-2">
          <Btn small tone="navy" disabled={busy || !draft.trim()} onClick={() => onReply(m.id, draft)}>{m.adminReply ? "Cevabı güncelle" : "Cevapla"}</Btn>
          {m.status !== "closed" && <Btn small disabled={busy} onClick={() => onClose(m.id)}>Kapat</Btn>}
        </div>
      </div>
    </AdminCard>
  );
}
