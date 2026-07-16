import type { Metadata } from "next";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Çanakkale Uzman",
  description: "Çanakkale Uzman platformu kullanım koşulları.",
  alternates: { canonical: rootUrl("/kullanim-kosullari") },
};

// NOT: Şablondur — yayına almadan önce hukukçu incelemesi önerilir.
export default function KullanimKosullariPage() {
  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <article className="mx-auto max-w-[760px] px-5 py-12 text-[#102844]">
          <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Kullanım Koşulları</h1>
          <p className="mt-2 text-xs text-[rgba(16,40,68,0.55)]">Son güncelleme: 15 Temmuz 2026</p>

          <div className="mt-6 space-y-6 text-sm leading-7">
            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">1. Platformun Niteliği</h2>
              <p>
                canakkaleuzman.com, Çanakkale&apos;deki uzmanlar ile hizmet arayanları buluşturan bir
                <strong> tanıtım ve iletişim platformudur</strong>. Platform; sağlık hizmeti, hukuki
                danışmanlık veya başka bir mesleki hizmetin sağlayıcısı DEĞİLDİR. Uzman ile ziyaretçi
                arasındaki hizmet ilişkisi tamamen taraflar arasında kurulur; Platform bu ilişkinin
                tarafı değildir ve hizmet kalitesinden sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">2. Üyelik ve Doğrulama</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Uzman ve şirket kayıtları yönetici onayından sonra yayınlanır.</li>
                <li>Sağlık ve hukuk branşlarında diploma/ruhsat belgesi istenebilir.</li>
                <li>Yanlış veya yanıltıcı bilgi veren hesaplar önceden bildirim yapılmaksızın askıya alınabilir veya silinebilir.</li>
                <li>&ldquo;Doğrulanmış&rdquo; rozeti yalnızca belge kontrolü yapılan üyelere verilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">3. İçerik ve İlan Sorumluluğu</h2>
              <p>
                Profil içerikleri, blog yazıları ve ilanlar (iş ilanı / iş arayan ilanı) içeriği
                gönderen kişi veya kuruma aittir. İlanlar yayın öncesi moderasyondan geçer; ancak
                Platform, içeriğin doğruluğunu garanti etmez. Hukuka aykırı, yanıltıcı veya uygunsuz
                içerik <a href="mailto:info@canakkaleuzman.com" className="font-semibold text-[#0d2c4b] underline">info@canakkaleuzman.com</a>{" "}
                adresine bildirilebilir; bildirimler incelenerek gerekli içerik kaldırılır.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">4. Randevu Sistemi</h2>
              <p>
                Randevu talebi bir <strong>taleptir</strong>; uzman onaylayana kadar kesinleşmiş
                randevu anlamına gelmez. Randevunun gerçekleştirilmesi, ertelenmesi veya iptali
                uzman ile ziyaretçi arasındadır.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">5. Ücretlendirme</h2>
              <p>
                Platformda listelenme ücretsizdir; premium üyelik ücretlidir ve kapsamı üyelik
                sırasında açıkça belirtilir. Platform, uzman-ziyaretçi arasındaki hizmet bedeline
                aracılık etmez, komisyon almaz.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">6. Fikri Mülkiyet ve Değişiklikler</h2>
              <p>
                Platform tasarımı ve yazılımı canakkaleuzman.com&apos;a aittir. Bu koşullar
                güncellenebilir; güncel sürüm her zaman bu sayfada yayınlanır. Uyuşmazlıklarda
                Çanakkale mahkemeleri ve icra daireleri yetkilidir.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
