import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getExperts } from "@/lib/db";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { ExpertCard } from "@/components/home/ExpertCard";
import { CategoryIcon } from "@/components/home/Icons";
import { rootUrl } from "@/lib/site";
import { expertListJsonLd, breadcrumbJsonLd } from "@/lib/listSchema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} | Çanakkale Uzman`,
    description: `Çanakkale'deki ${category.name.toLocaleLowerCase("tr")} uzmanları — ${category.description}`,
    alternates: { canonical: rootUrl(`/kategoriler/${category.slug}`) },
  };
}

// Kategoriye tıklamak artık gerçek bir sonuç verir: o kategorideki uzmanların
// listelendiği bu sayfa (Görev 1). Veri /uzmanlar ve /kategoriler ile aynı
// kaynaktan (getExperts) gelir — kategori/uzman tutarsızlığı kalmaz (Görev 2).
export default async function KategoriDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const allExperts = await getExperts();
  const experts = allExperts
    .filter((e) => e.category === slug)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  const titles = [...new Set(experts.map((e) => e.title))].sort((a, b) => a.localeCompare(b, "tr"));

  return (
    <>
      <JsonLd data={expertListJsonLd(experts, `Çanakkale ${category.name}`, `/kategoriler/${category.slug}`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Çanakkale Uzman", url: rootUrl("/") },
          { name: "Kategoriler", url: rootUrl("/kategoriler") },
          { name: category.name, url: rootUrl(`/kategoriler/${category.slug}`) },
        ])}
      />
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            <nav className="text-sm text-[rgba(16,40,68,0.6)]">
              <Link href="/kategoriler" className="hover:text-[#c99a53]">
                Kategoriler
              </Link>{" "}
              / {category.name}
            </nav>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fffdf9]">
                <CategoryIcon type={category.slug} className="h-9 w-9 text-[#0d2c4b]" />
              </span>
              <div>
                <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">{category.name}</h1>
                <p className="mt-1 text-sm text-[#102844]">
                  {category.description} · {experts.length} uzman
                </p>
              </div>
            </div>

            {titles.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {titles.map((t) => (
                  <span key={t} className="rounded-full border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 py-1.5 text-sm font-medium text-[#102844]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            {experts.length === 0 ? (
              <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
                Bu kategoride henüz uzman yok.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {experts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} />
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/kategoriler"
                className="rounded-[8px] border border-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]"
              >
                ← Tüm kategoriler
              </Link>
              <Link
                href="/uzmanlar"
                className="rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
              >
                Tüm uzmanları gör
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
