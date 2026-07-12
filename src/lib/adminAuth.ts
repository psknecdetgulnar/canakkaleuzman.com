import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";

// Admin girişi için oturum SAKLAYAN istemci (localStorage). Diğer istemciler
// persistSession:false kullanır; bu istemcinin JWT'si user_metadata.role
// taşıdığı için RLS'teki is_admin() politikaları yalnızca bununla çalışır.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const authDb: SupabaseClient | null =
  url && key && !url.includes("xxxx")
    ? createClient(url, key, { auth: { persistSession: true, storageKey: "cbuz_admin_auth" } })
    : null;

export function sessionIsAdmin(session: Session | null): boolean {
  return session?.user?.user_metadata?.role === "admin";
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

export async function adminSignOut(): Promise<void> {
  if (authDb) await authDb.auth.signOut();
}
