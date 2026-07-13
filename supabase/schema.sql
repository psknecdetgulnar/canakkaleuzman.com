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

-- ── MIGRASYON: Admin rolü + destek sistemi + gerçek kayıt akışı ─────────────
-- Admin, Supabase Auth'ta user_metadata.role='admin' olan kullanıcıdır.
-- Bu blok: (1) destek mesajları tablosu, (2) admin'e tam yönetim yetkisi,
-- (3) yeni uzman başvurusu (status='pending') için halka açık insert izni,
-- (4) nöbetçi eczane yazma yetkisinin admin'e kilitlenmesi.

-- JWT'den admin kontrolü (user_metadata.role = 'admin')
create or replace function is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false)
$$;

-- ── support_messages (kullanıcı ↔ admin destek hattı) ──────────────────────
create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  sender_type text not null check (sender_type in ('uzman','sirket','ziyaretci')),
  sender_id text,                      -- uzman slug'ı veya şirket id'si (varsa)
  sender_name text not null,
  sender_email text,
  subject text not null,
  message text not null,
  admin_reply text,                    -- admin cevabı; kullanıcı panelinde görünür
  status text not null default 'open' check (status in ('open','answered','closed')),
  created_at timestamptz not null default now(),
  replied_at timestamptz
);
create index if not exists support_sender_idx on support_messages(sender_type, sender_id);
create index if not exists support_status_idx on support_messages(status);

alter table support_messages enable row level security;
drop policy if exists support_public_insert on support_messages;
create policy support_public_insert on support_messages for insert with check (true);
-- DEMO: paneller kendi mesajlarını sender_id ile filtreleyerek okur; kullanıcı
-- auth'u geldiğinde sahibe kilitlenecek. Admin her şeyi okur/günceller.
drop policy if exists support_demo_read on support_messages;
create policy support_demo_read on support_messages for select using (true);
drop policy if exists support_admin_update on support_messages;
create policy support_admin_update on support_messages for update using (is_admin()) with check (is_admin());
drop policy if exists support_admin_delete on support_messages;
create policy support_admin_delete on support_messages for delete using (is_admin());

-- ── Uzman başvurusu: halka açık insert yalnızca 'pending' statüsüyle ────────
drop policy if exists experts_public_apply on experts;
create policy experts_public_apply on experts for insert with check (status = 'pending');

-- ── Admin tam yetki (onay/red, premium, silme) ──────────────────────────────
drop policy if exists experts_admin_select on experts;
create policy experts_admin_select on experts for select using (is_admin());
drop policy if exists experts_admin_update on experts;
create policy experts_admin_update on experts for update using (is_admin()) with check (is_admin());
drop policy if exists experts_admin_delete on experts;
create policy experts_admin_delete on experts for delete using (is_admin());

drop policy if exists companies_admin_select on companies;
create policy companies_admin_select on companies for select using (is_admin());
drop policy if exists companies_admin_update on companies;
create policy companies_admin_update on companies for update using (is_admin()) with check (is_admin());
drop policy if exists companies_admin_delete on companies;
create policy companies_admin_delete on companies for delete using (is_admin());

drop policy if exists appointments_admin_delete on appointments;
create policy appointments_admin_delete on appointments for delete using (is_admin());

-- ── Nöbetçi eczane: yazma artık yalnızca admin (Cron servis rolüyle çalışır) ─
drop policy if exists pharmacy_demo_write on pharmacy_duty;
drop policy if exists pharmacy_demo_delete on pharmacy_duty;
drop policy if exists pharmacy_admin_write on pharmacy_duty;
create policy pharmacy_admin_write on pharmacy_duty for insert with check (is_admin());
drop policy if exists pharmacy_admin_delete on pharmacy_duty;
create policy pharmacy_admin_delete on pharmacy_duty for delete using (is_admin());

-- ── MIGRASYON: GERÇEK GİRİŞ SİSTEMİ (Faz-auth) ──────────────────────────────
-- Uzman ve şirketler artık Supabase Auth hesabıyla çalışır. Her profil satırı
-- owner_id ile sahibine bağlanır; DEMO (anon açık) yazma politikaları kaldırılıp
-- sahip-bazlı politikalarla değiştirilir. Halka açık okuma politikaları aynen
-- kalır (dizin, profil, blog, eczane). Admin (is_admin) her şeye yetkilidir.

