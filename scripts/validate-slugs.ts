// Build-time validator: kategori/uzman/blog slug'ları yalnızca güvenli ASCII
// [a-z0-9-] içermeli ve benzersiz olmalı. Türkçe karakter bozulması build'i
// durdurur. Yalnızca canlı sitede kullanılan gerçek veriyi doğrular — artık
// kullanılmayan eski taksonomiler (branches/professions) buradan kaldırıldı.
import { categories } from "../src/data/categories";
import { experts } from "../src/data/experts";
import { blogPosts } from "../src/data/blog";
import { slugify, isValidSlug } from "../src/lib/slug";

const failures: string[] = [];

function checkUnique(label: string, slugs: string[]) {
  const seen = new Set<string>();
  for (const s of slugs) {
    if (!isValidSlug(s)) failures.push(`${label} slug geçersiz: "${s}"`);
    if (seen.has(s)) failures.push(`${label} slug tekrarı: "${s}"`);
    seen.add(s);
  }
}

checkUnique("Kategori", categories.map((c) => c.slug));
checkUnique("Uzman", experts.map((e) => e.id));
checkUnique("Blog yazısı", blogPosts.map((p) => p.slug));

// Blog yazılarının yazarı gerçek bir uzmana bağlı olmalı (kırık profil linki olmasın)
const expertIds = new Set(experts.map((e) => e.id));
for (const p of blogPosts) {
  if (!expertIds.has(p.authorId)) {
    failures.push(`Blog yazısı "${p.slug}" bilinmeyen yazara işaret ediyor: "${p.authorId}"`);
  }
}

// Türkçe örneklerle slugify dönüşümünü doğrula
const cases: [string, string][] = [
  ["Ayşe Yılmaz", "ayse-yilmaz"],
  ["İbrahim Çağ", "ibrahim-cag"],
  ["Gökhan Şahin", "gokhan-sahin"],
  ["Öznur Üstün", "oznur-ustun"],
];
for (const [input, expected] of cases) {
  const out = slugify(input);
  if (out !== expected) failures.push(`slugify("${input}") = "${out}", beklenen "${expected}"`);
  if (!isValidSlug(out)) failures.push(`slugify("${input}") ASCII güvenli değil: "${out}"`);
}

if (failures.length) {
  console.error("Slug doğrulama başarısız:\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log(
  `Slug doğrulama geçti. (${categories.length} kategori, ${experts.length} uzman, ${blogPosts.length} blog yazısı)`
);
