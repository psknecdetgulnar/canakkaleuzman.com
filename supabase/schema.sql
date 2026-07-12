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

-- ── MIGRASYON: expert_note alanı (uzmanın randevuya eklediği özel not) ─────
-- Panel takvim ızgarasında dolu hücreye tıklayınca uzman bir not girebilsin
-- diye eklendi. Ziyaretçiye asla gösterilmez.
alter table appointments add column if not exists expert_note text;

-- ── MIGRASYON: companies + job_listings (Şirket Paneli) ────────────────────
-- Şirketler kendi tanıtım sayfalarını oluşturabilir ve isteğe bağlı iş
-- ilanları paylaşabilir. Uzman panelinden tamamen ayrı, kendi demo profil-
-- seçici mekanizmasıyla çalışır (auth gelene kadar aynı desen).
create table if not exists companies (
  id text primary key,                 -- slug (ör. atlas-tip-merkezi)
  name text not null,
  sector text not null,
  city text not null default 'Çanakkale',
  description text,
  logo_initials text not null,
  website text,
  phone text,
  email text,
  address text,
  status text not null default 'approved' check (status in ('pending','approved','rejected')),
  premium boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists companies_status_idx on companies(status);

create table if not exists job_listings (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references companies(id) on delete cascade,
  title text not null,
  description text not null,
  employment_type text not null default 'Tam zamanlı',
  location text not null default 'Çanakkale',
  contact_email text,
  contact_phone text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);
create index if not exists job_listings_company_idx on job_listings(company_id);
create index if not exists job_listings_status_idx on job_listings(status);

alter table companies enable row level security;
alter table job_listings enable row level security;

drop policy if exists companies_public_read on companies;
create policy companies_public_read on companies for select using (status = 'approved');
drop policy if exists companies_demo_write on companies;
create policy companies_demo_write on companies for insert with check (true);
drop policy if exists companies_demo_update on companies;
create policy companies_demo_update on companies for update using (true) with check (true);

drop policy if exists job_listings_public_read on job_listings;
create policy job_listings_public_read on job_listings for select using (true);
drop policy if exists job_listings_demo_write on job_listings;
create policy job_listings_demo_write on job_listings for insert with check (true);
drop policy if exists job_listings_demo_update on job_listings;
create policy job_listings_demo_update on job_listings for update using (true) with check (true);
drop policy if exists job_listings_demo_delete on job_listings;
create policy job_listings_demo_delete on job_listings for delete using (true);

-- ── MIGRASYON: pharmacy_duty (nöbetçi eczane — pratik/manuel yaklaşım) ─────
-- Gerçek zamanlı otomatik çekme (üçüncü taraf siteleri kazıma) bu ortamdan
-- güvenilir şekilde kurulamaz; bunun yerine basit bir günlük liste + hafif
-- bir yönetim ekranı sunulur (eczane odası/il sağlık müdürlüğü listesinden
-- elle veya toplu yapıştırarak girilir).
create table if not exists pharmacy_duty (
  id uuid primary key default gen_random_uuid(),
  duty_date date not null,
  name text not null,
  district text not null,
  address text,
  phone text,
  created_at timestamptz not null default now()
);
create index if not exists pharmacy_duty_date_idx on pharmacy_duty(duty_date);

alter table pharmacy_duty enable row level security;
drop policy if exists pharmacy_public_read on pharmacy_duty;
create policy pharmacy_public_read on pharmacy_duty for select using (true);
-- DEMO: yönetim ekranı auth gelene kadar anon yazabilir (Faz-auth'ta admin'e kilitlenecek).
drop policy if exists pharmacy_demo_write on pharmacy_duty;
create policy pharmacy_demo_write on pharmacy_duty for insert with check (true);
drop policy if exists pharmacy_demo_delete on pharmacy_duty;
create policy pharmacy_demo_delete on pharmacy_duty for delete using (true);

-- ── MIGRASYON: blog_posts.published + panel yazma izni ─────────────────────
-- Uzmanlar panelden taslak yazıp yayınlayabilsin diye eklendi. Halka açık
-- okuma yalnızca published=true olanları göstermeli (uygulama katmanında
-- filtrelenir); DEMO yazma politikası auth gelene kadar anon'a açık.
alter table blog_posts add column if not exists published boolean not null default true;
drop policy if exists blog_demo_write on blog_posts;
create policy blog_demo_write on blog_posts for insert with check (true);
drop policy if exists blog_demo_update on blog_posts;
create policy blog_demo_update on blog_posts for update using (true) with check (true);
drop policy if exists blog_demo_delete on blog_posts;
create policy blog_demo_delete on blog_posts for delete using (true);
