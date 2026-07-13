Mevcut Çanakkale Uzman projesi için eksiksiz, ölçeklenebilir ve profesyonel bir admin paneli geliştir.

Önce mevcut proje yapısını, kullanılan framework’ü, veritabanını, authentication sistemini, mevcut admin ekranlarını, tabloları, API yapılarını ve component sistemini analiz et. Mevcut çalışan yapıyı bozma. Var olan admin paneli zayıf veya eksikse gerekli bölümleri yeniden yapılandır.

## Ana hedef

Platformun tamamının tek bir yönetim panelinden kontrol edilebildiği kapsamlı bir yönetim sistemi oluştur.

Admin paneli sadece içerik düzenleyen basit bir ekran olmasın. Platform yönetimi, kullanıcı yönetimi, uzman yönetimi, ilan yönetimi, moderasyon, ödeme takibi, SEO, analitik, bildirim, güvenlik ve sistem ayarlarını kapsayan merkezi bir operasyon paneli olsun.

## Yetkilendirme sistemi

Rol bazlı yetkilendirme oluştur:

* Super Admin
* Admin
* Editör
* Moderatör
* Destek Yetkilisi
* Finans Yetkilisi
* SEO / İçerik Yetkilisi

Super Admin tüm yetkilere sahip olsun.

Ancak güvenlik açısından şu kurallar zorunlu olsun:

* Her yönetim işlemi audit log olarak kaydedilsin.
* Hangi adminin, ne zaman, hangi kaydı, nasıl değiştirdiği görülebilsin.
* Kritik işlemler için onay modalı gösterilsin.
* Kalıcı silme işlemleri varsayılan olarak kapalı olsun.
* Öncelikle soft delete kullanılsın.
* Silinen kayıtlar geri alınabilsin.
* Rol ve izin değişiklikleri ayrıca loglansın.
* Super Admin hesabı normal adminler tarafından silinemesin veya yetkisi düşürülemesin.
* Hassas işlemlerde yeniden şifre doğrulaması veya ikinci onay mekanizması kullanılabilecek şekilde mimari kurulsun.

## Admin dashboard

Ana panelde şu özetler yer alsın:

* Toplam kullanıcı sayısı
* Toplam uzman sayısı
* Onay bekleyen uzmanlar
* Yayındaki uzman profilleri
* Askıya alınmış profiller
* Yeni üyelikler
* Günlük, haftalık ve aylık ziyaretçi sayısı
* Profil görüntülenme sayıları
* Telefon tıklamaları
* WhatsApp tıklamaları
* E-posta tıklamaları
* Yol tarifi tıklamaları
* Paylaşım sayıları
* En çok görüntülenen uzmanlar
* En çok aranan kategoriler
* En çok aranan ilçeler
* Aktif ilanlar
* Onay bekleyen ilanlar
* Bildirilen içerikler
* Ödeme durumu
* Aboneliği bitecek uzmanlar
* Sistem uyarıları
* Son admin işlemleri

Tarih filtresi ekle:

* Bugün
* Son 7 gün
* Son 30 gün
* Bu ay
* Özel tarih aralığı

## Uzman yönetimi

Uzmanlarla ilgili tam kontrol sağla.

Admin şunları yapabilsin:

* Uzman ekleme
* Uzman düzenleme
* Uzman silme
* Uzmanı askıya alma
* Uzmanı yayından kaldırma
* Uzmanı tekrar yayına alma
* Uzman hesabına geçici olarak erişme veya “uzman olarak görüntüle” modu
* Profil ön izlemesi
* Profil doğrulama
* Belge kontrolü
* Onay veya ret işlemi
* Ret gerekçesi ekleme
* Öne çıkarma
* Sponsorlu uzman olarak işaretleme
* Rozet verme
* Doğrulanmış uzman rozeti verme
* Profil sıralamasını değiştirme
* İlçe ve kategori değiştirme
* Profil URL slug düzenleme
* Profil fotoğrafı değiştirme
* Kapak görseli değiştirme
* Uzmanlık alanları ekleme
* Hizmetler ekleme
* Çalışma saatleri düzenleme
* İletişim bilgileri düzenleme
* Sosyal medya bağlantıları düzenleme
* Harita konumu düzenleme
* SEO başlığı ve açıklaması düzenleme
* Uzman adına profil paylaşım kartı oluşturma
* Profil görüntülenme ve dönüşüm verilerini inceleme

