import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getExperts, getBlogPosts } from "@/lib/db";
import { getCompanies, getOpenJobListings } from "@/lib/companies";
import { getApprovedListings } from "@/lib/publicListings";
import { getFreshPharmacies } from "@/lib/pharmacyServer";
import { rootUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Çanakkale Uzman | Çanakkale’de Güvenilir Uzmanlar",
  description:
    "Çanakkale’de psikolog, diyetisyen, avukat, fizyoterapist ve farklı alanlardaki uzmanlara kolayca ulaşın.",
  alternates: { canonical: rootUrl("/") },
};

export default async function Page() {
  const [experts, blogPosts, companies, companyJobs, publicJobs, pharmacyResult] = await Promise.all([
    getExperts(),
    getBlogPosts(),
    getCompanies(),
    getOpenJobListings(),
    getApprovedListings("is_ilani"),
    getFreshPharmacies(),
  ]);
  // Anasayfa iş akışı: şirket ilanları + onaylı halka açık ilanlar (yeni önce)
  const jobs = [
    ...publicJobs.map((l) => ({ id: l.id, title: l.title, employmentType: l.employmentType ?? "İlan", location: l.location, orgLabel: l.orgName ?? l.contactName })),
    ...companyJobs.map((j) => ({ id: j.id, title: j.title, employmentType: j.employmentType, location: j.location, companyId: j.companyId })),
  ];
  return (
    <HomePage
      experts={experts}
      blogPosts={blogPosts}
      companies={companies}
      jobs={jobs}
      pharmacies={pharmacyResult.pharmacies}
      pharmacyDate={pharmacyResult.date}
    />
  );
}
