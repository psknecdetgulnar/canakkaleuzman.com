"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import type { Expert } from "@/data/experts";
import { getExperts, getMyExpert } from "@/lib/db";
import { authDb, roleOf, signOut, type UserRole } from "@/lib/adminAuth";
import { PanelLogin } from "@/components/auth/PanelLogin";

// GERÇEK OTURUM MODU: panel artık Supabase Auth oturumuna kilitlidir.
// - uzman  → yalnızca kendi profili (owner_id eşleşmesi), seçici yok.
// - admin  → tüm onaylı uzmanlar arasında geçiş yapabilir (destek amaçlı).
// - oturum yok / sirket → panel içeriği yerine giriş/uyarı gösterilir.
const STORAGE_KEY = "cbuz_panel_active_slug";

type PanelProfileState = {
  experts: Expert[];
  loading: boolean;
  activeSlug: string | null;
  setActiveSlug: (slug: string) => void;
  role: UserRole | null;
  // Uzmanın kendi kaydının onay durumu (pending/approved/rejected); admin'de null.
  myStatus: string | null;
};

const PanelProfileCtx = createContext<PanelProfileState | null>(null);

export function PanelProfileProvider({ children }: { children: React.ReactNode }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlugState] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!authDb) {
        setSessionChecked(true);
        setLoading(false);
        return;
      }
      const { data } = await authDb.auth.getSession();
      const r = roleOf(data.session);
      if (!active) return;
      setRole(r);
      setSessionChecked(true);
      if (r === "uzman") {
        const mine = await getMyExpert();
        if (!active) return;
        if (mine) {
          setExperts([mine]);
          setActiveSlugState(mine.id);
          setMyStatus(mine.status);
        }
        setLoading(false);
      } else if (r === "admin") {
        const list = await getExperts();
        if (!active) return;
        setExperts(list);
        const remembered = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
        const valid = remembered && list.some((e) => e.id === remembered);
        setActiveSlugState(valid ? remembered : (list[0]?.id ?? null));
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  function setActiveSlug(slug: string) {
    setActiveSlugState(slug);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, slug);
  }

  // Oturum kapısı: kontrol bitmeden skeleton; oturum yoksa giriş formu.
  if (!sessionChecked) {
    return <div className="mx-auto max-w-[980px] px-4 py-10"><div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" /></div>;
  }
  if (!role) {
    return <PanelLogin panelName="Uzman Paneli" />;
  }
  if (role === "sirket") {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-10">
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-8 text-center">
          <h1 className="font-display text-[1.4rem] font-semibold text-[#0d2c4b]">Bu panel uzmanlar içindir</h1>
          <p className="mt-2 text-sm text-[#102844]">Hesabın bir şirket hesabı. Şirket paneline geç:</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/sirket-paneli" className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
              Şirket Paneli →
            </Link>
            <button type="button" onClick={() => signOut().then(() => window.location.reload())} className="text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
              Çıkış yap
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (role === "uzman" && !loading && experts.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-10">
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-8 text-center">
          <h1 className="font-display text-[1.4rem] font-semibold text-[#0d2c4b]">Profil bulunamadı</h1>
          <p className="mt-2 text-sm text-[#102844]">
            Hesabına bağlı bir uzman profili yok. Ana sayfadaki Kayıt Ol formundan başvuru
            yapabilir veya destek için bize ulaşabilirsin.
          </p>
          <button type="button" onClick={() => signOut().then(() => window.location.reload())} className="mt-4 text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
            Çıkış yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <PanelProfileCtx.Provider value={{ experts, loading, activeSlug, setActiveSlug, role, myStatus }}>
      {children}
    </PanelProfileCtx.Provider>
  );
}

export function usePanelProfile() {
  const ctx = useContext(PanelProfileCtx);
  if (!ctx) throw new Error("usePanelProfile, PanelProfileProvider içinde kullanılmalı");
  return ctx;
}
