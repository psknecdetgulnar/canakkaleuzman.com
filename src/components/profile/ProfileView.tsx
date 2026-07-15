"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExpertProfile, ProfileSectionKey } from "@/data/experts";
import { loadProfileOverride, type ProfileOverride } from "@/lib/profileStore";
import { ExpertPhoto } from "@/components/ExpertPhoto";
import { profileUrl, safeExternalUrl } from "@/lib/site";
import { createAppointment, getBookedSlots } from "@/lib/appointments";
import { ShareProfileModal } from "./ShareProfileModal";
import { track } from "@/lib/analytics";

const TABS: { key: ProfileSectionKey; label: string }[] = [
  { key: "about", label: "Hakkımda" },
  { key: "expertise", label: "Uzmanlık Alanlarım" },
  { key: "reviews", label: "Müşteri Yorumları" },
  { key: "portfolio", label: "Portföyüm" },
];

export function ProfileView({ profile: base }: { profile: ExpertProfile }) {
  // Panelde yapılan düzenlemeler (localStorage) profile'a bindirilir.
  const [override, setOverride] = useState<ProfileOverride | null>(null);
  useEffect(() => {
    let active = true;
    loadProfileOverride(base.slug).then((o) => {
      if (active) setOverride(o);
    });
    return () => {
      active = false;
    };
  }, [base.slug]);

  const profile = useMemo<ExpertProfile>(() => {
    if (!override) return base;
    return {
      ...base,
      ...override.fields,
      visibility: { ...base.visibility, ...override.visibility },
    };
  }, [base, override]);

  // Bölüm başlıkları panelden yeniden adlandırılabilir (en fazla 4 sekme görünür).
  const labelOf = (key: ProfileSectionKey) =>
    override?.sectionLabels?.[key]?.trim() || TABS.find((t) => t.key === key)!.label;
  const visibleTabs = TABS
    .filter((t) => profile.visibility[t.key] && hasContent(profile, t.key))
    .slice(0, 4);
  const [active, setActive] = useState<ProfileSectionKey>("about");
  const current = visibleTabs.find((t) => t.key === active) ? active : visibleTabs[0]?.key ?? "about";

  // Instagram paylaşım kartı modalı ("Profili Paylaş" butonu açar).
  const [shareOpen, setShareOpen] = useState(false);

  // Analitik: sayfa görüntülenmesi (bir kez, kişisel veri yok).
  useEffect(() => {
    track("profile_view", base.slug);
  }, [base.slug]);

  // Zaten talep edilmiş (reddedilmemiş/iptal olmamış) gün+saat çiftleri —
  // çifte rezervasyonu önlemek için takvimden gizlenir. Randevu tablosu artık
  // sahibe kilitli olduğundan PII sızdırmayan booked_slots RPC'si kullanılır.
  const [bookedKeys, setBookedKeys] = useState<Set<string>>(new Set());
  useEffect(() => {
    let active = true;
    getBookedSlots(base.slug).then((slots) => {
      if (!active) return;
      setBookedKeys(new Set(slots.map((s) => `${s.day}|${s.time}`)));
    });
    return () => {
      active = false;
    };
  }, [base.slug]);

  const calendar = override?.calendar;
  const availableSlots = (calendar?.slots ?? []).filter((s) => !bookedKeys.has(`${s.day}|${s.time}`));
  const showCalendar = Boolean(calendar?.enabled && availableSlots.length);
  // Takvimden seçilen saat, aşağıdaki forma taşınır ve gerçek bir talep olarak
  // Supabase'e (dolayısıyla uzmanın Gelen Kutusu'na) kaydedilir — daha önce
  // takvim tıklaması yalnızca WhatsApp açıyor, talep hiç kaydedilmiyordu.
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#102844]">
      {/* Kapak bandı — eskiz dokulu, kompakt */}
      <div className="relative h-[150px] w-full overflow-hidden bg-[#1a3652]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#16304d_0%,#1a3652_55%,#22496b_100%)]" />
        <img
          src="/images/cta-horse-v3.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-[4%] hidden h-[80%] w-auto object-contain opacity-50 md:block"
        />
        <img
          src="/images/cta-bridge-v3.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 right-[4%] hidden h-[80%] w-auto object-contain opacity-50 md:block"
        />
      </div>

      {/* relative z-10: içerik konumlanmış kapak bandının ÜSTÜNde boyanır
          (yoksa statik kart, positioned kapağın altında kalıp örtülür) */}
      <div className="relative z-10 mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-start">
          {/* Sol kart: foto + iletişim — sadece bu kart kapağa taşar */}
          <aside className="-mt-16 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_18px_44px_rgba(13,44,75,0.10)] md:-mt-24">
            <div className="mx-auto h-[180px] w-[180px] overflow-hidden rounded-full border-4 border-[#0d2c4b] bg-[#eef1f4]">
              <ExpertPhoto name={profile.name} title={profile.title} className="h-full w-full object-cover" />
            </div>
            {profile.premium ? (
              <>
                <div className="mt-4 space-y-2" onClickCapture={(e) => {
                  // Dönüşüm takibi: tıklanan iletişim kanalını kaydet (PII yok).
                  const href = (e.target as HTMLElement).closest("a")?.getAttribute("href") ?? "";
                  if (href.startsWith("tel:")) track("phone_click", base.slug);
                  else if (href.startsWith("mailto:")) track("email_click", base.slug);
                  else if (href.includes("wa.me")) track("whatsapp_click", base.slug);
                }}>
                  {profile.email && (
                    <ContactRow label="Bana yazın" value={profile.email} href={`mailto:${profile.email}`} icon="✉" />
                  )}
                  {profile.phone && (
                    <ContactRow label="Beni arayın" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, "")}`} icon="☎" />
                  )}
                  {profile.whatsapp && (
                    <ContactRow label="WhatsApp'tan ulaşın" value={`+${profile.whatsapp}`} href={`https://wa.me/${profile.whatsapp}`} icon="⌾" />
                  )}
                </div>
                {profile.socials.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.socials.map((s) => {
                      const safeUrl = safeExternalUrl(s.url);
                      if (!safeUrl) return null;
                      return (
                        <a
                          key={s.type}
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-[rgba(16,40,68,0.16)] px-3 py-1 text-xs font-semibold capitalize text-[#0d2c4b] hover:bg-[#f3eee6]"
                        >
                          {s.type}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              // Free profilde doğrudan iletişim bilgileri gösterilmez — ziyaretçi
              // yalnızca aşağıdaki platform içi randevu formunu kullanabilir.
              <p className="mt-4 rounded-[8px] bg-[#f3eee6] px-3 py-2.5 text-xs leading-relaxed text-[rgba(16,40,68,0.7)]">
                İletişim bilgileri yalnızca premium profillerde görünür. Aşağıdaki formla randevu talep
                edebilirsiniz.
              </p>
            )}
            <a
              href="#randevu"
              className="mt-4 block rounded-[6px] bg-[#c99a53] px-5 py-3 text-center text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742]"
            >
              Randevu talep et
            </a>
            <button
              type="button"
              onClick={() => {
                track("share", base.slug);
                setShareOpen(true);
              }}
              className="mt-2 block w-full rounded-[6px] border border-[rgba(16,40,68,0.2)] px-5 py-3 text-center text-sm font-semibold text-[#0d2c4b] transition-colors hover:border-[#c99a53] hover:text-[#c99a53]"
            >
              📸 Profili Paylaş
            </button>
          </aside>

          {/* Sağ: başlık + rozetler + sekmeler */}
          <section>
            <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_18px_44px_rgba(13,44,75,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="flex flex-wrap items-center gap-2 font-display text-[2rem] font-semibold uppercase leading-tight text-[#0d2c4b]">
                    {profile.name}
                    {profile.verified && (
                      <span title="Doğrulanmış uzman" className="inline-flex items-center gap-1 rounded-full bg-[#0d2c4b] px-2.5 py-1 text-[0.7rem] font-bold normal-case tracking-wide text-[#fffdf9]">✓ Doğrulanmış</span>
                    )}
                    {profile.premium && (
                      <span className="rounded-full bg-[#c99a53] px-2.5 py-1 text-[0.7rem] font-bold normal-case tracking-wide text-[#fffdf9]">
                        Premium
                      </span>
                    )}
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-[#102844]">
                    {profile.title}
                    {profile.firm ? <span className="text-[#c99a53]"> · {profile.firm}</span> : null}
                  </p>
                  <p className="mt-1 text-sm text-[rgba(16,40,68,0.6)]">Çanakkale · {profile.district}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-[rgba(16,40,68,0.6)]">Değerlendirme</div>
                  <div className="font-display text-[2.2rem] font-semibold leading-none text-[#0d2c4b]">
                    {profile.rating.toFixed(1)}
                  </div>
                  <Stars value={profile.rating} />
                </div>
              </div>

              {/* Rozetler */}
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Badge value={`${profile.yearsExperience} Yıl`} label="Deneyim" solid />
                {profile.stats.map((st) => (
                  <Badge key={st.label} value={st.value} label={st.label} />
                ))}
                <ShareButton slug={profile.slug} name={profile.name} />
              </div>
            </div>

            {/* Sekmeler */}
            {visibleTabs.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] shadow-[0_18px_44px_rgba(13,44,75,0.06)]">
                <div className="flex overflow-x-auto border-b border-[rgba(16,40,68,0.10)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {visibleTabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActive(t.key)}
                      className={`shrink-0 whitespace-nowrap px-4 py-4 text-sm font-semibold transition-colors sm:px-5 ${
                        current === t.key
                          ? "bg-[#0d2c4b] text-[#fffdf9]"
                          : "text-[#0d2c4b] hover:bg-[#f3eee6]"
                      }`}
                    >
                      {labelOf(t.key)}
                      {t.key === "portfolio" && profile.portfolio.length > 0 ? (
                        <span className="ml-2 rounded-full bg-[#c99a53] px-2 py-0.5 text-xs text-[#fffdf9]">
                          {profile.portfolio.length}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {current === "about" && <About profile={profile} />}
                  {current === "expertise" && <Expertise areas={profile.expertiseAreas} />}
                  {current === "reviews" && <Reviews reviews={profile.reviews} />}
                  {current === "portfolio" && <Portfolio items={profile.portfolio} />}
                </div>
              </div>
            )}

            {/* Randevu takvimi — panelden eklenir ve görünür kılınır */}
            {showCalendar && (
              <div className="mt-5 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_18px_44px_rgba(13,44,75,0.06)]">
                <h2 className="font-display text-[1.4rem] font-semibold text-[#0d2c4b]">Randevu Takvimi</h2>
                <p className="mt-1 text-sm text-[rgba(16,40,68,0.6)]">
                  Uygun gün ve saatler. Bir saate tıklayarak aşağıdaki formla talep gönderin.
                </p>
                <div className="mt-4 space-y-4">
                  {groupSlots(availableSlots).map((g) => (
                    <div key={g.day}>
                      <div className="text-sm font-semibold text-[#0d2c4b]">{g.day}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {g.times.map((t) => {
                          const isSelected = selectedSlot?.day === g.day && selectedSlot?.time === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                setSelectedSlot({ day: g.day, time: t });
                                document.getElementById("randevu")?.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "border-[#c99a53] bg-[#c99a53] text-[#fffdf9]"
                                  : "border-[rgba(16,40,68,0.14)] text-[#0d2c4b] hover:border-[#c99a53] hover:bg-[#f3eee6]"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Randevu bölümü — "Randevu talep et" butonu buraya iner */}
            <div
              id="randevu"
              className="mt-5 scroll-mt-24 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#0d2c4b] p-6 text-[#fffdf9] shadow-[0_18px_44px_rgba(13,44,75,0.10)]"
            >
              <h2 className="font-display text-[1.4rem] font-semibold">Randevu talep et</h2>
              <p className="mt-1 text-sm text-[#e8d8c2]">
                {profile.name} ile iletişime geçin; uygun gün ve saati birlikte belirleyin.
              </p>
              {/* Doğrudan iletişim kısayolları (platform dışına çıkarır) yalnızca
                  premium'da gösterilir; free'de yalnızca aşağıdaki form kalır. */}
              {profile.premium && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Merhaba, ${profile.name} için randevu talep etmek istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742]"
                    >
                      WhatsApp ile yaz
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      className="rounded-[6px] border border-[#fffdf9]/40 px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#fffdf9]/10"
                    >
                      Hemen ara · {profile.phone}
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent("Randevu talebi")}`}
                      className="rounded-[6px] border border-[#fffdf9]/40 px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#fffdf9]/10"
                    >
                      E-posta gönder
                    </a>
                  )}
                </div>
              )}

              {/* Randevu talep formu → Supabase'e kaydeder (takvimden seçilen saat dahil) */}
              <AppointmentForm
                expertId={profile.slug}
                expertName={profile.name}
                selectedSlot={selectedSlot}
                onClearSlot={() => setSelectedSlot(null)}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Instagram paylaşım kartı */}
      <ShareProfileModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        slug={profile.slug}
        name={profile.name}
        title={profile.title}
        district={profile.district}
        expertise={profile.expertiseAreas}
        bio={profile.bio}
      />
    </div>
  );
}

function AppointmentForm({
  expertId,
  expertName,
  selectedSlot,
  onClearSlot,
}: {
  expertId: string;
  expertName: string;
  selectedSlot: { day: string; time: string } | null;
  onClearSlot: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (!name || !phone) {
      setError("Ad ve telefon zorunlu.");
      return;
    }
    setState("sending");
    setError(null);
    const res = await createAppointment({
      expertId,
      visitorName: name,
      visitorPhone: phone,
      note: String(fd.get("note") ?? ""),
      day: selectedSlot?.day,
      time: selectedSlot?.time,
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setError("Talep gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-5 rounded-[8px] bg-[#fffdf9]/10 px-4 py-3 text-sm">
        Talep gönderildi. {expertName} en kısa sürede sizinle iletişime geçecek.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-3 border-t border-[#fffdf9]/15 pt-5 sm:grid-cols-2">
      {selectedSlot && (
        <div className="flex items-center gap-2 rounded-[6px] bg-[#c99a53]/15 px-3 py-2 text-sm text-[#fffdf9] sm:col-span-2">
          <span>
            Seçili saat: <strong>{selectedSlot.day} {selectedSlot.time}</strong>
          </span>
          <button type="button" onClick={onClearSlot} className="ml-auto text-[#e8d8c2] hover:text-[#fffdf9]" aria-label="Seçimi kaldır">
            ×
          </button>
        </div>
      )}
      <input name="name" placeholder="Ad soyad" required className="h-11 rounded-[6px] border border-[#fffdf9]/25 bg-[#fffdf9]/10 px-3 text-sm text-[#fffdf9] outline-none placeholder:text-[#e8d8c2]/70 focus:border-[#c99a53]" />
      <input name="phone" placeholder="Telefon" required inputMode="tel" className="h-11 rounded-[6px] border border-[#fffdf9]/25 bg-[#fffdf9]/10 px-3 text-sm text-[#fffdf9] outline-none placeholder:text-[#e8d8c2]/70 focus:border-[#c99a53]" />
      <input name="note" placeholder="Kısa not (opsiyonel)" className="h-11 rounded-[6px] border border-[#fffdf9]/25 bg-[#fffdf9]/10 px-3 text-sm text-[#fffdf9] outline-none placeholder:text-[#e8d8c2]/70 focus:border-[#c99a53] sm:col-span-2" />
      {error && <p className="text-sm text-[#f4cb96] sm:col-span-2">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="rounded-[6px] bg-[#c99a53] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742] disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {state === "sending" ? "Gönderiliyor…" : "Randevu talebini gönder"}
      </button>
    </form>
  );
}

// Takvim slotlarını güne göre grupla, gün sırasını koru.
function groupSlots(slots: { day: string; time: string }[]) {
  const order: string[] = [];
  const map = new Map<string, string[]>();
  for (const s of slots) {
    if (!map.has(s.day)) {
      map.set(s.day, []);
      order.push(s.day);
    }
    map.get(s.day)!.push(s.time);
  }
  return order.map((day) => ({ day, times: map.get(day)!.sort() }));
}

function hasContent(p: ExpertProfile, key: ProfileSectionKey): boolean {
  if (key === "about") return p.longBio.length > 0;
  if (key === "expertise") return p.expertiseAreas.length > 0;
  if (key === "reviews") return p.reviews.length > 0;
  if (key === "portfolio") return p.portfolio.length > 0;
  return false;
}

function About({ profile }: { profile: ExpertProfile }) {
  return (
    <div className="max-w-[68ch] space-y-4 text-[0.95rem] leading-7 text-[#102844]">
      {profile.longBio.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function Expertise({ areas }: { areas: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {areas.map((a) => (
        <span key={a} className="rounded-full border border-[rgba(16,40,68,0.14)] bg-[#f3eee6] px-4 py-2 text-sm font-semibold text-[#0d2c4b]">
          {a}
        </span>
      ))}
    </div>
  );
}

function Reviews({ reviews }: { reviews: ExpertProfile["reviews"] }) {
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0d2c4b]">{r.author}</span>
            <Stars value={r.rating} />
          </div>
          <p className="mt-2 text-sm leading-6 text-[#102844]">{r.body}</p>
          <p className="mt-1 text-xs text-[rgba(16,40,68,0.5)]">{r.date}</p>
        </div>
      ))}
    </div>
  );
}

function Portfolio({ items }: { items: ExpertProfile["portfolio"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[#0d2c4b]">{it.title}</h3>
            {it.tag ? <span className="text-xs font-semibold text-[#c99a53]">{it.tag}</span> : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-[#102844]">{it.description}</p>
        </div>
      ))}
    </div>
  );
}

function ContactRow({ label, value, href, icon }: { label: string; value: string; href: string; icon: string }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-[#f3eee6]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d2c4b] text-[#fffdf9]">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-[#0d2c4b]">{label}</span>
        <span className="block truncate text-sm text-[#102844]">{value}</span>
      </span>
    </a>
  );
}

function Badge({ value, label, solid }: { value: string; label: string; solid?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
        solid ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.14)] text-[#0d2c4b]"
      }`}
    >
      <span className="font-bold">{value}</span>
      <span className={solid ? "text-[rgba(255,253,249,0.75)]" : "text-[rgba(16,40,68,0.6)]"}>{label}</span>
    </span>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="tracking-[0.12em] text-[#d7a321]" aria-label={`${value} / 5`}>
      {"★".repeat(full)}
      <span className="text-[rgba(16,40,68,0.2)]">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function ShareButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = profileUrl(slug); // subdomain kanonik URL
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        /* iptal */
      }
    }
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,40,68,0.14)] px-4 py-2 text-sm font-semibold text-[#0d2c4b] hover:bg-[#f3eee6]"
    >
      {copied ? "Bağlantı kopyalandı" : "Paylaş"}
    </button>
  );
}

