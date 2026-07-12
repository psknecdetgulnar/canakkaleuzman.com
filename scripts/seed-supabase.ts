// Supabase seed: statik veriyi (experts + blog) veritabanına yükler.
// Çalıştır: npx tsx scripts/seed-supabase.ts
// Şema önce SQL Editor'de çalıştırılmış olmalı.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { experts, getExpertProfile } from "../src/data/experts";
import { blogPosts } from "../src/data/blog";

// .env.local'i elle yükle (tsx otomatik yüklemez)
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error(".env.local içinde SUPABASE anahtarları eksik");

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const expertRows = experts.map((e) => {
    const p = getExpertProfile(e);
    return {
      id: p.slug,
      name: p.name,
      title: p.title,
      category: p.category,
      category_label: p.categoryLabel,
      district: p.district,
      rating: p.rating,
      review_count: p.reviewCount,
      initials: p.initials,
      bio: p.bio,
      services: p.services,
      firm: p.firm,
      years_experience: p.yearsExperience,
      phone: p.phone,
      whatsapp: p.whatsapp,
      email: p.email,
      website: p.website,
      socials: p.socials,
      long_bio: p.longBio,
      expertise_areas: p.expertiseAreas,
      reviews: p.reviews,
      portfolio: p.portfolio,
      stats: p.stats,
      photo_url: null,
      status: "approved",
      premium: e.premium,
    };
  });

  const { error: e1 } = await db.from("experts").upsert(expertRows, { onConflict: "id" });
  if (e1) throw e1;
  console.log(`✓ ${expertRows.length} uzman yüklendi`);

  const postRows = blogPosts.map((b) => ({
    slug: b.slug,
    title: b.title,
    author_id: b.authorId,
    author_name: b.authorName,
    author_title: b.authorTitle,
    category: b.category,
    date: b.date,
    read_minutes: b.readMinutes,
    excerpt: b.excerpt,
    body: b.body,
  }));
  const { error: e2 } = await db.from("blog_posts").upsert(postRows, { onConflict: "slug" });
  if (e2) throw e2;
  console.log(`✓ ${postRows.length} blog yazısı yüklendi`);

  console.log("Seed tamam.");
}

main().catch((err) => {
  console.error("Seed hatası:", err.message ?? err);
  process.exit(1);
});
