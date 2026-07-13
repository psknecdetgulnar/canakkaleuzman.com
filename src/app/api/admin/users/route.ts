import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Auth kullanıcı yönetimi (listeleme/şifre sıfırlama/askıya alma) service-role
// gerektirir; bu route çağıranın JWT'sini doğrular ve admin_staff'ta
// super_admin/admin olduğunu SUNUCUDA kontrol eder. Yetki asla frontend'e
// bırakılmaz. Tüm işlemler audit_logs'a yazılır.

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "env eksik" }, { status: 500 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: caller } = await admin.auth.getUser(token);
  if (!caller?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: staffRow } = await admin
    .from("admin_staff")
    .select("role, active")
    .eq("user_id", caller.user.id)
    .maybeSingle();
  const isAdminMeta = caller.user.user_metadata?.role === "admin";
  const role = staffRow?.active ? staffRow.role : isAdminMeta ? "admin" : null;
  if (!role || !["super_admin", "admin"].includes(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const op = String(body.op ?? "");

  async function log(action: string, targetId: string, result: string, extra?: unknown) {
    await admin.from("audit_logs").insert({
      admin_user_id: caller!.user!.id,
      admin_email: caller!.user!.email,
      admin_role: role,
      action,
      target_type: "auth_user",
      target_id: targetId,
      new_data: extra ?? null,
      result,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  }

  if (op === "list") {
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.user_metadata?.role ?? null,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
      emailConfirmed: Boolean(u.email_confirmed_at),
      banned: Boolean((u as { banned_until?: string }).banned_until && new Date((u as { banned_until?: string }).banned_until!) > new Date()),
    }));
    return NextResponse.json({ users });
  }

  const targetId = String(body.userId ?? "");
  if (!targetId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 });

  // Super admin hesabı normal adminlerce etkilenemez.
  const { data: targetStaff } = await admin.from("admin_staff").select("role").eq("user_id", targetId).maybeSingle();
  if (targetStaff?.role === "super_admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Super Admin hesabına dokunulamaz" }, { status: 403 });
  }

  if (op === "reset") {
    const { data: u } = await admin.auth.admin.getUserById(targetId);
    if (!u?.user?.email) return NextResponse.json({ error: "kullanıcı bulunamadı" }, { status: 404 });
    const { error } = await admin.auth.resetPasswordForEmail(u.user.email);
    await log("user.password_reset", targetId, error ? "failure" : "success");
    return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
  }

  if (op === "ban" || op === "unban") {
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: op === "ban" ? "87600h" : "none", // ~10 yıl / kaldır
    });
    await log(op === "ban" ? "user.ban" : "user.unban", targetId, error ? "failure" : "success");
    return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "geçersiz işlem" }, { status: 400 });
}
