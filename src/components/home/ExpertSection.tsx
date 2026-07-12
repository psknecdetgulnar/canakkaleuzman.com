"use client";

import Link from "next/link";
import type { Expert } from "@/data/experts";
import { ExpertCard } from "./ExpertCard";

type ExpertSectionProps = {
  experts: Expert[];
};

export function ExpertSection({ experts }: ExpertSectionProps) {
  return (
    <section id="uzmanlar" className="bg-[#fffdf9] px-5 pb-7 pt-2 md:pb-9">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-[1.75rem] font-semibold text-[#0d2c4b]">
            Öne Çıkan Uzmanlar
          </h2>
          <Link
            href="/uzmanlar"
            className="hidden text-sm font-semibold text-[#0d2c4b] transition-colors hover:text-[#c99a53] sm:block"
          >
            Tüm Uzmanları Gör →
          </Link>
        </div>

        {experts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#f7f1e8] px-5 py-8 text-center text-[#102844]">
            Bu filtrelere uygun uzman bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
}