alter table experts add column if not exists owner_id uuid;
alter table companies add column if not exists owner_id uuid;
create index if not exists experts_owner_idx on experts(owner_id);
create index if not exists companies_owner_idx on companies(owner_id);

-- Sahip, kendi uzman satırını her statüde görebilir ve güncelleyebilir.
drop policy if exists experts_owner_select on experts;
create policy experts_owner_select on experts for select using (owner_id = auth.uid());
drop policy if exists experts_owner_update on experts;
create policy experts_owner_update on experts for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Şirket: kayıt yalnızca oturumlu kullanıcıyla (owner_id = kendisi).
drop policy if exists companies_demo_write on companies;
drop policy if exists companies_demo_update on companies;
drop policy if exists companies_owner_insert on companies;
create policy companies_owner_insert on companies for insert
  with check (owner_id = auth.uid());
drop policy if exists companies_owner_select on companies;
create policy companies_owner_select on companies for select using (owner_id = auth.uid());
drop policy if exists companies_owner_update on companies;
create policy companies_owner_update on companies for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Profil düzenlemeleri: yalnızca profil sahibi (veya admin).
drop policy if exists overrides_demo_write on profile_overrides;
drop policy if exists overrides_demo_update on profile_overrides;
drop policy if exists overrides_owner_insert on profile_overrides;
create policy overrides_owner_insert on profile_overrides for insert
  with check (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()));
drop policy if exists overrides_owner_update on profile_overrides;
create policy overrides_owner_update on profile_overrides for update
  using (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()))
  with check (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()));
drop policy if exists overrides_owner_delete on profile_overrides;
create policy overrides_owner_delete on profile_overrides for delete
  using (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()));

-- Randevular: PII yalnızca ilgili uzmanın sahibine (ve admin'e) görünür.
drop policy if exists appointments_demo_read on appointments;
drop policy if exists appointments_demo_update on appointments;
drop policy if exists appointments_owner_read on appointments;
create policy appointments_owner_read on appointments for select
  using (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()));
drop policy if exists appointments_owner_update on appointments;
create policy appointments_owner_update on appointments for update
  using (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()))
  with check (is_admin() or exists (select 1 from experts e where e.id = expert_id and e.owner_id = auth.uid()));

