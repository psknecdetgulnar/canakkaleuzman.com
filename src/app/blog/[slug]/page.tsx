import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPost, getBlogPosts } from "@/lib/db";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl, blogUrl } from "@/lib/site";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/listSchema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string) {
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || post.published === false) return {};
  return {
    title: `${post.title} | Çanakkale Uzman Blog`,
    description: post.excerpt,
    alternates: { canonical: blogUrl(post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      authors: [post.authorName],
      url: blogUrl(post.slug),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || post.published === false) notFound();
  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const initials = post.authorName.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Çanakkale Uzman", url: rootUrl("/") },
          { name: "Blog", url: rootUrl("/blog") },
          { name: post.title, url: blogUrl(post.slug) },
        ])}
      />
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <article className="mx-auto max-w-[760px] px-5 py-12">
          <nav className="text-sm text-[rgba(16,40,68,0.6)]">
            <Link href="/blog" className="hover:text-[#c99a53]">Blog</Link> / {post.category}
          </nav>

          <h1 className="mt-4 font-display text-[2.2rem] font-semibold leading-tight text-[#0d2c4b] md:text-[2.6rem]">
            {post.title}
          </h1>

          {/* Yazar künyesi */}
          <div className="mt-5 flex items-center gap-3 border-y border-[rgba(16,40,68,0.10)] py-4">
            <Link href={`/uzman/${post.authorId}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d2c4b] text-sm font-semibold text-[#fffdf9]">
              {initials}
            </Link>
            <div className="text-sm">
              <Link href={`/uzman/${post.authorId}`} className="block font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
                {post.authorName}
              </Link>
              <span className="block text-xs text-[rgba(16,40,68,0.6)]">
                {post.authorTitle} · {formatDate(post.date)} · {post.readMinutes} dk okuma
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-[1.05rem] leading-8 text-[#102844]">
            {post.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Yazar kartı */}
          <div className="mt-10 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(16,40,68,0.6)]">Yazar</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">{post.authorName}</p>
                <p className="text-sm text-[#102844]">{post.authorTitle} · Çanakkale</p>
              </div>
              <Link
                href={`/uzman/${post.authorId}`}
                className="shrink-0 rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
              >
                Profili Gör
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">İlgili yazılar</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="flex items-baseline justify-between gap-4 rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] px-4 py-3 transition-colors hover:border-[#c99a53]">
                      <span className="font-semibold text-[#0d2c4b]">{r.title}</span>
                      <span className="shrink-0 text-xs text-[rgba(16,40,68,0.6)]">{r.authorName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
