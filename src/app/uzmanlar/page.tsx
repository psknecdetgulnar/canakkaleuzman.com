import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getExperts } from "@/lib/db";
import { ExpertCard } from "@/components/home/ExpertCard";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";
import { expertListJsonLd } from "@/lib/listSchema";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Tüm Uzmanlar | Çanakkale Uzman",
  description: "Çanakkale'deki tüm uzmanları tek sayfada inceleyin; profil, iletişim ve randevu.",
  // Filtreli varyasyonlar (ör. ?category=) yerine hep ana listeye kanonik —
  // faceted-filter sayfalarında yinelenen içerik sorununu önler.
  alternates: { canonical: rootUrl("/uzmanlar") },
};

export default async function UzmanlarPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; title?: string }>;
}) {
  const { category, title } = await searchParams;
  const allExperts = await getExperts();

  const experts = allExperts.filter((e) => {
    const matchesCategory = !category || e.category === category;
    const matchesTitle = !title || e.title === title;
    return matchesCategory && matchesTitle;
  });

  const activeCategory = category ? categories.find((c) => c.slug === category) : null;

  return (
    <>
      <JsonLd data={expertListJsonLd(experts, "Çanakkale Uzman — Tüm Uzmanlar", "/uzmanlar")} />
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Tüm Uzmanlar</h1>
            <p className="mt-2 text-sm text-[#102844]">
              Çanakkale&apos;deki {experts.length} uzman. Profili incelemek için bir karta tıklayın.
            </p>

            {/* Aktif filtre görünür olsun — Görev 1/2: kategori tıklaması burada somutlaşır */}
            {(activeCategory || title) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-[rgba(16,40,68,0.6)]">Filtre:</span>
                {activeCategory && (
                  <span className="rounded-full bg-[#0d2c4b] px-3 py-1.5 font-semibold text-[#fffdf9]">
                    {activeCategory.name}
                  </span>
                )}
                {title && (
                  <span className="rounded-full border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 py-1.5 font-semibold text-[#102844]">
                    {title}
                  </span>
                )}
                <Link href="/uzmanlar" className="text-[#0d2c4b] underline decoration-[#c99a53] underline-offset-4 hover:text-[#c99a53]">
                  Filtreyi temizle
                </Link>
              </div>
            )}

            {/* Kategori hızlı geçişi — /kategoriler ile aynı taksonomi */}
            <nav className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/uzmanlar"
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  !category ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.14)] text-[#102844] hover:border-[#c99a53]"
                }`}
              >
                Tümü
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/uzmanlar?category=${c.slug}`}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    category === c.slug ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.14)] text-[#102844] hover:border-[#c99a53]"
                  }`}
                >
                  {c.shortName}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="px-5 py-10">
          {experts.length === 0 ? (
            <div className="mx-auto max-w-[980px] rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
              Bu filtrelere uygun uzman bulunamadı.
            </div>
          ) : (
            <div className="mx-auto grid max-w-[980px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
