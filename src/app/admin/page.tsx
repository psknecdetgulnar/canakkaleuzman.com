"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { authDb, adminSignIn, adminSignOut, sessionIsAdmin } from "@/lib/adminAuth";
import { rowToSupportMessage, type SupportMessage } from "@/lib/support";

// Yönetici paneli. Giriş: Supabase Auth (user_metadata.role='admin').
// Tüm yazma işlemleri authDb (oturumlu istemci) üzerinden gider; RLS'teki
// is_admin() politikaları yalnızca bu oturumla çalışır.

type Tab = "basvurular" | "uzmanlar" | "sirketler" | "destek";

type ExpertRow = {
  id: string;
  name: string;
  title: string;
  category_label: string;
  district: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  premium: boolean;
  premium_from: string | null;
  premium_until: string | null;
  created_at: string;
};

// Efektif premium (tarih aralığına göre) — süre dolduysa rozet gösterilmez.
function isPremiumNow(e: ExpertRow): boolean {
  if (!e.premium) return false;
  const now = Date.now();
  if (e.premium_from && new Date(e.premium_from).getTime() > now) return false;
  if (e.premium_until && new Date(e.premium_until).getTime() < now) return false;
  return true;
}

function premiumPeriodLabel(e: ExpertRow): string {
  if (!e.premium) return "";
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
  if (!e.premium_from && !e.premium_until) return "Sonsuza kadar";
  const from = e.premium_from ? fmt(e.premium_from) : "—";
  const until = e.premium_until ? fmt(e.premium_until) : "∞";
  return `${from} → ${until}`;
}

