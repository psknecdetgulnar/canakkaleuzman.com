# Çanakkaleuzman.com — Tasarım Sistemi

## 0. Konsept: "Bronz ve Boğaz"

Referans noktası Çanakkale'nin kendi materyalleri: Truva'nın patinalı bronzu, boğazın koyu suyu, kireç taşı, mürekkep.

**Karşı konumlandığı şey:** Doktortakvimi, Terapi365 ve benzeri dizinlerin görsel dili — beyaz zemin, parlak mavi buton, yuvarlak avatar, gölgeli kart, gülümseyen stok doktor fotoğrafı. Bu görsel dil ucuz durur ve uzmanı bir listedeki satıra indirger.

**Hedef his:** Bir uzmanın kendi web sitesi gibi durmalı. Bir dizinin içindeki satır gibi değil. Sadelik pahalı görünür; süs görünmez.

---

## 1. Renk Tokenları

```css
--ink:       #14181C;  /* Metin. Siyah değil, mürekkep. */
--strait:    #1F3A46;  /* Boğaz suyu. Koyu petrol. İkincil yüzey. */
--limestone: #EDE9E2;  /* Zemin. Krem değil, taş grisi. */
--bronze:    #8A6A3B;  /* Tek aksan. Altın değil, patinalı bronz. */
--paper:     #FAF9F7;  /* Kart / yüzey. */

/* Türetilmiş */
--hairline:  rgba(20, 24, 28, 0.08);
--muted:     rgba(20, 24, 28, 0.56);
```

### Kullanım Kuralı

