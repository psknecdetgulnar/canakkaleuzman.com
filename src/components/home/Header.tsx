"use client";

import { useState } from "react";

type HeaderProps = {
  onJoinClick: () => void;
  onLoginClick: () => void;
};

const navItems = [
  { href: "#uzmanlar", label: "Uzmanlar" },
  { href: "#kategoriler", label: "Kategoriler" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "#iletisim", label: "İletişim" },
];

export function Header({ onJoinClick, onLoginClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]/95 backdrop-blur">
      <div className="relative mx-auto flex h-[76px] max-w-[940px] items-center justify-between px-5 lg:px-0">
        <a href="#top" className="flex items-center gap-3 text-[#0d2c4b]" onClick={closeMenu}>
          {/* Orijinal mockup'tan çıkarılan fener görseli */}
          <img src="/images/lighthouse.png" alt="" className="h-11 w-auto" />
          <span className="font-display text-[1.35rem] font-semibold uppercase leading-[0.95] tracking-[0.02em]">
            Çanakkale
            <br />
            Uzman
          </span>
        </a>

        <nav className="ml-10 hidden items-center gap-7 text-sm font-semibold text-[#102844] lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#c99a53]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="rounded-[5px] bg-[#0d2c4b] px-6 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
            onClick={onJoinClick}
          >
            Uzman Ol
          </button>
          <button
            type="button"
            className="rounded-[5px] border border-[#0d2c4b] px-6 py-3 text-sm font-semibold text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]"
            onClick={onLoginClick}
          >
            Giriş Yap
          </button>
        </div>

        <button
          type="button"
          className="ml-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border border-[rgba(16,40,68,0.16)] bg-[#fffdf9] text-[#0d2c4b] lg:hidden"
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
          <nav className="mx-auto flex max-w-[940px] flex-col gap-4 text-sm font-semibold text-[#102844]">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mx-auto mt-5 grid max-w-[940px] gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-[5px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9]"
              onClick={() => {
                closeMenu();
                onJoinClick();
              }}
            >
              Uzman Ol
            </button>
            <button
              type="button"
              className="rounded-[5px] border border-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#0d2c4b]"
              onClick={() => {
                closeMenu();
                onLoginClick();
              }}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
