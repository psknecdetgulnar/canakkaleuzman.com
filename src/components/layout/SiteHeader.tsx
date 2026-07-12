"use client";

import { useState } from "react";
import Link from "next/link";

// Tüm sayfalarda AYNI üst menü — önceden anasayfa (Header) ve diğer
// sayfalar (ProfileHeaderBar) farklı bileşenler kullanıyordu, bu da
// sayfadan sayfaya menünün değişmesine yol açıyordu. Artık tek kaynak.
type SiteHeaderProps = {
  onJoinClick?: () => void;
  onLoginClick?: () => void;
};

const mainNavItems = [
  { href: "/uzmanlar", label: "Uzmanlar" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/blog", label: "Blog" },
  { href: "/#hakkimizda", label: "Hakkımızda" },
];

const moreNavItems = [
  { href: "/sirketler", label: "Şirketler" },
  { href: "/is-ilanlari", label: "İş İlanları" },
  { href: "/nobetci-eczane", label: "Nöbetçi Eczane" },
];

export function SiteHeader({ onJoinClick, onLoginClick }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]/95 backdrop-blur">
      <div className="relative mx-auto flex h-[72px] max-w-[1080px] items-center justify-between gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-[#0d2c4b]" onClick={closeMenu}>
          <img src="/images/lighthouse.png" alt="" className="h-9 w-auto" />
          <span className="font-display text-[1.05rem] font-semibold uppercase leading-[0.95] tracking-[0.02em]">
            Çanakkale
            <br />
            Uzman
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#102844] lg:flex">
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-[#c99a53]">
              {item.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#c99a53]"
              aria-expanded={moreOpen}
            >
              Kurumsal
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-px">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute left-1/2 top-full w-48 -translate-x-1/2 pt-3">
                <div className="flex flex-col rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] py-2 shadow-[0_16px_40px_rgba(13,44,75,0.12)]">
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="px-4 py-2.5 text-[#102844] transition-colors hover:bg-[#f3eee6] hover:text-[#c99a53]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/#iletisim" className="whitespace-nowrap transition-colors hover:text-[#c99a53]">
            İletişim
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          {onJoinClick ? (
            <button
              type="button"
              className="rounded-[6px] bg-[#0d2c4b] px-5 py-2.5 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
              onClick={onJoinClick}
            >
              Kayıt Ol
            </button>
          ) : (
            <Link
              href="/panel"
              className="rounded-[6px] bg-[#0d2c4b] px-5 py-2.5 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
            >
              Kayıt Ol
            </Link>
          )}
          {onLoginClick ? (
            <button
              type="button"
              className="rounded-[6px] border border-[#0d2c4b] px-5 py-2.5 text-sm font-semibold text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]"
              onClick={onLoginClick}
            >
              Giriş Yap
            </button>
          ) : (
            <Link
              href="/panel"
              className="rounded-[6px] border border-[#0d2c4b] px-5 py-2.5 text-sm font-semibold text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]"
            >
              Giriş Yap
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border border-[rgba(16,40,68,0.16)] bg-[#fffdf9] text-[#0d2c4b] lg:hidden"
          aria-label="Menüyü aç"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[rgba(16,40,68,0.08)] bg-[#fffdf9] px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-[1080px] flex-col gap-4 text-sm font-semibold text-[#102844]">
            {[...mainNavItems, ...moreNavItems, { href: "/#iletisim", label: "İletişim" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto mt-5 grid max-w-[1080px] gap-3 sm:grid-cols-2">
            {onJoinClick ? (
              <button
                type="button"
                className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9]"
                onClick={() => {
                  closeMenu();
                  onJoinClick();
                }}
              >
                Kayıt Ol
              </button>
            ) : (
              <Link href="/panel" onClick={closeMenu} className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-center text-sm font-semibold text-[#fffdf9]">
                Kayıt Ol
              </Link>
            )}
            {onLoginClick ? (
              <button
                type="button"
                className="rounded-[6px] border border-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#0d2c4b]"
                onClick={() => {
                  closeMenu();
                  onLoginClick();
                }}
              >
                Giriş Yap
              </button>
            ) : (
              <Link href="/panel" onClick={closeMenu} className="rounded-[6px] border border-[#0d2c4b] px-5 py-3 text-center text-sm font-semibold text-[#0d2c4b]">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
