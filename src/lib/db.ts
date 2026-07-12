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
    published: r.published ?? true,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// GERÇEK VERİ MODU: Supabase yapılandırılmışsa statik demo verisine ASLA
// düşülmez — hata durumunda sahte uzman göstermek yerine boş liste döner.
// Statik veri yalnızca env anahtarları hiç yokken (yerel tasarım/demo) kullanılır.
export async function getExperts(): Promise<Expert[]> {
  if (!db) return staticExperts;
  const { data, error } = await db.from("experts").select("*").eq("status", "approved").order("name");
  if (error || !data) return [];
  return data.map(rowToExpert);
}

export async function getExpertProfileBySlug(slug: string): Promise<ExpertProfile | null> {
  if (!db) return staticProfileBySlug(slug);
  const { data, error } = await db.from("experts").select("*").eq("id", slug).maybeSingle();
  if (error || !data) return null;
  return rowToProfile(data);
}

// Halka açık liste: yalnızca yayınlanmış yazılar (panelden yazılan taslaklar hariç).
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!db) return staticPosts.filter((p) => p.published !== false);
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!db) return staticPosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return rowToPost(data);
}

// Panel: bir uzmanın kendi yazıları (taslak + yayında, hepsi).
export async function getBlogPostsByAuthor(authorId: string): Promise<BlogPost[]> {
  if (!db) return staticPosts.filter((p) => p.authorId === authorId);
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("author_id", authorId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToPost);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type NewBlogPost = {
  title: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  category: string;
  excerpt: string;
  body: string[];
  published: boolean;
};

export async function createBlogPost(p: NewBlogPost): Promise<{ ok: boolean; error?: string; slug?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const base = slugify(p.title).slice(0, 80) || "yazi";
  let slug = base;
  for (let i = 1; i < 50; i++) {
    const { data: existing } = await db.from("blog_posts").select("slug").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${base}-${i + 1}`;
  }
  const readMinutes = Math.max(2, Math.round(p.body.join(" ").split(/\s+/).length / 180));
  const { error } = await db.from("blog_posts").insert({
    slug,
    title: p.title.trim().slice(0, 160),
    author_id: p.authorId,
    author_name: p.authorName,
    author_title: p.authorTitle,
    category: p.category,
    date: new Date().toISOString().slice(0, 10),
    read_minutes: readMinutes,
    excerpt: p.excerpt.trim().slice(0, 300),
    body: p.body.map((b) => b.trim()).filter(Boolean),
    published: p.published,
  });
  return error ? { ok: false, error: error.message } : { ok: true, slug };
}

export async function updateBlogPost(
  slug: string,
  p: Partial<Pick<NewBlogPost, "title" | "category" | "excerpt" | "body" | "published">>
): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const patch: Record<string, unknown> = {};
  if (p.title !== undefined) patch.title = p.title.trim().slice(0, 160);
  if (p.category !== undefined) patch.category = p.category;
  if (p.excerpt !== undefined) patch.excerpt = p.excerpt.trim().slice(0, 300);
  if (p.body !== undefined) {
    patch.body = p.body.map((b) => b.trim()).filter(Boolean);
    patch.read_minutes = Math.max(2, Math.round(p.body.join(" ").split(/\s+/).length / 180));
  }
  if (p.published !== undefined) patch.published = p.published;
  const { error } = await db.from("blog_posts").update(patch).eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteBlogPost(slug: string): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("blog_posts").delete().eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// Yeni uzman başvurusu: status='pending' ile kaydedilir; admin panelinden
// onaylanana kadar dizinde GÖRÜNMEZ (RLS: experts_public_apply politikası
// anon insert'e yalnızca pending statüsüyle izin verir).
export type ExpertApplication = {
  name: string;
  title: string;
  category: string;      // kategori slug'ı (categories.ts)
  categoryLabel: string;
  phone: string;
  district?: string;
};

export async function createExpertApplication(a: ExpertApplication): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const base = slugify(a.name).slice(0, 60) || "uzman";
  const initials = a.name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "??";
  // Bekleyen kayıtlar anon select'e kapalı olduğundan çakışma önceden
  // görülemez; PK çakışmasında (23505) sonek ekleyerek yeniden denenir.
  for (let i = 0; i < 20; i++) {
    const id = i === 0 ? base : `${base}-${i + 1}`;
    const { error } = await db.from("experts").insert({
      id,
      name: a.name.trim().slice(0, 120),
      title: a.title.trim().slice(0, 120),
      category: a.category,
      category_label: a.categoryLabel,
      district: a.district?.trim() || "Merkez",
      initials,
      phone: a.phone.trim().slice(0, 40) || null,
      status: "pending",
    });
    if (!error) return { ok: true, id };
    if (error.code !== "23505") return { ok: false, error: error.message };
  }
  return { ok: false, error: "Uygun bir profil adresi bulunamadı, lütfen bizimle iletişime geçin." };
}

export { staticExperts, staticPosts, getExpertProfile };