-- Halka açık takvim "dolu saat" görünümü: PII sızdırmadan yalnızca gün+saat.
-- (Randevu SELECT'i kilitlendiği için public profil bu fonksiyonu kullanır.)
create or replace function public.booked_slots(p_expert_id text)
returns table(day text, slot_time text)
language sql stable security definer set search_path = public as $$
  select day, slot_time from appointments
  where expert_id = p_expert_id
    and status in ('pending','confirmed')
    and day is not null and slot_time is not null
$$;

-- Blog: yazma yalnızca yazar-profilin sahibi (veya admin).
drop policy if exists blog_demo_write on blog_posts;
drop policy if exists blog_demo_update on blog_posts;
drop policy if exists blog_demo_delete on blog_posts;
drop policy if exists blog_owner_insert on blog_posts;
create policy blog_owner_insert on blog_posts for insert
  with check (is_admin() or exists (select 1 from experts e where e.id = author_id and e.owner_id = auth.uid()));
drop policy if exists blog_owner_update on blog_posts;
create policy blog_owner_update on blog_posts for update
  using (is_admin() or exists (select 1 from experts e where e.id = author_id and e.owner_id = auth.uid()))
  with check (is_admin() or exists (select 1 from experts e where e.id = author_id and e.owner_id = auth.uid()));
drop policy if exists blog_owner_delete on blog_posts;
create policy blog_owner_delete on blog_posts for delete
  using (is_admin() or exists (select 1 from experts e where e.id = author_id and e.owner_id = auth.uid()));

-- İş ilanları: yazma yalnızca şirket sahibi (veya admin).
drop policy if exists job_listings_demo_write on job_listings;
drop policy if exists job_listings_demo_update on job_listings;
drop policy if exists job_listings_demo_delete on job_listings;
drop policy if exists job_owner_insert on job_listings;
create policy job_owner_insert on job_listings for insert
  with check (is_admin() or exists (select 1 from companies c where c.id = company_id and c.owner_id = auth.uid()));
drop policy if exists job_owner_update on job_listings;
create policy job_owner_update on job_listings for update
  using (is_admin() or exists (select 1 from companies c where c.id = company_id and c.owner_id = auth.uid()))
  with check (is_admin() or exists (select 1 from companies c where c.id = company_id and c.owner_id = auth.uid()));
drop policy if exists job_owner_delete on job_listings;
create policy job_owner_delete on job_listings for delete
  using (is_admin() or exists (select 1 from companies c where c.id = company_id and c.owner_id = auth.uid()));

-- Destek: gönderen yalnızca kendi mesajlarını görür (admin hepsini).
drop policy if exists support_demo_read on support_messages;
drop policy if exists support_owner_read on support_messages;
create policy support_owner_read on support_messages for select
  using (
    is_admin()
    or (sender_type = 'uzman'  and exists (select 1 from experts   e where e.id = sender_id and e.owner_id = auth.uid()))
    or (sender_type = 'sirket' and exists (select 1 from companies c where c.id = sender_id and c.owner_id = auth.uid()))
  );

-- ── MIGRASYON: Premium tarih aralığı ────────────────────────────────────────
-- Admin, premium'un başlangıç/bitişini belirler; ikisi de null + premium=true
-- ise "sonsuza kadar". Efektif premium uygulama katmanında hesaplanır
-- (tarih geçince otomatik normal statüye döner). Bu alanlar HİÇBİR public
-- yüzeyde gösterilmez.
alter table experts add column if not exists premium_from timestamptz;
alter table experts add column if not exists premium_until timestamptz;

-- ── MIGRASYON: KURUMSAL ADMIN PANELİ (RBAC + audit + soft delete + analitik) ─
-- Rol bazlı yetki DB seviyesinde uygulanır; frontend yalnızca UI gizler.
-- Bu dosyayı Supabase SQL Editor'de çalıştır (schema.sql'e de eklenmiştir).

-- 1) Personel rolleri. Super Admin diğer adminlerce değiştirilemez/silinemez.
create table if not exists admin_staff (
  user_id uuid primary key,
  email text not null,
  role text not null check (role in ('super_admin','admin','editor','moderator','support','finance','seo')),
  active boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default now()
);
alter table admin_staff enable row level security;

create or replace function staff_role() returns text
language sql stable security definer set search_path = public as $$
  select role from admin_staff where user_id = auth.uid() and active
$$;
create or replace function is_super_admin() returns boolean
language sql stable as $$ select staff_role() = 'super_admin' $$;
-- is_admin(): eski politikaların tamamı bu fonksiyona bağlı — yeniden tanım
-- tüm sistemi RBAC'a geçirir. Geçiş için metadata 'admin' de kabul edilir.
create or replace function is_admin() returns boolean
language sql stable as $$
  select staff_role() in ('super_admin','admin')
      or coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false)
$$;
create or replace function is_staff() returns boolean
language sql stable as $$ select staff_role() is not null or is_admin() $$;
create or replace function can_moderate() returns boolean
language sql stable as $$ select is_admin() or staff_role() = 'moderator' $$;
create or replace function can_edit_content() returns boolean
language sql stable as $$ select is_admin() or staff_role() in ('editor','seo','moderator') $$;
create or replace function can_support() returns boolean
language sql stable as $$ select is_admin() or staff_role() = 'support' $$;

-- admin_staff politikaları: personel listeyi görür; yalnızca super_admin yönetir.
-- Super admin satırı super olmayan tarafından değiştirilemez (using şartı).
drop policy if exists staff_select on admin_staff;
create policy staff_select on admin_staff for select using (is_staff());
drop policy if exists staff_insert on admin_staff;
create policy staff_insert on admin_staff for insert with check (is_super_admin() and role <> 'super_admin');
drop policy if exists staff_update on admin_staff;
create policy staff_update on admin_staff for update
  using (is_super_admin() and role <> 'super_admin')
  with check (is_super_admin() and role <> 'super_admin');
drop policy if exists staff_delete on admin_staff;
create policy staff_delete on admin_staff for delete using (is_super_admin() and role <> 'super_admin');

