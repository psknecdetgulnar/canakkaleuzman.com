// +20 blog yazısı üretir → src/data/blog.generated.ts. Yazarlar üretilen uzmanlar.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/data/experts.generated.ts", "utf8");
const json = src.slice(src.indexOf("generatedExperts: Expert[] = ") + "generatedExperts: Expert[] = ".length);
const arr = JSON.parse(json.slice(0, json.indexOf("\n];\n") + 2));
const byCat = {};
for (const e of arr) (byCat[e.category] ??= []).push(e);

const TR = { ı:"i", İ:"i", ş:"s", Ş:"s", ğ:"g", Ğ:"g", ç:"c", Ç:"c", ö:"o", Ö:"o", ü:"u", Ü:"u" };
const slugify = (s) => s.trim().replace(/[ıİşŞğĞçÇöÖüÜ]/g,(c)=>TR[c]??c).toLocaleLowerCase("en-US")
  .normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");

// [category, blogCategory, title, excerpt, body[]]
const TOPICS = [
  ["psikoloji","Psikoloji","Panik Atak Anında Ne Yapmalı?","Panik atak korkutucu olsa da yaşamı tehdit etmez. Kriz anında uygulayabileceğiniz somut adımları anlatıyorum.",["Panik atak, bedenin yanlış alarm vermesidir; gerçek bir tehlike olmasa da kalp çarpıntısı ve nefes darlığı yaşanır.","Kriz anında dikkatinizi beş duyunuza verin: gördüğünüz beş şeyi, duyduğunuz dört sesi sayın. Bu, zihni şimdiki ana getirir.","Nefesinizi yavaşlatın; dört saniye alıp altı saniye vermek bedeni sakinleştirir. Ataklar sıklaşıyorsa bir uzmana başvurun."]],
  ["psikoloji","Psikoloji","Çocuklarda Sınav Kaygısıyla Baş Etmek","Sınav kaygısı doğru desteklenmediğinde başarıyı düşürür. Ebeveynlerin yapabileceği birkaç şey var.",["Çocuğun kaygısını 'boş ver' diyerek geçiştirmek işe yaramaz; duygusunu adlandırmasına yardımcı olmak daha etkilidir.","Sonuç değil çaba övülmeli. 'Çok çalıştın' cümlesi, 'Aferin zekisin'den daha sağlıklı bir motivasyon kaynağıdır.","Uyku ve beslenme düzeni kaygıyı doğrudan etkiler. Kaygı günlük yaşamı bozuyorsa profesyonel destek önerilir."]],
  ["psikoloji","Psikoloji","İlişkilerde Sağlıklı İletişimin Üç Kuralı","Çiftler arasındaki çoğu sorun içerikten çok iletişim biçiminden kaynaklanır.",["Suçlayıcı 'sen' dili yerine 'ben' dili kullanmak savunmayı azaltır: 'Beni yalnız hissettiriyorsun' demek, 'Sen hep meşgulsün'den daha yapıcıdır.","Dinlemek, yanıt hazırlamak için beklemek değildir. Karşınızdakini anladığınızı özetlemek bağı güçlendirir.","Tartışmalarda mola vermek zayıflık değil olgunluktur. Sakinleşince konuşmak çözümü kolaylaştırır."]],
  ["saglik","Sağlık","Masabaşı Çalışanlar İçin Postür Önerileri","Uzun süre oturmak boyun ve bel sorunlarının başlıca nedeni. Küçük düzenlemeler büyük fark yaratır.",["Ekranın üst kenarı göz hizasında olmalı; böylece boyun sürekli öne eğilmez. Ayaklar yere tam basmalı.","Her 45 dakikada bir ayağa kalkıp birkaç dakika yürümek, kasların kasılmasını önler.","Omuz ve boyun için basit germe hareketleri gün içinde tekrarlanmalı. Ağrı kalıcıysa bir fizyoterapiste danışın."]],
  ["saglik","Sağlık","Spor Yaralanmalarında İlk 48 Saat","Doğru ilk müdahale, iyileşme süresini belirgin biçimde kısaltır.",["Akut yaralanmada RICE ilkesi geçerlidir: dinlenme, buz, kompresyon ve elevasyon. İlk 48 saat sıcak uygulamadan kaçının.","Ağrı ve şişlik artıyorsa, eklemde stabilite kaybı varsa mutlaka değerlendirme yaptırın.","Erken ve kontrollü hareket, tam istirahatten daha iyi sonuç verir; ancak bu bir uzman gözetiminde olmalıdır."]],
  ["saglik","Sağlık","Bel Fıtığında Ameliyat Şart mı?","Bel fıtığı tanısı her zaman ameliyat anlamına gelmez. Konservatif tedavi çoğu vakada yeterlidir.",["Bel fıtığı vakalarının büyük kısmı egzersiz, fizik tedavi ve yaşam tarzı düzenlemeleriyle yönetilebilir.","Kas gücünü artıran ve kcore'u destekleyen egzersizler, ağrının tekrarını önlemede kritik rol oynar.","İlerleyen güç kaybı veya idrar-dışkı kontrolü sorunu varsa cerrahi değerlendirme gerekir; bu istisnai bir durumdur."]],
  ["hukuk","Hukuk","Kira Sözleşmesinde Dikkat Edilmesi Gerekenler","Sözleşme imzalamadan önce birkaç maddeyi netleştirmek ileride sorun yaşamayı önler.",["Depozito tutarı, iadesinin şartları ve süresi sözleşmede açıkça yazılmalı. Sözlü mutabakat ispat açısından zayıftır.","Zam oranı yasal sınırlar içinde belirlenmeli; sözleşmeye eklenen fahiş artış maddeleri geçersiz olabilir.","Tahliye ve fesih koşulları önceden okunmalı. Tereddüt halinde bir hukuk danışmanına başvurmak en sağlıklısıdır."]],
  ["hukuk","Hukuk","İş Yerinde Haklarınız: Fazla Mesai ve İzin","Çalışanların çoğu temel haklarını bilmediği için hak kaybına uğrar.",["Fazla mesai, haftalık 45 saati aşan çalışmadır ve yüzde elli zamlı ücret gerektirir. Onay ve kayıt önemlidir.","Yıllık izin, kıdeme göre belirlenir ve kullandırılması işverenin yükümlülüğüdür; parasal karşılığı ancak fesihte gündeme gelir.","Haklarınızın ihlali halinde arabuluculuk çoğu uyuşmazlıkta zorunlu ilk adımdır."]],
  ["hukuk","Hukuk","Miras Paylaşımında Temel Kavramlar","Miras süreci duygusal olduğu kadar hukuki bir konudur; temel kavramları bilmek süreci kolaylaştırır.",["Yasal mirasçılar ve saklı pay kavramı, paylaşımın çerçevesini belirler. Vasiyet bu sınırlar içinde geçerlidir.","Mirasın reddi belirli süreler içinde yapılmalıdır; aksi halde borçlar da devralınmış sayılabilir.","Anlaşmazlık halinde ortaklığın giderilmesi davası gündeme gelir; öncesinde danışmanlık zaman ve maliyet kazandırır."]],
  ["egitim","Eğitim","Verimli Ders Çalışmanın Bilimsel Yolları","Saatlerce çalışmak değil, doğru çalışmak fark yaratır.",["Aralıklı tekrar, bilgiyi kalıcı kılar: konuyu bir gün, üç gün ve bir hafta sonra tekrar etmek ezberden etkilidir.","Pomodoro tekniğiyle 25 dakikalık odaklı bloklar, dikkat süresini korur ve tükenmeyi önler.","Aktif hatırlama, pasif okumadan üstündür; konuyu kapatıp kendinize anlatmak en iyi testtir."]],
  ["egitim","Eğitim","YKS'ye Son Ay Nasıl Hazırlanılır?","Son ay yeni konu öğrenme değil, pekiştirme ve deneme zamanıdır.",["Bu dönemde eksik konu kapatmak yerine güçlü olduğunuz alanları sağlamlaştırmak puanı daha çok artırır.","Her gün deneme çözmek ve yanlışları analiz etmek, sınav temposunu kazandırır.","Uyku düzenini bozmamak, son ayın en önemli ama en çok ihmal edilen kuralıdır."]],
  ["egitim","Eğitim","İngilizce Öğrenmede En Sık Yapılan Hatalar","Yıllarca çalışıp ilerleyememenin arkasında genellikle birkaç yaygın hata vardır.",["Kelimeyi listeden ezberlemek yerine bağlam içinde öğrenmek kalıcılığı artırır.","Konuşmaktan çekinmek ilerlemeyi durdurur; hata yapmak öğrenmenin doğal parçasıdır.","Dizi ve podcast gibi gerçek içeriklerle düzenli temas, ders kitabından daha hızlı sonuç verir."]],
  ["beslenme","Beslenme","Detoks Diyetleri Gerçekten İşe Yarıyor mu?","Popüler detoks vaatlerinin bilimsel dayanağı çoğu zaman zayıftır.",["Vücut, karaciğer ve böbrekler aracılığıyla zaten kendini arındırır; 'detoks' ürünlerine ihtiyaç duymaz.","Aşırı kısıtlayıcı detoks programları kas kaybına ve yo-yo etkisine yol açabilir.","Sağlıklı olmanın yolu tek seferlik kürlerden değil, sürdürülebilir bir beslenme düzeninden geçer."]],
  ["beslenme","Beslenme","Sağlıklı Atıştırmalık Alternatifleri","Öğün aralarındaki seçimler, günlük dengenin görünmeyen belirleyicisidir.",["Cips ve bisküvi yerine kuruyemiş, yoğurt veya meyve, hem tok tutar hem kan şekerini dengeler.","Atıştırmalığı porsiyonlayarak hazırlamak, farkında olmadan fazla yemeyi önler.","Su tüketimini artırmak, çoğu zaman açlık sanılan susuzluk hissini ortadan kaldırır."]],
  ["beslenme","Beslenme","Sporcularda Öğün Zamanlaması","Ne yediğiniz kadar ne zaman yediğiniz de performansı etkiler.",["Antrenman öncesi kompleks karbonhidrat, dayanıklılık için enerji sağlar.","Antrenman sonrası ilk saat, protein ve karbonhidrat alımı için önemli bir penceredir.","Her sporcunun ihtiyacı farklıdır; program bireysel hedeflere göre kurulmalıdır."]],
  ["kisisel-gelisim","Kişisel Gelişim","Erteleme Alışkanlığını Kırmanın Yolları","Erteleme bir tembellik değil, çoğu zaman bir kaygı yönetimi sorunudur.",["Büyük görevleri küçük ve somut adımlara bölmek, başlama direncini azaltır.","'İki dakika kuralı': iki dakikada yapılabilecek bir işi hemen yapmak momentum kazandırır.","Kendinize karşı sert olmak ertelemeyi artırır; şefkatli bir yaklaşım daha sürdürülebilirdir."]],
  ["kisisel-gelisim","Kişisel Gelişim","Kariyer Değişikliğine Nasıl Karar Verilir?","Kariyer geçişi büyük bir karardır; duygularla değil, bir çerçeveyle ele alınmalıdır.",["Önce mevcut işte sizi yoran şeyin sektör mü yoksa koşullar mı olduğunu ayırt edin.","Yeni alanı denemeden büyük adım atmayın; küçük projeler ve görüşmeler risksiz bir keşif sağlar.","Finansal bir geçiş planı, kararı kaygıdan çıkarıp yönetilebilir kılar."]],
  ["kisisel-gelisim","Kişisel Gelişim","Farkındalık (Mindfulness) Nedir, Nasıl Başlanır?","Farkındalık, şimdiki ana yargısızca dikkat vermektir ve öğrenilebilir bir beceridir.",["Günde beş dakika nefese odaklanmak bile başlangıç için yeterlidir; süre zamanla artırılır.","Zihnin dağılması başarısızlık değildir; fark edip nazikçe geri dönmek pratiğin ta kendisidir.","Düzenli farkındalık, stresi azaltır ve dikkat süresini uzatır."]],
  ["psikoloji","Psikoloji","Yas Sürecinde Kendinize İzin Verin","Kayıp sonrası yaşanan duygular karmaşık ve kişiseldir; 'doğru' bir yas yoktur.",["Yas doğrusal ilerlemez; iyi ve kötü günler iç içe geçer. Bu normaldir.","Duyguları bastırmak süreci uzatır; hissetmeye izin vermek iyileşmenin parçasıdır.","Günlük işlevsellik uzun süre bozuluyorsa, bir uzmandan destek almak güçsüzlük değil öz bakımdır."]],
  ["saglik","Sağlık","Doğru Nefes Almak Neden Önemli?","Yüzeysel nefes, farkında olmadan gerginlik ve yorgunluk yaratır.",["Diyafram nefesi, karnı şişirerek alınan derin nefestir ve gevşemeyi tetikler.","Gün içinde birkaç kez bilinçli derin nefes almak, stres seviyesini düşürür.","Solunum egzersizleri, fizik tedavi programlarının da sık kullanılan bir parçasıdır."]],
];

const posts = [];
const counters = {};
for (let i = 0; i < TOPICS.length; i++) {
  const [cat, blogCat, title, excerpt, body] = TOPICS[i];
  const pool = byCat[cat] ?? [];
  counters[cat] = (counters[cat] ?? 0);
  const author = pool.length ? pool[counters[cat]++ % pool.length] : null;
  if (!author) continue;
  const dayOffset = i * 3;
  const d = new Date("2026-06-25"); d.setDate(d.getDate() - dayOffset);
  posts.push({
    slug: slugify(title),
    title,
    authorId: author.id,
    authorName: author.name,
    authorTitle: author.title,
    category: blogCat,
    date: d.toISOString().slice(0, 10),
    readMinutes: 4 + (i % 4),
    excerpt,
    body,
  });
}

const out = `// OTOMATİK ÜRETİLDİ — scripts/gen-blog.mjs
import type { BlogPost } from "./blog";

export const generatedPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;
writeFileSync("src/data/blog.generated.ts", out, "utf8");
console.log(`YAZILDI ${posts.length} blog yazısı → src/data/blog.generated.ts`);
