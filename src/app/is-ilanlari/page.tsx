import type { Metadata } from "next";
import Link from "next/link";
import { getOpenJobListings, getCompanies } from "@/lib/companies";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "İş İlanları | Çanakkale Uzman",
  description: "Çanakkale'deki şirketlerden açık pozisyonlar.",
  alternates: { canonical: rootUrl("/is-ilanlari") },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function JobsPage() {
  const [jobs, companies] = await Promise.all([getOpenJobListings(), getCompanies()]);
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[840px]">
            <h1 className="font-display text-[2.4rem] font-semibold text-[#0d2c4b] md:text-[3rem]">İş İlanları</h1>
            <p className="mt-2 text-[#102844]">
              Çanakkale&apos;deki şirketlerin paylaştığı açık pozisyonlar. Şirketini tanıtmak ve ilan
              paylaşmak için{" "}
              <Link href="/sirket-paneli" className="font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
                şirket paneline
              </Link>{" "}
              göz atabilirsin.
            </p>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[840px]">
            {jobs.length === 0 ? (
              <p className="text-[#102844]">Şu anda yayında iş ilanı yok.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {jobs.map((j) => {
                  const company = companyMap.get(j.companyId);
                  return (
                    <li key={j.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">{j.title}</p>
                          {company && (
                            <Link href={`/sirket/${company.id}`} className="text-sm font-semibold text-[#102844] hover:text-[#c99a53]">
                              {company.name}
                            </Link>
                          )}
                          <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                            {j.employmentType} · {j.location} · {formatDate(j.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-[#102844]">{j.description}</p>
                      {(j.contactEmail || j.contactPhone) && (
                        <p className="mt-3 text-sm font-semibold text-[#0d2c4b]">
                          Başvuru: {[j.contactEmail, j.contactPhone].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
