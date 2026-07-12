"use client";

import { SiteHeader } from "@/components/layout/SiteHeader";

type HeaderProps = {
  onJoinClick: () => void;
  onLoginClick: () => void;
};

// Anasayfaya özgü ince katman: aynı SiteHeader'ı modal tetikleyicileriyle render eder.
export function Header({ onJoinClick, onLoginClick }: HeaderProps) {
  return <SiteHeader onJoinClick={onJoinClick} onLoginClick={onLoginClick} />;
}
