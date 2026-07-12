// +50 uzman üretir → src/data/experts.generated.ts
import { writeFileSync } from "node:fs";

const TR = { ı:"i", İ:"i", ş:"s", Ş:"s", ğ:"g", Ğ:"g", ç:"c", Ç:"c", ö:"o", Ö:"o", ü:"u", Ü:"u" };
const slugify = (s) => s.trim().replace(/[ıİşŞğĞçÇöÖüÜ]/g,(c)=>TR[c]??c).toLocaleLowerCase("en-US")
  .normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const initials = (n) => n.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toLocaleUpperCase("tr");

const FIRST = ["Ahmet","Mehmet","Mustafa","Ali","Hüseyin","Hasan","İbrahim","Osman","Emre","Kaan","Yusuf","Murat","Serkan","Barış","Onur","Kerem","Tolga","Selim","Cem","Gökhan","Ayşe","Fatma","Elif","Zeynep","Merve","Selin","Deniz","Ece","Gizem","Büşra","Damla","Nur","Sıla","İrem","Melis","Pınar","Ceren","Aslı","Derya","Esra"];
const LAST = ["Yılmaz","Kaya","Demir","Şahin","Çelik","Yıldız","Yıldırım","Öztürk","Aydın","Arslan","Doğan","Kılıç","Aslan","Çetin","Kara","Koç","Kurt","Özkan","Şimşek","Polat","Korkmaz","Erdoğan","Aksoy","Bulut","Güneş","Bozkurt","Turan","Avcı","Taş","Acar"];
const DISTRICTS = ["Merkez","Kepez","Biga","Gelibolu","Ezine","Çan","Ayvacık","Bayramiç","Lapseki","Yenice"];

const CATS = {
  psikoloji: { label:"Psikoloji & Psikoterapi", titles:["Klinik Psikolog","Psikolog","Çocuk ve Ergen Psikoloğu","Aile Danışmanı","Psikolojik Danışman"],
    exp:["Bireysel terapi","Kaygı bozuklukları","İlişki danışmanlığı","Yas danışmanlığı","Ergen danışmanlığı"],
    bio:["Çanakkale'de danışanlarıyla bilişsel davranışçı ve şema terapi yaklaşımlarıyla çalışan bir ruh sağlığı uzmanıyım.","Görüşmeler yüz yüze veya online yürütülür; ilk seans bir tanışma ve ihtiyaç değerlendirmesidir."],
    port:[["Bireysel Terapi","Kaygı, stres ve ilişki odaklı görüşmeler.","Yüz yüze / Online"],["Çift Terapisi","İletişim ve çatışma çözümü.","Yüz yüze"]],
    rev:["Süreç boyunca çok destekleyiciydi.","Kendimi güvende hissettim, çok faydalandım."] },
  saglik: { label:"Sağlık Hizmetleri", titles:["Fizyoterapist","Ergoterapist","Dil ve Konuşma Terapisti","Spor Fizyoterapisti","Odyolog"],
    exp:["Manuel terapi","Ortopedik rehabilitasyon","Spor yaralanmaları","Postür analizi","Nörolojik rehabilitasyon"],
    bio:["Ortopedik ve sportif rehabilitasyon üzerine çalışan bir sağlık uzmanıyım. Bireye özel tedavi programları hazırlıyorum.","Tedavi ev egzersiz programıyla desteklenir ve ilerleme düzenli ölçülür."],
    port:[["Manuel Terapi","Eklem ve yumuşak doku mobilizasyonu.","Klinikte"],["Rehabilitasyon","Ameliyat sonrası dönüş programı.","6-12 hafta"]],
    rev:["Ağrılarım kısa sürede azaldı.","Çok ilgili ve profesyonel bir yaklaşım."] },
  hukuk: { label:"Hukuk & Danışmanlık", titles:["Avukat","Hukuk Danışmanı","Arabulucu","Aile Hukuku Danışmanı","İş Hukuku Danışmanı"],
    exp:["Aile hukuku","İş hukuku","Sözleşmeler","Miras hukuku","İcra takibi"],
    bio:["Çanakkale Barosu'na bağlı olarak aile ve iş hukuku alanlarında dava ve danışmanlık hizmeti veriyorum.","İlk görüşmede sürecin adımları, süresi ve maliyeti açıkça konuşulur."],
    port:[["Boşanma & Velayet","Anlaşmalı ve çekişmeli süreçler.","Dava + Danışmanlık"],["İş Hukuku","İşçi-işveren uyuşmazlıkları.","Danışmanlık"]],
    rev:["Her aşamada net bilgilendirme yaptı.","Sürecim başarıyla sonuçlandı."] },
  egitim: { label:"Eğitim & Koçluk", titles:["Matematik Öğretmeni","İngilizce Öğretmeni","Öğrenci Koçu","Eğitim Koçu","YKS Danışmanı"],
    exp:["Sınav hazırlığı","Çalışma planı","Öğrenci motivasyonu","Deneme analizi","Konu anlatımı"],
    bio:["Öğrencilerle haftalık program, deneme analizi ve motivasyon görüşmeleri yürütüyorum.","Hazır kalıplar yerine öğrencinin gün akışına göre plan çıkarıyorum; veli bilgilendirmesi sürecin parçasıdır."],
    port:[["Birebir Ders","Seviyeye göre haftalık program.","Birebir"],["Sınav Koçluğu","Deneme analizi ve takip.","12. sınıf / mezun"]],
    rev:["Netlerim belirgin arttı.","Düzenli çalışmayı öğrendim."] },
  beslenme: { label:"Beslenme & Diyet", titles:["Diyetisyen","Beslenme Uzmanı","Sporcu Beslenme Uzmanı","Çocuk Beslenme Uzmanı"],
    exp:["Kilo yönetimi","İnsülin direnci","Sporcu beslenmesi","Gebelik beslenmesi","Bitkisel beslenme"],
    bio:["Sürdürülebilir beslenme ve klinik diyetetik üzerine çalışıyorum. Katı yasaklar yerine hayata oturan bir düzen kuruyorum.","Görüşmeler yüz yüze veya online yapılır; süreç kontrol randevularıyla takip edilir."],
    port:[["Kişiye Özel Diyet","Laboratuvar sonuçlarına göre program.","4-12 hafta"],["Online Takip","Haftalık kontrol ve güncelleme.","Online"]],
    rev:["Hiç aç kalmadan hedefime ulaştım.","Değerlerim normale döndü."] },
  "kisisel-gelisim": { label:"Kişisel Gelişim & Yaşam", titles:["Yaşam Koçu","Kariyer Koçu","İlişki Koçu","Mindfulness Eğitmeni","NLP Uzmanı"],
    exp:["Hedef planlama","Kariyer geçişi","Öncelik yönetimi","Farkındalık","Motivasyon"],
    bio:["Bireylerin yaşam dengesi kurması ve hedeflerine ilerlemesi için birebir koçluk yapıyorum.","Her seans sonunda somut bir eylem planı çıkar; süreç haftalık düzendedir."],
    port:[["Birebir Koçluk","Haftalık görüşme ve eylem planı.","Online / Yüz yüze"],["Kariyer Geçişi","Yeni alana yol haritası.","8 seans"]],
    rev:["Kararlarımı netleştirdim.","Bakış açım tamamen değişti."] },
};

