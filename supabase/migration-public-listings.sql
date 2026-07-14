-- ── MIGRASYON: Halka açık ilan gönderimi (iş ilanı + iş arayan) ─────────────
-- Kişi/kurumlar detaylı ilan gönderir; admin onayından SONRA yayınlanır.
-- Mevcut companies/job_listings yapısına dokunulmaz (şirket paneli akışı ayrı).

create table if not exists public_listings (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('is_ilani','is_arayan')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  -- ortak alanlar
  title text not null,                 -- pozisyon adı / aranan pozisyon
  description text not null,           -- detaylı açıklama / kendini tanıtma
  location text not null default 'Çanakkale',
  employment_type text,                -- Tam zamanlı / Yarı zamanlı / Stajyer / Uzaktan
  salary text,                         -- ücret / ücret beklentisi (serbest metin)
  contact_name text not null,
  contact_phone text,
  contact_email text,
  contact_whatsapp text,
  -- işveren ilanı alanları
  org_name text,                       -- kurum / işveren adı
  requirements text,                   -- aranan nitelikler
  -- iş arayan alanları
  experience text,                     -- deneyim özeti
  education text,                      -- eğitim durumu
  availability text,                   -- ne zaman başlayabilir
  rejection_reason text,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists public_listings_status_idx on public_listings(kind, status, created_at desc);

alter table public_listings enable row level security;
-- Herkes GÖNDEREBİLİR ama yalnızca 'pending' olarak (yayın kararı admin'de).
drop policy if exists plistings_public_insert on public_listings;
create policy plistings_public_insert on public_listings for insert
  with check (status = 'pending');
-- Halka açık okuma: yalnızca onaylanmış + silinmemiş.
drop policy if exists plistings_public_read on public_listings;
create policy plistings_public_read on public_listings for select
  using (status = 'approved' and deleted_at is null);
-- Personel: tümünü görür (moderasyon kuyruğu), moderatör+ günceller.
drop policy if exists plistings_staff_read on public_listings;
create policy plistings_staff_read on public_listings for select using (is_staff());
drop policy if exists plistings_mod_update on public_listings;
create policy plistings_mod_update on public_listings for update
  using (can_moderate()) with check (can_moderate());
