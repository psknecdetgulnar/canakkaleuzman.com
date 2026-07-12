export type CategorySlug =
  | "psikoloji"
  | "saglik"
  | "hukuk"
  | "egitim"
  | "beslenme"
  | "kisisel-gelisim";

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "psikoloji",
    name: "Psikoloji & Psikoterapi",
    shortName: "Psikoloji",
    description: "Terapi, danışmanlık ve psikolojik destek.",
  },
  {
    slug: "saglik",
    name: "Sağlık Hizmetleri",
    shortName: "Sağlık",
    description: "Fizyoterapi ve tamamlayıcı sağlık hizmetleri.",
  },
  {
    slug: "hukuk",
    name: "Hukuk & Danışmanlık",
    shortName: "Hukuk",
    description: "Avukatlık, arabuluculuk ve profesyonel danışmanlık.",
  },
  {
    slug: "egitim",
    name: "Eğitim & Koçluk",
    shortName: "Eğitim",
    description: "Eğitim danışmanlığı, sınav ve kariyer koçluğu.",
  },
  {
    slug: "beslenme",
    name: "Beslenme & Diyet",
    shortName: "Beslenme",
    description: "Diyet, kilo yönetimi ve sağlıklı yaşam planları.",
  },
  {
    slug: "kisisel-gelisim",
    name: "Kişisel Gelişim & Yaşam",
    shortName: "Yaşam",
    description: "Yaşam koçluğu ve bireysel gelişim desteği.",
  },
];

// Gerçek uzman verisindeki tüm ilçeler (deneyim veya uzman ekleme sırasında
// burada olmayan bir ilçe kullanılırsa filtre listesi otomatik tutarsızlaşır —
// bu listeyi her zaman gerçek expert.district değerleriyle eşleştir).
export const districts = [
  "Merkez",
  "Kepez",
  "Biga",
  "Gelibolu",
  "Ezine",
  "Çan",
  "Ayvacık",
  "Bayramiç",
  "Lapseki",
  "Yenice",
] as const;
