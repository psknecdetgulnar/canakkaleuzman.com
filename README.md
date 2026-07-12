# Çanakkaleuzman.com

Çanakkale uzman dizini + subdomain tabanlı mini site & randevu sistemi.
Ürün spesifikasyonu [CLAUDE.md](./CLAUDE.md), tasarım sistemi [Design.md](./Design.md).

## Stack
Next.js 15 (App Router) · TypeScript · Supabase (Postgres + RLS + Auth + Storage) · Tailwind · Vercel

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldur
```

Supabase projesinde SQL editöründe [`supabase/schema.sql`](./supabase/schema.sql) dosyasını çalıştır.
Storage'da `avatars` ve `covers` adında iki public bucket oluştur.

```bash
npm run dev     # http://localhost:3000
```

Subdomain'i yerelde test etmek için `slug.lvh.me:3000` kullan (lvh.me → 127.0.0.1).

## Mimari

- **Subdomain routing:** `src/middleware.ts` — `ayse.canakkaleuzman.com` → `/u/ayse`.
- **Çift rezervasyon engeli:** `request_appointment` RPC (transaction-level lock).
- **Şehir-agnostik:** her tabloda `city`; v1 yalnızca Çanakkale.
- **SEO:** dinamik `sitemap.xml`, `rss.xml`, sayfa bazlı JSON-LD (`src/lib/schema.tsx`).
- **Tasarım tokenları:** `tailwind.config.ts` + `src/app/globals.css`; varsayılan palet ezildi.

## Build
`npm run build` önce `scripts/validate-slugs.ts` ile Türkçe→ASCII slug güvenliğini doğrular.

## Manuel süreçler (v1, tasarım gereği)
- Profil onayı: `experts.status` → `approved` (admin, elle).
- Abonelik: Shopier ödemesi sonrası `subscription_status` elle güncellenir.
- Belge doğrulama: sağlık/hukuk branşlarında `credential_verified`.
