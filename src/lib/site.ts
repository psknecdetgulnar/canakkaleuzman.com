// Merkezi site yapılandırması ve URL yardımcıları.
// Uzman profilleri subdomain'de sunulur: ayse-demir.canakkaleuzman.com
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "canakkaleuzman.com";
export const SITE_NAME = "Çanakkale Uzman";

// Ana domain URL'i (ör. /kategoriler, /blog).
export const rootUrl = (path = "") => `https://${ROOT_DOMAIN}${path}`;

// Uzman profilinin kanonik (subdomain) URL'i.
export const profileUrl = (slug: string) => `https://${slug}.${ROOT_DOMAIN}`;

// Blog yazısı kanonik URL'i (ana domain).
export const blogUrl = (slug: string) => `https://${ROOT_DOMAIN}/blog/${slug}`;

// Şirket sayfası kanonik URL'i (ana domain, subdomain kullanmaz).
export const companyUrl = (slug: string) => `https://${ROOT_DOMAIN}/sirket/${slug}`;

// Kullanıcı girdisi olan dış bağlantıları (şirket website, uzman sosyal
// linkleri) güvene alır: yalnızca http(s) şemasına izin verir; javascript:,
// data:, vbscript: gibi tehlikeli şemaları veya boş/hatalı değerleri null'a
// çevirir. Şema yoksa https:// varsayar (kullanıcı "site.com" yazmışsa).
export function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
