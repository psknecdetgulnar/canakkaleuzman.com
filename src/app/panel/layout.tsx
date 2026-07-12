import Link from "next/link";
import { PanelProfileProvider } from "@/components/panel/PanelProfileContext";

// Panel yerleşimi — sitenin geri kalanıyla aynı lacivert/krem dil (Görev 3).
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelProfileProvider>
      <div className="min-h-screen bg-[#fffdf9]">
        <header className="border-b border-[rgba(16,40,68,0.08)] bg-[#fffdf9]">
          <div className="mx-auto flex h-16 max-w-[980px] items-center justify-between px-4">
            <Link href="/panel" className="font-display text-lg font-semibold text-[#0d2c4b]">
              Uzman Paneli
            </Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-[#102844]">
              <Link href="/panel/profil" className="transition-colors hover:text-[#c99a53]">
                Profil düzenle
              </Link>
              <Link href="/panel/gelen-kutusu" className="transition-colors hover:text-[#c99a53]">
                Gelen kutusu
              </Link>
              <Link href="/panel/blog" className="transition-colors hover:text-[#c99a53]">
                Blog
              </Link>
              <Link href="/panel/destek" className="transition-colors hover:text-[#c99a53]">
                Destek
              </Link>
              <Link href="/" className="transition-colors hover:text-[#c99a53]">
                Dizine dön
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[980px] px-4 py-10">{children}</main>
      </div>
    </PanelProfileProvider>
  );
}
