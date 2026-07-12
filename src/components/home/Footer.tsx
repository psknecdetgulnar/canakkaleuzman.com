
export function Footer() {
  return (
    <footer id="iletisim" className="bg-[#f3eee6] px-5 pt-6 text-[#102844]">
      <div className="mx-auto grid max-w-[860px] gap-6 border-b border-[rgba(16,40,68,0.12)] pb-6 md:grid-cols-[1.25fr_1fr_0.9fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-[#0d2c4b]">
            {/* Orijinal mockup'tan çıkarılan fener görseli */}
            <img src="/images/lighthouse.png" alt="" className="h-11 w-auto" />
            <span className="font-display text-[1.2rem] font-semibold uppercase leading-[0.95]">
              Çanakkale
              <br />
              Uzman
            </span>
          </div>
          <p className="mt-3 max-w-[300px] text-sm leading-6">
            Çanakkale’deki uzmanları ve ihtiyaç sahiplerini buluşturan güvenilir
            platform.
          </p>
          <div className="mt-4 flex gap-3">
            {(
              [
                ["f", "https://facebook.com/", "Facebook"],
                ["ig", "https://instagram.com/", "Instagram"],
                ["in", "https://linkedin.com/", "LinkedIn"],
                ["yt", "https://youtube.com/", "YouTube"],
              ] as const
            ).map(([item, href, label]) => (
              <a
                key={item}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d2c4b] text-xs font-semibold text-[#fffdf9] transition-colors hover:bg-[#c99a53]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <FooterLinks title="Keşfet" links={["Uzmanlar", "Kategoriler", "Blog", "Hakkımızda"]} />
        <FooterLinks title="Yardım" links={["Sıkça Sorulan Sorular", "Kullanım Koşulları", "Gizlilik Politikası"]} />

        <div>
          <h2 className="text-sm font-bold text-[#0d2c4b]">İletişim</h2>
          <div className="mt-4 space-y-2 text-sm">
            <a href="mailto:info@canakkaleuzman.com" className="block hover:text-[#c99a53]">
              info@canakkaleuzman.com
            </a>
            <p className="tnum">+90 5XX XXX XX XX</p>
            <p>Çanakkale / Türkiye</p>
          </div>
          {/* Gerçek çizim: Çanakkale Şehitler Abidesi (referans mockup'tan). */}
          <img
            src="/images/footer-monument.png"
            alt=""
            className="mt-6 h-16 w-auto object-contain object-left"
          />
        </div>
      </div>
      <div className="mx-auto max-w-[860px] py-4 text-center text-xs">
        © 2026 Çanakkale Uzman. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div id={title === "Keşfet" ? "blog" : undefined}>
      <h2 className="text-sm font-bold text-[#0d2c4b]">{title}</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <a
            key={link}
            href={
              link === "Kategoriler"
                ? "/kategoriler"
                : link === "Uzmanlar"
                  ? "/uzmanlar"
                  : link === "Blog"
                    ? "/blog"
                    : "/#top"
            }
            className="hover:text-[#c99a53]"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  );
}
