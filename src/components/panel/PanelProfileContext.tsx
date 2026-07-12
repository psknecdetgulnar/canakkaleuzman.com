"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Expert } from "@/data/experts";
import { getExperts } from "@/lib/db";

// Auth henüz yok: panel, düzenlenecek uzmanı elle seçtirerek çalışır (demo).
// Bu seçim panelin TÜM sayfalarında (profil düzenle, gelen kutusu) aynı kalsın
// diye tek bir context'te tutulur ve tarayıcıda hatırlanır — Görev 3/5.
// Gerçek giriş eklendiğinde bu context kaldırılıp oturumdaki uzmanla değiştirilecek.
const STORAGE_KEY = "cbuz_panel_active_slug";

type PanelProfileState = {
  experts: Expert[];
  loading: boolean;
  activeSlug: string | null;
  setActiveSlug: (slug: string) => void;
};

const PanelProfileCtx = createContext<PanelProfileState | null>(null);

export function PanelProfileProvider({ children }: { children: React.ReactNode }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlugState] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getExperts().then((list) => {
      if (!active) return;
      setExperts(list);
      const remembered = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      const valid = remembered && list.some((e) => e.id === remembered);
      setActiveSlugState(valid ? remembered : (list[0]?.id ?? null));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  function setActiveSlug(slug: string) {
    setActiveSlugState(slug);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, slug);
  }

  return (
    <PanelProfileCtx.Provider value={{ experts, loading, activeSlug, setActiveSlug }}>
      {children}
    </PanelProfileCtx.Provider>
  );
}

export function usePanelProfile() {
  const ctx = useContext(PanelProfileCtx);
  if (!ctx) throw new Error("usePanelProfile, PanelProfileProvider içinde kullanılmalı");
  return ctx;
}
