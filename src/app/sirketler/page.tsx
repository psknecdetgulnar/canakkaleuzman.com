import type { Metadata } from "next";
import Link from "next/link";
import { getCompanies } from "@/lib/companies";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";
import { companyListJsonLd } from "@/lib/listSchema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Şirketler | Çanakkale Uzman",
  description: "Çanakkale'de faaliyet gösteren şirketlerin tanıtım sayfaları ve iş ilanları.",
  alternates: { canonical: rootUrl("/sirketler") },
};

export default async function CompaniesPage() {
  const companies = await getCompanies();
  return (
    <>
      <JsonLd data={companyListJsonLd(companies)} />
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[980px]">
            <h1 className="font-display text-[2.4rem] font-semibold text-[#0d2c4b] md:text-[3rem]">Şirketler</h1>
            <p className="mt-2 text-[#102844]">
              Çanakkale&apos;de faaliyet gösteren şirketler. İlgili iş ilanlarını{" "}
              <Link href="/is-ilanlari" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
                iş ilanları sayfasında
              </Link>{" "}
              görebilirsin.
            </p>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            {companies.length === 0 ? (
              <p className="text-[#102844]">Henüz kayıtlı şirket yok.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {companies.map((c) => (
                  <Link
                    key={c.id}
                    href={`/sirket/${c.id}`}
                    className="flex flex-col rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d2c4b] text-sm font-semibold text-[#fffdf9]">
                        {c.logoInitials}
                      </span>
                      <div>
                        <p className="font-display text-[1.15rem] font-semibold text-[#0d2c4b]">{c.name}</p>
                        <p className="text-xs text-[rgba(16,40,68,0.6)]">{c.sector} · {c.city}</p>
                      </div>
                    </div>
                    {c.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-[#102844]">{c.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
