import Link from "next/link";
import { CompanyProfileProvider } from "@/components/company-panel/CompanyProfileContext";

// Uzman panelinden tamamen ayrı bir alan: şirketler burada kendi tanıtım
// sayfalarını oluşturur ve isteğe bağlı iş ilanı paylaşır.
export default function CompanyPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyProfileProvider>
      <div className="min-h-screen bg-[#fffdf9]">
        <header className="border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]">
          <div className="mx-auto flex h-16 max-w-[980px] items-center justify-between px-4">
            <Link href="/sirket-paneli" className="font-display text-lg font-semibold text-[#0d2c4b]">
              Şirket Paneli
            </Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-[#102844]">
              <Link href="/sirket-paneli/profil" className="transition-colors hover:text-[#c99a53]">
                Şirket profili
              </Link>
              <Link href="/sirket-paneli/is-ilanlari" className="transition-colors hover:text-[#c99a53]">
                İş ilanları
              </Link>
              <Link href="/" className="transition-colors hover:text-[#c99a53]">
                Dizine dön
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[980px] px-4 py-10">{children}</main>
      </div>
    </CompanyProfileProvider>
  );
}
