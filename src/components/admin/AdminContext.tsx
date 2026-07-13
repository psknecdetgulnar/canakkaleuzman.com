"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { authDb, adminSignOut } from "@/lib/adminAuth";
import { getMyStaffRole, ROLE_LABELS, ROLE_MODULES, type StaffRole } from "@/lib/adminPanel";

// Admin paneli oturum + rol kapısı ve kabuğu (sidebar/topbar).
// Yetkiler DB'de (RLS) uygulanır; buradaki rol yalnızca menü görünürlüğü içindir.

type AdminState = { session: Session; role: StaffRole; email: string };
const AdminCtx = createContext<AdminState | null>(null);

const NAV: { key: string; href: string; label: string; icon: string }[] = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: "▦" },
  { key: "uzmanlar", href: "/admin/uzmanlar", label: "Uzmanlar", icon: "👤" },
  { key: "sirketler", href: "/admin/sirketler", label: "Şirketler", icon: "🏢" },
  { key: "icerik", href: "/admin/icerik", label: "İçerik / Blog", icon: "📝" },
  { key: "ilanlar", href: "/admin/ilanlar", label: "İş İlanları", icon: "💼" },
  { key: "destek", href: "/admin/destek", label: "Destek", icon: "💬" },
  { key: "kullanicilar", href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "🪪" },
  { key: "analitik", href: "/admin/analitik", label: "Analitik", icon: "📈" },
  { key: "eczane", href: "/nobetci-eczane/yonet", label: "Nöbetçi Eczane", icon: "💊" },
  { key: "loglar", href: "/admin/loglar", label: "İşlem Kayıtları", icon: "🧾" },
  { key: "ayarlar", href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙" },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!authDb) {
      setReady(true);
      return;
    }
    let active = true;
    authDb.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) setRole(await getMyStaffRole());
      setReady(true);
    });
    const { data: sub } = authDb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f3ed]"><div className="h-32 w-72 animate-pulse rounded-[14px] bg-[#e8e2d6]" /></div>;
  }
  if (!session || !role) {
    return <AdminLoginScreen hasSession={Boolean(session)} />;
  }

  const modules = ROLE_MODULES[role];
  const nav = NAV.filter((n) => modules.includes(n.key));

  return (
    <AdminCtx.Provider value={{ session, role, email: session.user.email ?? "" }}>
      <div className="flex min-h-screen bg-[#f6f3ed]">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col bg-[#0d2c4b] text-[#fffdf9] lg:flex">
          <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
            <img src="/images/lighthouse.png" alt="" className="h-8 w-auto brightness-0 invert" />
            <span className="font-display text-sm font-semibold uppercase leading-tight tracking-wide">Çanakkale Uzman<br /><span className="text-[#c99a53]">Yönetim</span></span>
          </Link>
          <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4">
            {nav.map((n) => {
              const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.key}
                  href={n.href}
                  className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "bg-[#fffdf9]/12 text-[#fffdf9]" : "text-[#fffdf9]/65 hover:bg-[#fffdf9]/8 hover:text-[#fffdf9]"
                  }`}
                >
                  <span aria-hidden="true" className="w-5 text-center">{n.icon}</span>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[#fffdf9]/10 px-5 py-4 text-xs">
            <div className="font-semibold">{session.user.email}</div>
            <div className="mt-0.5 text-[#c99a53]">{ROLE_LABELS[role]}</div>
          </div>
        </aside>

        {/* Ana alan */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]/95 px-4 backdrop-blur">
            <div className="flex items-center gap-3 overflow-x-auto lg:hidden">
              {nav.slice(0, 6).map((n) => (
                <Link key={n.key} href={n.href} className="whitespace-nowrap text-xs font-semibold text-[#102844] hover:text-[#c99a53]">{n.label}</Link>
              ))}
            </div>
            <div className="hidden text-sm text-[rgba(16,40,68,0.55)] lg:block">Yönetim Paneli</div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-semibold text-[#0d2c4b] hover:text-[#c99a53]">Siteye dön</Link>
              <button type="button" onClick={() => adminSignOut().then(() => window.location.reload())} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)]">
                Çıkış
              </button>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}

function AdminLoginScreen({ hasSession }: { hasSession: boolean }) {
  // Oturum var ama personel değil → açıkça reddet; yoksa mevcut giriş formu.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!authDb) return;
    setBusy(true);
    setError(null);
    const { error: err } = await authDb.auth.signInWithPassword({ email, password });
    if (err) {
      setBusy(false);
      setError("E-posta veya şifre hatalı.");
      return;
    }
    const role = await getMyStaffRole();
    if (!role) {
      await authDb.auth.signOut();
      setBusy(false);
      setError("Bu hesabın yönetim paneli yetkisi yok.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d2c4b] px-4">
      <div className="w-full max-w-sm rounded-[16px] bg-[#fffdf9] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2.5">
          <img src="/images/lighthouse.png" alt="" className="h-9 w-auto" />
          <div className="font-display text-base font-semibold uppercase leading-tight text-[#0d2c4b]">Çanakkale Uzman<br /><span className="text-[#c99a53]">Yönetim Paneli</span></div>
        </div>
        {hasSession && (
          <p className="mt-4 rounded-[8px] bg-[#fdf3e9] px-3 py-2 text-xs text-[#7a4f1a]">
            Mevcut oturumun yönetim yetkisi yok. Yetkili bir hesapla giriş yap.
          </p>
        )}
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
          <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]" />
          {error && <p className="text-sm text-[#b3261e]">{error}</p>}
          <button type="submit" disabled={busy} className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">
            {busy ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdmin, AdminProvider içinde kullanılmalı");
  return ctx;
}
