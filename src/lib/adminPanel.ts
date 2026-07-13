import { sb } from "@/lib/supabaseClient";

// Admin paneli çekirdeği: personel rolü, audit log, site ayarları.
// Yetki asıl olarak RLS'te uygulanır; buradaki rol bilgisi yalnızca UI içindir.

export type StaffRole = "super_admin" | "admin" | "editor" | "moderator" | "support" | "finance" | "seo";

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editör",
  moderator: "Moderatör",
  support: "Destek Yetkilisi",
  finance: "Finans Yetkilisi",
  seo: "SEO / İçerik",
};

// Modül-bazlı görünürlük (UI). RLS zaten DB'de uygular.
export const ROLE_MODULES: Record<StaffRole, string[]> = {
  super_admin: ["dashboard", "uzmanlar", "sirketler", "icerik", "ilanlar", "destek", "kullanicilar", "analitik", "eczane", "loglar", "ayarlar"],
  admin: ["dashboard", "uzmanlar", "sirketler", "icerik", "ilanlar", "destek", "kullanicilar", "analitik", "eczane", "loglar", "ayarlar"],
  editor: ["dashboard", "icerik", "analitik"],
  moderator: ["dashboard", "uzmanlar", "sirketler", "ilanlar", "icerik"],
  support: ["dashboard", "destek"],
  finance: ["dashboard", "analitik"],
  seo: ["dashboard", "icerik", "analitik"],
};

export type StaffMember = { userId: string; email: string; role: StaffRole; active: boolean; createdAt: string };

// Oturumdaki kullanıcının personel rolü (admin_staff; geçiş için metadata).
export async function getMyStaffRole(): Promise<StaffRole | null> {
  if (!sb) return null;
  const { data: u } = await sb.auth.getUser();
  const user = u?.user;
  if (!user) return null;
  const { data } = await sb.from("admin_staff").select("role, active").eq("user_id", user.id).maybeSingle();
  if (data?.active) return data.role as StaffRole;
  // Geçiş: metadata 'admin' → admin gibi davran (DB is_admin() de kabul eder).
  return user.user_metadata?.role === "admin" ? "admin" : null;
}

export async function listStaff(): Promise<StaffMember[]> {
  if (!sb) return [];
  const { data } = await sb.from("admin_staff").select("*").order("created_at");
  return (data ?? []).map((r) => ({ userId: r.user_id, email: r.email, role: r.role, active: r.active, createdAt: r.created_at }));
}

export async function upsertStaff(userId: string, email: string, role: Exclude<StaffRole, "super_admin">): Promise<{ ok: boolean; error?: string }> {
  if (!sb) return { ok: false, error: "Bağlantı yok" };
  const { error } = await sb.from("admin_staff").upsert({ user_id: userId, email, role, active: true }, { onConflict: "user_id" });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deactivateStaff(userId: string): Promise<{ ok: boolean; error?: string }> {
  if (!sb) return { ok: false, error: "Bağlantı yok" };
  const { error } = await sb.from("admin_staff").update({ active: false }).eq("user_id", userId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

// ── Audit log ────────────────────────────────────────────────────────────────
// Her yönetim işleminden SONRA çağrılır. Kayıtlar RLS gereği silinemez.
export async function logAdminAction(entry: {
  action: string;
  targetType?: string;
  targetId?: string;
  oldData?: unknown;
  newData?: unknown;
  result?: "success" | "failure";
}): Promise<void> {
  if (!sb) return;
  const { data: u } = await sb.auth.getUser();
  const user = u?.user;
  if (!user) return;
  const role = await getMyStaffRole();
  await sb.from("audit_logs").insert({
    admin_user_id: user.id,
    admin_email: user.email ?? null,
    admin_role: role,
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    old_data: entry.oldData ?? null,
    new_data: entry.newData ?? null,
    result: entry.result ?? "success",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : null,
  });
}

export type AuditLog = {
  id: string;
  adminEmail: string | null;
  adminRole: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  oldData: unknown;
  newData: unknown;
  result: string;
  createdAt: string;
};

export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  if (!sb) return [];
  const { data } = await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map((r) => ({
    id: r.id, adminEmail: r.admin_email, adminRole: r.admin_role, action: r.action,
    targetType: r.target_type, targetId: r.target_id, oldData: r.old_data, newData: r.new_data,
    result: r.result, createdAt: r.created_at,
  }));
}

// ── Site ayarları ────────────────────────────────────────────────────────────
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (!sb) return fallback;
  const { data } = await sb.from("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export async function setSetting(key: string, value: unknown): Promise<{ ok: boolean; error?: string }> {
  if (!sb) return { ok: false, error: "Bağlantı yok" };
  const { data: u } = await sb.auth.getUser();
  const { error } = await sb.from("site_settings").upsert(
    { key, value, updated_at: new Date().toISOString(), updated_by: u?.user?.id ?? null },
    { onConflict: "key" }
  );
  return error ? { ok: false, error: error.message } : { ok: true };
}
