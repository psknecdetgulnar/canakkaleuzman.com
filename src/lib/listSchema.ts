import type { Expert } from "@/data/experts";
import type { BlogPost } from "@/data/blog";
import { rootUrl, profileUrl, blogUrl, SITE_NAME } from "@/lib/site";
import { expertPhoto } from "@/lib/avatar";

// CollectionPage + ItemList: uzman dizini / kategori listeleri için.
export function expertListJsonLd(experts: Expert[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: rootUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: experts.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: profileUrl(e.id),
        name: e.name,
      })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// BlogPosting: tek yazı için.
export function blogPostingJsonLd(post: BlogPost) {
  const url = blogUrl(post.slug);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.date,
    articleSection: post.category,
    author: post.authorId
      ? { "@type": "Person", name: post.authorName, url: profileUrl(post.authorId) }
      : { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: SITE_NAME, url: rootUrl("/") },
    image: post.authorId ? expertPhoto(post.authorName) : undefined,
  };
}
