"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Company } from "@/lib/companies";
import { getCompanies } from "@/lib/companies";

// Uzman panelindeki demo profil-seçici deseninin şirket paneli karşılığı
// (bkz. PanelProfileContext). Auth gelene kadar "hangi şirketi yönetiyorum"
// tarayıcıda hatırlanır.
const STORAGE_KEY = "cbuz_company_active_id";

type CompanyProfileState = {
  companies: Company[];
  loading: boolean;
  activeId: string | null;
  setActiveId: (id: string) => void;
  refresh: () => Promise<void>;
};

const CompanyProfileCtx = createContext<CompanyProfileState | null>(null);

export function CompanyProfileProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveIdState] = useState<string | null>(null);

  async function load() {
    const list = await getCompanies();
    setCompanies(list);
    const remembered = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const valid = remembered && list.some((c) => c.id === remembered);
    setActiveIdState(valid ? remembered : (list[0]?.id ?? null));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setActiveId(id: string) {
    setActiveIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <CompanyProfileCtx.Provider value={{ companies, loading, activeId, setActiveId, refresh: load }}>
      {children}
    </CompanyProfileCtx.Provider>
  );
}

export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileCtx);
  if (!ctx) throw new Error("useCompanyProfile, CompanyProfileProvider içinde kullanılmalı");
  return ctx;
}
