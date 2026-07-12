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

// Tüm menü öğeleri doğrudan link — açılır menü (dropdown) kaldırıldı çünkü
// fareyle-üzerine-gel davranışı mobil/dokunmatikte ve fare boşluğunda
// güvenilmez çalışıyor, linkler "tıklanmıyor" gibi görünüyordu.
const navItems = [
  { href: "/uzmanlar", label: "Uzmanlar" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/sirketler", label: "Şirketler" },
  { href: "/is-ilanlari", label: "İş İlanları" },
  { href: "/nobetci-eczane", label: "Nöbetçi Eczane" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader({ onJoinClick, onLoginClick }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
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

        <nav className="hidden items-center gap-5 text-sm font-semibold text-[#102844] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-[#c99a53]">
              {item.label}
            </Link>
          ))}
          {/* Sayfanın altındaki iletişim bilgilerine (footer) yumuşak kaydırma.
              Footer tüm halka açık sayfalarda id="iletisim" ile mevcut. */}
          <a href="#iletisim" className="whitespace-nowrap transition-colors hover:text-[#c99a53]">
            İletişim
          </a>
        </nav>

        <div className="mr-3 hidden shrink-0 items-center gap-2.5 lg:flex">
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
            {[...navItems, { href: "/#hakkimizda", label: "Hakkımızda" }, { href: "/#iletisim", label: "İletişim" }].map((item) => (
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
