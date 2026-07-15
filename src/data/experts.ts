import type { CategorySlug } from "./categories";
import { generatedExperts, generatedExtras } from "./experts.generated";

export type Expert = {
  id: string;
  name: string;
  title: string;
  category: CategorySlug;
  categoryLabel: string;
  district: string;
  rating: number;
  reviewCount: number;
  initials: string;
  bio: string;
  services: string[];
  // Premium: iletişim bilgileri ve doğrudan dönüşüm araçları (telefon, e-posta,
  // WhatsApp, sosyal linkler, web sitesi) yalnızca premium'da halka açık
  // gösterilir ve panelde düzenlenebilir. Free profilde bu alanlar salt-okunur.
  premium: boolean;
  verified?: boolean;  // admin onaylı "Doğrulanmış" rozeti
  sponsored?: boolean; // dizinde öne çıkarılır (etiketli)
};

// ── Zengin profil modeli (sosyal-medya tadında üye sayfası) ──
export type SocialType = "instagram" | "youtube" | "linkedin" | "facebook" | "x" | "web";
export type SocialLink = { type: SocialType; url: string };
export type ExpertReview = { author: string; rating: number; body: string; date: string };
export type PortfolioItem = { title: string; description: string; tag?: string };
export type ProfileSectionKey = "about" | "expertise" | "reviews" | "portfolio";

export type ExpertProfile = Expert & {
  slug: string;
  firm: string | null;
  yearsExperience: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  socials: SocialLink[];
  longBio: string[];
  expertiseAreas: string[];
  reviews: ExpertReview[];
  portfolio: PortfolioItem[];
  stats: { label: string; value: string }[];
  // Her bölüm public/gizli — panelden yönetilir (Tumblr/Facebook mantığı)
  visibility: Record<ProfileSectionKey, boolean>;
};

