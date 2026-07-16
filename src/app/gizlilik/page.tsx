import type { Metadata } from "next";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Aydınlatma Metni | Çanakkale Uzman",
  description: "Kişisel verilerin işlenmesine ilişkin aydınlatma metni ve gizlilik politikası.",
  alternates: { canonical: rootUrl("/gizlilik") },
};

// NOT: Bu metin bir ŞABLONDUR — yayına almadan önce bir hukukçuya
// inceletilmesi önerilir. [Köşeli parantezli] alanlar doldurulmalıdır.
export default function GizlilikPage() {
  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <article className="mx-auto max-w-[760px] px-5 py-12 text-[#102844]">
          <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">
            Gizlilik Politikası ve KVKK Aydınlatma Metni
          </h1>
          <p className="mt-2 text-xs text-[rgba(16,40,68,0.55)]">Son güncelleme: 15 Temmuz 2026</p>

          <div className="mt-6 space-y-6 text-sm leading-7">
            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">1. Veri Sorumlusu</h2>
              <p>
                canakkaleuzman.com (&ldquo;Platform&rdquo;), 6698 sayılı Kişisel Verilerin Korunması
                Kanunu (&ldquo;KVKK&rdquo;) kapsamında veri sorumlusu sıfatıyla hareket eder.
                Veri sorumlusu: <strong>[Ad Soyad / Ticari Unvan]</strong>, iletişim:{" "}
                <a href="mailto:info@canakkaleuzman.com" className="font-semibold text-[#0d2c4b] underline">info@canakkaleuzman.com</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">2. İşlenen Kişisel Veriler</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Ziyaretçiler (randevu talebi):</strong> ad soyad, telefon numarası, isteğe bağlı not.</li>
                <li><strong>Uzman/şirket üyeleri:</strong> ad soyad/unvan, e-posta, telefon, mesleki bilgiler, profil içeriği.</li>
                <li><strong>İlan verenler:</strong> ad/kurum adı, iletişim bilgileri, ilan içeriği.</li>
                <li><strong>Otomatik toplanan:</strong> anonim kullanım olayları (sayfa görüntülenme, buton tıklama — kimlikle eşleştirilmez), oturum çerezleri.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">3. İşleme Amaçları ve Hukuki Sebep</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Randevu talebinin ilgili uzmana iletilmesi (sözleşmenin kurulması — KVKK m.5/2-c).</li>
                <li>Üyelik hesabının oluşturulması ve yönetimi (sözleşmenin ifası).</li>
                <li>İlanların yayınlanması ve moderasyonu (meşru menfaat — m.5/2-f).</li>
                <li>Platform güvenliği ve hizmet iyileştirme (meşru menfaat).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">4. Aktarım</h2>
              <p>
                Randevu talebindeki ad, telefon ve not bilgisi yalnızca randevu talep edilen uzmana
                gösterilir. Veriler, barındırma ve veritabanı hizmeti aldığımız yurt dışı merkezli
                hizmet sağlayıcıların (Vercel Inc., Supabase Inc.) sunucularında saklanır; bu aktarım
                için KVKK m.9 kapsamında açık rızanız alınır. Veriler bunun dışında üçüncü kişilerle
                paylaşılmaz, satılmaz.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">5. Saklama Süresi</h2>
              <p>
                Üyelik verileri üyelik süresince; randevu kayıtları ilgili randevunun tamamlanmasından
                itibaren en fazla 2 yıl; ilan içerikleri yayından kaldırıldıktan sonra en fazla 1 yıl
                saklanır ve ardından silinir veya anonimleştirilir.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">6. Haklarınız (KVKK m.11)</h2>
              <p>
                Kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini
                isteme, işlemeye itiraz etme ve zarara uğramanız hâlinde giderilmesini talep etme
                haklarına sahipsiniz. Talepleriniz için{" "}
                <a href="mailto:info@canakkaleuzman.com" className="font-semibold text-[#0d2c4b] underline">info@canakkaleuzman.com</a>{" "}
                adresine başvurabilirsiniz; başvurular en geç 30 gün içinde yanıtlanır.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[1.2rem] font-semibold text-[#0d2c4b]">7. Çerezler</h2>
              <p>
                Platform yalnızca oturum yönetimi için zorunlu çerezler/yerel depolama kullanır;
                reklam veya üçüncü taraf izleme çerezi kullanılmaz.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