Aksan rengi **yalnızca üç yerde** görünür:
1. Bağlantı (hover'da alt çizgi)
2. Aktif/seçili randevu slotu
3. Sayfadaki tek birincil eylem

Bunun dışında bronz yok. Bir sayfada iki bronz düğme varsa biri yanlıştır.

### Yasak

- Gradient (hiçbir yerde)
- Gölge (`box-shadow` sadece focus ring için)
- Sağlık mavisi (`#0066CC` ve akrabaları)
- Yeşil "onay" rengi — onay durumu metinle anlatılır

---

## 2. Tipografi

| Rol | Font | Yedek |
|---|---|---|
| Display | Newsreader | Georgia, serif |
| Gövde | Inter Tight | -apple-system, sans-serif |
| Utility (saat/tarih/sayı) | Inter Tight, `font-variant-numeric: tabular-nums` | — |

### Türkçe Glif Kuralı

Font seçiminde **ilk filtre Türkçe karakter desteğidir**, estetik ikincidir. `ğ ş ı İ ç ö ü` glifleri eksik veya bozuk olan hiçbir font kullanılmaz. Özellikle noktasız `ı` ve noktalı büyük `İ` kontrol edilir. Newsreader ve Inter Tight bu testi geçer.

### Tip Ölçeği

```css
--text-xs:   0.8125rem;  /* 13px — etiket, yardımcı metin */
--text-sm:   0.9375rem;  /* 15px — ikincil */
--text-base: 1.0625rem;  /* 17px — gövde */
--text-lg:   1.375rem;   /* 22px */
--text-xl:   2rem;       /* 32px — bölüm başlığı */
--text-2xl:  3rem;       /* 48px — uzman adı */

--leading-tight: 1.15;   /* display */
--leading-body:  1.6;    /* gövde ve blog */
```

Display face **seyrek** kullanılır: uzman adı, blog yazı başlığı, kategori başlığı. Başka hiçbir yerde.

Blog gövdesi: `max-width: 68ch`. Okunabilirlik, genişlikten önce gelir.

---

## 3. Layout

### Genel

```css
--radius: 2px;           /* Her yerde. Yuvarlak köşe yok. */
--gutter: 24px;
--measure: 1080px;       /* İçerik maks. genişlik */
```

Ayrım için **hairline çizgi**, kart değil. `border-bottom: 1px solid var(--hairline)`.

### Profil Sayfası

```
┌────────────────────────────────────────────┐
│  [ kapak görseli — üst %40, tam genişlik   │
│    DEĞİL, kenardan içeride, alt kenar      │
│    keskin ]                                │
│                                            │
│  ┌──────┐                                  │
│  │ port-│   AYŞE YILMAZ          (display) │
│  │ re   │   Klinik Psikolog                │
│  │ foto │   ─────────────  ← boğaz çizgisi │
│  └──────┘                                  │
│                                            │
│  Hakkında ─────────────────────────────    │
│  gövde metni, 68ch                         │
│                                            │
│  Hizmetler ────────────────────────────    │
│  · Bireysel terapi                         │
│  · Çift terapisi                           │
│                                            │
│  Randevu ──────────────────────────────    │
│  Pazartesi 12 Ağu                          │
│    09:00                                   │
│    10:30    ← hover: bronz alt çizgi       │
│    14:00                                   │
│                                            │
│  Yazılar ──────────────────────────────    │
│  Başlık (display)              12 Tem      │
│  Başlık (display)              04 Tem      │
└────────────────────────────────────────────┘
```

**Kritik detaylar:**
- Profil fotoğrafı **dikdörtgen, portre oranı (4:5)**, sola hizalı. Yuvarlak avatar dizin klişesidir, kullanılmaz.
- Kapak görseli tam genişlik değil; kenarlarda boşluk bırakır. Bu, "banner" değil "sayfa" hissi verir.
- Fotoğraf kapağa binmez. Kapağın altında başlar.

### Randevu Slotları

Takvim ızgarası **değil**. Tarihe göre gruplanmış dikey liste:

- Saat: `tabular-nums`, `--text-lg`
- Varsayılan: `--ink`, çizgisiz
- Hover: `text-decoration: underline; text-decoration-color: var(--bronze); text-underline-offset: 4px`
- Seçili: bronz metin + kalın alt çizgi
- Dolu slot listede görünmez (üstü çizili gösterilmez — gürültü)

Ay takvimi ızgarası hem mobilde bozulur hem de kullanıcıya boş kutular gösterir. Liste yalnızca var olanı gösterir.

---

## 4. Signature Öğe: Boğaz Çizgisi

Her uzman profilinde, isim bloğunun altında ince bir SVG: Çanakkale Boğazı'nın sadeleştirilmiş kıyı hattı, tek `1px` bronz çizgi. Uzmanın konumu bu hat üzerinde küçük bir nokta ile işaretlenir.

- Genişlik: isim bloğu genişliği
- Yükseklik: ~24px
- Nokta: `4px`, `--bronze`, dolu
- Çizgi: `--hairline` renginde, bronz değil (nokta öne çıksın)
- Animasyon yok. Statik.

**Neden:** Sayfadaki tek "cesur" öğe budur. Yerelliği dekorasyon değil, veri haline getirir — her profilde farklıdır çünkü konum farklıdır. Etrafındaki her şey sessiz kalır.

Bu öğe dışında hiçbir yerde illüstrasyon, ikon seti veya grafik kullanılmaz.

---

## 5. Dizin & Kategori Sayfaları

- Kart yok. Her uzman bir **satır**: portre fotoğraf (48×60), isim (display), branş, ilçe.
- Satırlar arası hairline.
- Hover: satır zemini `--paper`'a döner. Ölçek/gölge animasyonu yok.
- Filtre: üstte yatay, düz metin bağlantılar. Dropdown yok, chip yok.

Grid layout dizini "ürün kataloğu" gibi gösterir. Satır listesi "künye" gibi gösterir — premium olan ikincisi.

---

## 6. Hareket

Toplam animasyon bütçesi düşük:

- Sayfa geçişi: `opacity` 160ms
- Hover: `text-decoration-color` 120ms
- Başka hiçbir şey

`prefers-reduced-motion: reduce` tam desteklenir; yukarıdakiler de kapanır.

Scroll-triggered reveal, parallax, sayı sayacı, fade-in-up **kullanılmaz**. Bunlar 2020 portfolyo dilidir ve AI-üretimi hissi verir.

---

## 7. Metin Dili (Copy)

Arayüz metni tasarım malzemesidir, dekorasyon değil.

| Kötü | İyi |
|---|---|
| Hemen Randevu Al! | Randevu talep et |
| Gönder | Talebi gönder |
| Başarıyla gönderildi 🎉 | Talep gönderildi |
| Profilinizi oluşturun | Profil oluştur |
| Bir hata oluştu | Bu saat artık dolu. Başka bir saat seçin. |

Kurallar:
- Ünlem yok, emoji yok
- Cümle düzeni: büyük harf sadece ilk kelimede
- Eylem adı akış boyunca değişmez: `Randevu talep et` → toast `Talep gönderildi`
- Hata mesajı özür dilemez, ne olduğunu ve ne yapılacağını söyler
- Boş ekran bir davettir: "Henüz yazı yok." değil, "İlk yazını ekle."

---

## 8. Kalite Zemini

Duyurulmadan sağlanır:

- Mobilde 360px'e kadar bozulmadan çalışır
- Klavye focus'u görünür: `outline: 2px solid var(--bronze); outline-offset: 2px`
- Kontrast: gövde metni AA, büyük metin AA
- `--ink` üzerine `--limestone` ve tersi test edilmiştir
- Görsellerde `alt`: `"{İsim} — Çanakkale {Branş}"`
- Font yüklenene kadar `font-display: swap`, layout shift yok

---

## 9. Bileşen Envanteri (v1 tamamı)

Bundan fazlası yok:

1. `SiteHeader` — logo (kelime işareti, display face), kategori bağlantıları
2. `ExpertRow` — dizin satırı
3. `ProfileHeader` — kapak + portre + isim + boğaz çizgisi
4. `Section` — hairline başlıklı içerik bloğu
5. `SlotList` — tarihe göre gruplanmış randevu saatleri
6. `RequestForm` — ad, telefon, not, tek buton
7. `PostList` / `PostBody` — blog
8. `Footer` — hairline üstü, tek satır

İkon seti yok. Kart bileşeni yok. Modal yok (form sayfa içinde).

---

## 10. Uygulama Notu

Tailwind kullanılıyorsa: yukarıdaki tokenlar `tailwind.config` içine `theme.extend` olarak yazılır ve **yalnızca bunlar** kullanılır. `bg-blue-500`, `rounded-lg`, `shadow-md` gibi varsayılan sınıflar projede yasaktır — bir lint kuralıyla engellenebilir.

Bu sistemin tamamı bir sayfada test edilir: **bir uzman profili**. Orada çalışmıyorsa hiçbir yerde çalışmaz.