const baseExperts: Expert[] = [
  {
    id: "ayse-demir",
    name: "Ayşe Demir",
    title: "Klinik Psikolog",
    category: "psikoloji",
    categoryLabel: "Psikoloji & Psikoterapi",
    district: "Merkez",
    rating: 5,
    reviewCount: 23,
    initials: "AD",
    bio: "Yetişkin terapisi, kaygı ve ilişki sorunları alanlarında Çanakkale merkezde danışan kabul eder.",
    services: ["Bireysel terapi", "Kaygı çalışmaları", "İlişki danışmanlığı"],
    premium: true,
  },
  {
    id: "mehmet-yildiz",
    name: "Mehmet Yıldız",
    title: "Diyetisyen",
    category: "beslenme",
    categoryLabel: "Beslenme & Diyet",
    district: "Merkez",
    rating: 5,
    reviewCount: 18,
    initials: "MY",
    bio: "Sürdürülebilir beslenme, kilo yönetimi ve klinik diyetetik üzerine çalışır.",
    services: ["Kilo yönetimi", "Sporcu beslenmesi", "Klinik beslenme"],
    premium: true,
  },
  {
    id: "zeynep-kaya",
    name: "Zeynep Kaya",
    title: "Avukat",
    category: "hukuk",
    categoryLabel: "Hukuk & Danışmanlık",
    district: "Merkez",
    rating: 5,
    reviewCount: 31,
    initials: "ZK",
    bio: "Aile hukuku, iş hukuku ve sözleşme danışmanlığı alanlarında hizmet verir.",
    services: ["Aile hukuku", "İş hukuku", "Sözleşme danışmanlığı"],
    premium: true,
  },
  {
    id: "caner-akin",
    name: "Caner Akın",
    title: "Fizyoterapist",
    category: "saglik",
    categoryLabel: "Sağlık Hizmetleri",
    district: "Kepez",
    rating: 5,
    reviewCount: 27,
    initials: "CA",
    bio: "Manuel terapi, ortopedik rehabilitasyon ve spor yaralanmaları üzerine çalışır.",
    services: ["Manuel terapi", "Ortopedik rehabilitasyon", "Spor yaralanmaları"],
    premium: true,
  },
  {
    id: "elif-sari",
    name: "Elif Sarı",
    title: "Yaşam Koçu",
    category: "kisisel-gelisim",
    categoryLabel: "Kişisel Gelişim & Yaşam",
    district: "Merkez",
    rating: 5,
    reviewCount: 15,
    initials: "ES",
    bio: "Yaşam dengesi, hedef belirleme ve bireysel gelişim süreçlerinde danışmanlık verir.",
    services: ["Yaşam koçluğu", "Hedef planlama", "Kişisel gelişim"],
    premium: true,
  },
  {
    id: "burak-sahin",
    name: "Burak Şahin",
    title: "Eğitim Koçu",
    category: "egitim",
    categoryLabel: "Eğitim & Koçluk",
    district: "Biga",
    rating: 4.9,
    reviewCount: 16,
    initials: "BŞ",
    bio: "Sınav hazırlığı, çalışma planı ve öğrenci motivasyonu alanlarında destek sağlar.",
    services: ["Sınav koçluğu", "Çalışma planı", "Öğrenci motivasyonu"],
    premium: true,
  },
  {
    id: "deniz-aksoy",
    name: "Deniz Aksoy",
    title: "Çocuk ve Ergen Psikoloğu",
    category: "psikoloji",
    categoryLabel: "Psikoloji & Psikoterapi",
    district: "Merkez",
    rating: 5,
    reviewCount: 21,
    initials: "DA",
    bio: "Okul çağı ve ergenlik dönemindeki çocuklarla oyun temelli ve bilişsel yaklaşımlarla çalışır.",
    services: ["Çocuk değerlendirmesi", "Ergen danışmanlığı", "Aile görüşmesi"],
    premium: true,
  },
  {
    id: "hakan-demirtas",
    name: "Hakan Demirtaş",
    title: "İngilizce Öğretmeni",
    category: "egitim",
    categoryLabel: "Eğitim & Koçluk",
    district: "Merkez",
    rating: 4.9,
    reviewCount: 34,
    initials: "HD",
    bio: "YDS, IELTS ve genel İngilizce alanında birebir ve küçük grup dersleri verir.",
    services: ["IELTS hazırlık", "YDS hazırlık", "Konuşma pratiği"],
    premium: true,
  },
  {
    id: "seda-koc",
    name: "Seda Koç",
    title: "Beslenme Uzmanı",
    category: "beslenme",
    categoryLabel: "Beslenme & Diyet",
    district: "Kepez",
    rating: 5,
    reviewCount: 12,
    initials: "SK",
    bio: "Gebelik ve emzirme dönemi beslenmesi ile bitkisel ağırlıklı beslenme programları hazırlar.",
    services: ["Gebelik beslenmesi", "Bitkisel beslenme", "Online danışmanlık"],
    premium: true,
  },
  {
    id: "okan-erol",
    name: "Okan Erol",
    title: "Spor Fizyoterapisti",
    category: "saglik",
    categoryLabel: "Sağlık Hizmetleri",
    district: "Biga",
    rating: 4.8,
    reviewCount: 19,
    initials: "OE",
    bio: "Sporcularda yaralanma önleme, dönüş programları ve performans destekli rehabilitasyon uygular.",
    services: ["Sporcu rehabilitasyonu", "Yaralanma önleme", "Performans testi"],
    premium: true,
  },
];

// Temel (elle) + üretilen uzmanlar birleşik dizin.
export const experts: Expert[] = [...baseExperts, ...generatedExperts];

// Uzman başına zengin profil içeriği (id → ek alanlar). Eksik olanlar
// getExpertProfile içinde makul varsayılanlarla tamamlanır.
type ProfileExtra = Partial<Omit<ExpertProfile, keyof Expert | "slug">>;

