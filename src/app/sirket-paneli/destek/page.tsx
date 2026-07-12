"use client";

import { useCompanyProfile } from "@/components/company-panel/CompanyProfileContext";
import { CompanySwitcher } from "@/components/company-panel/CompanySwitcher";
import { SupportSection } from "@/components/SupportSection";

// Şirket → admin destek hattı (uzman panelindekiyle aynı sistem).
export default function CompanyDestekPage() {
  const { companies, activeId, loading } = useCompanyProfile();
  const active = companies.find((c) => c.id === activeId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Destek</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-[#102844]">
          Soru, sorun veya önerin için bize yaz. Mesajın yönetim ekibine iletilir; cevap
          geldiğinde bu sayfada mesajının altında görünür.
        </p>
      </div>

      <CompanySwitcher />

      {!loading && active && (
        <SupportSection senderType="sirket" senderId={active.id} senderName={active.name} />
      )}
    </div>
  );
}
