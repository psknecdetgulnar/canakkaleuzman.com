# Çanakkaleuzman.com — Ürün Spesifikasyonu

## 1. Ürün Tanımı

Çanakkale'deki uzmanlar için **subdomain tabanlı mini web sitesi + randevu sistemi**, aynı zamanda halka açık **yerel uzman dizini**.

İki katmanlı yapı:
- **Satış vaadi (A):** "Web siten yok mu? Ayda ₺X ile kendi siten, randevu sistemin ve blog'un olsun."
- **Uzun vadeli varlık (B):** Ana domain otoritesiyle beslenen yerel dizin. İlk yıl satış argümanı olarak kullanılmaz.

Her uzman: `ayseyilmaz.canakkaleuzman.com`

---

## 2. Fonksiyon Listesi (Kapsam Kilitli)

### Uzman Paneli (login arkasında)
1. **Profil yönetimi** — kapak fotoğrafı, profil fotoğrafı, bio, branş(lar), hizmet listesi, konum, iletişim
2. **Randevu takvimi** — müsaitlik ayarlama, blok saatler, platform içi randevu yönetimi
3. **Hatırlatma** — randevu öncesi SMS/WhatsApp otomatik bildirim
4. **Danışan kayıt defteri** — isim, iletişim, notlar, geçmiş randevular
5. **Blog** — görselsiz, sadece metin yazı ekleme
6. **Instagram link butonu** — API entegrasyonu yok, sadece dış link

### Halka Açık Taraf (login gerektirmez)
- Ana sayfa (dizin)
- Branş kategori sayfaları: `/psikolog`, `/diyetisyen`, `/avukat` …
- Uzman profil sayfaları (subdomain)
- Blog yazıları
- Randevu talebi formu (platform içi, ziyaretçi giriş yapmadan gönderir)

### Kapsam Dışı (bilinçli olarak yok)
- Ödeme alma / komisyon
- Danışan hesabı / danışan paneli
- Yorum-puanlama sistemi
- Instagram Graph API entegrasyonu
- İstatistik/analytics paneli
- Google Business Profile senkronizasyonu

---

## 3. Randevu Akışı

1. Ziyaretçi uzman profilinde müsait slotu görür.
2. Formu doldurur (ad, telefon, kısa not) — hesap açması gerekmez.
3. Randevu **platform içinde** oluşur, durum: `pending`.
4. Uzmana e-posta + WhatsApp/SMS bildirimi düşer.
5. Uzman panelden onaylar/reddeder → durum `confirmed` / `rejected`.
6. Onaylanan randevu için 24 saat ve 1 saat önce ziyaretçiye hatırlatma gider.

**Çakışma yönetimi:** Tek doğruluk kaynağı platform veritabanıdır. Google Calendar senkronu **yok** (tek yönlü .ics export opsiyonel, v2). Slot rezerve edilirken transaction-level lock ile çift rezervasyon engellenir.

---

## 4. Fiyatlandırma

Tek paket, iki dönem seçeneği:

| Dönem | Fiyat | Efektif aylık |
|---|---|---|
| Aylık | 349 TL | 349 TL |
| Yıllık | 3.490 TL | ~291 TL (2 ay bedava) |

- 14 gün ücretsiz deneme, kredi kartı istenmez.
- **Kurucu üye (ilk 15 uzman):** ömür boyu 199 TL/ay veya 1.990 TL/yıl.
- Ödeme: Shopier üzerinden manuel. Abonelik yaşam döngüsü manueldir — kayıt onayı ve Supabase güncellemesi elle yapılır.

**Gerekçe:** 349 TL, web sitesi yaptırma (5.000–15.000 TL + yıllık bakım) alternatifine karşı savunulabilir; Çanakkale ölçeğinde küçük uzman için psikolojik eşiğin altında.

---

## 5. İlk Müşteri Kanalı (Soğuk Başlangıç)

Aşamalı plan:

**Aşama 0 — Dizini doldur (satış yok)**
- 15 kurucu üyeyi ömür boyu indirimle al. Boş dizine kimse abone olmaz.
- Kaynak: mevcut mesleki tanışıklık, Çanakkale'deki kliniklerin komşu uzmanları (diyetisyen, fizyoterapist, avukat), Atlas Tıp Merkezi bağlantısı üzerinden yayılım.

**Aşama 1 — İçerikle trafik**
- Her branş için bir rehber yazısı: "Çanakkale'de [branş] Nasıl Seçilir?"
- Kategori sayfalarına iç link. Long-tail arama trafiğinin ilk kaynağı.

**Aşama 2 — Soğuk temas**
- Google Maps'te Çanakkale'de kayıtlı, web sitesi olmayan uzmanları listele (kolayca 200+ çıkar).
- Her birine hazır profil taslağı göster: "Profilin hazır, 14 gün ücretsiz dene."
- Hazır taslak, kayıt sürtünmesini sıfıra indirir. En yüksek dönüşümlü kanal budur.

**Aşama 3 — Ağ etkisi**
- Trafik oluştukça uzmanlar birbirini getirir. Referans indirimi: getiren 1 ay bedava.

---

## 6. Doğrulama & Onboarding

- Kayıt açık, ancak profil **manuel onaydan** sonra yayına girer.
- Sağlık ve hukuk branşlarında diploma/ruhsat belgesi zorunlu (panelden yükleme, admin kontrolü).
- Diğer branşlarda kimlik + iş yeri doğrulaması yeterli.
- Sahte profil dizinin itibarını bitirir; manuel onay ilk 200 üyede yönetilebilir maliyettir.

---

## 7. Bildirim Altyapısı

**SMS (birincil):** Netgsm veya İleti Merkezi. Adet başı ~0,10–0,15 TL. 349 TL abonelikte aylık ~50 SMS marj problemi yaratmaz.

