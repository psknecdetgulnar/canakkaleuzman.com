import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperts, getExpertProfileBySlug } from "@/lib/db";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { profileUrl, SITE_NAME } from "@/lib/site";
import { expertPhoto } from "@/lib/avatar";
import { expertJsonLd } from "@/lib/expertSchema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export async function generateStaticParams() {
  const experts = await getExperts();
  return experts.map((e) => ({ slug: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getExpertProfileBySlug(slug);
  if (!p) return {};
  const url = profileUrl(p.slug); // subdomain kanonik
  const title = `${p.title} ${p.name} - Çanakkale | ${SITE_NAME}`;
  const [firstName, ...rest] = p.name.split(" ");
  return {
    title,
    description: p.bio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description: p.bio,
      url,
      firstName,
      lastName: rest.join(" "),
      images: [{ url: expertPhoto(p.name), alt: `${p.name} — Çanakkale ${p.title}` }],
    },
    twitter: { card: "summary_large_image", title, description: p.bio, images: [expertPhoto(p.name)] },
  };
}

export default async function UzmanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getExpertProfileBySlug(slug);
  if (!profile) notFound();
  return (
    <>
      <JsonLd data={expertJsonLd(profile)} />
      <ProfileHeaderBar />
      <ProfileView profile={profile} />
      <Footer />
    </>
  );
}
