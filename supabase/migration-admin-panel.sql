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
