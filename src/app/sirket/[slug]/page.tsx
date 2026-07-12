import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCompanies, getCompanyBySlug, getJobListingsByCompany } from "@/lib/companies";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl, companyUrl } from "@/lib/site";
import { companyJsonLd, breadcrumbJsonLd } from "@/lib/listSchema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: `${company.name} | Çanakkale Uzman`,
    description: company.description ?? `${company.name} — ${company.sector}, Çanakkale.`,
    alternates: { canonical: companyUrl(company.id) },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();
  const jobs = (await getJobListingsByCompany(company.id)).filter((j) => j.status === "open");

  return (
    <>
      <JsonLd data={companyJsonLd(company)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Çanakkale Uzman", url: rootUrl("/") },
          { name: "Şirketler", url: rootUrl("/sirketler") },
          { name: company.name, url: companyUrl(company.id) },
        ])}
      />
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[760px]">
            <nav className="text-sm text-[rgba(16,40,68,0.6)]">
              <Link href="/sirketler" className="hover:text-[#c99a53]">Şirketler</Link> / {company.sector}
            </nav>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0d2c4b] text-xl font-semibold text-[#fffdf9]">
                {company.logoInitials}
              </span>
              <div>
                <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b] md:text-[2.4rem]">{company.name}</h1>
                <p className="text-[#102844]">{company.sector} · {company.city}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto flex max-w-[760px] flex-col gap-8">
            {company.description && (
              <div>
                <h2 className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">Hakkında</h2>
                <p className="mt-2 whitespace-pre-line text-[1.05rem] leading-8 text-[#102844]">{company.description}</p>
              </div>
            )}

            <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6">
              <h2 className="font-display text-[1.1rem] font-semibold text-[#0d2c4b]">İletişim</h2>
              <div className="mt-3 flex flex-col gap-2 text-sm text-[#102844]">
                {company.phone && <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-[#c99a53]">{company.phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="hover:text-[#c99a53]">{company.email}</a>}
                {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#c99a53]">{company.website}</a>}
                {company.address && <p>{company.address}</p>}
                {!company.phone && !company.email && !company.website && !company.address && (
                  <p className="text-[rgba(16,40,68,0.6)]">İletişim bilgisi paylaşılmamış.</p>
                )}
              </div>
            </div>

            {jobs.length > 0 && (
              <div>
                <h2 className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">Açık pozisyonlar</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {jobs.map((j) => (
                    <li key={j.id} className="rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
                      <p className="font-semibold text-[#0d2c4b]">{j.title}</p>
                      <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{j.employmentType} · {j.location}</p>
                      <p className="mt-2 text-sm text-[#102844]">{j.description}</p>
                      {(j.contactEmail || j.contactPhone) && (
                        <p className="mt-2 text-sm text-[#102844]">
                          Başvuru: {[j.contactEmail, j.contactPhone].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
