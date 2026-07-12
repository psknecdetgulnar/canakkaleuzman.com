import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getExperts, getBlogPosts } from "@/lib/db";
import { rootUrl, profileUrl } from "@/lib/site";

export const revalidate = 3600;

// Dinamik sitemap: ana sayfalar + uzman profilleri (subdomain) + kategoriler + blog.
// Kategoriler categories.ts'ten (gerçek 6 kategori) gelir — /uzmanlar ve
// /kategoriler ile aynı kaynak (Görev 2 tutarlılığı).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [experts, blogPosts] = await Promise.all([getExperts(), getBlogPosts()]);

  return [
    { url: rootUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: rootUrl("/uzmanlar"), changeFrequency: "daily", priority: 0.9 },
    { url: rootUrl("/kategoriler"), changeFrequency: "weekly", priority: 0.8 },
    { url: rootUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
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
  ];
}