const PROFILE_EXTRAS: Record<string, ProfileExtra> = {
  "ayse-demir": {
    firm: "Deniz Psikoloji",
    yearsExperience: 9,
    phone: "0286 217 00 42",
    whatsapp: "905078207422",
    email: "ayse.demir@canakkaleuzman.com",
    socials: [{ type: "instagram", url: "https://instagram.com/" }],
    longBio: [
      "Çanakkale merkezde yetişkinlerle çalışan bir klinik psikoloğum. Kaygı, ilişki güçlükleri ve yas süreçlerinde bilişsel davranışçı ve şema terapi yaklaşımlarını birlikte kullanıyorum.",
      "Görüşmeler yüz yüze veya online yürütülür. İlk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
    ],
    expertiseAreas: ["Yetişkin psikoterapisi", "Kaygı ve panik", "Çift terapisi", "Yas danışmanlığı"],
    reviews: [
      { author: "M. K.", rating: 5, body: "Süreç boyunca çok destekleyiciydi, kendimi güvende hissettim.", date: "2026-05-12" },
      { author: "S. A.", rating: 5, body: "Kaygımı yönetmeyi gerçekten öğrendim. Teşekkürler.", date: "2026-04-03" },
    ],
    portfolio: [
      { title: "Bireysel Terapi", description: "Kaygı, stres ve ilişki odaklı bireysel görüşmeler.", tag: "Yüz yüze / Online" },
      { title: "Çift Terapisi", description: "İletişim ve çatışma çözümü odaklı çift görüşmeleri.", tag: "Yüz yüze" },
    ],
  },
  "mehmet-yildiz": {
    firm: "Denge Beslenme",
    yearsExperience: 7,
    phone: "0286 213 55 10",
    whatsapp: "905000000001",
    email: "mehmet.yildiz@canakkaleuzman.com",
    socials: [{ type: "instagram", url: "https://instagram.com/" }],
    longBio: [
      "Çanakkale merkezde klinik diyetetik ve sürdürülebilir beslenme üzerine çalışan bir diyetisyenim. Katı yasak listeleri yerine, danışanın günlük hayatına oturan ve kalıcı olan beslenme düzenleri kurmayı hedefliyorum.",
      "Kilo yönetimi, insülin direnci ve sporcu beslenmesi ana çalışma alanlarım. İlk görüşmede detaylı öykü alınır; gerekli durumlarda laboratuvar sonuçlarıyla birlikte değerlendirme yapılır.",
      "Görüşmeler yüz yüze veya online yürütülür; kontrol randevularıyla süreç birlikte takip edilir.",
    ],
    expertiseAreas: ["Kilo yönetimi", "İnsülin direnci", "Sporcu beslenmesi", "Çocuk beslenmesi"],
    reviews: [
      { author: "E. T.", rating: 5, body: "Üç ayda hedefime ulaştım, hiç aç kalmadan. Sistemli ve motive edici.", date: "2026-05-20" },
      { author: "B. D.", rating: 5, body: "İnsülin direnci değerlerim normale döndü. Takibi çok düzenli.", date: "2026-03-14" },
    ],
    portfolio: [
      { title: "Kişiye Özel Diyet", description: "Laboratuvar sonuçlarına göre bireysel program.", tag: "4-12 hafta" },
      { title: "Sporcu Beslenmesi", description: "Antrenman dönemine göre beslenme planı.", tag: "Online destek" },
      { title: "Online Takip", description: "Haftalık kontrol ve program güncellemesi.", tag: "Online" },
    ],
  },
  "zeynep-kaya": {
    firm: "Kaya Hukuk",
    yearsExperience: 11,
    phone: "0286 214 21 00",
    whatsapp: "905000000003",
    email: "zeynep.kaya@canakkaleuzman.com",
    longBio: [
      "On bir yıldır Çanakkale Barosu'na bağlı olarak aile hukuku, iş hukuku ve sözleşme danışmanlığı alanlarında çalışıyorum. Ofisim Çanakkale merkezdedir; çevre ilçelerdeki duruşmalara da katılırım.",
      "Boşanma, velayet, nafaka ve mal paylaşımı davalarında; işçi alacakları ve işe iade süreçlerinde dava ve danışmanlık hizmeti veriyorum. İlk görüşmede sürecin muhtemel adımları, süresi ve maliyeti açıkça konuşulur.",
    ],
    expertiseAreas: ["Aile hukuku", "İş hukuku", "Sözleşmeler", "Miras hukuku"],
    reviews: [
      { author: "H. Y.", rating: 5, body: "Sürecin her aşamasında net bilgilendirme yaptı.", date: "2026-06-01" },
      { author: "K. A.", rating: 5, body: "İşe iade davamı kazandık. İletişimi çok güçlü.", date: "2026-02-18" },
    ],
    portfolio: [
      { title: "Boşanma & Velayet", description: "Anlaşmalı ve çekişmeli boşanma süreçleri.", tag: "Dava + Danışmanlık" },
      { title: "İş Hukuku", description: "İşçi-işveren uyuşmazlıkları ve alacaklar.", tag: "Danışmanlık" },
      { title: "Sözleşme İncelemesi", description: "Kira, hizmet ve ticari sözleşme denetimi.", tag: "Danışmanlık" },
    ],
  },
  "caner-akin": {
    firm: "Kepez Fizyoterapi",
    yearsExperience: 6,
    phone: "0286 218 40 20",
    whatsapp: "905000000002",
    email: "caner.akin@canakkaleuzman.com",
    longBio: [
      "Kepez'deki kliniğimde manuel terapi ve ortopedik rehabilitasyon üzerine çalışıyorum. Ameliyat sonrası iyileşme, bel-boyun ağrıları ve spor yaralanmalarında bireye özel tedavi programları hazırlıyorum.",
      "Her danışan için değerlendirme seansıyla başlarız; tedavi planı ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
    ],
    expertiseAreas: ["Manuel terapi", "Ortopedik rehabilitasyon", "Spor yaralanmaları", "Postür analizi"],
    reviews: [
      { author: "S. Ö.", rating: 5, body: "Bel fıtığı ağrılarım altı haftada büyük ölçüde geçti.", date: "2026-04-22" },
      { author: "R. G.", rating: 5, body: "Menisküs ameliyatı sonrası sahaya döndüm. Çok ilgili.", date: "2026-01-30" },
    ],
    portfolio: [
      { title: "Manuel Terapi", description: "Eklem ve yumuşak doku mobilizasyonu.", tag: "Klinikte" },
      { title: "Ameliyat Sonrası Rehabilitasyon", description: "Ortopedik cerrahi sonrası dönüş programı.", tag: "6-12 hafta" },
      { title: "Sporcu Takibi", description: "Yaralanma önleme ve performans desteği.", tag: "Saha + Klinik" },
    ],
  },
  "elif-sari": {
    firm: "Sarı Koçluk",
    yearsExperience: 5,
    phone: "0286 212 80 15",
    whatsapp: "905000000004",
    email: "elif.sari@canakkaleuzman.com",
    socials: [
      { type: "instagram", url: "https://instagram.com/" },
      { type: "linkedin", url: "https://linkedin.com/" },
    ],
    longBio: [
      "Bireylerin yaşam dengesi kurması, hedef belirlemesi ve bu hedeflere adım adım ilerlemesi için birebir koçluk yapıyorum. ICF onaylı koçluk eğitimimi 2021'de tamamladım.",
      "Görüşmeler haftalık düzendedir; her seans sonunda somut bir eylem planı çıkar. Kariyer geçişi, erteleme ve öncelik yönetimi en sık çalıştığım konulardır.",
    ],
    expertiseAreas: ["Yaşam koçluğu", "Hedef planlama", "Kariyer geçişi", "Öncelik yönetimi"],
    reviews: [
      { author: "D. M.", rating: 5, body: "Altı seansta iş değişikliği kararımı netleştirdim.", date: "2026-05-05" },
    ],
    portfolio: [
      { title: "Birebir Koçluk", description: "Haftalık görüşme ve eylem planı takibi.", tag: "Online / Yüz yüze" },
      { title: "Kariyer Geçişi", description: "Yeni alana geçiş için yol haritası.", tag: "8 seans" },
    ],
  },
  "burak-sahin": {
    firm: null,
    yearsExperience: 8,
    phone: "0286 316 42 00",
    whatsapp: "905000000005",
    email: "burak.sahin@canakkaleuzman.com",
    socials: [{ type: "youtube", url: "https://youtube.com/" }],
    longBio: [
      "Biga'da sekiz yıldır öğrenci koçluğu yapıyorum. YKS ve LGS hazırlık sürecindeki öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Amacım öğrencinin kendi çalışma sistemini kurması; hazır kalıplar yerine öğrencinin gün akışına ve hedef netine göre plan çıkarıyorum. Veli bilgilendirmesi sürecin parçasıdır.",
    ],
    expertiseAreas: ["Sınav koçluğu", "YKS hazırlık", "LGS hazırlık", "Çalışma planı", "Öğrenci motivasyonu"],
    reviews: [
      { author: "Z. K. (veli)", rating: 5, body: "Oğlum ilk kez düzenli çalışmaya başladı. Netleri belirgin arttı.", date: "2026-06-10" },
      { author: "A. Ç.", rating: 4, body: "Deneme analizleri çok işime yaradı, hedefimi netleştirdim.", date: "2026-04-01" },
    ],
    portfolio: [
      { title: "YKS Koçluğu", description: "Haftalık plan, deneme analizi, birebir takip.", tag: "12. sınıf / mezun" },
      { title: "LGS Koçluğu", description: "8. sınıf öğrencisine özel çalışma düzeni.", tag: "Veli raporu" },
    ],
  },
  "deniz-aksoy": {
    firm: "Aksoy Çocuk Psikolojisi",
    yearsExperience: 7,
    phone: "0286 214 90 60",
    whatsapp: "905000000006",
    email: "deniz.aksoy@canakkaleuzman.com",
    socials: [{ type: "instagram", url: "https://instagram.com/" }],
    longBio: [
      "Okul çağı ve ergenlik dönemindeki çocuklarla çalışan bir psikoloğum. Oyun temelli teknikler ve bilişsel davranışçı yaklaşımı yaşa göre harmanlıyorum.",
      "Kaygı, okul uyumu, dikkat güçlükleri ve sınav stresi en sık çalıştığım alanlar. Süreç her zaman aile görüşmesiyle başlar; okul iş birliği gerektiğinde öğretmenle de iletişim kurulur.",
    ],
    expertiseAreas: ["Çocuk değerlendirmesi", "Ergen danışmanlığı", "Kaygı", "Okul uyumu", "Aile görüşmesi"],
    reviews: [
      { author: "N. B. (veli)", rating: 5, body: "Kızımın okul kaygısı birkaç ayda görünür şekilde azaldı.", date: "2026-05-28" },
      { author: "T. E. (veli)", rating: 5, body: "Süreci bize de çok iyi anlattı, evde ne yapacağımızı bildik.", date: "2026-03-07" },
    ],
    portfolio: [
      { title: "Çocuk Değerlendirmesi", description: "Gelişim ve duygusal değerlendirme seansları.", tag: "6-12 yaş" },
      { title: "Ergen Danışmanlığı", description: "Birebir görüşme ve aile geri bildirimi.", tag: "13-18 yaş" },
    ],
  },
  "hakan-demirtas": {
    firm: null,
    yearsExperience: 12,
    phone: "0286 213 70 25",
    whatsapp: "905000000007",
    email: "hakan.demirtas@canakkaleuzman.com",
    socials: [{ type: "youtube", url: "https://youtube.com/" }],
    longBio: [
      "On iki yıldır İngilizce öğretiyorum; son beş yıldır ağırlıklı olarak IELTS ve YDS hazırlığı yapıyorum. Dersler birebir veya en fazla dört kişilik gruplarla yürür.",
      "İlk derste seviye tespiti yapılır ve hedef puana göre haftalık program çıkarılır. Konuşma pratiği her programın zorunlu parçasıdır.",
    ],
    expertiseAreas: ["IELTS", "YDS", "Genel İngilizce", "Konuşma pratiği", "Akademik yazma"],
    reviews: [
      { author: "G. S.", rating: 5, body: "IELTS 7.5 aldım. Yazma bölümündeki geri bildirimleri çok değerliydi.", date: "2026-06-15" },
      { author: "M. U.", rating: 5, body: "YDS 85+. Programı harfiyen uygulamak yetti.", date: "2026-02-25" },
    ],
    portfolio: [
      { title: "IELTS Hazırlık", description: "Hedef puana göre 8-16 haftalık program.", tag: "Birebir" },
      { title: "Konuşma Kulübü", description: "Haftalık küçük grup konuşma pratiği.", tag: "4 kişi" },
    ],
  },
  "seda-koc": {
    firm: null,
    yearsExperience: 4,
    phone: "0286 212 90 30",
    whatsapp: "905000000008",
    email: "seda.koc@canakkaleuzman.com",
    socials: [{ type: "instagram", url: "https://instagram.com/" }],
    longBio: [
      "Gebelik ve emzirme dönemi beslenmesi ile bitkisel ağırlıklı beslenme programları hazırlıyorum. Görüşmeler online veya Kepez'deki ofiste yapılır.",
      "Amacım kısa süreli diyetler değil; döneme ve yaşam tarzına uyan, sürdürülebilir bir beslenme düzeni kurmak.",
    ],
    expertiseAreas: ["Gebelik beslenmesi", "Emzirme dönemi", "Bitkisel beslenme", "Online danışmanlık"],
    reviews: [
      { author: "P. A.", rating: 5, body: "Gebeliğim boyunca kilo kontrolüm çok rahat geçti.", date: "2026-04-18" },
    ],
    portfolio: [
      { title: "Gebelik Programı", description: "Trimester bazlı beslenme takibi.", tag: "9 ay" },
      { title: "Online Danışmanlık", description: "Görüntülü görüşme ve haftalık plan.", tag: "Online" },
    ],
  },
  "okan-erol": {
    firm: "Biga Spor Sağlığı",
    yearsExperience: 9,
    phone: "0286 316 55 40",
    whatsapp: "905000000009",
    email: "okan.erol@canakkaleuzman.com",
    longBio: [
      "Dokuz yıldır sporcularla çalışıyorum; amatör ve profesyonel seviyede futbol, basketbol ve atletizm sporcularının yaralanma sonrası dönüş programlarını yürütüyorum.",
      "Tedavi kadar yaralanma önlemeye de odaklanırım: hareket analizi ve kuvvet testleriyle risk haritası çıkarır, antrenman programına entegre öneriler veririm.",
    ],
    expertiseAreas: ["Sporcu rehabilitasyonu", "Yaralanma önleme", "Dönüş programları", "Performans testi"],
    reviews: [
      { author: "F. Y.", rating: 5, body: "Çapraz bağ ameliyatı sonrası dokuz ayda sahaya döndüm.", date: "2026-05-02" },
      { author: "C. T.", rating: 4, body: "Test ve ölçümleri çok profesyonel. Programı takip etmek kolay.", date: "2026-01-12" },
    ],
    portfolio: [
      { title: "Dönüş Programı", description: "Ameliyat/yaralanma sonrası kademeli saha dönüşü.", tag: "12-36 hafta" },
      { title: "Risk Analizi", description: "Hareket taraması ve kuvvet dengesi testi.", tag: "Sezon öncesi" },
    ],
  },
};

