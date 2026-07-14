import type { Metadata } from "next";
import Link from "next/link";
import { getOpenJobListings, getCompanies } from "@/lib/companies";
import { getApprovedListings } from "@/lib/publicListings";
import { ListingSubmit } from "@/components/listings/ListingSubmit";
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
  const [jobs, companies, publicJobs, seekers] = await Promise.all([
    getOpenJobListings(),
    getCompanies(),
    getApprovedListings("is_ilani"),
    getApprovedListings("is_arayan"),
  ]);
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
          <div className="mx-auto flex max-w-[840px] flex-col gap-8">
            {/* İlan gönderme (işveren + iş arayan) — admin onayıyla yayınlanır */}
            <ListingSubmit />

            {/* Onaylanmış işveren ilanları (halka açık gönderim) */}
            {publicJobs.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-[1.4rem] font-semibold text-[#0d2c4b]">İş İlanları</h2>
                <ul className="flex flex-col gap-4">
                  {publicJobs.map((l) => (
                    <li key={l.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
                      <p className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">{l.title}</p>
                      <p className="text-sm font-semibold text-[#102844]">{l.orgName}</p>
                      <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                        {[l.employmentType, l.location, l.salary, formatDate(l.createdAt)].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm text-[#102844]">{l.description}</p>
                      {l.requirements && <p className="mt-2 text-sm text-[#102844]"><strong>Aranan nitelikler:</strong> {l.requirements}</p>}
                      <p className="mt-3 text-sm font-semibold text-[#0d2c4b]">
                        Başvuru: {l.contactName} · {[l.contactPhone, l.contactEmail, l.contactWhatsapp && `WhatsApp: ${l.contactWhatsapp}`].filter(Boolean).join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* İş arayanlar */}
            {seekers.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-[1.4rem] font-semibold text-[#0d2c4b]">İş Arayanlar</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {seekers.map((l) => (
                    <li key={l.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f9f7f2] p-5">
                      <p className="font-semibold text-[#0d2c4b]">🔎 {l.title}</p>
                      <p className="text-sm text-[#102844]">{l.contactName}</p>
                      <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
                        {[l.employmentType, l.location, l.availability, l.salary].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-[#102844]">{l.description}</p>
                      {l.experience && <p className="mt-1 text-xs text-[#102844]"><strong>Deneyim:</strong> {l.experience}</p>}
                      {l.education && <p className="mt-1 text-xs text-[#102844]"><strong>Eğitim:</strong> {l.education}</p>}
                      <p className="mt-2 text-xs font-semibold text-[#0d2c4b]">
                        İletişim: {[l.contactPhone, l.contactEmail, l.contactWhatsapp && `WA: ${l.contactWhatsapp}`].filter(Boolean).join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
            <h2 className="mb-3 font-display text-[1.4rem] font-semibold text-[#0d2c4b]">Şirket İlanları</h2>
            {jobs.length === 0 ? (
              <p className="text-[#102844]">Şu anda şirket paneli üzerinden yayınlanmış ilan yok.</p>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
