import Link from "next/link";
import type { PharmacyDuty } from "@/lib/pharmacy";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

// Nöbet, gösterilen günün sabahından ertesi güne (08:30 – 08:30) sürer.
function dutyNight(iso: string) {
  const start = new Date(`${iso}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${start.getDate()} ${MONTHS[start.getMonth()]} → ${end.getDate()} ${MONTHS[end.getMonth()]}`;
}

// Sayfanın en tepesinde, ilk göze çarpan şerit: bugün nöbetçi olan
// eczaneler. Herkesin işine yarayan pratik bir bilgi olduğu için dizinin
// önüne (Hero'nun bile üstüne) alındı.
export function HomePharmacyBanner({ pharmacies, date }: { pharmacies: PharmacyDuty[]; date?: string }) {
  if (pharmacies.length === 0) return null;

  return (
    <div className="border-b border-[rgba(16,40,68,0.10)] bg-[#fdf3e9]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c0392b] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c0392b]" />
          </span>
          <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wide text-[#c0392b]">
            Nöbetçi Eczane
          </span>
          {date && (
            <span className="hidden whitespace-nowrap text-xs font-semibold text-[#7a4f1a] sm:inline">
              🌙 {dutyNight(date)} gecesi
            </span>
          )}
        </div>

        <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pharmacies.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href="/nobetci-eczane"
              className="flex shrink-0 items-center gap-2 rounded-full border border-[rgba(16,40,68,0.12)] bg-[#fffdf9] px-3.5 py-1.5 text-xs font-semibold text-[#0d2c4b] transition-colors hover:border-[#c99a53]"
            >
              {p.name}
              <span className="font-normal text-[rgba(16,40,68,0.55)]">· {p.district}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/nobetci-eczane"
          className="shrink-0 whitespace-nowrap text-xs font-bold text-[#0d2c4b] transition-colors hover:text-[#c99a53]"
        >
          Tüm Liste →
        </Link>
      </div>
    </div>
  );
}
