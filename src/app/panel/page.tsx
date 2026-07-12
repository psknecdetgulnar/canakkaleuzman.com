"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePanelProfile } from "@/components/panel/PanelProfileContext";
import { ProfileSwitcher } from "@/components/panel/ProfileSwitcher";
import { loadProfileOverride } from "@/lib/profileStore";
import { getAppointments } from "@/lib/appointments";

// Panel hub'ı: profil düzenleme ZORUNLU değildir. Profilin platform
// varsayılanlarıyla otomatik yayında kalır; bu panel yalnızca özelleştirmek
// isteyen uzmanlar için isteğe bağlı bir araç setidir (Görev 5).
export default function PanelHubPage() {
  const { experts, activeSlug, loading } = usePanelProfile();
  const isPremium = Boolean(experts.find((e) => e.id === activeSlug)?.premium);
  const [pending, setPending] = useState<number | null>(null);
  const [customized, setCustomized] = useState<boolean | null>(null);
  const [calendarOn, setCalendarOn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!activeSlug) return;
    let active = true;
    setPending(null);
    setCustomized(null);
    setCalendarOn(null);
    Promise.all([getAppointments(activeSlug), loadProfileOverride(activeSlug)]).then(([appts, override]) => {
      if (!active) return;
      setPending(appts.filter((a) => a.status === "pending").length);
      setCustomized(Boolean(override && Object.keys(override.fields ?? {}).length > 0));
      setCalendarOn(Boolean(override?.calendar?.enabled));
    });
    return () => {
      active = false;
    };
  }, [activeSlug]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Panel</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          Bu paneli kullanmak zorunlu değildir. Her uzmanın profili, platform varsayılanlarıyla
          otomatik olarak yayında kalır. Aşağıdaki araçları yalnızca profilini özelleştirmek,
          randevu takvimi eklemek veya gelen talepleri görmek istediğinde kullan.
        </p>
      </div>

      <ProfileSwitcher />

      {!loading && activeSlug && (
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Bekleyen randevu talebi"
            value={pending}
            accent={pending !== null && pending > 0}
            sublabel={!isPremium && pending !== null && pending > 0 ? "Detaylar premium'da" : undefined}
          />
          <StatCard label="Profil özelleştirildi mi" value={customized === null ? null : customized ? "Evet" : "Hayır (varsayılan)"} />
          <StatCard label="Randevu takvimi" value={calendarOn === null ? null : calendarOn ? "Açık" : "Kapalı"} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <PanelLink
          href="/panel/profil"
          title="Profil düzenle"
          description="Hakkımda, uzmanlık alanları, sekme başlıkları, görünürlük ve randevu takvimini yönet."
        />
        <PanelLink
          href="/panel/gelen-kutusu"
          title="Gelen kutusu"
          description={
            isPremium
              ? "Ziyaretçilerin randevu talepleri; onayla, reddet veya WhatsApp'tan yaz."
              : "Talep geldiğini bildirim olarak görürsün; ad/telefon/not premium'da açılır."
          }
          badge={pending && pending > 0 ? `${pending} yeni` : undefined}
        />
        <PanelLink
          href="/panel/blog"
          title="Blog"
          description="Görselsiz, sade metin yazılar ekle. Taslak kaydet veya doğrudan yayınla."
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  sublabel,
}: {
  label: string;
  value: string | number | null;
  accent?: boolean;
  sublabel?: string;
}) {
  return (
    <div className="rounded-[12px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
      <div className="text-xs text-[rgba(16,40,68,0.6)]">{label}</div>
      <div className={`mt-1 font-display text-[1.6rem] font-semibold ${accent ? "text-[#c99a53]" : "text-[#0d2c4b]"}`}>
        {value === null ? "…" : value}
      </div>
      {sublabel && <div className="mt-0.5 text-[0.7rem] text-[#c99a53]">🔒 {sublabel}</div>}
    </div>
  );
}

function PanelLink({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_10px_30px_rgba(13,44,75,0.05)] transition-shadow hover:shadow-[0_16px_40px_rgba(13,44,75,0.09)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-[1.25rem] font-semibold text-[#0d2c4b]">{title}</span>
        {badge && (
          <span className="rounded-full bg-[#c99a53] px-2.5 py-1 text-xs font-semibold text-[#fffdf9]">{badge}</span>
        )}
      </div>
      <p className="mt-2 text-sm text-[#102844]">{description}</p>
      <span className="mt-4 text-sm font-semibold text-[#0d2c4b]">Aç →</span>
    </Link>
  );
}
