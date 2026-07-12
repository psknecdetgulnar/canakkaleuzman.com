import Link from "next/link";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";

export default function NotFound() {
  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-[60vh] bg-[#fffdf9] px-5 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-display text-[4rem] font-semibold text-[#0d2c4b]">404</p>
          <h1 className="mt-2 font-display text-[1.8rem] font-semibold text-[#0d2c4b]">Sayfa bulunamadı</h1>
          <p className="mt-3 text-[#102844]">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
              Anasayfa
            </Link>
            <Link href="/uzmanlar" className="rounded-[8px] border border-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]">
              Uzmanları Gör
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