type CompanyRow = {
  id: string;
  name: string;
  sector: string;
  phone: string | null;
  email: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authDb) {
      setReady(true);
      return;
    }
    authDb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = authDb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <Shell><div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" /></Shell>;
  if (!sessionIsAdmin(session)) return <Shell><LoginForm /></Shell>;
  return <Shell><Dashboard /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fffdf9]">
      <header className="border-b border-[rgba(16,40,68,0.08)] bg-[#0d2c4b]">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-4">
          <Link href="/admin" className="font-display text-lg font-semibold text-[#fffdf9]">
            Çanakkale Uzman — Yönetim
          </Link>
          <Link href="/" className="text-sm font-semibold text-[#e8d8c2] transition-colors hover:text-[#fffdf9]">
            Siteye dön
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-4 py-8">{children}</main>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await adminSignIn(email, password);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Giriş başarısız.");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-[1.6rem] font-semibold text-[#0d2c4b]">Yönetici girişi</h1>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Şifre</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        {error && <p className="text-sm text-[#b3261e]">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50">
          {busy ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>("basvurular");
  const [experts, setExperts] = useState<ExpertRow[] | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const [messages, setMessages] = useState<SupportMessage[] | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!authDb) return;
    const [e, c, m] = await Promise.all([
      authDb.from("experts").select("id,name,title,category_label,district,phone,status,premium,premium_from,premium_until,created_at").order("created_at", { ascending: false }),
      authDb.from("companies").select("id,name,sector,phone,email,status,created_at").order("created_at", { ascending: false }),
      authDb.from("support_messages").select("*").order("created_at", { ascending: false }),
    ]);
    setExperts((e.data as ExpertRow[]) ?? []);
    setCompanies((c.data as CompanyRow[]) ?? []);
    setMessages((m.data ?? []).map(rowToSupportMessage));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setExpertStatus(id: string, status: ExpertRow["status"]) {
    if (!authDb) return;
    setBusy(true);
    await authDb.from("experts").update({ status }).eq("id", id);
    await refresh();
    setBusy(false);
  }

  // Premium'u tarih aralığıyla ver: forever=true → süresiz; değilse
  // from/until (yerel gün başlangıcı / günü kapsasın diye gün sonu).
  async function grantPremium(id: string, opts: { forever: boolean; from?: string; until?: string }) {
    if (!authDb) return;
    setBusy(true);
    await authDb
      .from("experts")
      .update({
        premium: true,
        premium_from: opts.forever || !opts.from ? null : new Date(`${opts.from}T00:00:00`).toISOString(),
        premium_until: opts.forever || !opts.until ? null : new Date(`${opts.until}T23:59:59`).toISOString(),
      })
      .eq("id", id);
    await refresh();
    setBusy(false);
  }

  async function revokePremium(id: string) {
    if (!authDb) return;
    setBusy(true);
    await authDb.from("experts").update({ premium: false, premium_from: null, premium_until: null }).eq("id", id);
    await refresh();
    setBusy(false);
  }

  async function setCompanyStatus(id: string, status: CompanyRow["status"]) {
    if (!authDb) return;
    setBusy(true);
    await authDb.from("companies").update({ status }).eq("id", id);
    await refresh();
    setBusy(false);
  }

  async function replyMessage(id: string, reply: string) {
    if (!authDb || !reply.trim()) return;
    setBusy(true);
    await authDb.from("support_messages").update({ admin_reply: reply.trim().slice(0, 2000), status: "answered", replied_at: new Date().toISOString() }).eq("id", id);
    await refresh();
    setBusy(false);
  }

  const pendingExperts = experts?.filter((e) => e.status === "pending") ?? [];
  const openMessages = messages?.filter((m) => m.status === "open") ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[1.8rem] font-semibold text-[#0d2c4b]">Yönetim Paneli</h1>
        <div className="flex items-center gap-3">
          <Link href="/nobetci-eczane/yonet" className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-4 py-2 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53]">
            Nöbetçi eczane yönetimi
          </Link>
          <button type="button" onClick={() => adminSignOut()} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-4 py-2 text-sm font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)]">
            Çıkış yap
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[10px] bg-[#f3eee6] p-1.5">
        {([
          ["basvurular", `Başvurular${pendingExperts.length ? ` (${pendingExperts.length})` : ""}`],
          ["uzmanlar", "Uzmanlar"],
          ["sirketler", "Şirketler"],
          ["destek", `Destek${openMessages.length ? ` (${openMessages.length})` : ""}`],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors ${
              tab === key ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844] hover:text-[#0d2c4b]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {experts === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" />
      ) : tab === "basvurular" ? (
        <div className="flex flex-col gap-3">
          {pendingExperts.length === 0 ? (
            <Empty text="Bekleyen uzman başvurusu yok." />
          ) : (
            pendingExperts.map((e) => (
              <Card key={e.id}>
                <div>
                  <p className="font-semibold text-[#0d2c4b]">{e.name} <span className="font-normal text-[rgba(16,40,68,0.6)]">· {e.title}</span></p>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{e.category_label} · {e.district} {e.phone ? `· ${e.phone}` : ""} · {formatDate(e.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => setExpertStatus(e.id, "approved")} className="rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">Onayla</button>
                  <button type="button" disabled={busy} onClick={() => setExpertStatus(e.id, "rejected")} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-4 py-2 text-sm font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">Reddet</button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : tab === "uzmanlar" ? (
        <div className="flex flex-col gap-3">
          {experts.filter((e) => e.status !== "pending").length === 0 ? (
            <Empty text="Kayıtlı uzman yok." />
          ) : (
            experts.filter((e) => e.status !== "pending").map((e) => (
              <div key={e.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/uzman/${e.id}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{e.name}</Link>
                      <Badge text={e.status === "approved" ? "Yayında" : "Reddedildi"} dark={e.status === "approved"} />
                      {isPremiumNow(e) && <Badge text="Premium" gold />}
                      {e.premium && !isPremiumNow(e) && <Badge text="Premium süresi doldu" />}
                    </div>
                    <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                      {e.title} · {e.category_label} · {e.district}
                      {e.premium && <span className="ml-2 text-[#c99a53]">🔒 {premiumPeriodLabel(e)}</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {e.status === "approved" ? (
                      <button type="button" disabled={busy} onClick={() => setExpertStatus(e.id, "rejected")} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">Yayından kaldır</button>
                    ) : (
                      <button type="button" disabled={busy} onClick={() => setExpertStatus(e.id, "approved")} className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53] disabled:opacity-50">Tekrar yayınla</button>
                    )}
                  </div>
                </div>
                <PremiumEditor expert={e} busy={busy} onGrant={grantPremium} onRevoke={revokePremium} />
              </div>
            ))
          )}
        </div>
      ) : tab === "sirketler" ? (
        <div className="flex flex-col gap-3">
          {companies === null || companies.length === 0 ? (
            <Empty text="Kayıtlı şirket yok." />
          ) : (
            companies.map((c) => (
              <Card key={c.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/sirket/${c.id}`} target="_blank" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">{c.name}</Link>
                    <Badge text={c.status === "approved" ? "Yayında" : c.status === "pending" ? "Bekliyor" : "Reddedildi"} dark={c.status === "approved"} />
                  </div>
                  <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{c.sector} {c.phone ? `· ${c.phone}` : ""} {c.email ? `· ${c.email}` : ""} · {formatDate(c.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  {c.status === "approved" ? (
                    <button type="button" disabled={busy} onClick={() => setCompanyStatus(c.id, "rejected")} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">Yayından kaldır</button>
                  ) : (
                    <button type="button" disabled={busy} onClick={() => setCompanyStatus(c.id, "approved")} className="rounded-[6px] bg-[#0d2c4b] px-3 py-1.5 text-xs font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">Onayla / Yayınla</button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages === null || messages.length === 0 ? (
            <Empty text="Destek mesajı yok." />
          ) : (
            messages.map((m) => <SupportCard key={m.id} m={m} busy={busy} onReply={replyMessage} />)
          )}
        </div>
      )}
    </div>
  );
}

// Premium tarih editörü: başlangıç/bitiş tarihi veya "Sonsuza kadar".
// Bitiş geçince profil otomatik normale döner (efektif hesap okuma anında).
// Bu tarihler yalnızca admin panelinde görünür — public yüzeye çıkmaz.
function PremiumEditor({
  expert,
  busy,
  onGrant,
  onRevoke,
}: {
  expert: ExpertRow;
  busy: boolean;
  onGrant: (id: string, opts: { forever: boolean; from?: string; until?: string }) => void;
  onRevoke: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
  const today = new Date().toISOString().slice(0, 10);
  const [forever, setForever] = useState(expert.premium && !expert.premium_from && !expert.premium_until);
  const [from, setFrom] = useState(toDateInput(expert.premium_from) || today);
  const [until, setUntil] = useState(toDateInput(expert.premium_until));

  if (!open) {
    return (
      <div className="mt-3 flex flex-wrap gap-2 border-t border-[rgba(16,40,68,0.08)] pt-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => setOpen(true)}
          className="rounded-[6px] border border-[#c99a53] px-3 py-1.5 text-xs font-semibold text-[#c99a53] hover:bg-[#fdf3e9] disabled:opacity-50"
        >
          {expert.premium ? "Premium süresini düzenle" : "Premium yap"}
        </button>
        {expert.premium && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onRevoke(expert.id)}
            className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50"
          >
            Premium'u kaldır
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-[10px] border border-[#c99a53] bg-[#fdf3e9] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#c99a53]">Premium süresi</p>
      <label className="mt-3 flex items-center gap-2 text-sm text-[#102844]">
        <input type="checkbox" checked={forever} onChange={(e) => setForever(e.target.checked)} className="h-4 w-4 accent-[#c99a53]" />
        Sonsuza kadar
      </label>
      {!forever && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[rgba(16,40,68,0.6)]">Başlangıç</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[rgba(16,40,68,0.6)]">Bitiş (o gün dahil)</span>
            <input type="date" value={until} onChange={(e) => setUntil(e.target.value)} min={from} className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
          </label>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || (!forever && !until)}
          onClick={() => {
            onGrant(expert.id, { forever, from, until });
            setOpen(false);
          }}
          className="rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50"
        >
          Kaydet
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-[6px] px-4 py-2 text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
          Vazgeç
        </button>
        {!forever && !until && (
          <span className="self-center text-xs text-[#b3261e]">Bitiş tarihi seç veya &ldquo;Sonsuza kadar&rdquo;yı işaretle.</span>
        )}
      </div>
    </div>
  );
}

function SupportCard({ m, busy, onReply }: { m: SupportMessage; busy: boolean; onReply: (id: string, reply: string) => void }) {
  const [draft, setDraft] = useState(m.adminReply ?? "");
  return (
    <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#0d2c4b]">{m.subject}</span>
            <Badge text={m.status === "open" ? "Yeni" : m.status === "answered" ? "Cevaplandı" : "Kapalı"} gold={m.status === "open"} dark={m.status === "answered"} />
          </div>
          <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
            {m.senderName} ({m.senderType}{m.senderId ? `: ${m.senderId}` : ""}){m.senderEmail ? ` · ${m.senderEmail}` : ""} · {formatDate(m.createdAt)}
          </p>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm text-[#102844]">{m.message}</p>
      <div className="mt-4 border-t border-[rgba(16,40,68,0.08)] pt-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Cevabın (kullanıcının panelindeki Destek sayfasında görünür)</span>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} maxLength={2000} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-2 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
        </label>
        <button type="button" disabled={busy || !draft.trim()} onClick={() => onReply(m.id, draft)} className="mt-2 rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">
          {m.adminReply ? "Cevabı güncelle" : "Cevapla"}
        </button>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
      {children}
    </div>
  );
}

function Badge({ text, dark, gold }: { text: string; dark?: boolean; gold?: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${gold ? "bg-[#c99a53] text-[#fffdf9]" : dark ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"}`}>
      {text}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
      {text}
    </div>
  );
}