const FIRMS = ["Deniz","Boğaz","Truva","Kale","Ege","Marmara","Anafartalar","Kepez","Nefes","Umut"];
const catKeys = Object.keys(CATS);
const seen = new Set(["ayse-demir","mehmet-yildiz","zeynep-kaya","caner-akin","elif-sari","burak-sahin","deniz-aksoy","hakan-demirtas","seda-koc","okan-erol"]);

const experts = [];
const extras = {};
let n = 0, phoneSeq = 100;
outer:
for (let li = 0; li < LAST.length; li++) {
  for (let fi = 0; fi < FIRST.length; fi++) {
    if (n >= 50) break outer;
    const name = `${FIRST[(fi + li) % FIRST.length]} ${LAST[li]}`;
    const id = slugify(name);
    if (seen.has(id)) continue;
    seen.add(id);
    const cat = catKeys[n % catKeys.length];
    const C = CATS[cat];
    const title = C.titles[n % C.titles.length];
    const district = DISTRICTS[n % DISTRICTS.length];
    const rating = [5, 5, 4.9, 4.8, 5, 4.7, 4.9][n % 7];
    const reviewCount = 6 + ((n * 7) % 55);
    const exp = [C.exp[n % C.exp.length], C.exp[(n + 1) % C.exp.length], C.exp[(n + 2) % C.exp.length]];
    const years = 3 + (n % 15);
    n++;
    phoneSeq++;
    experts.push({
      id, name, title, category: cat, categoryLabel: C.label, district,
      rating, reviewCount, initials: initials(name),
      bio: `${C.exp[n % C.exp.length]} ve ${C.exp[(n + 1) % C.exp.length].toLocaleLowerCase("tr")} alanlarında Çanakkale ${district}'de hizmet verir.`,
      services: exp,
      premium: false, // üretilen 50 uzman free tier; 10 el yazımı temel uzman premium
    });
    extras[id] = {
      firm: n % 3 === 0 ? null : `${FIRMS[n % FIRMS.length]} ${title.split(" ")[0]}`,
      yearsExperience: years,
      phone: `0286 ${200 + (n % 90)} ${10 + (n % 80)} ${(n % 90).toString().padStart(2,"0")}`,
      whatsapp: `9053${(10000000 + n * 137).toString().slice(0,8)}`,
      email: `${id}@canakkaleuzman.com`,
      socials: n % 2 === 0 ? [{ type: "instagram", url: "https://instagram.com/" }] : [],
      longBio: [...C.bio, `${years} yıldır Çanakkale ${district} ve çevresinde çalışıyorum.`],
      expertiseAreas: exp,
      reviews: [
        { author: `${FIRST[(n * 3) % FIRST.length][0]}. ${LAST[(n * 5) % LAST.length][0]}.`, rating: 5, body: C.rev[0], date: "2026-05-10" },
        { author: `${FIRST[(n * 7) % FIRST.length][0]}. ${LAST[(n * 2) % LAST.length][0]}.`, rating: rating >= 5 ? 5 : 4, body: C.rev[1], date: "2026-03-22" },
      ],
      portfolio: C.port.map(([t, d, tag]) => ({ title: t, description: d, tag })),
    };
  }
}

const out = `// OTOMATİK ÜRETİLDİ — scripts/gen-experts.mjs
import type { Expert } from "./experts";

type Extra = Record<string, unknown>;

export const generatedExperts: Expert[] = ${JSON.stringify(experts, null, 2)};

export const generatedExtras: Record<string, Extra> = ${JSON.stringify(extras, null, 2)};
`;
writeFileSync("src/data/experts.generated.ts", out, "utf8");
console.log(`YAZILDI ${experts.length} uzman → src/data/experts.generated.ts`);