export function getExpertProfile(base: Expert): ExpertProfile {
  const x = PROFILE_EXTRAS[base.id] ?? (generatedExtras[base.id] as ProfileExtra | undefined) ?? {};
  return {
    ...base,
    slug: base.id,
    firm: x.firm ?? null,
    yearsExperience: x.yearsExperience ?? 3,
    phone: x.phone ?? null,
    whatsapp: x.whatsapp ?? null,
    email: x.email ?? null,
    website: x.website ?? null,
    socials: x.socials ?? [],
    longBio: x.longBio ?? [base.bio],
    expertiseAreas: x.expertiseAreas ?? base.services,
    reviews: x.reviews ?? [],
    portfolio: x.portfolio ?? base.services.map((s) => ({ title: s, description: `${base.name} tarafından sunulan ${s.toLocaleLowerCase("tr")} hizmeti.` })),
    stats: x.stats ?? [
      { label: "Değerlendirme", value: `${base.reviewCount}` },
      { label: "Puan", value: base.rating.toFixed(1) },
    ],
    visibility: x.visibility ?? { about: true, expertise: true, reviews: true, portfolio: true },
  };
}

export function getExpertProfileBySlug(slug: string): ExpertProfile | null {
  const base = experts.find((e) => e.id === slug);
  return base ? getExpertProfile(base) : null;
}