Uzman listesinde gelişmiş filtreler olsun:

* İsim
* Meslek
* Kategori
* İlçe
* Üyelik durumu
* Onay durumu
* Doğrulama durumu
* Abonelik planı
* Kayıt tarihi
* Son giriş tarihi
* Profil tamamlanma oranı
* Görüntülenme sayısı
* Sponsorlu / organik
* Aktif / pasif / askıda

Toplu işlemler ekle:

* Toplu onay
* Toplu askıya alma
* Toplu kategori değiştirme
* Toplu e-posta gönderme
* Toplu bildirim gönderme
* Toplu dışa aktarma
* Toplu etiket ekleme

## Kullanıcı yönetimi

Tüm kullanıcı hesapları yönetilebilsin.

Admin şunları yapabilsin:

* Kullanıcı listeleme
* Kullanıcı detayını görüntüleme
* Hesap durumunu değiştirme
* E-posta doğrulama durumunu görme
* Son giriş zamanını görme
* Kullanıcının favorilerini görme
* Kullanıcının oluşturduğu ilanları görme
* Kullanıcının bildirim geçmişini görme
* Şikâyet geçmişini görme
* Hesabı askıya alma
* Hesabı silme
* Şifre sıfırlama bağlantısı gönderme
* KVKK kapsamında veri dışa aktarma
* Kullanıcı verilerini anonimleştirme

## Kategori ve lokasyon yönetimi

Admin şu alanları yönetebilsin:

* Meslek kategorileri
* Alt kategoriler
* Uzmanlık alanları
* Hizmet türleri
* İlçeler
* Mahalleler
* Şehirler
* Kategori ikonları
* Kategori görselleri
* Kategori açıklamaları
* SEO başlıkları
* SEO açıklamaları
* URL slug alanları
* Sayfa sıralamaları
* Aktif / pasif durumu

Kategori yapısı sınırsız alt kategori destekleyebilecek şekilde tasarlansın.

## İçerik yönetimi

Admin panelinden şu içerikler yönetilebilsin:

* Blog yazıları
* Haberler
* Etkinlikler
* İş ilanları
* Nöbetçi eczaneler
* Duyurular
* Kampanyalar
* Sponsorlu içerikler
* Sık sorulan sorular
* Ana sayfa metinleri
* Statik sayfalar
* Banner alanları
* Popup duyuruları
* Footer içerikleri
* Menü bağlantıları

İçerik düzenleyicisinde şu özellikler olsun:

* Zengin metin editörü
* Taslak kaydetme
* Ön izleme
* Zamanlanmış yayınlama
* Yayından kaldırma
* Revizyon geçmişi
* Yazar bilgisi
* SEO alanları
* Open Graph alanları
* Canonical URL
* Schema türü seçimi
* Öne çıkan görsel
* Galeri
* Etiket sistemi

## İlan yönetimi

Etkinlik, iş ilanı ve diğer ilan tipleri için ortak ama esnek bir moderasyon sistemi oluştur.

Admin şunları yapabilsin:

* İlan ekleme
* İlan düzenleme
* Onaylama
* Reddetme
* Ret gerekçesi yazma
* Yayından kaldırma
* Öne çıkarma
* Sponsorlu işaretleme
* Bitiş tarihi belirleme
* Süresi dolan ilanları otomatik arşivleme
* İlan sahibini görüntüleme
* Şikâyetleri inceleme

## Nöbetçi eczane yönetimi

* Manuel eczane ekleme
* API veya veri kaynağından gelen kayıtları görüntüleme
* Hatalı kayıt düzeltme
* İlçe bazlı filtreleme
* Tarih bazlı listeleme
* Kaynak bilgisini görme
* Son güncelleme zamanını görme
* Veri çekme hatalarını görme
* Gerekirse manuel olarak veri yenileme
* Geçmiş nöbet kayıtlarını inceleme

## Abonelik ve ödeme yönetimi

Platform ücretli üyelik veya sponsorlu profil sistemine hazır olsun.

