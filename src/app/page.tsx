import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getExperts, getBlogPosts } from "@/lib/db";
import { getCompanies, getOpenJobListings } from "@/lib/companies";
import { getTodayPharmaciesWithFallback } from "@/lib/pharmacy";
import { rootUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Çanakkale Uzman | Çanakkale’de Güvenilir Uzmanlar",
  description:
    "Çanakkale’de psikolog, diyetisyen, avukat, fizyoterapist ve farklı alanlardaki uzmanlara kolayca ulaşın.",
  alternates: { canonical: rootUrl("/") },
};

export default async function Page() {
  const [experts, blogPosts, companies, jobs, pharmacyResult] = await Promise.all([
    getExperts(),
    getBlogPosts(),
    getCompanies(),
    getOpenJobListings(),
    getTodayPharmaciesWithFallback(),
  ]);
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
