"use client";

import Image from "next/image";
import type { SearchFilters } from "./SearchBar";
import { SearchBar } from "./SearchBar";
import { TrustIcon } from "./Icons";

type HeroProps = {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSearch: () => void;
};

export function Hero({ filters, onFilterChange, onSearch }: HeroProps) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#e8d8c2] text-[#0d2c4b]">
      {/* Tam boy hero görseli — LCP: öncelikli, optimize (next/image) */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Sol tarafta metin okunurluğu için açık gradyan */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,245,241,0.94)_0%,rgba(246,245,241,0.72)_26%,rgba(246,245,241,0.30)_46%,transparent_64%)]" />
      <HeroAtmosphere />

      <div className="relative mx-auto max-w-[860px] px-5 pb-10 pt-14 md:min-h-[450px] md:pb-24 md:pt-16 lg:px-0">
        <div className="max-w-[620px]">
          <h1 className="font-display text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d2c4b] md:text-[4.35rem]">
            Çanakkale’de
            <br />
            Uzmanına Güven
          </h1>
          <p className="mt-6 max-w-[520px] text-base leading-7 text-[#102844] md:text-[1.15rem]">
            Çanakkale’deki güvenilir uzmanlara kolayca ulaşın. İhtiyacınızı en doğru
            şekilde karşılayın.
          </p>

          <div className="mt-7 max-w-[760px]">
            <SearchBar filters={filters} onChange={onFilterChange} onSearch={onSearch} />
          </div>
        </div>
      </div>

      <div className="relative inset-x-0 bottom-0 z-10 bg-[rgba(13,44,75,0.86)] backdrop-blur-[1px] md:absolute md:bg-[rgba(13,44,75,0.48)]">
        <div className="mx-auto grid max-w-[860px] gap-5 px-5 py-6 text-[#fffdf9] md:grid-cols-3 lg:px-0">
          <TrustItem icon="shield" title="Doğru Uzman" subtitle="Doğru Destek" />
          <TrustItem icon="pin" title="Çanakkale’ye Özel" subtitle="Uzman Ağı" />
          <TrustItem icon="star" title="Güvenilir" subtitle="Değerlendirmeler" />
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: "shield" | "pin" | "star";
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <TrustIcon type={icon} className="h-10 w-10 shrink-0 text-[#fffdf9]" />
      <div className="text-sm font-semibold leading-tight">
        <div>{title}</div>
        <div>{subtitle}</div>
      </div>
    </div>
  );
}

function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Trust bar okunurluğu için alt petrol gradyanı */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(30,76,99,0)_0%,rgba(13,44,75,0.72)_100%)]" />
    </div>
  );
}
