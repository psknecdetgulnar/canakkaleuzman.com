import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getExperts, getBlogPosts } from "@/lib/db";
import { getCompanies } from "@/lib/companies";
import { rootUrl, profileUrl, companyUrl } from "@/lib/site";

export const revalidate = 3600;

// Dinamik sitemap: ana sayfalar + uzman profilleri (subdomain) + kategoriler +
// blog + şirketler/iş ilanları + nöbetçi eczane (Görev 2 tutarlılığı).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [experts, blogPosts, companies] = await Promise.all([getExperts(), getBlogPosts(), getCompanies()]);

  return [
    { url: rootUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: rootUrl("/uzmanlar"), changeFrequency: "daily", priority: 0.9 },
    { url: rootUrl("/kategoriler"), changeFrequency: "weekly", priority: 0.8 },
    { url: rootUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: rootUrl("/sirketler"), changeFrequency: "weekly", priority: 0.7 },
    { url: rootUrl("/is-ilanlari"), changeFrequency: "daily", priority: 0.7 },
    { url: rootUrl("/nobetci-eczane"), changeFrequency: "daily", priority: 0.5 },
    ...categories.map((c) => ({
      url: rootUrl(`/kategoriler/${c.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...experts.map((e) => ({
      url: profileUrl(e.id), // subdomain kanonik
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((p) => ({
      url: rootUrl(`/blog/${p.slug}`),
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...companies.map((c) => ({
      url: companyUrl(c.id),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