-- 2) Audit log — güncellenemez, silinemez (politika yok = kimse yapamaz).
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  admin_email text,
  admin_role text,
  action text not null,
  target_type text,
  target_id text,
  old_data jsonb,
  new_data jsonb,
  result text not null default 'success',
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists audit_created_idx on audit_logs(created_at desc);
create index if not exists audit_target_idx on audit_logs(target_type, target_id);
alter table audit_logs enable row level security;
drop policy if exists audit_insert on audit_logs;
create policy audit_insert on audit_logs for insert
  with check (is_staff() and admin_user_id = auth.uid());
drop policy if exists audit_select on audit_logs;
create policy audit_select on audit_logs for select using (is_admin());

-- 3) Soft delete + moderasyon alanları
alter table experts   add column if not exists deleted_at timestamptz;
alter table experts   add column if not exists rejection_reason text;
alter table experts   add column if not exists verified boolean not null default false;
alter table experts   add column if not exists sponsored boolean not null default false;
alter table companies add column if not exists deleted_at timestamptz;
alter table companies add column if not exists rejection_reason text;
alter table blog_posts   add column if not exists deleted_at timestamptz;
alter table job_listings add column if not exists deleted_at timestamptz;

-- Askıya alma: status check kısıtına 'suspended' eklenir.
alter table experts drop constraint if exists experts_status_check;
alter table experts add constraint experts_status_check
  check (status in ('pending','approved','rejected','suspended'));

-- Public okuma: silinmişler görünmez.
drop policy if exists experts_public_read on experts;
create policy experts_public_read on experts for select
  using (status = 'approved' and deleted_at is null);
drop policy if exists companies_public_read on companies;
create policy companies_public_read on companies for select
  using (status = 'approved' and deleted_at is null);
drop policy if exists blog_public_read on blog_posts;
create policy blog_public_read on blog_posts for select using (deleted_at is null);
drop policy if exists job_listings_public_read on job_listings;
create policy job_listings_public_read on job_listings for select using (deleted_at is null);

-- Rol-bazlı ek yazma politikaları (mevcut is_admin politikalarına paralel).
drop policy if exists experts_mod_update on experts;
create policy experts_mod_update on experts for update
  using (can_moderate()) with check (can_moderate());
drop policy if exists blog_staff_all on blog_posts;
create policy blog_staff_all on blog_posts for update
  using (can_edit_content()) with check (can_edit_content());
drop policy if exists support_staff_update on support_messages;
create policy support_staff_update on support_messages for update
  using (can_support()) with check (can_support());
drop policy if exists jobs_mod_update on job_listings;
create policy jobs_mod_update on job_listings for update
  using (can_moderate()) with check (can_moderate());
drop policy if exists companies_mod_update on companies;
create policy companies_mod_update on companies for update
  using (can_moderate()) with check (can_moderate());

-- 4) Analitik olayları: anon insert (takip), okuma yalnızca personel.
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in
    ('profile_view','phone_click','whatsapp_click','email_click','share','qr','directions_click','website_click','search')),
  expert_id text,
  meta text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_event_idx on analytics_events(event, created_at desc);
create index if not exists analytics_expert_idx on analytics_events(expert_id, created_at desc);
alter table analytics_events enable row level security;
drop policy if exists analytics_public_insert on analytics_events;
create policy analytics_public_insert on analytics_events for insert with check (true);
drop policy if exists analytics_staff_select on analytics_events;
create policy analytics_staff_select on analytics_events for select using (is_staff());

-- 5) Site ayarları (sırlar burada DEĞİL — env'de kalır).
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table site_settings enable row level security;
drop policy if exists settings_public_read on site_settings;
create policy settings_public_read on site_settings for select using (true);
drop policy if exists settings_admin_write on site_settings;
create policy settings_admin_write on site_settings for insert with check (is_admin());
drop policy if exists settings_admin_update on site_settings;
create policy settings_admin_update on site_settings for update using (is_admin()) with check (is_admin());

-- 6) Mevcut yönetici hesabını super_admin olarak tanımla (idempotent).
insert into admin_staff (user_id, email, role)
values ('3c0ef977-653c-482a-a2ab-202293182fc9', 'ncdtglnr@gmail.com', 'super_admin')
on conflict (user_id) do update set role = 'super_admin', active = true;
