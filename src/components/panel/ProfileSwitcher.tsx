"use client";

import Link from "next/link";
import { usePanelProfile } from "./PanelProfileContext";

// Panelin tüm sayfalarında görünen, tek bir yerden yönetilen profil seçici.
// Gerçek giriş (auth) eklendiğinde bu bileşen tamamen kaldırılacak; o zamana
// kadar hangi profilin düzenlendiği burada açıkça gösterilir (Görev 3/5).
export function ProfileSwitcher() {
  const { experts, loading, activeSlug, setActiveSlug } = usePanelProfile();
  const active = experts.find((e) => e.id === activeSlug);

  if (loading) {
    return <div className="h-[52px] animate-pulse rounded-[10px] bg-[#f3eee6]" />;
  }

  if (experts.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[rgba(16,40,68,0.18)] bg-[#f3eee6] px-4 py-4 text-sm text-[#102844]">
        Henüz onaylanmış uzman profili yok. Ana sayfadaki <strong>Kayıt Ol</strong> formundan
        başvuru yapılabilir; başvurular yönetici onayından sonra burada görünür.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d2c4b] text-xs font-semibold text-[#fffdf9]">
          {active?.initials ?? "?"}
        </span>
        <div className="text-sm">
          <div className="text-[rgba(16,40,68,0.6)]">Düzenlenen profil</div>
          <div className="flex items-center gap-2 font-semibold text-[#0d2c4b]">
            {active ? `${active.name} — ${active.title}` : "Profil seçilmedi"}
            {active?.premium && (
              <span className="rounded-full bg-[#c99a53] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#fffdf9]">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          aria-label="Düzenlenecek profili seç"
          value={activeSlug ?? ""}
          onChange={(e) => setActiveSlug(e.target.value)}
          className="h-10 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
        >
          {experts.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {e.title}
            </option>
          ))}
        </select>
        {active && (
          <Link href={`/uzman/${active.id}`} target="_blank" className="text-sm font-semibold text-[#0d2c4b] hover:text-[#c99a53]">
            Profili görüntüle →
          </Link>
        )}
      </div>
    </div>
  );
}