**WhatsApp:** Resmi Business API pahalı ve onay süreci uzun. **v1'de kullanılmaz.** Bunun yerine:
- Uzmana gelen randevu bildirimi: e-posta + panel içi
- Ziyaretçiye hatırlatma: SMS

WhatsApp entegrasyonu v2'ye ertelenir. Pazarlama metninde "WhatsApp" vaadi verilmez.

---

## 8. Şehir Mimarisi

Veri modeli **şehir-agnostik** tasarlanır (`city` alanı her tabloda mevcut), ancak v1 yalnızca Çanakkale'yi sunar.

- Domain: `canakkaleuzman.com` (exact-match, yerel SEO avantajı)
- Genişleme durumunda: `bursauzman.com`, `balikesiruzman.com` — aynı kod tabanı, farklı domain, ortak veritabanı.
- Bu karar baştan alınır; sonradan retrofit maliyeti yüksektir.

---

## 9. Teknik Stack

- **Framework:** Next.js 15 (App Router)
- **Hosting:** Vercel
- **Veritabanı / Auth:** Supabase (Postgres + RLS + Storage)
- **Subdomain routing:** Wildcard DNS (`*.canakkaleuzman.com`) + Next.js middleware ile subdomain → slug çözümlemesi
- **Görsel depolama:** Supabase Storage, `next/image` ile optimize
- **SMS:** Netgsm REST API
- **Ödeme:** Shopier (manuel, uygulama içi entegrasyon yok)
- **Dil:** TypeScript

**Not:** Vercel'de wildcard subdomain, custom domain başına konfigürasyon gerektirir. Pro plan ile yönetilebilir; her subdomain ayrı domain olarak eklenmez, wildcard tek kayıt olarak tanımlanır.

---

## 10. SEO & Schema

### Sayfa Bazlı Schema

| Sayfa | Schema |
|---|---|
| Ana sayfa (dizin) | `CollectionPage` + `ItemList` (her uzman `ListItem`) |
| Branş kategori sayfası | `CollectionPage` + `ItemList` + `BreadcrumbList` |
| Uzman profili | `ProfilePage` + `Person` (veya `LocalBusiness`) |
| Blog yazısı | `BlogPosting` + `BreadcrumbList` |

### Person / ProfilePage Alanları
- `name`, `jobTitle`, `knowsAbout` (branş), `address` (PostalAddress), `telephone`
- `image` → profil fotoğrafı (`ImageObject`)
- `ProfilePage.primaryImageOfPage` → kapak fotoğrafı (`ImageObject`)
- `hasCredential` → belge/diploma doğrulanmışsa
- `aggregateRating` **kullanılmaz** (yorum sistemi yok, sahte sinyal verme)

### Görsel SEO
- Her `ImageObject` için `contentUrl`, `caption`
- `alt` metni: `"{İsim} — Çanakkale {Branş}"` formatında otomatik üretilir
- Alt metin, schema'dan daha güçlü sıralama sinyali verir.

### İç Linkleme (asıl savunulabilir avantaj)
- Blog yazısı altında **"Diğer Yazılar"** bölümü: aynı uzmanın + aynı branştaki diğer yazılar
- Profil sayfasından branş kategori sayfasına link
- Kategori sayfasından tüm uzman profillerine link
- Ana domain otoritesi tüm subdomain'lere yayılır — tek başına hiçbir uzmanın elde edemeyeceği güç. Aboneliği gerekçelendiren ana teknik değer budur.

### Teknik SEO Zorunlulukları
- Dinamik `sitemap.xml` (tüm profiller + kategoriler + blog yazıları)
- Her subdomain için canonical, ana domain'e değil kendi URL'ine
- Türkçe karakter güvenliği: slug üretiminde `ı → i`, `ş → s`, `ğ → g` dönüşümü; ASCII bozulmasına karşı build-time validator
- RSS feed (blog)

---

## 11. Rekabet Konumu — Dürüst Değerlendirme

Doktortakvimi, Terapi365 gibi oyuncuların üstünlüğü schema değil **domain otoritesi**dir. Yeni bir dizin, mükemmel schema ile bile ilk 6–12 ay ulusal sonuçların yanına giremez.

**Kazanılabilir alan:** yerel + long-tail.
- "Çanakkale diyetisyen"
- "Çanakkale boşanma avukatı fiyat"
- "Kepez fizyoterapist"

Ulusal platformlar bu aramalarda zayıftır. Tüm SEO ve içerik stratejisi buraya odaklanır.

**Ürünün kendisi savunulabilir değildir** (takvim + CRM + profil, kolayca kopyalanır). Savunulabilir olan: yerel içerik birikimi, dizin doluluğu ve exact-match domain.

---

## 12. Açık Riskler

1. **Panel kullanım sürtünmesi.** Hedef kitle panel açmayı sevmez. Randevu bildirimi e-posta + SMS ile gitmeli; panele girmek zorunlu olmamalı.
2. **Churn.** Uzman ilk 3 ayda randevu görmezse çıkar. Yıllık peşin satış bunu kısmen çözer.
3. **Manuel abonelik yönetimi** ~100 üyeden sonra ölçeklenmez. O noktada iyzico/Paddle entegrasyonu şart olur.
4. **Boş dizin.** Aşama 0 tamamlanmadan ücretli satışa çıkılmamalı.

---

## 13. Yol Haritası

**v1 (MVP)**
Profil + subdomain + randevu (platform içi) + danışan defteri + blog + açık dizin/arama + schema

**v2**
WhatsApp Business API, .ics export, öne çıkarma (sponsorlu listing), çoklu şehir

**v3**
Otomatik ödeme/abonelik, Google Business Profile senkronu
