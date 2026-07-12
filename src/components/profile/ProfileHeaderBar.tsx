import Link from "next/link";

// Profil sayfaları için sade üst bar — ana sayfayla aynı dil (lacivert/krem).
export function ProfileHeaderBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto flex h-[64px] max-w-[980px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-[#0d2c4b]">
          <img src="/images/lighthouse.png" alt="" className="h-9 w-auto" />
          <span className="font-display text-[1.1rem] font-semibold uppercase leading-[0.95]">
            Çanakkale
            <br />
            Uzman
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-[#102844]">
          <Link href="/" className="hidden transition-colors hover:text-[#c99a53] md:block">
            Anasayfa
          </Link>
          <Link href="/kategoriler" className="hidden transition-colors hover:text-[#c99a53] sm:block">
            Kategoriler
          </Link>
          <Link href="/uzmanlar" className="transition-colors hover:text-[#c99a53]">
            Uzmanlar
          </Link>
          <Link href="/blog" className="hidden transition-colors hover:text-[#c99a53] sm:block">
            Blog
          </Link>
          <Link href="/#hakkimizda" className="hidden transition-colors hover:text-[#c99a53] md:block">
            Hakkımızda
          </Link>
          <Link href="/#iletisim" className="hidden transition-colors hover:text-[#c99a53] md:block">
            İletişim
          </Link>
          <Link
            href="/panel"
            className="rounded-[5px] border border-[#0d2c4b] px-4 py-2 text-[#0d2c4b] transition-colors hover:bg-[#0d2c4b] hover:text-[#fffdf9]"
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
