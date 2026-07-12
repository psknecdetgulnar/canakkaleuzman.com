import { NextRequest, NextResponse } from "next/server";

// Subdomain routing: ayse-demir.canakkaleuzman.com → /uzman/ayse-demir
// Wildcard DNS + burada subdomain → slug çözümlemesi. Ana domain ve www dokunulmaz.
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "canakkaleuzman.com";

// Uzman subdomain'i sayılmayacak alt alan adları
const RESERVED = new Set(["www", "app", "admin", "api", "mail", "blog", "panel"]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") ?? "").split(":")[0];

  // Yerel geliştirme: lvh.me / localhost desteği (ör. ayse-demir.lvh.me:3000)
  const isLocal = host.endsWith("localhost") || host.endsWith("lvh.me");

  let subdomain = "";
  if (isLocal) {
    const parts = host.split(".");
    if (parts.length > 1) subdomain = parts[0];
  } else if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = host.slice(0, -(ROOT_DOMAIN.length + 1));
  }

  if (subdomain && !RESERVED.has(subdomain) && !subdomain.includes(".")) {
    // Subdomain'i /uzman/<slug> altına yeniden yaz. Kullanıcı için URL değişmez.
    const rewritten = new URL(url);
    rewritten.pathname = `/uzman/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