Admin şunları yönetebilsin:

* Abonelik planları
* Plan özellikleri
* Fiyatlar
* İndirimler
* Kuponlar
* Ücretsiz deneme süresi
* Abonelik başlangıç ve bitiş tarihi
* Manuel abonelik tanımlama
* Abonelik uzatma
* Abonelik iptali
* Ödeme durumu
* Başarılı ve başarısız ödemeler
* Fatura bilgileri
* İade işlemleri
* Sponsorlu profil paketleri
* Öne çıkarma paketleri

Ödeme altyapısı henüz yoksa sistem ileride iyzico, Stripe veya başka bir ödeme altyapısına bağlanabilecek şekilde soyutlanmış olsun.

## Bildirim sistemi

Admin panelinden şu kanallarda bildirim gönderilebilsin:

* Uygulama içi bildirim
* E-posta
* SMS entegrasyonuna hazır yapı
* Push notification entegrasyonuna hazır yapı

Bildirimler şu gruplara gönderilebilsin:

* Tüm kullanıcılar
* Tüm uzmanlar
* Belirli kategori
* Belirli ilçe
* Belirli abonelik planı
* Seçili kullanıcılar
* Pasif kullanıcılar
* Aboneliği bitecek kullanıcılar

Bildirim geçmişi ve teslim durumu görüntülensin.

## Şikâyet ve moderasyon

* Kullanıcı şikâyetleri
* Uzman şikâyetleri
* İçerik şikâyetleri
* Sahte profil bildirimleri
* Yanlış bilgi bildirimleri
* Uygunsuz içerik bildirimleri

Her şikâyet için:

* Durum
* Öncelik
* Atanan admin
* İç not
* Kullanıcıya verilen cevap
* Sonuç
* İşlem geçmişi

alanları bulunsun.

## SEO yönetimi

Admin panelinde merkezi SEO yönetimi oluştur.

Şunlar yönetilebilsin:

* Site genel SEO ayarları
* Sayfa başlıkları
* Meta açıklamalar
* Canonical URL
* Robots ayarları
* Sitemap yönetimi
* Open Graph ayarları
* Twitter Card ayarları
* Schema.org yapılandırmaları
* Kategori sayfası SEO alanları
* Uzman profil SEO alanları
* İlçe sayfası SEO alanları
* Blog SEO alanları
* 301 yönlendirmeleri
* 404 hata kayıtları
* Kırık bağlantılar
* Index / noindex ayarları

Toplu SEO düzenleme yapılabilsin.

## Medya kütüphanesi

* Görsel yükleme
* Dosya yükleme
* Klasörleme
* Görsel arama
* Dosya türüne göre filtreleme
* Kullanılmayan görselleri bulma
* Görsel sıkıştırma
* WebP veya AVIF dönüştürme
* Alt metin düzenleme
* Görsel başlığı ve açıklaması
* Dosya boyutu bilgisi
* Kullanıldığı sayfaları görüntüleme

## Sistem ayarları

Admin panelinden şu ayarlar değiştirilebilsin:

* Site adı
* Logo
* Favicon
* Marka renkleri
* İletişim bilgileri
* Sosyal medya bağlantıları
* E-posta ayarları
* Site bakım modu
* Yeni kayıtları açma veya kapatma
* Uzman başvurularını açma veya kapatma
* Otomatik onay ayarları
* Dosya yükleme limitleri
* Profil fotoğrafı limitleri
* Maksimum ilan süresi
* Varsayılan SEO ayarları
* Analitik entegrasyon kodları
* Google Tag Manager
* Google Analytics
* Search Console doğrulama kodları
* Meta Pixel
* E-posta servis ayarları
* API anahtarları için güvenli environment variable yapısı

API anahtarlarını veya gizli bilgileri doğrudan admin arayüzünde açık metin olarak gösterme.

## Analitik

Gelişmiş analitik ekranı oluştur.

Takip edilecek metrikler:

* Profil görüntülenmeleri
* Arama sonuçlarında görünme
* Telefon tıklamaları
* WhatsApp tıklamaları
* E-posta tıklamaları
* Web sitesi tıklamaları
* Yol tarifi tıklamaları
* Profil paylaşımı
* QR kod taraması
* Favoriye ekleme
* İlçe bazlı trafik
* Kategori bazlı trafik
* Organik trafik
* Direkt trafik
* Sosyal medya trafiği
* Dönüşüm oranları

