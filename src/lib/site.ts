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
