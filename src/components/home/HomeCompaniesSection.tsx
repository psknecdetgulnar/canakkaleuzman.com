import Link from "next/link";
import type { Company, JobListing } from "@/lib/companies";

// Şirketler ve iş ilanları için anasayfa akışı. Uzman dizininden ayrı bir
// katman — Çanakkale'deki şirketler kendi sayfalarını burada tanıtır.
export function HomeCompaniesSection({ companies, jobs }: { companies: Company[]; jobs: JobListing[] }) {
  if (companies.length === 0 && jobs.length === 0) return null;
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  return (
    <section id="sirketler" className="bg-[#f3eee6] px-5 py-8 md:py-10">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-[1.75rem] font-semibold text-[#0d2c4b]">
            Şirketler &amp; İş İlanları
          </h2>
          <div className="hidden gap-4 text-sm font-semibold sm:flex">
            <Link href="/sirketler" className="text-[#0d2c4b] transition-colors hover:text-[#c99a53]">
              Şirketleri Gör →
            </Link>
            <Link href="/is-ilanlari" className="text-[#0d2c4b] transition-colors hover:text-[#c99a53]">
              İlanları Gör →
            </Link>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {jobs.slice(0, 3).map((j) => {
              const company = companyMap.get(j.companyId);
              return (
                <Link
                  key={j.id}
                  href="/is-ilanlari"
                  className="flex flex-col rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
                >
                  <span className="w-fit rounded-full bg-[#0d2c4b] px-3 py-1 text-xs font-semibold text-[#fffdf9]">
                    {j.employmentType}
                  </span>
                  <h3 className="mt-3 font-display text-[1.05rem] font-semibold leading-snug text-[#0d2c4b]">
                    {j.title}
                  </h3>
                  {company && <p className="mt-1 text-sm text-[#102844]">{company.name}</p>}
                  <p className="mt-2 text-xs text-[rgba(16,40,68,0.6)]">{j.location}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {companies.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/sirket/${c.id}`}
                className="flex items-center gap-3 rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d2c4b] text-xs font-semibold text-[#fffdf9]">
                  {c.logoInitials}
                </span>
                <div>
                  <p className="font-semibold text-[#0d2c4b]">{c.name}</p>
                  <p className="text-xs text-[rgba(16,40,68,0.6)]">{c.sector}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-5 flex gap-4 text-sm font-semibold sm:hidden">
          <Link href="/sirketler" className="text-[#0d2c4b] hover:text-[#c99a53]">Şirketleri Gör →</Link>
          <Link href="/is-ilanlari" className="text-[#0d2c4b] hover:text-[#c99a53]">İlanları Gör →</Link>
        </div>
      </div>
    </section>
  );
}
