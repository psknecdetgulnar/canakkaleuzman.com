import { TrustIcon } from "./Icons";

const items = [
  {
    icon: "shield" as const,
    title: "Güvenilir Uzmanlar",
    text: "Tüm uzmanlarımız titizlikle doğrulanır ve değerlendirilir.",
  },
  {
    icon: "pin" as const,
    title: "Çanakkale’ye Özel",
    text: "Şehrimizdeki uzmanlara hızlı ve kolay erişim sağlar.",
  },
  {
    icon: "star" as const,
    title: "Topluluk Odaklı",
    text: "Çanakkale’nin gelişimine katkı sağlayan bir uzman ağı.",
  },
];

export function WhySection() {
  return (
    <section id="hakkimizda" className="bg-[#f9f9f9] px-5 py-12 md:py-16">
      <div className="mx-auto grid max-w-[860px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-display text-[1.8rem] font-semibold text-[#0d2c4b]">
            Neden Çanakkale Uzman?
          </h2>
          <div className="mt-3 h-px w-9 bg-[#c99a53]" />

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.title} className="grid grid-cols-[48px_1fr] gap-5">
                <TrustIcon type={item.icon} className="h-10 w-10 text-[#0d2c4b]" />
                <div>
                  <h3 className="text-base font-bold text-[#0d2c4b]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#102844]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suluboya: Çanakkale Kalesi ve Şehitler Abidesi. Fon rengi bölüm
            zeminiyle aynı (#f9f9f9) — kenarları erir, tek parça görünür. */}
        <div className="relative">
          <img
            src="/images/suluboya.jpg"
            alt="Çanakkale Kalesi ve Çanakkale Şehitler Abidesi — suluboya"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
