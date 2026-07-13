"use client";

import { useCompanyProfile } from "./CompanyProfileContext";
import { signOut } from "@/lib/adminAuth";

// Şirket paneli üst çubuğu: şirket sahibi kendi şirketini görür (seçici yok),
// admin tüm şirketler arasında geçiş yapabilir.
export function CompanySwitcher() {
  const { companies, activeId, setActiveId, loading, role } = useCompanyProfile();
  const active = companies.find((c) => c.id === activeId);

  if (loading || companies.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d2c4b] text-xs font-semibold text-[#fffdf9]">
          {active?.logoInitials ?? "?"}
        </span>
        <div className="text-sm">
          <div className="text-[rgba(16,40,68,0.6)]">{role === "admin" ? "Yönetilen şirket (admin)" : "Şirketin"}</div>
          <div className="font-semibold text-[#0d2c4b]">{active?.name ?? "Şirket seçilmedi"}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {role === "admin" && (
          <select
            aria-label="Yönetilecek şirketi seç"
            value={activeId ?? ""}
            onChange={(e) => setActiveId(e.target.value)}
            className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => signOut().then(() => window.location.reload())}
          className="text-sm font-semibold text-[rgba(16,40,68,0.5)] transition-colors hover:text-[#b3261e]"
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}
