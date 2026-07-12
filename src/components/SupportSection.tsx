"use client";

import { useEffect, useState } from "react";
import {
  createSupportMessage,
  getSupportMessagesBySender,
  type SupportMessage,
  type SupportSenderType,
} from "@/lib/support";

// Uzman ve şirket panellerindeki ortak "Destek" gövdesi: mesaj gönderme
// formu + geçmiş mesajlar + admin cevapları. Admin cevabı /admin panelinden
// yazılır ve burada aynı kaydın altında görünür.
export function SupportSection({
  senderType,
  senderId,
  senderName,
}: {
  senderType: SupportSenderType;
  senderId: string;
  senderName: string;
}) {
  const [items, setItems] = useState<SupportMessage[] | null>(null);
  const [form, setForm] = useState({ subject: "", message: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await getSupportMessagesBySender(senderType, senderId));
  }

  useEffect(() => {
    setItems(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderType, senderId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      setError("Konu ve mesaj zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createSupportMessage({
      senderType,
      senderId,
      senderName,
      senderEmail: form.email || undefined,
      subject: form.subject,
      message: form.message,
    });
    setBusy(false);
    if (res.ok) {
      setForm({ subject: "", message: "", email: "" });
      load();
    } else {
      setError(res.error ?? "Gönderilemedi.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submit} className="max-w-lg rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">Yeni destek talebi</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[rgba(16,40,68,0.6)]">Konu</span>
            <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} maxLength={200} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[rgba(16,40,68,0.6)]">Mesajın</span>
            <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4} maxLength={2000} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[rgba(16,40,68,0.6)]">E-posta (isteğe bağlı — cevap bildirimi için)</span>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
          </label>
          {error && <p className="text-sm text-[#b3261e]">{error}</p>}
          <button type="submit" disabled={busy} className="self-start rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
            {busy ? "Gönderiliyor…" : "Gönder"}
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">Geçmiş talepler</h2>
        <div className="mt-3 flex flex-col gap-3">
          {items === null ? (
            <div className="h-24 animate-pulse rounded-[14px] bg-[#f3eee6]" />
          ) : items.length === 0 ? (
            <p className="text-sm text-[rgba(16,40,68,0.6)]">Henüz destek talebin yok.</p>
          ) : (
            items.map((m) => (
              <div key={m.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#0d2c4b]">{m.subject}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.status === "answered" ? "bg-[#0d2c4b] text-[#fffdf9]" : m.status === "open" ? "bg-[#c99a53] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"}`}>
                    {m.status === "answered" ? "Cevaplandı" : m.status === "open" ? "İnceleniyor" : "Kapalı"}
                  </span>
                  <span className="text-xs text-[rgba(16,40,68,0.5)]">
                    {new Date(m.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-[#102844]">{m.message}</p>
                {m.adminReply && (
                  <div className="mt-3 rounded-[8px] border-l-4 border-[#c99a53] bg-[#fdf3e9] p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#c99a53]">Destek ekibi</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-[#102844]">{m.adminReply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
