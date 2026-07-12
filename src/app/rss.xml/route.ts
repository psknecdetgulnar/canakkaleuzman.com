import { blogPosts } from "@/data/blog";
import { rootUrl, blogUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

// Blog RSS feed (tüm yazılar, en yeni önce).
export function GET() {
  const escape = (s: string) =>
    s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));

  const items = [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => {
      const link = blogUrl(p.slug);
      return `<item><title>${escape(p.title)}</title><link>${link}</link><guid>${link}</guid><author>${escape(p.authorName)}</author><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${escape(p.excerpt)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE_NAME} — Blog</title><link>${rootUrl("/blog")}</link><description>Çanakkale'deki uzmanlardan yazılar</description>${items}</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