Veriler grafik, tablo ve karşılaştırmalı rapor halinde gösterilsin.

CSV ve Excel dışa aktarma özelliği ekle.

## Arama ve filtreleme

Admin panelinin üst kısmında global arama alanı olsun.

Şunlarda arama yapabilsin:

* Uzmanlar
* Kullanıcılar
* İlanlar
* Blog yazıları
* Etkinlikler
* İş ilanları
* Eczaneler
* Şikâyetler
* Ödemeler

Büyük veri setlerinde server-side pagination, filtreleme ve sıralama kullan.

## Admin paneli tasarımı

* Modern
* Profesyonel
* Hızlı
* Mobil uyumlu
* Masaüstü odaklı
* Karanlık ve açık tema destekli
* Sol sidebar
* Üst navigasyon
* Breadcrumb
* Gelişmiş tablolar
* Modal ve drawer yapıları
* Toast bildirimleri
* Loading skeleton
* Boş durum ekranları
* Hata durumları
* Erişilebilir form alanları
* Tutarlı tasarım sistemi

Admin paneli halka açık sitenin tasarımından bağımsız ancak marka kimliğiyle uyumlu olsun.

## Teknik gereksinimler

* Mevcut authentication sistemini kullan.
* Admin yetkisini yalnızca frontend kontrolüne bırakma.
* Tüm yetki kontrollerini backend ve veritabanı seviyesinde uygula.
* API endpoint’lerini rol ve izin bazlı koru.
* Veritabanında gerekli admin role ve permission tablolarını oluştur.
* Gerekirse migration dosyaları hazırla.
* Row Level Security kullanılıyorsa doğru RLS politikalarını yaz.
* Form doğrulamalarını hem frontend hem backend tarafında yap.
* Kritik işlemleri transaction içinde gerçekleştir.
* Server-side pagination kullan.
* N+1 sorgu problemlerinden kaçın.
* Büyük tablolarda gerekli indexleri oluştur.
* Dosya yüklemelerinde tür ve boyut kontrolü yap.
* XSS, CSRF, IDOR, yetki yükseltme ve SQL injection risklerine karşı önlem al.
* Admin paneli URL’si kolay tahmin edilemeyen bir URL olabilir ancak güvenliği yalnızca URL gizliliğine bağlama.
* Session timeout ve güvenli çıkış sistemi oluştur.
* Mümkünse iki faktörlü doğrulamaya hazır bir yapı kur.

## Audit log sistemi

Her admin işlemi için şu bilgiler kaydedilsin:

* Admin kullanıcı ID
* İşlem türü
* Etkilenen kayıt türü
* Etkilenen kayıt ID
* Önceki veri
* Yeni veri
* IP adresi
* User agent
* Tarih ve saat
* İşlem sonucu

Audit log kayıtları normal adminler tarafından silinemesin.

## Uygulama sırası

Önce:

1. Mevcut projeyi analiz et.
2. Var olan admin paneli ve veritabanı yapısını incele.
3. Eksik tabloları ve modülleri tespit et.
4. Uygulanacak mimariyi kısa ve somut şekilde açıkla.
5. Gerekli veritabanı migrationlarını hazırla.
6. Authentication ve authorization sistemini kur.
7. Admin paneli layout ve navigasyonu oluştur.
8. Modülleri aşamalı olarak geliştir.
9. Her modülün çalıştığını test et.
10. Yetki açıklarını ve güvenlik problemlerini kontrol et.

Sadece tasarım veya mockup oluşturma. Özelliği gerçekten çalışan backend, veritabanı ve admin arayüzüyle birlikte geliştir.

Mevcut çalışan özellikleri bozma. Her önemli değişiklikten önce ilgili dosyaları incele. Tekrarlanan component veya geçici çözüm üretme. Kod kalitesini, yeniden kullanılabilirliği ve sürdürülebilirliği önceliklendir.


mevcut yapıyı bozma görevleri sırayla ve tek tek yap.