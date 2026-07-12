import type { ExpertProfile } from "@/data/experts";
import { rootUrl, profileUrl, SITE_NAME } from "@/lib/site";
import { expertPhoto } from "@/lib/avatar";

// Uzman profili için Schema.org JSON-LD @graph.
// Yalnızca sayfada kullanıcıya gösterilen gerçek verileri içerir.
export function expertJsonLd(p: ExpertProfile) {
  const url = profileUrl(p.slug);
  const personId = `${url}#person`;

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": personId,
    name: p.name,
    url,
    jobTitle: p.title,
    image: expertPhoto(p.name),
    knowsAbout: p.expertiseAreas,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.district,
      addressRegion: "Çanakkale",
      addressCountry: "TR",
    },
    areaServed: { "@type": "City", name: "Çanakkale" },
  };
  if (p.longBio.length) person.description = p.longBio[0];
  if (p.firm) person.worksFor = { "@type": "Organization", name: p.firm };
  // Free profilde sayfada gösterilmeyen iletişim bilgileri schema'ya da sızmaz
  // (aksi halde arama sonuçlarında gizlenen bilgi görünür olurdu).
  if (p.premium) {
    if (p.phone) person.telephone = p.phone;
    if (p.email) person.email = p.email;
    const sameAs = p.socials.map((s) => s.url);
    if (sameAs.length) person.sameAs = sameAs;
  }

  // Puan ve yorumlar sayfada gösteriliyor → schema ile tutarlı.
  if (p.reviewCount > 0) {
    person.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (p.reviews.length) {
    person.review = p.reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      author: { "@type": "Person", name: r.author },
      reviewBody: r.body,
      datePublished: r.date,
    }));
  }

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    name: `${p.title} ${p.name} | ${SITE_NAME}`,
    mainEntity: { "@id": personId },
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: rootUrl("/") },
      { "@type": "ListItem", position: 2, name: "Uzmanlar", item: rootUrl("/uzmanlar") },
      { "@type": "ListItem", position: 3, name: p.name, item: url },
    ],
  };

  const services = p.expertiseAreas.map((s) => ({
    "@type": "Service",
    name: s,
    serviceType: p.title,
    provider: { "@id": personId },
    areaServed: { "@type": "City", name: "Çanakkale" },
    availableChannel: { "@type": "ServiceChannel", serviceUrl: url },
  }));

  return { "@context": "https://schema.org", "@graph": [profilePage, person, breadcrumb, ...services] };
}
