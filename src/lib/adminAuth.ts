import type { Session } from "@supabase/supabase-js";
import { sb } from "@/lib/supabaseClient";

// Oturum yardımcıları. Tek paylaşılan istemci (supabaseClient.sb) kullanılır;
// admin, uzman ve şirket hepsi aynı Supabase Auth üzerinden giriş yapar.
// Rol, user_metadata.role içinde tutulur: 'admin' | 'uzman' | 'sirket'.
export const authDb = sb;

export type UserRole = "admin" | "uzman" | "sirket";

export function roleOf(session: Session | null): UserRole | null {
  const r = session?.user?.user_metadata?.role;
  return r === "admin" || r === "uzman" || r === "sirket" ? r : null;
}

export function sessionIsAdmin(session: Session | null): boolean {
  return roleOf(session) === "admin";
}

export async function adminSignIn(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!authDb) return { ok: false, error: "Bağlantı yok" };
  const { data, error } = await authDb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "E-posta veya şifre hatalı." };
  if (!sessionIsAdmin(data.session)) {
    await authDb.auth.signOut();
    return { ok: false, error: "Bu hesabın yönetici yetkisi yok." };
  }
  return { ok: true };
}

// Genel giriş (uzman/şirket/admin) — role göre hedef sayfa döner.
export async function signIn(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; redirect?: string }> {
  if (!authDb) return { ok: false, error: "Bağlantı yok" };
  const { data, error } = await authDb.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = /email not confirmed/i.test(error.message)
      ? "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et."
      : "E-posta veya şifre hatalı.";
    return { ok: false, error: msg };
  }
  const role = roleOf(data.session);
  const redirect = role === "admin" ? "/admin" : role === "sirket" ? "/sirket-paneli" : "/panel";
  return { ok: true, redirect };
}

export async function signUpUser(
  email: string,
  password: string,
  role: Exclude<UserRole, "admin">
): Promise<{ ok: boolean; error?: string; userId?: string; needsConfirm?: boolean }> {
  if (!authDb) return { ok: false, error: "Bağlantı yok" };
  const { data, error } = await authDb.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });
  if (error) {
    const msg = /already registered/i.test(error.message)
      ? "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene."
      : /at least 6/i.test(error.message)
        ? "Şifre en az 6 karakter olmalı."
        : error.message;
    return { ok: false, error: msg };
  }
  if (!data.user) return { ok: false, error: "Hesap oluşturulamadı." };
  // E-posta doğrulaması açıksa session null döner; kullanıcı önce e-postasını
  // onaylamalı. Kapalıysa doğrudan oturum açılır.
  return { ok: true, userId: data.user.id, needsConfirm: !data.session };
}

export async function adminSignOut(): Promise<void> {
  if (authDb) await authDb.auth.signOut();
}

export const signOut = adminSignOut;
