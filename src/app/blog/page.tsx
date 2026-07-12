import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/db";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { BlogList } from "@/components/blog/BlogList";
import { rootUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | Çanakkale Uzman",
  description:
    "Çanakkale'deki uzmanlardan pratik rehberler: psikoloji, sağlık, hukuk, beslenme ve daha fazlası.",
  alternates: { canonical: rootUrl("/blog") },
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[980px]">
            <h1 className="font-display text-[2.4rem] font-semibold text-[#0d2c4b] md:text-[3rem]">Blog</h1>
            <p className="mt-2 text-[#102844]">
              Çanakkale'deki uzmanlardan pratik rehberler ve deneyimler.
            </p>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[980px]">
            <BlogList posts={blogPosts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
