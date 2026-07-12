-- Çanakkale Uzman — Supabase şeması (navy/gold veri modeli)
-- Supabase → SQL Editor'e yapıştırıp "Run" ile çalıştır.
-- Not: Auth Faz'ında profile_overrides ve appointments politikaları sahibe kilitlenecek.

create extension if not exists "pgcrypto";

-- ── experts (zengin profil dokümanı) ──────────────────────────────────────
create table if not exists experts (
  id text primary key,                 -- slug = subdomain (ör. ayse-demir)
  name text not null,
  title text not null,
  category text not null,              -- 6 ana kategori slug'ı (homepage filtresi)
  category_label text not null,
  district text not null,
  rating numeric not null default 5,
  review_count int not null default 0,
  initials text not null,
  bio text,
  services jsonb not null default '[]',
  firm text,
  years_experience int not null default 3,
  phone text,
  whatsapp text,
  email text,
  website text,
  socials jsonb not null default '[]',
  long_bio jsonb not null default '[]',
  expertise_areas jsonb not null default '[]',
  reviews jsonb not null default '[]',
  portfolio jsonb not null default '[]',
  stats jsonb not null default '[]',
  photo_url text,                      -- Storage'dan gerçek foto (yoksa null → placeholder)
  status text not null default 'approved' check (status in ('pending','approved','rejected')),
  premium boolean not null default false, -- iletişim bilgileri yalnızca premium'da açık/düzenlenebilir
  created_at timestamptz not null default now()
);
create index if not exists experts_category_idx on experts(category);
create index if not exists experts_status_idx on experts(status);

-- ── blog_posts ─────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  slug text primary key,
  title text not null,
  author_id text references experts(id) on delete set null,
  author_name text not null,
  author_title text not null,
  category text not null,
  date date not null,
  read_minutes int not null default 5,
  excerpt text not null,
  body jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists blog_posts_date_idx on blog_posts(date desc);

-- ── profile_overrides (panel düzenlemeleri) ───────────────────────────────
create table if not exists profile_overrides (
  expert_id text primary key references experts(id) on delete cascade,
  fields jsonb not null default '{}',
  visibility jsonb not null default '{}',
  section_labels jsonb not null default '{}',
  calendar jsonb not null default '{"enabled":false,"slots":[]}',
  updated_at timestamptz not null default now()
);

-- ── appointments (ziyaretçi randevu talepleri) ────────────────────────────
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  expert_id text references experts(id) on delete cascade,
  visitor_name text not null,
  visitor_phone text not null,
  note text,
  day text,
  slot_time text,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists appointments_expert_idx on appointments(expert_id, status);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table experts enable row level security;
alter table blog_posts enable row level security;
alter table profile_overrides enable row level security;
alter table appointments enable row level security;

-- Halka açık okuma
drop policy if exists experts_public_read on experts;
create policy experts_public_read on experts for select using (status = 'approved');

drop policy if exists blog_public_read on blog_posts;
create policy blog_public_read on blog_posts for select using (true);

drop policy if exists overrides_public_read on profile_overrides;
create policy overrides_public_read on profile_overrides for select using (true);

-- Ziyaretçi randevu oluşturabilir (okuma yok — yalnızca sahibi/servis rolü)
drop policy if exists appointments_public_insert on appointments;
create policy appointments_public_insert on appointments for insert with check (true);

-- DEMO: panel düzenlemesi auth gelene kadar anon yazabilir (Faz-auth'ta kilitlenecek)
drop policy if exists overrides_demo_write on profile_overrides;
create policy overrides_demo_write on profile_overrides for insert with check (true);
drop policy if exists overrides_demo_update on profile_overrides;
create policy overrides_demo_update on profile_overrides for update using (true) with check (true);

-- DEMO: gelen kutusu — panel randevu taleplerini okuyup durumunu güncelleyebilsin
-- diye anon select/update açık (Faz-auth'ta expert_id sahibine kilitlenecek).
drop policy if exists appointments_demo_read on appointments;
create policy appointments_demo_read on appointments for select using (true);
drop policy if exists appointments_demo_update on appointments;
create policy appointments_demo_update on appointments for update using (true) with check (true);

-- ── MIGRASYON: premium alanı (mevcut tabloya sonradan eklendi) ─────────────
-- Tablo zaten oluşturulduysa "create table if not exists" bunu atlar; bu
-- yüzden ayrıca burada eklenir. Zaten varsa hata vermez.
alter table experts add column if not exists premium boolean not null default false;
