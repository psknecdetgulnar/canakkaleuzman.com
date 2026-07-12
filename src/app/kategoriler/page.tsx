import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getExperts } from "@/lib/db";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { CategoryBrowser, type CategoryWithExperts } from "@/components/categories/CategoryBrowser";
import { rootUrl } from "@/lib/site";

// Diğer veri-bağımlı sayfalarla (/, /uzman/[slug]) aynı tazelik penceresi —
// yeni uzman eklenince en geç 5 dakikada kategori sayımına yansır.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kategoriler | Çanakkale Uzman",
  description: "Çanakkale Uzman'daki kategoriler ve bu kategorilerdeki gerçek uzmanlar.",
  alternates: { canonical: rootUrl("/kategoriler") },
};

// Kategoriler tamamen gerçek uzman verisinden türetilir — statik bir meslek
// kataloğu değil. Böylece /kategoriler, /uzmanlar ve her uzmanın profilindeki
// "uzmanlık alanları" aynı, tutarlı veri kaynağını (Expert.category / .title)
// kullanır (Görev 1+2).
export default async function KategorilerPage() {
  const experts = await getExperts();

  const withExperts: CategoryWithExperts[] = categories.map((c) => {
    const inCategory = experts.filter((e) => e.category === c.slug);
    const titles = [...new Set(inCategory.map((e) => e.title))].sort((a, b) => a.localeCompare(b, "tr"));
    return {
      slug: c.slug,
      name: c.name,
      description: c.description,
      count: inCategory.length,
      titles,
    };
  });

  const totalExperts = experts.length;

  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[980px]">
            <h1 className="font-display text-[2.4rem] font-semibold text-[#0d2c4b] md:text-[3rem]">
              Kategoriler
            </h1>
            <p className="mt-2 text-[#102844]">Çanakkale&apos;deki uzmanları kategorilere göre keşfedin.</p>
            <p className="mt-1 text-sm text-[rgba(16,40,68,0.6)]">
              {categories.length} kategori · {totalExperts} uzman
            </p>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            <CategoryBrowser categories={withExperts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
