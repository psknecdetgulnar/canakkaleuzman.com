import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// TEK paylaşılan Supabase istemcisi.
// - Tarayıcıda: oturum SAKLAR (localStorage, cbuz_auth). Giriş yapan uzman/
//   şirket/admin'in JWT'si buradan geçen TÜM sorgulara eklenir; RLS'teki
//   sahip-bazlı (owner_id) ve is_admin() politikaları böylece çalışır.
// - Sunucuda (SSR/route): oturum saklamaz, salt anon halka açık okuma yapar.
// Not: lib'lerdeki dağınık createClient kopyaları bu modülde birleştirildi.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isBrowser = typeof window !== "undefined";

export const sb: SupabaseClient | null =
  url && key && !url.includes("xxxx")
    ? createClient(url, key, {
        auth: isBrowser
          ? { persistSession: true, storageKey: "cbuz_auth", autoRefreshToken: true }
          : { persistSession: false },
      })
    : null;
