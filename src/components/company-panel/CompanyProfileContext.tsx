"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/companies";
import { getCompanies, getMyCompany } from "@/lib/companies";
import { authDb, roleOf, signOut, type UserRole } from "@/lib/adminAuth";
import { PanelLogin } from "@/components/auth/PanelLogin";

// GERÇEK OTURUM MODU (şirket paneli):
// - sirket → yalnızca kendi şirketi (owner_id eşleşmesi); yoksa kurulum formu.
// - admin  → tüm şirketler arasında geçiş yapabilir.
// - oturum yok / uzman → giriş formu veya yanlış-panel uyarısı.
const STORAGE_KEY = "cbuz_company_active_id";

type CompanyProfileState = {
  companies: Company[];
  loading: boolean;
  activeId: string | null;
  setActiveId: (id: string) => void;
  refresh: () => Promise<void>;
  role: UserRole | null;
};

const CompanyProfileCtx = createContext<CompanyProfileState | null>(null);

export function CompanyProfileProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  async function load() {
    if (!authDb) {
      setSessionChecked(true);
      setLoading(false);
      return;
    }
    const { data } = await authDb.auth.getSession();
    const r = roleOf(data.session);
    setRole(r);
    setSessionChecked(true);
    if (r === "sirket") {
      const mine = await getMyCompany();
      setCompanies(mine ? [mine] : []);
      setActiveIdState(mine?.id ?? null);
      setLoading(false);
    } else if (r === "admin") {
      const list = await getCompanies();
      setCompanies(list);
      const remembered = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      const valid = remembered && list.some((c) => c.id === remembered);
      setActiveIdState(valid ? remembered : (list[0]?.id ?? null));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setActiveId(id: string) {
    setActiveIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }

  if (!sessionChecked) {
    return <div className="mx-auto max-w-[980px] px-4 py-10"><div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" /></div>;
  }
  if (!role) {
    return <PanelLogin panelName="Şirket Paneli" />;
  }
  if (role === "uzman") {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-10">
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-8 text-center">
          <h1 className="font-display text-[1.4rem] font-semibold text-[#0d2c4b]">Bu panel şirketler içindir</h1>
          <p className="mt-2 text-sm text-[#102844]">Hesabın bir uzman hesabı. Uzman paneline geç:</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/panel" className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
              Uzman Paneli →
            </Link>
            <button type="button" onClick={() => signOut().then(() => window.location.reload())} className="text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
              Çıkış yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompanyProfileCtx.Provider value={{ companies, loading, activeId, setActiveId, refresh: load, role }}>
      {children}
    </CompanyProfileCtx.Provider>
  );
}

export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileCtx);
  if (!ctx) throw new Error("useCompanyProfile, CompanyProfileProvider içinde kullanılmalı");
  return ctx;
}
