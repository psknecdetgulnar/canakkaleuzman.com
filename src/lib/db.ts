// Supabase veri erişim katmanı (statik yedekli).
// Supabase yapılandırılmamışsa veya erişilemezse data/ statik verisine düşer.
import { createClient } from "@supabase/supabase-js";
import {
  experts as staticExperts,
  getExpertProfile,
  getExpertProfileBySlug as staticProfileBySlug,
  type Expert,
  type ExpertProfile,
} from "@/data/experts";
import { blogPosts as staticPosts, type BlogPost } from "@/data/blog";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const configured = Boolean(url && key && !url.includes("xxxx"));
const db = configured ? createClient(url!, key!, { auth: { persistSession: false } }) : null;

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToExpert(r: any): Expert {
  return {
    id: r.id,
    name: r.name,
    title: r.title,
    category: r.category,
    categoryLabel: r.category_label,
    district: r.district,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    initials: r.initials,
    bio: r.bio ?? "",
    services: r.services ?? [],
    premium: r.premium ?? false,
  };
}

function rowToProfile(r: any): ExpertProfile {
  return {
    ...rowToExpert(r),
    slug: r.id,
    firm: r.firm ?? null,
    yearsExperience: r.years_experience ?? 3,
    phone: r.phone ?? null,
    whatsapp: r.whatsapp ?? null,
    email: r.email ?? null,
    website: r.website ?? null,
    socials: r.socials ?? [],
    longBio: r.long_bio ?? [],
    expertiseAreas: r.expertise_areas ?? [],
    reviews: r.reviews ?? [],
    portfolio: r.portfolio ?? [],
    stats: r.stats ?? [],
    visibility: { about: true, expertise: true, reviews: true, portfolio: true },
  };
}

function rowToPost(r: any): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    authorId: r.author_id,
    authorName: r.author_name,
    authorTitle: r.author_title,
    category: r.category,
    date: typeof r.date === "string" ? r.date.slice(0, 10) : r.date,
    readMinutes: r.read_minutes,
    excerpt: r.excerpt,
    body: r.body ?? [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getExperts(): Promise<Expert[]> {
  if (!db) return staticExperts;
  const { data, error } = await db.from("experts").select("*").eq("status", "approved").order("name");
  if (error || !data) return staticExperts;
  return data.map(rowToExpert);
}

export async function getExpertProfileBySlug(slug: string): Promise<ExpertProfile | null> {
  if (!db) return staticProfileBySlug(slug);
  const { data, error } = await db.from("experts").select("*").eq("id", slug).maybeSingle();
  if (error) return staticProfileBySlug(slug);
  if (!data) return null;
  return rowToProfile(data);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!db) return staticPosts;
  const { data, error } = await db.from("blog_posts").select("*").order("date", { ascending: false });
  if (error || !data) return staticPosts;
  return data.map(rowToPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!db) return staticPosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) return staticPosts.find((p) => p.slug === slug) ?? null;
  if (!data) return null;
  return rowToPost(data);
}

export { staticExperts, staticPosts, getExpertProfile };
