"use client";

import { useCompanyProfile } from "./CompanyProfileContext";

// Demo-modda "hangi şirketi yönetiyorum" seçicisi — ProfileSwitcher'ın
// şirket paneli karşılığı.
export function CompanySwitcher() {
  const { companies, activeId, setActiveId, loading } = useCompanyProfile();

  if (loading || companies.length === 0) return null;

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-[rgba(16,40,68,0.6)]">
        Demo modu: hangi şirketi yönetiyorsun? (gerçek girişte otomatik olacak)
      </span>
      <select
        value={activeId ?? ""}
        onChange={(e) => setActiveId(e.target.value)}
        className="h-11 max-w-sm rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
