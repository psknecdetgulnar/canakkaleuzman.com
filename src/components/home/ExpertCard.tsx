"use client";

import Link from "next/link";
import type { Expert } from "@/data/experts";
import { ExpertPhoto } from "@/components/ExpertPhoto";

type ExpertCardProps = {
  expert: Expert;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <article className="relative rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-3 text-center shadow-[0_12px_34px_rgba(13,44,75,0.07)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(13,44,75,0.11)]">
      {expert.premium && (
        <span className="absolute right-2 top-2 rounded-full bg-[#c99a53] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#fffdf9]">
          Premium
        </span>
      )}
      {/* Sponsorlu öne çıkarma her zaman ETİKETLİ — dürüst reklam ilkesi */}
      {expert.sponsored && (
        <span className="absolute left-2 top-2 rounded-full border border-[#c99a53] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#c99a53]">
          Sponsorlu
        </span>
      )}
      <div className="mx-auto h-[58px] w-[58px] overflow-hidden rounded-full bg-[#efe8dc]">
        <ExpertPhoto name={expert.name} title={expert.title} className="h-full w-full object-cover" />
      </div>
      <h3 className="mt-2 flex items-center justify-center gap-1 text-base font-bold text-[#0d2c4b]">
        {expert.name}
        {expert.verified && (
          <span title="Doğrulanmış uzman" aria-label="Doğrulanmış uzman" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0d2c4b] text-[0.6rem] text-[#fffdf9]">✓</span>
        )}
      </h3>
      <p className="text-sm text-[#102844]">{expert.title}</p>
      {expert.reviewCount > 0 ? (
        <div className="mt-1 flex items-center justify-center gap-1 text-[0.8rem] text-[#102844]">
          <span className="tracking-[0.08em] text-[#d7a321]">★★★★★</span>
          <span className="font-medium">{expert.rating.toFixed(1)}</span>
          <span className="text-[rgba(16,40,68,0.58)]">({expert.reviewCount})</span>
        </div>
      ) : (
        <div className="mt-1 text-[0.75rem] font-semibold text-[#c99a53]">Yeni üye</div>
      )}
      <p className="mt-1 text-sm font-semibold text-[#102844]">{expert.district}</p>
      <Link
        href={`/uzman/${expert.id}`}
        className="mt-2.5 block w-full rounded-[5px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
      >
        Profili İncele
      </Link>
    </article>
  );
}
