// OTOMATİK ÜRETİLDİ — scripts/gen-experts.mjs
import type { Expert } from "./experts";

type Extra = Record<string, unknown>;

export const generatedExperts: Expert[] = [
  {
    "id": "ahmet-yilmaz",
    "name": "Ahmet Yılmaz",
    "title": "Klinik Psikolog",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Merkez",
    "rating": 5,
    "reviewCount": 6,
    "initials": "AY",
    "bio": "Kaygı bozuklukları ve ilişki danışmanlığı alanlarında Çanakkale Merkez'de hizmet verir.",
    "services": [
      "Bireysel terapi",
      "Kaygı bozuklukları",
      "İlişki danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "mehmet-yilmaz",
    "name": "Mehmet Yılmaz",
    "title": "Ergoterapist",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Kepez",
    "rating": 5,
    "reviewCount": 13,
    "initials": "MY",
    "bio": "Spor yaralanmaları ve postür analizi alanlarında Çanakkale Kepez'de hizmet verir.",
    "services": [
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları",
      "Postür analizi"
    ],
    "premium": false
  },
  {
    "id": "mustafa-yilmaz",
    "name": "Mustafa Yılmaz",
    "title": "Arabulucu",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Biga",
    "rating": 4.9,
    "reviewCount": 20,
    "initials": "MY",
    "bio": "Miras hukuku ve icra takibi alanlarında Çanakkale Biga'de hizmet verir.",
    "services": [
      "Sözleşmeler",
      "Miras hukuku",
      "İcra takibi"
    ],
    "premium": false
  },
  {
    "id": "ali-yilmaz",
    "name": "Ali Yılmaz",
    "title": "Eğitim Koçu",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Gelibolu",
    "rating": 4.8,
    "reviewCount": 27,
    "initials": "AY",
    "bio": "Konu anlatımı ve sınav hazırlığı alanlarında Çanakkale Gelibolu'de hizmet verir.",
    "services": [
      "Deneme analizi",
      "Konu anlatımı",
      "Sınav hazırlığı"
    ],
    "premium": false
  },
  {
    "id": "huseyin-yilmaz",
    "name": "Hüseyin Yılmaz",
    "title": "Diyetisyen",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Ezine",
    "rating": 5,
    "reviewCount": 34,
    "initials": "HY",
    "bio": "Kilo yönetimi ve insülin direnci alanlarında Çanakkale Ezine'de hizmet verir.",
    "services": [
      "Bitkisel beslenme",
      "Kilo yönetimi",
      "İnsülin direnci"
    ],
    "premium": false
  },
  {
    "id": "hasan-yilmaz",
    "name": "Hasan Yılmaz",
    "title": "Yaşam Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Çan",
    "rating": 4.7,
    "reviewCount": 41,
    "initials": "HY",
    "bio": "Kariyer geçişi ve öncelik yönetimi alanlarında Çanakkale Çan'de hizmet verir.",
    "services": [
      "Hedef planlama",
      "Kariyer geçişi",
      "Öncelik yönetimi"
    ],
    "premium": false
  },
  {
    "id": "ibrahim-yilmaz",
    "name": "İbrahim Yılmaz",
    "title": "Psikolog",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Ayvacık",
    "rating": 4.9,
    "reviewCount": 48,
    "initials": "İY",
    "bio": "İlişki danışmanlığı ve yas danışmanlığı alanlarında Çanakkale Ayvacık'de hizmet verir.",
    "services": [
      "Kaygı bozuklukları",
      "İlişki danışmanlığı",
      "Yas danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "osman-yilmaz",
    "name": "Osman Yılmaz",
    "title": "Dil ve Konuşma Terapisti",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Bayramiç",
    "rating": 5,
    "reviewCount": 55,
    "initials": "OY",
    "bio": "Postür analizi ve nörolojik rehabilitasyon alanlarında Çanakkale Bayramiç'de hizmet verir.",
    "services": [
      "Spor yaralanmaları",
      "Postür analizi",
      "Nörolojik rehabilitasyon"
    ],
    "premium": false
  },
  {
    "id": "emre-yilmaz",
    "name": "Emre Yılmaz",
    "title": "Aile Hukuku Danışmanı",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Lapseki",
    "rating": 5,
    "reviewCount": 7,
    "initials": "EY",
    "bio": "İcra takibi ve aile hukuku alanlarında Çanakkale Lapseki'de hizmet verir.",
    "services": [
      "Miras hukuku",
      "İcra takibi",
      "Aile hukuku"
    ],
    "premium": false
  },
  {
    "id": "kaan-yilmaz",
    "name": "Kaan Yılmaz",
    "title": "YKS Danışmanı",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Yenice",
    "rating": 4.9,
    "reviewCount": 14,
    "initials": "KY",
    "bio": "Sınav hazırlığı ve çalışma planı alanlarında Çanakkale Yenice'de hizmet verir.",
    "services": [
      "Konu anlatımı",
      "Sınav hazırlığı",
      "Çalışma planı"
    ],
    "premium": false
  },
  {
    "id": "yusuf-yilmaz",
    "name": "Yusuf Yılmaz",
    "title": "Sporcu Beslenme Uzmanı",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Merkez",
    "rating": 4.8,
    "reviewCount": 21,
    "initials": "YY",
    "bio": "İnsülin direnci ve sporcu beslenmesi alanlarında Çanakkale Merkez'de hizmet verir.",
    "services": [
      "Kilo yönetimi",
      "İnsülin direnci",
      "Sporcu beslenmesi"
    ],
    "premium": false
  },
  {
    "id": "murat-yilmaz",
    "name": "Murat Yılmaz",
    "title": "Kariyer Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Kepez",
    "rating": 5,
    "reviewCount": 28,
    "initials": "MY",
    "bio": "Öncelik yönetimi ve farkındalık alanlarında Çanakkale Kepez'de hizmet verir.",
    "services": [
      "Kariyer geçişi",
      "Öncelik yönetimi",
      "Farkındalık"
    ],
    "premium": false
  },
  {
    "id": "serkan-yilmaz",
    "name": "Serkan Yılmaz",
    "title": "Çocuk ve Ergen Psikoloğu",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Biga",
    "rating": 4.7,
    "reviewCount": 35,
    "initials": "SY",
    "bio": "Yas danışmanlığı ve ergen danışmanlığı alanlarında Çanakkale Biga'de hizmet verir.",
    "services": [
      "İlişki danışmanlığı",
      "Yas danışmanlığı",
      "Ergen danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "baris-yilmaz",
    "name": "Barış Yılmaz",
    "title": "Spor Fizyoterapisti",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Gelibolu",
    "rating": 4.9,
    "reviewCount": 42,
    "initials": "BY",
    "bio": "Nörolojik rehabilitasyon ve manuel terapi alanlarında Çanakkale Gelibolu'de hizmet verir.",
    "services": [
      "Postür analizi",
      "Nörolojik rehabilitasyon",
      "Manuel terapi"
    ],
    "premium": false
  },
  {
    "id": "onur-yilmaz",
    "name": "Onur Yılmaz",
    "title": "İş Hukuku Danışmanı",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Ezine",
    "rating": 5,
    "reviewCount": 49,
    "initials": "OY",
    "bio": "Aile hukuku ve iş hukuku alanlarında Çanakkale Ezine'de hizmet verir.",
    "services": [
      "İcra takibi",
      "Aile hukuku",
      "İş hukuku"
    ],
    "premium": false
  },
  {
    "id": "kerem-yilmaz",
    "name": "Kerem Yılmaz",
    "title": "Matematik Öğretmeni",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Çan",
    "rating": 5,
    "reviewCount": 56,
    "initials": "KY",
    "bio": "Çalışma planı ve öğrenci motivasyonu alanlarında Çanakkale Çan'de hizmet verir.",
    "services": [
      "Sınav hazırlığı",
      "Çalışma planı",
      "Öğrenci motivasyonu"
    ],
    "premium": false
  },
  {
    "id": "tolga-yilmaz",
    "name": "Tolga Yılmaz",
    "title": "Diyetisyen",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Ayvacık",
    "rating": 4.9,
    "reviewCount": 8,
    "initials": "TY",
    "bio": "Sporcu beslenmesi ve gebelik beslenmesi alanlarında Çanakkale Ayvacık'de hizmet verir.",
    "services": [
      "İnsülin direnci",
      "Sporcu beslenmesi",
      "Gebelik beslenmesi"
    ],
    "premium": false
  },
  {
    "id": "selim-yilmaz",
    "name": "Selim Yılmaz",
    "title": "İlişki Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Bayramiç",
    "rating": 4.8,
    "reviewCount": 15,
    "initials": "SY",
    "bio": "Farkındalık ve motivasyon alanlarında Çanakkale Bayramiç'de hizmet verir.",
    "services": [
      "Öncelik yönetimi",
      "Farkındalık",
      "Motivasyon"
    ],
    "premium": false
  },
  {
    "id": "cem-yilmaz",
    "name": "Cem Yılmaz",
    "title": "Aile Danışmanı",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Lapseki",
    "rating": 5,
    "reviewCount": 22,
    "initials": "CY",
    "bio": "Ergen danışmanlığı ve bireysel terapi alanlarında Çanakkale Lapseki'de hizmet verir.",
    "services": [
      "Yas danışmanlığı",
      "Ergen danışmanlığı",
      "Bireysel terapi"
    ],
    "premium": false
  },
  {
    "id": "gokhan-yilmaz",
    "name": "Gökhan Yılmaz",
    "title": "Odyolog",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Yenice",
    "rating": 4.7,
    "reviewCount": 29,
    "initials": "GY",
    "bio": "Manuel terapi ve ortopedik rehabilitasyon alanlarında Çanakkale Yenice'de hizmet verir.",
    "services": [
      "Nörolojik rehabilitasyon",
      "Manuel terapi",
      "Ortopedik rehabilitasyon"
    ],
    "premium": false
  },
  {
    "id": "ayse-yilmaz",
    "name": "Ayşe Yılmaz",
    "title": "Avukat",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Merkez",
    "rating": 4.9,
    "reviewCount": 36,
    "initials": "AY",
    "bio": "İş hukuku ve sözleşmeler alanlarında Çanakkale Merkez'de hizmet verir.",
    "services": [
      "Aile hukuku",
      "İş hukuku",
      "Sözleşmeler"
    ],
    "premium": false
  },
  {
    "id": "fatma-yilmaz",
    "name": "Fatma Yılmaz",
    "title": "İngilizce Öğretmeni",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Kepez",
    "rating": 5,
    "reviewCount": 43,
    "initials": "FY",
    "bio": "Öğrenci motivasyonu ve deneme analizi alanlarında Çanakkale Kepez'de hizmet verir.",
    "services": [
      "Çalışma planı",
      "Öğrenci motivasyonu",
      "Deneme analizi"
    ],
    "premium": false
  },
  {
    "id": "elif-yilmaz",
    "name": "Elif Yılmaz",
    "title": "Sporcu Beslenme Uzmanı",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Biga",
    "rating": 5,
    "reviewCount": 50,
    "initials": "EY",
    "bio": "Gebelik beslenmesi ve bitkisel beslenme alanlarında Çanakkale Biga'de hizmet verir.",
    "services": [
      "Sporcu beslenmesi",
      "Gebelik beslenmesi",
      "Bitkisel beslenme"
    ],
    "premium": false
  },
  {
    "id": "zeynep-yilmaz",
    "name": "Zeynep Yılmaz",
    "title": "Mindfulness Eğitmeni",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Gelibolu",
    "rating": 4.9,
    "reviewCount": 57,
    "initials": "ZY",
    "bio": "Motivasyon ve hedef planlama alanlarında Çanakkale Gelibolu'de hizmet verir.",
    "services": [
      "Farkındalık",
      "Motivasyon",
      "Hedef planlama"
    ],
    "premium": false
  },
  {
    "id": "merve-yilmaz",
    "name": "Merve Yılmaz",
    "title": "Psikolojik Danışman",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Ezine",
    "rating": 4.8,
    "reviewCount": 9,
    "initials": "MY",
    "bio": "Bireysel terapi ve kaygı bozuklukları alanlarında Çanakkale Ezine'de hizmet verir.",
    "services": [
      "Ergen danışmanlığı",
      "Bireysel terapi",
      "Kaygı bozuklukları"
    ],
    "premium": false
  },
  {
    "id": "selin-yilmaz",
    "name": "Selin Yılmaz",
    "title": "Fizyoterapist",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Çan",
    "rating": 5,
    "reviewCount": 16,
    "initials": "SY",
    "bio": "Ortopedik rehabilitasyon ve spor yaralanmaları alanlarında Çanakkale Çan'de hizmet verir.",
    "services": [
      "Manuel terapi",
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları"
    ],
    "premium": false
  },
  {
    "id": "deniz-yilmaz",
    "name": "Deniz Yılmaz",
    "title": "Hukuk Danışmanı",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Ayvacık",
    "rating": 4.7,
    "reviewCount": 23,
    "initials": "DY",
    "bio": "Sözleşmeler ve miras hukuku alanlarında Çanakkale Ayvacık'de hizmet verir.",
    "services": [
      "İş hukuku",
      "Sözleşmeler",
      "Miras hukuku"
    ],
    "premium": false
  },
  {
    "id": "ece-yilmaz",
    "name": "Ece Yılmaz",
    "title": "Öğrenci Koçu",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Bayramiç",
    "rating": 4.9,
    "reviewCount": 30,
    "initials": "EY",
    "bio": "Deneme analizi ve konu anlatımı alanlarında Çanakkale Bayramiç'de hizmet verir.",
    "services": [
      "Öğrenci motivasyonu",
      "Deneme analizi",
      "Konu anlatımı"
    ],
    "premium": false
  },
  {
    "id": "gizem-yilmaz",
    "name": "Gizem Yılmaz",
    "title": "Diyetisyen",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Lapseki",
    "rating": 5,
    "reviewCount": 37,
    "initials": "GY",
    "bio": "Bitkisel beslenme ve kilo yönetimi alanlarında Çanakkale Lapseki'de hizmet verir.",
    "services": [
      "Gebelik beslenmesi",
      "Bitkisel beslenme",
      "Kilo yönetimi"
    ],
    "premium": false
  },
  {
    "id": "busra-yilmaz",
    "name": "Büşra Yılmaz",
    "title": "NLP Uzmanı",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Yenice",
    "rating": 5,
    "reviewCount": 44,
    "initials": "BY",
    "bio": "Hedef planlama ve kariyer geçişi alanlarında Çanakkale Yenice'de hizmet verir.",
    "services": [
      "Motivasyon",
      "Hedef planlama",
      "Kariyer geçişi"
    ],
    "premium": false
  },
  {
    "id": "damla-yilmaz",
    "name": "Damla Yılmaz",
    "title": "Klinik Psikolog",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Merkez",
    "rating": 4.9,
    "reviewCount": 51,
    "initials": "DY",
    "bio": "Kaygı bozuklukları ve ilişki danışmanlığı alanlarında Çanakkale Merkez'de hizmet verir.",
    "services": [
      "Bireysel terapi",
      "Kaygı bozuklukları",
      "İlişki danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "nur-yilmaz",
    "name": "Nur Yılmaz",
    "title": "Ergoterapist",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Kepez",
    "rating": 4.8,
    "reviewCount": 58,
    "initials": "NY",
    "bio": "Spor yaralanmaları ve postür analizi alanlarında Çanakkale Kepez'de hizmet verir.",
    "services": [
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları",
      "Postür analizi"
    ],
    "premium": false
  },
  {
    "id": "sila-yilmaz",
    "name": "Sıla Yılmaz",
    "title": "Arabulucu",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Biga",
    "rating": 5,
    "reviewCount": 10,
    "initials": "SY",
    "bio": "Miras hukuku ve icra takibi alanlarında Çanakkale Biga'de hizmet verir.",
    "services": [
      "Sözleşmeler",
      "Miras hukuku",
      "İcra takibi"
    ],
    "premium": false
  },
  {
    "id": "irem-yilmaz",
    "name": "İrem Yılmaz",
    "title": "Eğitim Koçu",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Gelibolu",
    "rating": 4.7,
    "reviewCount": 17,
    "initials": "İY",
    "bio": "Konu anlatımı ve sınav hazırlığı alanlarında Çanakkale Gelibolu'de hizmet verir.",
    "services": [
      "Deneme analizi",
      "Konu anlatımı",
      "Sınav hazırlığı"
    ],
    "premium": false
  },
  {
    "id": "melis-yilmaz",
    "name": "Melis Yılmaz",
    "title": "Sporcu Beslenme Uzmanı",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Ezine",
    "rating": 4.9,
    "reviewCount": 24,
    "initials": "MY",
    "bio": "Kilo yönetimi ve insülin direnci alanlarında Çanakkale Ezine'de hizmet verir.",
    "services": [
      "Bitkisel beslenme",
      "Kilo yönetimi",
      "İnsülin direnci"
    ],
    "premium": false
  },
  {
    "id": "pinar-yilmaz",
    "name": "Pınar Yılmaz",
    "title": "Yaşam Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Çan",
    "rating": 5,
    "reviewCount": 31,
    "initials": "PY",
    "bio": "Kariyer geçişi ve öncelik yönetimi alanlarında Çanakkale Çan'de hizmet verir.",
    "services": [
      "Hedef planlama",
      "Kariyer geçişi",
      "Öncelik yönetimi"
    ],
    "premium": false
  },
  {
    "id": "ceren-yilmaz",
    "name": "Ceren Yılmaz",
    "title": "Psikolog",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Ayvacık",
    "rating": 5,
    "reviewCount": 38,
    "initials": "CY",
    "bio": "İlişki danışmanlığı ve yas danışmanlığı alanlarında Çanakkale Ayvacık'de hizmet verir.",
    "services": [
      "Kaygı bozuklukları",
      "İlişki danışmanlığı",
      "Yas danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "asli-yilmaz",
    "name": "Aslı Yılmaz",
    "title": "Dil ve Konuşma Terapisti",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Bayramiç",
    "rating": 4.9,
    "reviewCount": 45,
    "initials": "AY",
    "bio": "Postür analizi ve nörolojik rehabilitasyon alanlarında Çanakkale Bayramiç'de hizmet verir.",
    "services": [
      "Spor yaralanmaları",
      "Postür analizi",
      "Nörolojik rehabilitasyon"
    ],
    "premium": false
  },
  {
    "id": "derya-yilmaz",
    "name": "Derya Yılmaz",
    "title": "Aile Hukuku Danışmanı",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Lapseki",
    "rating": 4.8,
    "reviewCount": 52,
    "initials": "DY",
    "bio": "İcra takibi ve aile hukuku alanlarında Çanakkale Lapseki'de hizmet verir.",
    "services": [
      "Miras hukuku",
      "İcra takibi",
      "Aile hukuku"
    ],
    "premium": false
  },
  {
    "id": "esra-yilmaz",
    "name": "Esra Yılmaz",
    "title": "YKS Danışmanı",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Yenice",
    "rating": 5,
    "reviewCount": 59,
    "initials": "EY",
    "bio": "Sınav hazırlığı ve çalışma planı alanlarında Çanakkale Yenice'de hizmet verir.",
    "services": [
      "Konu anlatımı",
      "Sınav hazırlığı",
      "Çalışma planı"
    ],
    "premium": false
  },
  {
    "id": "mehmet-kaya",
    "name": "Mehmet Kaya",
    "title": "Diyetisyen",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Merkez",
    "rating": 4.7,
    "reviewCount": 11,
    "initials": "MK",
    "bio": "İnsülin direnci ve sporcu beslenmesi alanlarında Çanakkale Merkez'de hizmet verir.",
    "services": [
      "Kilo yönetimi",
      "İnsülin direnci",
      "Sporcu beslenmesi"
    ],
    "premium": false
  },
  {
    "id": "mustafa-kaya",
    "name": "Mustafa Kaya",
    "title": "Kariyer Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Kepez",
    "rating": 4.9,
    "reviewCount": 18,
    "initials": "MK",
    "bio": "Öncelik yönetimi ve farkındalık alanlarında Çanakkale Kepez'de hizmet verir.",
    "services": [
      "Kariyer geçişi",
      "Öncelik yönetimi",
      "Farkındalık"
    ],
    "premium": false
  },
  {
    "id": "ali-kaya",
    "name": "Ali Kaya",
    "title": "Çocuk ve Ergen Psikoloğu",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Biga",
    "rating": 5,
    "reviewCount": 25,
    "initials": "AK",
    "bio": "Yas danışmanlığı ve ergen danışmanlığı alanlarında Çanakkale Biga'de hizmet verir.",
    "services": [
      "İlişki danışmanlığı",
      "Yas danışmanlığı",
      "Ergen danışmanlığı"
    ],
    "premium": false
  },
  {
    "id": "huseyin-kaya",
    "name": "Hüseyin Kaya",
    "title": "Spor Fizyoterapisti",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Gelibolu",
    "rating": 5,
    "reviewCount": 32,
    "initials": "HK",
    "bio": "Nörolojik rehabilitasyon ve manuel terapi alanlarında Çanakkale Gelibolu'de hizmet verir.",
    "services": [
      "Postür analizi",
      "Nörolojik rehabilitasyon",
      "Manuel terapi"
    ],
    "premium": false
  },
  {
    "id": "hasan-kaya",
    "name": "Hasan Kaya",
    "title": "İş Hukuku Danışmanı",
    "category": "hukuk",
    "categoryLabel": "Hukuk & Danışmanlık",
    "district": "Ezine",
    "rating": 4.9,
    "reviewCount": 39,
    "initials": "HK",
    "bio": "Aile hukuku ve iş hukuku alanlarında Çanakkale Ezine'de hizmet verir.",
    "services": [
      "İcra takibi",
      "Aile hukuku",
      "İş hukuku"
    ],
    "premium": false
  },
  {
    "id": "ibrahim-kaya",
    "name": "İbrahim Kaya",
    "title": "Matematik Öğretmeni",
    "category": "egitim",
    "categoryLabel": "Eğitim & Koçluk",
    "district": "Çan",
    "rating": 4.8,
    "reviewCount": 46,
    "initials": "İK",
    "bio": "Çalışma planı ve öğrenci motivasyonu alanlarında Çanakkale Çan'de hizmet verir.",
    "services": [
      "Sınav hazırlığı",
      "Çalışma planı",
      "Öğrenci motivasyonu"
    ],
    "premium": false
  },
  {
    "id": "osman-kaya",
    "name": "Osman Kaya",
    "title": "Sporcu Beslenme Uzmanı",
    "category": "beslenme",
    "categoryLabel": "Beslenme & Diyet",
    "district": "Ayvacık",
    "rating": 5,
    "reviewCount": 53,
    "initials": "OK",
    "bio": "Sporcu beslenmesi ve gebelik beslenmesi alanlarında Çanakkale Ayvacık'de hizmet verir.",
    "services": [
      "İnsülin direnci",
      "Sporcu beslenmesi",
      "Gebelik beslenmesi"
    ],
    "premium": false
  },
  {
    "id": "emre-kaya",
    "name": "Emre Kaya",
    "title": "İlişki Koçu",
    "category": "kisisel-gelisim",
    "categoryLabel": "Kişisel Gelişim & Yaşam",
    "district": "Bayramiç",
    "rating": 4.7,
    "reviewCount": 60,
    "initials": "EK",
    "bio": "Farkındalık ve motivasyon alanlarında Çanakkale Bayramiç'de hizmet verir.",
    "services": [
      "Öncelik yönetimi",
      "Farkındalık",
      "Motivasyon"
    ],
    "premium": false
  },
  {
    "id": "kaan-kaya",
    "name": "Kaan Kaya",
    "title": "Aile Danışmanı",
    "category": "psikoloji",
    "categoryLabel": "Psikoloji & Psikoterapi",
    "district": "Lapseki",
    "rating": 4.9,
    "reviewCount": 12,
    "initials": "KK",
    "bio": "Ergen danışmanlığı ve bireysel terapi alanlarında Çanakkale Lapseki'de hizmet verir.",
    "services": [
      "Yas danışmanlığı",
      "Ergen danışmanlığı",
      "Bireysel terapi"
    ],
    "premium": false
  },
  {
    "id": "yusuf-kaya",
    "name": "Yusuf Kaya",
    "title": "Odyolog",
    "category": "saglik",
    "categoryLabel": "Sağlık Hizmetleri",
    "district": "Yenice",
    "rating": 5,
    "reviewCount": 19,
    "initials": "YK",
    "bio": "Manuel terapi ve ortopedik rehabilitasyon alanlarında Çanakkale Yenice'de hizmet verir.",
    "services": [
      "Nörolojik rehabilitasyon",
      "Manuel terapi",
      "Ortopedik rehabilitasyon"
    ],
    "premium": false
  }
];

export const generatedExtras: Record<string, Extra> = {
  "ahmet-yilmaz": {
    "firm": "Boğaz Klinik",
    "yearsExperience": 3,
    "phone": "0286 201 11 01",
    "whatsapp": "905310000137",
    "email": "ahmet-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "3 yıldır Çanakkale Merkez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Bireysel terapi",
      "Kaygı bozuklukları",
      "İlişki danışmanlığı"
    ],
    "reviews": [
      {
        "author": "A. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "O. D.",
        "rating": 5,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "mehmet-yilmaz": {
    "firm": "Truva Ergoterapist",
    "yearsExperience": 4,
    "phone": "0286 202 12 02",
    "whatsapp": "905310000274",
    "email": "mehmet-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "4 yıldır Çanakkale Kepez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları",
      "Postür analizi"
    ],
    "reviews": [
      {
        "author": "İ. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "O. Ç.",
        "rating": 5,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "mustafa-yilmaz": {
    "firm": null,
    "yearsExperience": 5,
    "phone": "0286 203 13 03",
    "whatsapp": "905310000411",
    "email": "mustafa-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "5 yıldır Çanakkale Biga ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Sözleşmeler",
      "Miras hukuku",
      "İcra takibi"
    ],
    "reviews": [
      {
        "author": "K. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "F. Y.",
        "rating": 4,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "ali-yilmaz": {
    "firm": "Ege Eğitim",
    "yearsExperience": 6,
    "phone": "0286 204 14 04",
    "whatsapp": "905310000548",
    "email": "ali-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "6 yıldır Çanakkale Gelibolu ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Deneme analizi",
      "Konu anlatımı",
      "Sınav hazırlığı"
    ],
    "reviews": [
      {
        "author": "S. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "G. A.",
        "rating": 4,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "huseyin-yilmaz": {
    "firm": "Marmara Diyetisyen",
    "yearsExperience": 7,
    "phone": "0286 205 15 05",
    "whatsapp": "905310000685",
    "email": "huseyin-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "7 yıldır Çanakkale Ezine ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Bitkisel beslenme",
      "Kilo yönetimi",
      "İnsülin direnci"
    ],
    "reviews": [
      {
        "author": "K. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "P. D.",
        "rating": 5,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "hasan-yilmaz": {
    "firm": null,
    "yearsExperience": 8,
    "phone": "0286 206 16 06",
    "whatsapp": "905310000822",
    "email": "hasan-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "8 yıldır Çanakkale Çan ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Hedef planlama",
      "Kariyer geçişi",
      "Öncelik yönetimi"
    ],
    "reviews": [
      {
        "author": "C. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "M. A.",
        "rating": 4,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "ibrahim-yilmaz": {
    "firm": "Kepez Psikolog",
    "yearsExperience": 9,
    "phone": "0286 207 17 07",
    "whatsapp": "905310000959",
    "email": "ibrahim-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "9 yıldır Çanakkale Ayvacık ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kaygı bozuklukları",
      "İlişki danışmanlığı",
      "Yas danışmanlığı"
    ],
    "reviews": [
      {
        "author": "F. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "K. K.",
        "rating": 4,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "osman-yilmaz": {
    "firm": "Nefes Dil",
    "yearsExperience": 10,
    "phone": "0286 208 18 08",
    "whatsapp": "905310001096",
    "email": "osman-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "10 yıldır Çanakkale Bayramiç ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Spor yaralanmaları",
      "Postür analizi",
      "Nörolojik rehabilitasyon"
    ],
    "reviews": [
      {
        "author": "M. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "T. K.",
        "rating": 5,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "emre-yilmaz": {
    "firm": null,
    "yearsExperience": 11,
    "phone": "0286 209 19 09",
    "whatsapp": "905310001233",
    "email": "emre-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "11 yıldır Çanakkale Lapseki ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Miras hukuku",
      "İcra takibi",
      "Aile hukuku"
    ],
    "reviews": [
      {
        "author": "E. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "Z. Ş.",
        "rating": 5,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "kaan-yilmaz": {
    "firm": "Deniz YKS",
    "yearsExperience": 12,
    "phone": "0286 210 20 10",
    "whatsapp": "905310001370",
    "email": "kaan-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "12 yıldır Çanakkale Yenice ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Konu anlatımı",
      "Sınav hazırlığı",
      "Çalışma planı"
    ],
    "reviews": [
      {
        "author": "D. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "D. K.",
        "rating": 4,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "yusuf-yilmaz": {
    "firm": "Boğaz Sporcu",
    "yearsExperience": 13,
    "phone": "0286 211 21 11",
    "whatsapp": "905310001507",
    "email": "yusuf-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "13 yıldır Çanakkale Merkez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kilo yönetimi",
      "İnsülin direnci",
      "Sporcu beslenmesi"
    ],
    "reviews": [
      {
        "author": "İ. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "A. A.",
        "rating": 4,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "murat-yilmaz": {
    "firm": null,
    "yearsExperience": 14,
    "phone": "0286 212 22 12",
    "whatsapp": "905310001644",
    "email": "murat-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "14 yıldır Çanakkale Kepez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kariyer geçişi",
      "Öncelik yönetimi",
      "Farkındalık"
    ],
    "reviews": [
      {
        "author": "C. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "H. G.",
        "rating": 5,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "serkan-yilmaz": {
    "firm": "Kale Çocuk",
    "yearsExperience": 15,
    "phone": "0286 213 23 13",
    "whatsapp": "905310001781",
    "email": "serkan-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "15 yıldır Çanakkale Biga ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İlişki danışmanlığı",
      "Yas danışmanlığı",
      "Ergen danışmanlığı"
    ],
    "reviews": [
      {
        "author": "E. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "M. T.",
        "rating": 4,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "baris-yilmaz": {
    "firm": "Ege Spor",
    "yearsExperience": 16,
    "phone": "0286 214 24 14",
    "whatsapp": "905310001918",
    "email": "baris-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "16 yıldır Çanakkale Gelibolu ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Postür analizi",
      "Nörolojik rehabilitasyon",
      "Manuel terapi"
    ],
    "reviews": [
      {
        "author": "M. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "C. T.",
        "rating": 4,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "onur-yilmaz": {
    "firm": null,
    "yearsExperience": 17,
    "phone": "0286 215 25 15",
    "whatsapp": "905310002055",
    "email": "onur-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "17 yıldır Çanakkale Ezine ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İcra takibi",
      "Aile hukuku",
      "İş hukuku"
    ],
    "reviews": [
      {
        "author": "H. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "S. Y.",
        "rating": 5,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "kerem-yilmaz": {
    "firm": "Anafartalar Matematik",
    "yearsExperience": 3,
    "phone": "0286 216 26 16",
    "whatsapp": "905310002192",
    "email": "kerem-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "3 yıldır Çanakkale Çan ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Sınav hazırlığı",
      "Çalışma planı",
      "Öğrenci motivasyonu"
    ],
    "reviews": [
      {
        "author": "E. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "S. D.",
        "rating": 5,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "tolga-yilmaz": {
    "firm": "Kepez Diyetisyen",
    "yearsExperience": 4,
    "phone": "0286 217 27 17",
    "whatsapp": "905310002329",
    "email": "tolga-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "4 yıldır Çanakkale Ayvacık ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İnsülin direnci",
      "Sporcu beslenmesi",
      "Gebelik beslenmesi"
    ],
    "reviews": [
      {
        "author": "M. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "E. Ç.",
        "rating": 4,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "selim-yilmaz": {
    "firm": null,
    "yearsExperience": 5,
    "phone": "0286 218 28 18",
    "whatsapp": "905310002466",
    "email": "selim-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "5 yıldır Çanakkale Bayramiç ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Öncelik yönetimi",
      "Farkındalık",
      "Motivasyon"
    ],
    "reviews": [
      {
        "author": "O. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "İ. Y.",
        "rating": 4,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "cem-yilmaz": {
    "firm": "Umut Aile",
    "yearsExperience": 6,
    "phone": "0286 219 29 19",
    "whatsapp": "905310002603",
    "email": "cem-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "6 yıldır Çanakkale Lapseki ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Yas danışmanlığı",
      "Ergen danışmanlığı",
      "Bireysel terapi"
    ],
    "reviews": [
      {
        "author": "S. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "B. A.",
        "rating": 5,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "gokhan-yilmaz": {
    "firm": "Deniz Odyolog",
    "yearsExperience": 7,
    "phone": "0286 220 30 20",
    "whatsapp": "905310002740",
    "email": "gokhan-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "7 yıldır Çanakkale Yenice ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Nörolojik rehabilitasyon",
      "Manuel terapi",
      "Ortopedik rehabilitasyon"
    ],
    "reviews": [
      {
        "author": "A. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "A. D.",
        "rating": 4,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "ayse-yilmaz": {
    "firm": null,
    "yearsExperience": 8,
    "phone": "0286 221 31 21",
    "whatsapp": "905310002877",
    "email": "ayse-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "8 yıldır Çanakkale Merkez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Aile hukuku",
      "İş hukuku",
      "Sözleşmeler"
    ],
    "reviews": [
      {
        "author": "Z. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "E. A.",
        "rating": 4,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "fatma-yilmaz": {
    "firm": "Truva İngilizce",
    "yearsExperience": 9,
    "phone": "0286 222 32 22",
    "whatsapp": "905310003014",
    "email": "fatma-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "9 yıldır Çanakkale Kepez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Çalışma planı",
      "Öğrenci motivasyonu",
      "Deneme analizi"
    ],
    "reviews": [
      {
        "author": "D. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "M. K.",
        "rating": 5,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "elif-yilmaz": {
    "firm": "Kale Sporcu",
    "yearsExperience": 10,
    "phone": "0286 223 33 23",
    "whatsapp": "905310003151",
    "email": "elif-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "10 yıldır Çanakkale Biga ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Sporcu beslenmesi",
      "Gebelik beslenmesi",
      "Bitkisel beslenme"
    ],
    "reviews": [
      {
        "author": "B. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "M. K.",
        "rating": 5,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "zeynep-yilmaz": {
    "firm": null,
    "yearsExperience": 11,
    "phone": "0286 224 34 24",
    "whatsapp": "905310003288",
    "email": "zeynep-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "11 yıldır Çanakkale Gelibolu ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Farkındalık",
      "Motivasyon",
      "Hedef planlama"
    ],
    "reviews": [
      {
        "author": "S. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "E. Ş.",
        "rating": 4,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "merve-yilmaz": {
    "firm": "Marmara Psikolojik",
    "yearsExperience": 12,
    "phone": "0286 225 35 25",
    "whatsapp": "905310003425",
    "email": "merve-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "12 yıldır Çanakkale Ezine ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Ergen danışmanlığı",
      "Bireysel terapi",
      "Kaygı bozuklukları"
    ],
    "reviews": [
      {
        "author": "P. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "K. K.",
        "rating": 4,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "selin-yilmaz": {
    "firm": "Anafartalar Fizyoterapist",
    "yearsExperience": 13,
    "phone": "0286 226 36 26",
    "whatsapp": "905310003562",
    "email": "selin-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "13 yıldır Çanakkale Çan ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Manuel terapi",
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları"
    ],
    "reviews": [
      {
        "author": "D. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "E. A.",
        "rating": 5,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "deniz-yilmaz": {
    "firm": null,
    "yearsExperience": 14,
    "phone": "0286 227 37 27",
    "whatsapp": "905310003699",
    "email": "deniz-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "14 yıldır Çanakkale Ayvacık ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İş hukuku",
      "Sözleşmeler",
      "Miras hukuku"
    ],
    "reviews": [
      {
        "author": "M. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "B. G.",
        "rating": 4,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "ece-yilmaz": {
    "firm": "Nefes Öğrenci",
    "yearsExperience": 15,
    "phone": "0286 228 38 28",
    "whatsapp": "905310003836",
    "email": "ece-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "15 yıldır Çanakkale Bayramiç ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Öğrenci motivasyonu",
      "Deneme analizi",
      "Konu anlatımı"
    ],
    "reviews": [
      {
        "author": "H. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "C. T.",
        "rating": 4,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "gizem-yilmaz": {
    "firm": "Umut Diyetisyen",
    "yearsExperience": 16,
    "phone": "0286 229 39 29",
    "whatsapp": "905310003973",
    "email": "gizem-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "16 yıldır Çanakkale Lapseki ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Gebelik beslenmesi",
      "Bitkisel beslenme",
      "Kilo yönetimi"
    ],
    "reviews": [
      {
        "author": "O. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "A. T.",
        "rating": 5,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "busra-yilmaz": {
    "firm": null,
    "yearsExperience": 17,
    "phone": "0286 230 40 30",
    "whatsapp": "905310004110",
    "email": "busra-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "17 yıldır Çanakkale Yenice ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Motivasyon",
      "Hedef planlama",
      "Kariyer geçişi"
    ],
    "reviews": [
      {
        "author": "Y. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "Y. Y.",
        "rating": 5,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "damla-yilmaz": {
    "firm": "Boğaz Klinik",
    "yearsExperience": 3,
    "phone": "0286 231 41 31",
    "whatsapp": "905310004247",
    "email": "damla-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "3 yıldır Çanakkale Merkez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Bireysel terapi",
      "Kaygı bozuklukları",
      "İlişki danışmanlığı"
    ],
    "reviews": [
      {
        "author": "B. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "S. D.",
        "rating": 4,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "nur-yilmaz": {
    "firm": "Truva Ergoterapist",
    "yearsExperience": 4,
    "phone": "0286 232 42 32",
    "whatsapp": "905310004384",
    "email": "nur-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "4 yıldır Çanakkale Kepez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Ortopedik rehabilitasyon",
      "Spor yaralanmaları",
      "Postür analizi"
    ],
    "reviews": [
      {
        "author": "T. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "M. Ç.",
        "rating": 4,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "sila-yilmaz": {
    "firm": null,
    "yearsExperience": 5,
    "phone": "0286 233 43 33",
    "whatsapp": "905310004521",
    "email": "sila-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "5 yıldır Çanakkale Biga ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Sözleşmeler",
      "Miras hukuku",
      "İcra takibi"
    ],
    "reviews": [
      {
        "author": "G. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "N. Y.",
        "rating": 5,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "irem-yilmaz": {
    "firm": "Ege Eğitim",
    "yearsExperience": 6,
    "phone": "0286 234 44 34",
    "whatsapp": "905310004658",
    "email": "irem-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "6 yıldır Çanakkale Gelibolu ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Deneme analizi",
      "Konu anlatımı",
      "Sınav hazırlığı"
    ],
    "reviews": [
      {
        "author": "E. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "D. A.",
        "rating": 4,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "melis-yilmaz": {
    "firm": "Marmara Sporcu",
    "yearsExperience": 7,
    "phone": "0286 235 45 35",
    "whatsapp": "905310004795",
    "email": "melis-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "7 yıldır Çanakkale Ezine ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Bitkisel beslenme",
      "Kilo yönetimi",
      "İnsülin direnci"
    ],
    "reviews": [
      {
        "author": "S. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "H. D.",
        "rating": 4,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "pinar-yilmaz": {
    "firm": null,
    "yearsExperience": 8,
    "phone": "0286 236 46 36",
    "whatsapp": "905310004932",
    "email": "pinar-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "8 yıldır Çanakkale Çan ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Hedef planlama",
      "Kariyer geçişi",
      "Öncelik yönetimi"
    ],
    "reviews": [
      {
        "author": "G. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "S. A.",
        "rating": 5,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "ceren-yilmaz": {
    "firm": "Kepez Psikolog",
    "yearsExperience": 9,
    "phone": "0286 237 47 37",
    "whatsapp": "905310005069",
    "email": "ceren-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "9 yıldır Çanakkale Ayvacık ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kaygı bozuklukları",
      "İlişki danışmanlığı",
      "Yas danışmanlığı"
    ],
    "reviews": [
      {
        "author": "N. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "G. K.",
        "rating": 5,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "asli-yilmaz": {
    "firm": "Nefes Dil",
    "yearsExperience": 10,
    "phone": "0286 238 48 38",
    "whatsapp": "905310005206",
    "email": "asli-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "10 yıldır Çanakkale Bayramiç ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Spor yaralanmaları",
      "Postür analizi",
      "Nörolojik rehabilitasyon"
    ],
    "reviews": [
      {
        "author": "M. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "D. K.",
        "rating": 4,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "derya-yilmaz": {
    "firm": null,
    "yearsExperience": 11,
    "phone": "0286 239 49 39",
    "whatsapp": "905310005343",
    "email": "derya-yilmaz@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "11 yıldır Çanakkale Lapseki ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Miras hukuku",
      "İcra takibi",
      "Aile hukuku"
    ],
    "reviews": [
      {
        "author": "A. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "İ. Ş.",
        "rating": 4,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "esra-yilmaz": {
    "firm": "Deniz YKS",
    "yearsExperience": 12,
    "phone": "0286 240 50 40",
    "whatsapp": "905310005480",
    "email": "esra-yilmaz@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "12 yıldır Çanakkale Yenice ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Konu anlatımı",
      "Sınav hazırlığı",
      "Çalışma planı"
    ],
    "reviews": [
      {
        "author": "A. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "A. K.",
        "rating": 5,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "mehmet-kaya": {
    "firm": "Boğaz Diyetisyen",
    "yearsExperience": 13,
    "phone": "0286 241 51 41",
    "whatsapp": "905310005617",
    "email": "mehmet-kaya@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "13 yıldır Çanakkale Merkez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kilo yönetimi",
      "İnsülin direnci",
      "Sporcu beslenmesi"
    ],
    "reviews": [
      {
        "author": "A. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "O. A.",
        "rating": 4,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "mustafa-kaya": {
    "firm": null,
    "yearsExperience": 14,
    "phone": "0286 242 52 42",
    "whatsapp": "905310005754",
    "email": "mustafa-kaya@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "14 yıldır Çanakkale Kepez ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Kariyer geçişi",
      "Öncelik yönetimi",
      "Farkındalık"
    ],
    "reviews": [
      {
        "author": "İ. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "O. G.",
        "rating": 4,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "ali-kaya": {
    "firm": "Kale Çocuk",
    "yearsExperience": 15,
    "phone": "0286 243 53 43",
    "whatsapp": "905310005891",
    "email": "ali-kaya@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "15 yıldır Çanakkale Biga ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İlişki danışmanlığı",
      "Yas danışmanlığı",
      "Ergen danışmanlığı"
    ],
    "reviews": [
      {
        "author": "K. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "F. T.",
        "rating": 5,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "huseyin-kaya": {
    "firm": "Ege Spor",
    "yearsExperience": 16,
    "phone": "0286 244 54 44",
    "whatsapp": "905310006028",
    "email": "huseyin-kaya@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "16 yıldır Çanakkale Gelibolu ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Postür analizi",
      "Nörolojik rehabilitasyon",
      "Manuel terapi"
    ],
    "reviews": [
      {
        "author": "S. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "G. T.",
        "rating": 5,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  },
  "hasan-kaya": {
    "firm": null,
    "yearsExperience": 17,
    "phone": "0286 245 55 45",
    "whatsapp": "905310006165",
    "email": "hasan-kaya@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.",
      "İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur.",
      "17 yıldır Çanakkale Ezine ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İcra takibi",
      "Aile hukuku",
      "İş hukuku"
    ],
    "reviews": [
      {
        "author": "K. K.",
        "rating": 5,
        "body": "Her aşamada net bilgilendirme yaptı.",
        "date": "2026-05-10"
      },
      {
        "author": "P. Y.",
        "rating": 4,
        "body": "Sürecim başarıyla sonuçlandı.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Boşanma & Velayet",
        "description": "Anlaşmalı ve çekişmeli süreçler.",
        "tag": "Dava + Danışmanlık"
      },
      {
        "title": "İş Hukuku",
        "description": "İşçi-işveren uyuşmazlıkları.",
        "tag": "Danışmanlık"
      }
    ]
  },
  "ibrahim-kaya": {
    "firm": "Anafartalar Matematik",
    "yearsExperience": 3,
    "phone": "0286 246 56 46",
    "whatsapp": "905310006302",
    "email": "ibrahim-kaya@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.",
      "Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır.",
      "3 yıldır Çanakkale Çan ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Sınav hazırlığı",
      "Çalışma planı",
      "Öğrenci motivasyonu"
    ],
    "reviews": [
      {
        "author": "C. K.",
        "rating": 5,
        "body": "Netlerim belirgin arttı.",
        "date": "2026-05-10"
      },
      {
        "author": "M. D.",
        "rating": 4,
        "body": "Düzenli çalışmayı öğrendim.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Ders",
        "description": "Seviyeye göre haftalık program.",
        "tag": "Birebir"
      },
      {
        "title": "Sınav Koçluğu",
        "description": "Deneme analizi ve takip.",
        "tag": "12. sınıf / mezun"
      }
    ]
  },
  "osman-kaya": {
    "firm": "Kepez Sporcu",
    "yearsExperience": 4,
    "phone": "0286 247 57 47",
    "whatsapp": "905310006439",
    "email": "osman-kaya@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.",
      "Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir.",
      "4 yıldır Çanakkale Ayvacık ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "İnsülin direnci",
      "Sporcu beslenmesi",
      "Gebelik beslenmesi"
    ],
    "reviews": [
      {
        "author": "F. B.",
        "rating": 5,
        "body": "Hiç aç kalmadan hedefime ulaştım.",
        "date": "2026-05-10"
      },
      {
        "author": "K. Ç.",
        "rating": 5,
        "body": "Değerlerim normale döndü.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Kişiye Özel Diyet",
        "description": "Laboratuvar sonuçlarına göre program.",
        "tag": "4-12 hafta"
      },
      {
        "title": "Online Takip",
        "description": "Haftalık kontrol ve güncelleme.",
        "tag": "Online"
      }
    ]
  },
  "emre-kaya": {
    "firm": null,
    "yearsExperience": 5,
    "phone": "0286 248 58 48",
    "whatsapp": "905310006576",
    "email": "emre-kaya@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.",
      "Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir.",
      "5 yıldır Çanakkale Bayramiç ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Öncelik yönetimi",
      "Farkındalık",
      "Motivasyon"
    ],
    "reviews": [
      {
        "author": "M. Y.",
        "rating": 5,
        "body": "Kararlarımı netleştirdim.",
        "date": "2026-05-10"
      },
      {
        "author": "T. Y.",
        "rating": 4,
        "body": "Bakış açım tamamen değişti.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Birebir Koçluk",
        "description": "Haftalık görüşme ve eylem planı.",
        "tag": "Online / Yüz yüze"
      },
      {
        "title": "Kariyer Geçişi",
        "description": "Yeni alana yol haritası.",
        "tag": "8 seans"
      }
    ]
  },
  "kaan-kaya": {
    "firm": "Umut Aile",
    "yearsExperience": 6,
    "phone": "0286 249 59 49",
    "whatsapp": "905310006713",
    "email": "kaan-kaya@canakkaleuzman.com",
    "socials": [],
    "longBio": [
      "Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.",
      "Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir.",
      "6 yıldır Çanakkale Lapseki ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Yas danışmanlığı",
      "Ergen danışmanlığı",
      "Bireysel terapi"
    ],
    "reviews": [
      {
        "author": "E. Y.",
        "rating": 5,
        "body": "Süreç boyunca çok destekleyiciydi.",
        "date": "2026-05-10"
      },
      {
        "author": "Z. A.",
        "rating": 4,
        "body": "Kendimi güvende hissettim, çok faydalandım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Bireysel Terapi",
        "description": "Kaygı, stres ve ilişki odaklı görüşmeler.",
        "tag": "Yüz yüze / Online"
      },
      {
        "title": "Çift Terapisi",
        "description": "İletişim ve çatışma çözümü.",
        "tag": "Yüz yüze"
      }
    ]
  },
  "yusuf-kaya": {
    "firm": "Deniz Odyolog",
    "yearsExperience": 7,
    "phone": "0286 250 60 50",
    "whatsapp": "905310006850",
    "email": "yusuf-kaya@canakkaleuzman.com",
    "socials": [
      {
        "type": "instagram",
        "url": "https://instagram.com/"
      }
    ],
    "longBio": [
      "Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.",
      "Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür.",
      "7 yıldır Çanakkale Yenice ve çevresinde çalışıyorum."
    ],
    "expertiseAreas": [
      "Nörolojik rehabilitasyon",
      "Manuel terapi",
      "Ortopedik rehabilitasyon"
    ],
    "reviews": [
      {
        "author": "D. D.",
        "rating": 5,
        "body": "Ağrılarım kısa sürede azaldı.",
        "date": "2026-05-10"
      },
      {
        "author": "D. D.",
        "rating": 5,
        "body": "Çok ilgili ve profesyonel bir yaklaşım.",
        "date": "2026-03-22"
      }
    ],
    "portfolio": [
      {
        "title": "Manuel Terapi",
        "description": "Eklem ve yumuşak doku mobilizasyonu.",
        "tag": "Klinikte"
      },
      {
        "title": "Rehabilitasyon",
        "description": "Ameliyat sonrası dönüş programı.",
        "tag": "6-12 hafta"
      }
    ]
  }
};
