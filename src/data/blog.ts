// Blog içerikleri. Her yazının yazarı bir uzmandır (authorId → experts).
import { generatedPosts } from "./blog.generated";

export type BlogPost = {
  slug: string;
  title: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  excerpt: string;
  body: string[]; // paragraflar
};

const basePosts: BlogPost[] = [
  {
    slug: "kaygiyla-basa-cikmanin-yollari",
    title: "Kaygıyla Başa Çıkmanın Beş Pratik Yolu",
    authorId: "ayse-demir",
    authorName: "Ayşe Demir",
    authorTitle: "Klinik Psikolog",
    category: "Psikoloji",
    date: "2026-06-28",
    readMinutes: 5,
    excerpt:
      "Kaygı, tehlike olmadığında bile alarm veren bir sistemdir. Günlük hayatta uygulayabileceğiniz basit ama etkili beş yöntemi paylaşıyorum.",
    body: [
      "Kaygı, bedenimizin bizi korumak için geliştirdiği doğal bir tepkidir. Sorun, bu alarmın gerçek bir tehlike olmadığında da çalmasıdır. İyi haber şu: kaygıyı yönetmek öğrenilebilir bir beceridir.",
      "Birinci adım, bedensel belirtileri fark etmektir. Hızlı kalp atışı, sığ nefes ve gerginlik birer düşman değil, veridir. Bunları fark etmek, kontrolü geri almanın ilk aşamasıdır.",
      "İkinci adım nefesi yavaşlatmaktır. Dört saniye alıp altı saniye vermek, bedene tehlikenin geçtiğini bildirir. Bu basit egzersiz, panik anlarında dahi işe yarar.",
      "Üçüncü adım düşünceyi sınamaktır. \"En kötü ne olabilir?\" sorusunun yanıtını yazmak, çoğu zaman zihnin ürettiği felaketin gerçeğin çok ötesinde olduğunu gösterir.",
      "Dördüncü ve beşinci adımlar ise düzenli uyku ve hareketle ilgilidir. Kaygı günlük yaşamı kısıtlıyorsa, bir uzmandan destek almak en sağlıklı seçimdir.",
    ],
  },
  {
    slug: "saglikli-kilo-vermenin-temelleri",
    title: "Sağlıklı Kilo Vermenin Temelleri: Diyet Değil, Düzen",
    authorId: "mehmet-yildiz",
    authorName: "Mehmet Yıldız",
    authorTitle: "Diyetisyen",
    category: "Beslenme",
    date: "2026-06-20",
    readMinutes: 6,
    excerpt:
      "Katı yasak listeleri uzun vadede işe yaramaz. Sürdürülebilir kilo yönetiminin sırrı, hayatınıza oturan bir beslenme düzenidir.",
    body: [
      "Çoğu insan kilo verme sürecine bir yasak listesiyle başlar. Oysa katı diyetler kısa vadede sonuç verse de, uzun vadede terk edilir ve kaybedilen kilolar geri gelir.",
      "Sürdürülebilir kilo yönetiminin temeli, öğün düzenidir. Uzun açlıklar yerine dengeli aralıklarla beslenmek, kan şekerini stabil tutar ve ani atıştırma isteğini azaltır.",
      "Tabağınızın yarısını sebze, çeyreğini kaliteli protein, çeyreğini tam tahıl oluştursun. Bu basit kural, kalori saymadan porsiyon dengesini sağlar.",
      "Su tüketimini ihmal etmeyin; çoğu zaman açlık sandığımız his aslında susuzluktur. Her bireyin metabolizması farklıdır, bu yüzden en doğrusu kişiye özel bir program çıkarmaktır.",
    ],
  },
  {
    slug: "bosanma-surecinde-bilmeniz-gerekenler",
    title: "Boşanma Sürecinde Bilmeniz Gereken Temel Haklar",
    authorId: "zeynep-kaya",
    authorName: "Zeynep Kaya",
    authorTitle: "Avukat",
    category: "Hukuk",
    date: "2026-06-12",
    readMinutes: 7,
    excerpt:
      "Boşanma yalnızca duygusal değil, hukuki bir süreçtir. Velayet, nafaka ve mal paylaşımında haklarınızı bilmek süreci kolaylaştırır.",
    body: [
      "Boşanma kararı verildiğinde, sürecin hukuki boyutunu anlamak kişiye büyük güven verir. Anlaşmalı ve çekişmeli boşanma olmak üzere iki temel yol vardır.",
      "Anlaşmalı boşanmada taraflar velayet, nafaka ve mal paylaşımı konularında uzlaşır; süreç tek celsede tamamlanabilir. Çekişmeli boşanma ise daha uzun sürer ve delil sunmayı gerektirir.",
      "Velayet, çocuğun üstün yararı gözetilerek belirlenir. Nafaka ise iştirak, yoksulluk ve tedbir nafakası olarak farklı biçimlerde gündeme gelebilir.",
      "Sürece başlamadan önce bir avukatla görüşmek, hangi yolun size uygun olduğunu ve muhtemel süreyi netleştirir. Bilgi, bu süreçte en büyük güç kaynağıdır.",
    ],
  },
  {
    slug: "bel-agrisina-karsi-egzersizler",
    title: "Bel Ağrısına Karşı Evde Yapabileceğiniz Egzersizler",
    authorId: "caner-akin",
    authorName: "Caner Akın",
    authorTitle: "Fizyoterapist",
    category: "Sağlık",
    date: "2026-06-05",
    readMinutes: 5,
    excerpt:
      "Masabaşı çalışanların en sık şikayeti bel ağrısı. Doğru egzersizlerle ağrıyı azaltmak ve tekrarını önlemek mümkün.",
    body: [
      "Uzun süre oturmak, bel bölgesindeki kasların zayıflamasına ve ağrıya yol açar. İyi haber, düzenli ve doğru egzersizlerle bu ağrıların çoğu önlenebilir.",
      "Köprü egzersizi, kalça ve bel kaslarını güçlendirir: sırt üstü yatın, dizleri bükün ve kalçanızı yavaşça yukarı kaldırın. Günde iki set, on tekrar iyi bir başlangıçtır.",
      "Kedi-deve hareketi, omurga esnekliğini artırır. Dört ayak pozisyonunda sırtınızı önce yukarı yuvarlayın, sonra hafifçe çukurlaştırın.",
      "Ağrı şiddetliyse, bacağa yayılıyorsa veya iki haftadan uzun sürüyorsa mutlaka bir uzmana başvurun. Bu egzersizler genel öneridir; kişisel programın yerini tutmaz.",
    ],
  },
  {
    slug: "ielts-hazirlik-hatalari",
    title: "IELTS'e Hazırlanırken En Sık Yapılan Beş Hata",
    authorId: "hakan-demirtas",
    authorName: "Hakan Demirtaş",
    authorTitle: "İngilizce Öğretmeni",
    category: "Eğitim",
    date: "2026-05-30",
    readMinutes: 6,
    excerpt:
      "Yıllardır IELTS öğrencileriyle çalışıyorum. Hedef puana ulaşmayı geciktiren, ama kolayca düzeltilebilen beş yaygın hatayı derledim.",
    body: [
      "IELTS hazırlığında en sık gördüğüm hata, sınav formatını tanımadan çalışmaya başlamaktır. Her bölümün kendine has bir stratejisi vardır ve bunu bilmek zaman kazandırır.",
      "İkinci hata, konuşma pratiğini erteleme eğilimidir. Speaking bölümü, ancak düzenli konuşarak gelişir; teoriyle değil.",
      "Üçüncü hata, kelime ezberine gereğinden fazla yüklenmektir. Kelimeyi bağlam içinde öğrenmek, ezberlemekten çok daha kalıcıdır.",
      "Dördüncü ve beşinci hatalar, deneme sınavı çözmemek ve yazma bölümünde geri bildirim almamaktır. Hedef puana giden yol, düzenli deneme ve dışarıdan değerlendirmeden geçer.",
    ],
  },
];

export const blogPosts: BlogPost[] = [...basePosts, ...generatedPosts];

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
