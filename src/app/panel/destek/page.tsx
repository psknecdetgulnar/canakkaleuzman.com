"use client";

import { usePanelProfile } from "@/components/panel/PanelProfileContext";
import { ProfileSwitcher } from "@/components/panel/ProfileSwitcher";
import { SupportSection } from "@/components/SupportSection";

// Uzman → admin destek hattı. Mesajlar /admin panelindeki "Destek" sekmesine
// düşer; admin cevabı burada mesajın altında görünür.
export default function PanelDestekPage() {
  const { experts, activeSlug, loading } = usePanelProfile();
  const active = experts.find((e) => e.id === activeSlug);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Destek</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          Soru, sorun veya önerin için bize yaz. Mesajın yönetim ekibine iletilir; cevap
          geldiğinde bu sayfada mesajının altında görünür.
        </p>
      </div>

      <ProfileSwitcher />

      {!loading && active && (
        <SupportSection senderType="uzman" senderId={active.id} senderName={active.name} />
      )}
    </div>
  );
}
