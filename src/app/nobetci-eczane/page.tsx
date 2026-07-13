import type { Metadata } from "next";
import { getTodayPharmaciesWithFallback } from "@/lib/pharmacy";
import { ProfileHeaderBar } from "@/components/profile/ProfileHeaderBar";
import { Footer } from "@/components/home/Footer";
import { rootUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nöbetçi Eczaneler | Çanakkale Uzman",
  description: "Bugün Çanakkale'de nöbetçi olan eczaneler.",
  alternates: { canonical: rootUrl("/nobetci-eczane") },
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const WEEKDAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function shortDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Nöbet, bir günün sabahından ertesi günün sabahına kadar sürer (tipik devir
// saati 08:30). "12 Temmuz'u 13 Temmuz'a bağlayan gece" biçiminde, hangi iki
// günü birbirine bağladığını açıkça gösterir.
function dutyNightLabel(iso: string) {
  const start = new Date(`${iso}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${shortDate(start)} → ${shortDate(end)} gecesi (08:30 – 08:30)`;
}

export default async function PharmacyDutyPage() {
  const { pharmacies, date, isStale } = await getTodayPharmaciesWithFallback();

  return (
    <>
      <ProfileHeaderBar />
      <main className="min-h-screen bg-[#fffdf9]">
        <section className="border-b border-[rgba(16,40,68,0.08)] bg-[#f3eee6] px-5 py-12">
          <div className="mx-auto max-w-[760px]">
            <h1 className="font-display text-[2.4rem] font-semibold text-[#0d2c4b] md:text-[3rem]">Nöbetçi Eczaneler</h1>
            <p className="mt-2 text-[#102844]">{formatDate(date)} — Çanakkale</p>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#0d2c4b] px-3.5 py-1.5 text-sm font-semibold text-[#fffdf9]">
              🌙 {dutyNightLabel(date)}
            </p>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto max-w-[760px]">
            {isStale && pharmacies.length > 0 && (
              <div className="mb-4 rounded-[10px] border border-[#c99a53] bg-[#fdf3e9] px-4 py-3 text-sm text-[#7a4f1a]">
                Bugüne ait liste henüz girilmedi. En güncel bilinen liste ({formatDate(date)}) gösteriliyor.
              </div>
            )}
            {pharmacies.length === 0 ? (
              <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
                Nöbetçi eczane kaydı henüz girilmedi.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {pharmacies.map((p) => (
                  <li key={p.id} className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-[1.15rem] font-semibold text-[#0d2c4b]">{p.name}</p>
                      <span className="rounded-full bg-[#0d2c4b] px-3 py-1 text-xs font-semibold text-[#fffdf9]">{p.district}</span>
                    </div>
                    {p.address && <p className="mt-2 text-sm text-[#102844]">{p.address}</p>}
                    {p.phone && (
                      <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="mt-1 inline-block text-sm font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
                        {p.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-6 text-xs text-[rgba(16,40,68,0.5)]">
              Liste her sabah saat 10:00&apos;da güncellenir. Nöbet, gösterilen günün sabahından ertesi
              günün sabahına kadar (08:30 – 08:30) sürer. Acil durumlarda 112&apos;yi arayın.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
