"use client";

import { useCallback, useEffect, useState } from "react";
import { sb } from "@/lib/supabaseClient";
import { AdminCard, Badge, Btn, Empty, PageTitle, useConfirm } from "@/components/admin/ui";

// Auth kullanıcıları (uzman/şirket hesapları): listeleme, şifre sıfırlama
// e-postası, askıya alma. İşlemler korumalı API route üzerinden yapılır.

type U = { id: string; email: string | null; role: string | null; createdAt: string; lastSignIn: string | null; emailConfirmed: boolean; banned: boolean };

export default function KullanicilarPage() {
  const [users, setUsers] = useState<U[] | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { confirm, modal } = useConfirm();

  const call = useCallback(async (payload: Record<string, unknown>) => {
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return null;
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return res.json();
  }, []);

  const load = useCallback(async () => {
    const json = await call({ op: "list" });
    setUsers(json?.users ?? []);
    if (json?.error) setMsg(json.error);
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = (users ?? []).filter((u) => !q.trim() || (u.email ?? "").toLowerCase().includes(q.trim().toLowerCase()));

  async function act(op: string, u: U, confirmOpts?: { title: string; desc: string }) {
    if (confirmOpts) {
      const r = await confirm({ ...confirmOpts, danger: true });
      if (!r.ok) return;
    }
    setBusy(true);
    setMsg(null);
    const json = await call({ op, userId: u.id });
    if (json?.error) setMsg(json.error);
    else setMsg(op === "reset" ? `${u.email} adresine şifre sıfırlama e-postası gönderildi.` : "İşlem tamam.");
    await load();
    setBusy(false);
  }

  return (
    <div>
      <PageTitle title="Kullanıcılar" desc="Tüm hesaplar (uzman, şirket, yönetim). Şifre sıfırlama bağlantısı gönder veya hesabı askıya al. UUID'yi kopyalayıp Ayarlar'dan personel rolü verebilirsin." />
      <AdminCard className="mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="E-posta ara…" className="h-10 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
      </AdminCard>
      {msg && <p className="mb-3 rounded-[8px] bg-[#fdf3e9] px-3 py-2 text-xs text-[#7a4f1a]">{msg}</p>}

      {users === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : filtered.length === 0 ? (
        <Empty text="Kullanıcı bulunamadı." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((u) => (
            <AdminCard key={u.id} className="!p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-[#0d2c4b]">{u.email ?? "—"}</span>
                    {u.role && <Badge text={u.role} tone={u.role === "admin" ? "gold" : "navy"} />}
                    {!u.emailConfirmed && <Badge text="E-posta doğrulanmadı" tone="muted" />}
                    {u.banned && <Badge text="Askıda" tone="red" />}
                  </div>
                  <p className="mt-0.5 text-xs text-[rgba(16,40,68,0.55)]">
                    Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")} · Son giriş: {u.lastSignIn ? new Date(u.lastSignIn).toLocaleString("tr-TR") : "—"} ·{" "}
                    <button type="button" className="underline hover:text-[#c99a53]" onClick={() => { navigator.clipboard.writeText(u.id); setMsg("UUID kopyalandı."); }}>UUID kopyala</button>
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Btn small disabled={busy} onClick={() => act("reset", u)}>Şifre sıfırlama gönder</Btn>
                  {u.banned ? (
                    <Btn small tone="navy" disabled={busy} onClick={() => act("unban", u)}>Askıyı kaldır</Btn>
                  ) : (
                    <Btn small tone="red" disabled={busy} onClick={() => act("ban", u, { title: "Hesabı askıya al", desc: `${u.email} giriş yapamaz hale gelir. Geri alınabilir.` })}>Askıya al</Btn>
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
